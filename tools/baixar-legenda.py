#!/usr/bin/env python3
"""
Baixa a legenda de um video e grava em ingest/, com cabecalho de procedencia.

Nao transcreve com IA. Usa a legenda que a plataforma ja tem, ou seja: mesma
fonte, mesmo resultado, em qualquer maquina e por qualquer agente.

Cria e usa um ambiente virtual proprio em tools/.venv-ingest. Nao instala nada
no Python do sistema.

Quando o video nao tem legenda, o caminho e reconhecimento de fala local, com
--transcrever. Reconhecimento de fala NAO e a mesma coisa que pedir transcricao
a um provedor de IA: ele mapeia audio para texto e nao completa lacuna com
plausibilidade. O erro dele e fonetico e visivel.

Uso:
    python3 tools/baixar-legenda.py <url>
    python3 tools/baixar-legenda.py <url> --idioma en
    python3 tools/baixar-legenda.py --listar <url>
    python3 tools/baixar-legenda.py <url> --transcrever
    python3 tools/baixar-legenda.py <url> --transcrever --modelo large-v3
    python3 tools/baixar-legenda.py            (pergunta a url)

Idioma: o padrao e pt. Um agente que esteja conversando em outro idioma deve
passar --idioma explicitamente, em vez de assumir o padrao.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import unicodedata
import venv
from datetime import date
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
JANELA_SEGUNDOS = 30.0
MODELOS_FALA = ("tiny", "base", "small", "medium", "large-v2", "large-v3")
VENV = Path(__file__).resolve().parent / ".venv-ingest"
DESTINO = RAIZ / "ingest"


def executavel_do_venv(nome: str) -> Path:
    sub = "Scripts" if os.name == "nt" else "bin"
    sufixo = ".exe" if os.name == "nt" else ""
    return VENV / sub / f"{nome}{sufixo}"


def preparar_venv(atualizar: bool = False) -> Path:
    """Cria o venv na primeira execucao e instala o yt-dlp.

    Nao atualiza por conta propria. Atualizacao automatica em toda execucao
    faria a mesma url passar por versoes diferentes da ferramenta ao longo do
    tempo, e a legenda publicada pela plataforma tambem muda. O artefato
    reproduzivel e o .srt gravado, nao a capacidade de baixar de novo. Use
    --atualizar quando quiser subir de versao deliberadamente.
    """
    py = executavel_do_venv("python")
    if not py.exists():
        print(f"criando ambiente isolado em {VENV}")
        venv.EnvBuilder(with_pip=True, clear=False).create(VENV)
    ja_tem = subprocess.run(
        [str(py), "-c", "import yt_dlp"], capture_output=True
    ).returncode == 0
    if ja_tem and not atualizar:
        return py
    print("atualizando yt-dlp" if atualizar else "instalando yt-dlp")
    r = subprocess.run(
        [str(py), "-m", "pip", "install", "--quiet", "--upgrade", "yt-dlp"],
        capture_output=True,
        text=True,
    )
    if r.returncode != 0:
        print("falha ao instalar yt-dlp:", file=sys.stderr)
        print(r.stderr, file=sys.stderr)
        sys.exit(1)
    return py


def rodar_ytdlp(py: Path, args: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(
        [str(py), "-m", "yt_dlp", *args], capture_output=True, text=True
    )


def metadados(py: Path, url: str) -> dict:
    r = rodar_ytdlp(py, ["--dump-single-json", "--skip-download", url])
    if r.returncode != 0:
        print("nao foi possivel ler o video:", file=sys.stderr)
        print(r.stderr.strip()[:800], file=sys.stderr)
        sys.exit(1)
    d = json.loads(r.stdout)
    return {
        "id": d.get("id", ""),
        "titulo": d.get("title", ""),
        "canal": d.get("uploader", ""),
        "publicado": d.get("upload_date", ""),
        "duracao": d.get("duration", 0),
        "legendas_manuais": sorted((d.get("subtitles") or {}).keys()),
        "legendas_automaticas": sorted((d.get("automatic_captions") or {}).keys()),
    }


def escolher_idioma(meta: dict, pedido: str) -> tuple[str, str]:
    """Devolve (codigo, origem). Prefere legenda manual a automatica.

    Casamento exato primeiro. Se so houver variante regional, avisa antes de
    escolher: pedir 'pt' com 'pt-BR' e 'pt-PT' disponiveis nao tem resposta
    obvia, e escolher por ordem alfabetica em silencio decide por acidente.
    """
    for chave, origem in (
        ("legendas_manuais", "manual"),
        ("legendas_automaticas", "automatica"),
    ):
        if pedido in meta[chave]:
            return pedido, origem
        variantes = sorted(c for c in meta[chave] if c.split("-")[0] == pedido)
        if variantes:
            if len(variantes) > 1:
                print(
                    f"aviso: '{pedido}' tem mais de uma variante ({', '.join(variantes)}). "
                    f"escolhendo '{variantes[0]}'. use --idioma com a variante "
                    f"exata se quiser outra."
                )
            return variantes[0], origem
    return "", ""


def slug(texto: str, limite: int = 40) -> str:
    """Slug em ASCII puro. Acento em nome de arquivo quebra em sistema com
    locale diferente, e o nome tem que ser identico em qualquer maquina."""
    t = unicodedata.normalize("NFKD", texto)
    t = t.encode("ascii", "ignore").decode("ascii").lower()
    t = re.sub(r"[^a-z0-9\s-]", "", t)
    t = re.sub(r"[\s_]+", "-", t).strip("-")
    return t[:limite].strip("-") or "video"


def srt_para_texto(srt: str) -> str:
    """Converte SRT em linhas 'mm:ss texto'.

    Legenda automatica do YouTube e rolante: cada bloco repete a linha anterior
    e acrescenta a nova, com blocos de dezenas de milissegundos servindo de
    preenchimento entre eles. Emitir bloco por bloco duplica quase tudo.

    A regra aqui e emitir cada linha fisica uma unica vez, com o timestamp de
    FIM do bloco onde apareceu. O fim e usado porque e a atribuicao que a
    propria plataforma faz no painel de transcricao dela, e assim o texto daqui
    pode ser comparado com o de la sem deslocamento.

    A comparacao usa janela de TEMPO, e nao conjunto de tudo que ja saiu nem
    contagem de blocos. Duas razoes. Conjunto global descartaria frase repetida
    de verdade, dita pelo palestrante em momentos distintos, e ninguem notaria
    a falta. E contagem de blocos nao serve porque bloco vizinho no arquivo
    pode estar a minutos de distancia no tempo, quando ha corte de edicao.

    A repeticao do formato rolante ocorre dentro de poucos segundos. A janela
    de trinta segundos cobre isso com folga e deixa passar repeticao real.
    """

    def segundos(marca: str) -> float:
        h, m, s = marca.strip().replace(",", ".").split(":")
        return int(h) * 3600 + int(m) * 60 + float(s)

    saida: list[str] = []
    recentes: list[tuple[float, str]] = []

    for bloco in re.split(r"\n\s*\n", srt.replace("\r", "").strip()):
        partes = [p.strip() for p in bloco.split("\n")]
        tempo = next((p for p in partes if "-->" in p), None)
        if not tempo:
            continue
        ini, fim = (segundos(x) for x in tempo.split("-->"))
        recentes = [(t, l) for t, l in recentes if ini - t <= JANELA_SEGUNDOS]
        vizinhas = {l for _, l in recentes}
        for linha in partes:
            if not linha or "-->" in linha or linha.isdigit():
                continue
            recentes.append((ini, linha))
            if linha in vizinhas:
                continue
            saida.append(f"{int(fim) // 60}:{int(fim) % 60:02d} {linha}")

    return "\n".join(saida)


def cabecalho_de_fala(meta: dict, url: str, idioma: str, modelo: str) -> str:
    return "\n".join(
        [
            "# Transcricao por reconhecimento de fala local, material bruto",
            "#",
            "# NAO E CONHECIMENTO AUTORADO. Nao carregue isto em conhecimento/.",
            "# NAO FOI TRANSCRITO POR PROVEDOR DE IA. Reconhecimento de fala",
            "# mapeia audio para texto e nao completa lacuna com plausibilidade.",
            f"# Modelo: faster-whisper {modelo}, idioma {idioma}, vad_filter ativo",
            f"# Titulo: {meta['titulo']}",
            f"# Canal: {meta['canal']}",
            f"# Publicado: {meta['publicado']}",
            f"# URL: {url}",
            f"# Transcrito em: {date.today().isoformat()}",
            "#",
            "# Cada linha comeca com o timestamp mm:ss. O timestamp e a",
            "# procedencia de qualquer afirmacao extraida daqui.",
            "#",
            "# DUAS LIMITACOES MEDIDAS:",
            "# 1. Erro fonetico em termo de dominio. Sigla, nome de agencia,",
            "#    nome de norma e nome de companhia sao os mais afetados.",
            "#    Confira contra outra fonte antes de citar.",
            "# 2. Trecho sem fala pode gerar texto inventado. O vad_filter",
            "#    reduz isso e nao elimina. Frase curta e generica isolada,",
            "#    perto de vinheta ou musica, e suspeita.",
            "",
        ]
    )


def baixar_audio(py: Path, url: str, destino: Path) -> Path:
    """Baixa a trilha de audio sem converter, o que dispensa ffmpeg no sistema."""
    modelo = str(destino / "%(id)s-audio.%(ext)s")
    r = rodar_ytdlp(
        py,
        [
            "-f",
            "bestaudio[ext=m4a]/bestaudio",
            "--no-part",
            "--output",
            modelo,
            url,
        ],
    )
    if r.returncode != 0:
        print("falha ao baixar o audio:", file=sys.stderr)
        print(r.stderr.strip()[-900:], file=sys.stderr)
        sys.exit(1)
    achados = sorted(destino.glob("*-audio.*"))
    if not achados:
        print("download terminou sem erro mas nenhum audio apareceu", file=sys.stderr)
        sys.exit(1)
    return achados[-1]


def preparar_fala(py: Path, atualizar: bool = False) -> None:
    ja_tem = subprocess.run(
        [str(py), "-c", "import faster_whisper"], capture_output=True
    ).returncode == 0
    if ja_tem and not atualizar:
        return
    print("instalando faster-whisper")
    r = subprocess.run(
        [str(py), "-m", "pip", "install", "--quiet", "--upgrade", "faster-whisper"],
        capture_output=True,
        text=True,
    )
    if r.returncode != 0:
        print("falha ao instalar faster-whisper:", file=sys.stderr)
        print(r.stderr[-900:], file=sys.stderr)
        sys.exit(1)


def transcrever(py: Path, audio: Path, idioma: str, modelo: str) -> str:
    """Roda o reconhecimento de fala num subprocesso do venv.

    vad_filter e obrigatorio e nao opcional. Sem ele, trecho sem fala, como
    vinheta e musica de fundo, produz texto que ninguem falou: isso foi medido
    contra um tom puro de 440Hz, que devolveu uma frase inventada sem o filtro
    e nenhum segmento com ele. Essa e a unica forma de invencao do
    reconhecimento de fala, e e mitigavel.
    """
    codigo = f"""
import json, sys
from faster_whisper import WhisperModel
m = WhisperModel({modelo!r}, device="cpu", compute_type="int8")
segs, info = m.transcribe(
    {str(audio)!r},
    language={idioma!r},
    vad_filter=True,
    condition_on_previous_text=False,
)
saida = [{{"ini": s.start, "txt": s.text.strip()}} for s in segs if s.text.strip()]
print(json.dumps({{"duracao": info.duration, "segmentos": saida}}))
"""
    print(f"transcrevendo com modelo '{modelo}', pode demorar")
    r = subprocess.run([str(py), "-c", codigo], capture_output=True, text=True)
    if r.returncode != 0:
        print("falha no reconhecimento de fala:", file=sys.stderr)
        print(r.stderr[-900:], file=sys.stderr)
        sys.exit(1)
    d = json.loads(r.stdout.strip().splitlines()[-1])
    linhas = []
    for s in d["segmentos"]:
        m_, sec = divmod(int(s["ini"]), 60)
        linhas.append(f"{m_}:{sec:02d} {s['txt']}")
    print(f"segmentos com fala: {len(linhas)}")
    return "\n".join(linhas)


def main() -> None:
    p = argparse.ArgumentParser(
        description="Baixa legenda de video para ingestao de conhecimento."
    )
    p.add_argument("url", nargs="?", help="url do video")
    p.add_argument(
        "--idioma",
        default="pt",
        help="codigo do idioma da legenda. padrao: pt",
    )
    p.add_argument(
        "--listar",
        action="store_true",
        help="apenas lista os idiomas de legenda disponiveis",
    )
    p.add_argument(
        "--atualizar",
        action="store_true",
        help="atualiza yt-dlp e faster-whisper antes de rodar. sem isto, a "
        "versao instalada e mantida, para a mesma url nao passar por "
        "ferramentas diferentes ao longo do tempo",
    )
    p.add_argument(
        "--transcrever",
        action="store_true",
        help="ignora a legenda e transcreve o audio por reconhecimento de fala local",
    )
    p.add_argument(
        "--modelo",
        default="medium",
        help="modelo de reconhecimento de fala. tiny, base, small, medium, "
        "large-v3. padrao: medium. abaixo de medium erra termo de dominio "
        "com frequencia alta",
    )
    a = p.parse_args()

    if a.transcrever and a.modelo not in MODELOS_FALA:
        print(
            f"modelo de fala desconhecido: {a.modelo!r}\n"
            f"validos: {', '.join(MODELOS_FALA)}",
            file=sys.stderr,
        )
        sys.exit(2)

    url = a.url or input("url do video: ").strip()
    if not url:
        print("nenhuma url informada", file=sys.stderr)
        sys.exit(1)

    py = preparar_venv(a.atualizar)
    meta = metadados(py, url)

    print(f"\ntitulo: {meta['titulo']}")
    print(f"canal: {meta['canal']}")
    print(f"publicado: {meta['publicado']}")
    print(f"duracao: {meta['duracao'] // 60}min{meta['duracao'] % 60:02d}s")

    if a.listar:
        print(f"\nlegendas manuais: {', '.join(meta['legendas_manuais']) or 'nenhuma'}")
        print(
            f"legendas automaticas: {', '.join(meta['legendas_automaticas']) or 'nenhuma'}"
        )
        return

    DESTINO.mkdir(parents=True, exist_ok=True)
    base = f"{slug(meta['canal'])}-{slug(meta['titulo'])}-{meta['id']}"

    if a.transcrever:
        preparar_fala(py, a.atualizar)
        audio = baixar_audio(py, url, DESTINO)
        print(f"audio: {audio.relative_to(RAIZ)}")
        corpo = transcrever(py, audio, a.idioma, a.modelo)
        texto = DESTINO / f"{base}.transcrito.txt"
        texto.write_text(
            cabecalho_de_fala(meta, url, a.idioma, a.modelo) + corpo + "\n",
            encoding="utf-8",
        )
        print(f"texto: {texto.relative_to(RAIZ)}")
        print(
            "\nO audio pode ser apagado depois da conferencia. Ele nao e "
            "conhecimento e nao deve sair de ingest/."
        )
        return

    codigo, origem = escolher_idioma(meta, a.idioma)
    if not codigo:
        print(f"\nnao existe legenda em '{a.idioma}' para este video.", file=sys.stderr)
        def resumir(lista: list[str]) -> str:
            if not lista:
                return "nenhuma"
            if len(lista) <= 12:
                return ", ".join(lista)
            return f"{', '.join(lista[:12])} ... e mais {len(lista) - 12}"

        print(
            f"manuais: {resumir(meta['legendas_manuais'])}",
            file=sys.stderr,
        )
        print(
            f"automaticas: {resumir(meta['legendas_automaticas'])}",
            file=sys.stderr,
        )
        print(
            "use --listar para ver a lista inteira",
            file=sys.stderr,
        )
        print(
            "\nse o video nao tem legenda em nenhum idioma util, a transcricao "
            "precisa ser feita por reconhecimento de fala local, tipo whisper. "
            "Nao use provedor de IA para transcrever: ele resume e preenche "
            "lacuna com plausibilidade.",
            file=sys.stderr,
        )
        sys.exit(2)

    print(f"legenda escolhida: {codigo} ({origem})")

    modelo = str(DESTINO / f"{base}.%(ext)s")

    args = [
        "--skip-download",
        "--convert-subs",
        "srt",
        "--sub-langs",
        codigo,
        "--output",
        modelo,
        url,
    ]
    args.insert(0, "--write-subs" if origem == "manual" else "--write-auto-subs")

    r = rodar_ytdlp(py, args)
    if r.returncode != 0:
        print("falha ao baixar a legenda:", file=sys.stderr)
        print(r.stderr.strip()[:800], file=sys.stderr)
        sys.exit(1)

    achados = sorted(DESTINO.glob(f"{base}*.srt"))
    if not achados:
        print("yt-dlp terminou sem erro mas nenhum .srt apareceu", file=sys.stderr)
        sys.exit(1)
    srt = achados[0]

    cabecalho = "\n".join(
        [
            "# Legenda de video, material bruto para ingestao",
            "#",
            "# NAO E CONHECIMENTO AUTORADO. Nao carregue isto em conhecimento/.",
            "# Legenda obtida da plataforma, sem transcricao por IA.",
            f"# Origem da legenda: {origem} ({codigo})",
            f"# Titulo: {meta['titulo']}",
            f"# Canal: {meta['canal']}",
            f"# Publicado: {meta['publicado']}",
            f"# URL: {url}",
            f"# Baixado em: {date.today().isoformat()}",
            "#",
            "# Cada linha comeca com o timestamp mm:ss. O timestamp e a",
            "# procedencia de qualquer afirmacao extraida daqui, do mesmo modo",
            "# que documento e pagina sao a procedencia de um PDF.",
            "#",
            "# Legenda automatica erra termo de dominio por semelhanca fonetica.",
            "# Confira nome proprio e sigla contra outra fonte antes de citar.",
            "",
        ]
    )

    texto = DESTINO / f"{base}.txt"
    texto.write_text(
        cabecalho + srt_para_texto(srt.read_text(encoding="utf-8")) + "\n",
        encoding="utf-8",
    )

    print(f"\nsrt:   {srt.relative_to(RAIZ)}")
    print(f"texto: {texto.relative_to(RAIZ)}")
    print(f"linhas: {len(texto.read_text(encoding='utf-8').splitlines())}")


if __name__ == "__main__":
    main()
