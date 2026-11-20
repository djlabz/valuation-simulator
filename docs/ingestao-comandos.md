# Comandos do normalizador de transcrição

- **Versão do normalizador:** 0.8.1 (saída de `bun run ingest:versao`)
- **Data:** 20/11/2026
- **Aviso:** Gerado a partir do --help desta versão. Quando a versão mudar, refaça este arquivo.

Todo atalho roda a partir da raiz do repositório e entra em `ingest/` antes de chamar a
ferramenta, com `TRANSCRIPT_NORMALIZER_HOME` apontando para lá (D-106). Por isso os caminhos
passados aos atalhos são relativos a `ingest/`: `runs/<id>/legenda.txt`, e não
`ingest/runs/<id>/legenda.txt`. O que vem depois do nome do atalho é acrescentado ao fim do
comando real.

As descrições abaixo são tradução do texto do `--help` da 0.8.1. Onde o `--help` não explica,
está escrito "o --help não descreve". O que vem do `DECISOES.md` está marcado com o número da
decisão.

---

## 1. Fluxo de um vídeo, em ordem

1. **Conferir o link sem baixar.**

   ```bash
   bun run ingest:info <url>
   ```

   O `--help` do `fetch --list`: confere um link sem baixar, mostrando o site, o título, a
   duração, as faixas de legenda (ou nenhuma), se há áudio para transcrever e se o site pede
   login. A D-107 registra que ele não grava nada.

2. **Baixar, uma vez só por URL.**

   ```bash
   bun run ingest:video <url>
   ```

   Baixa a legenda da plataforma ou, sem ela, transcreve o áudio localmente, e grava em
   `runs/<id>/`. Guarda a legenda bruta `.vtt` ou `.srt` (`--keep-raw`) e, quando transcreve,
   o áudio (`--keep-audio`). **Não rode de novo na mesma URL**: o `fetch` repetido substitui o
   `legenda.txt` existente sem aviso (D-107).

3. **Revisar o que a normalização não teve certeza.**

   ```bash
   bun run ingest:revisar runs/<id>/legenda.txt
   ```

   O `--help` do `--review`: uma parada por forma incerta, na ordem do vídeo, com a linha
   anterior, a linha da forma, a linha seguinte, onde mais ela aparece e um link para aquele
   instante. Os palpites próximos (faixa média) já estão aplicados no `normalized.txt`, e a
   revisão confirma ou desfaz. Nomes achados pelo som são só sugeridos, nunca aplicados sem o
   seu sim. Para cada forma: sim (corrigir daqui em diante), sim só neste vídeo, dito assim
   (reconhecer e manter o texto), não, ou decidir depois; Enter decide depois. No fim vem um
   resumo, e nada é salvo sem o seu sim a ele.

4. **Normalizar de novo, para o `normalized.txt` refletir a revisão.**

   ```bash
   bun run ingest:normalizar runs/<id>/legenda.txt
   ```

   O `--help` do `normalize`: corrige termos de domínio. A D-106 registra que as respostas da
   revisão vão para a camada aprendida e não regravam o `normalized.txt` daquela execução; para
   ele refletir o que foi decidido, roda-se o `normalize` de novo sobre o mesmo `legenda.txt`.
   Sempre sobre o `legenda.txt` do `fetch`, nunca sobre `.srt` nem `.vtt` (D-107).

---

## 2. Atalhos do `package.json`

O prefixo comum a todos é
`cd ingest && TRANSCRIPT_NORMALIZER_HOME="$PWD" uv run --locked --project ../tools/ingest transcript-normalizer`.
A coluna do meio mostra só o que vem depois dele.

| Atalho | Comando real, depois do prefixo | Para que serve, pelo `--help` |
|---|---|---|
| `ingest:menu` | (nada) | Num terminal, abre o menu interativo |
| `ingest:info` | `fetch --list` | Confere um link sem baixar: site, título, duração, faixas de legenda, se há áudio para transcrever, se o site pede login |
| `ingest:video` | `fetch --keep-raw --keep-audio` | Baixa a legenda da plataforma ou transcreve o áudio localmente. `--keep-raw` guarda o `legenda.vtt` ou `.srt` baixado, que por padrão é apagado depois de convertido. `--keep-audio` guarda o áudio baixado na pasta da execução como `<id>.<ext>` depois de transcrever, que por padrão é apagado |
| `ingest:lista` | `list` | Lista toda execução em `runs/`: id do vídeo, data de publicação e título |
| `ingest:normalizar` | `normalize` | Propõe normalizações à parte (stand-off) para um arquivo de legenda; corrige termos de domínio |
| `ingest:revisar` | `normalize --review` | A revisão: uma parada por forma incerta, na ordem do vídeo, com as linhas em volta e um link para o instante; nada é salvo até o sim ao resumo do fim |
| `ingest:propor` | `pack propose --pack financas-ptbr` | Contribui o que as revisões ensinaram à ferramenta. Lê a camada aprendida, fica com o que o pacote ainda não tem, mostra (termo, forma e decisão, nunca a transcrição) e, com um sim, grava em `contributions/<pack>-<date>.yaml` e abre uma issue preenchida no repositório de pacotes. A ferramenta não envia nada sozinha: a issue é sua para enviar |
| `ingest:versao` | `--version` | A versão instalada, numa linha |

---

## 3. Comandos e opções sem atalho

### 3.1. `fetch <url|arquivo>`, opções que os atalhos não passam

| Opção | O que faz, pelo `--help` |
|---|---|
| `--check` | Mostra quais ferramentas de download estão instaladas (yt-dlp, curl_cffi, faster-whisper) e as versões |
| `--out DIR` | Grava em `DIR` em vez de `runs/<video-id>/` |
| `--whisper` | Pula a legenda da plataforma e transcreve o áudio localmente |
| `--caption-only` | Usa a legenda da plataforma ou falha; nunca cai para a transcrição local |
| `--lang LANG` | Código de idioma da legenda. Padrão: o idioma do próprio vídeo, como o site informa (senão a única faixa original ou a única manual, senão `pt`) |
| `--track CODE` | Pega exatamente esta faixa de legenda, como o `--list` a nomeia (`pt-orig`, `pt`, `en`); um código com faixa manual pega a manual. Substitui a escolha do `--lang` |
| `--model MODEL` | Modelo de reconhecimento de fala: tiny, base, small, medium, large-v2, large-v3. Padrão: medium. Abaixo de medium erra termo de domínio com frequência |
| `--cookies-from-browser BROWSER` | Usa o login deste navegador, para site que pede login ou para a checagem de robô do YouTube (firefox, chrome, edge, brave, chromium, opera, vivaldi, safari, whale; o Firefox funciona melhor). Substitui a configuração |
| `--cookies FILE` | Usa o login deste arquivo `cookies.txt` (formato Netscape). Substitui a configuração |

O argumento também pode ser um arquivo local de áudio ou vídeo, que vai direto para a
transcrição. A D-107 registra que o `fetch` de arquivo local também substitui um `legenda.txt`
existente sem aviso.

### 3.2. `normalize <legenda.txt>`, opções que os atalhos não passam

| Opção | O que faz, pelo `--help` |
|---|---|
| `--confirm` | Revisa a faixa média forma por forma, agrupada por termo, e grava as respostas na camada aprendida. Respostas: `y` o reconhecedor estragou o termo, corrigir daqui em diante; `o` o mesmo, só neste vídeo, guardado ao lado da execução, nunca aprendido nem contribuído; `n` não é este termo, nunca propor de novo; `l` é este termo, dito assim, reconhecer e nunca mudar; `s` não tenho certeza, pergunta de novo da próxima vez; `a` sim para esta forma e para as demais do mesmo termo; `r` não para esta forma e para as demais do mesmo termo |
| `--pack PACK` | Pacote de domínio. O `--help` mostra como padrão o `financas-ptbr.yaml` incluído no programa. A D-106 registra que, sem `--pack`, vale `ingest/packs/financas-ptbr.yaml` quando ele existe |
| `--out DIR` | Grava em `DIR` em vez de `runs/<id>/` |
| `--learned PATH` | Arquivo da camada aprendida, em vez de `packs/<pack-name>.learned.yaml` |
| `--corrections` | Grava também `needs-review/corrections.csv`, as anotações aplicadas como rascunho de gabarito com status `draft` |
| `--summary` | Mostra os contadores em vez do relatório completo; o `report.txt` não muda |
| `--force` | Aplica o pacote mesmo quando menos de 3 dos seus termos são achados com confiança |
| `--quiet` | Não mostra nem o relatório nem os contadores; o `report.txt` não muda |
| `--allow-generic` | Se o idioma do pacote não tem módulo, casa com o genérico (sem flexões, sem regras de unidade) em vez de parar |

`--confirm` e `--review` não andam juntos. O `--help` também aceita
`transcript-normalizer <legenda.txt>` sem a palavra `normalize`, com o mesmo efeito.

### 3.3. `help`

Mostra a ajuda, a mesma do `--help` raiz e do item 8 do menu.

### 3.4. `pack`

Pacotes de domínio do repositório de pacotes, instalados em `packs/`, e os seus. Os que leem o
índice do repositório aceitam `--index URL`; o `--help` dá como padrão
`$TRANSCRIPT_NORMALIZER_PACKS_INDEX`, senão o `index.json` da main do repositório de pacotes.

| Comando | O que faz, pelo `--help` |
|---|---|
| `pack list` | Os pacotes instalados, depois os incluídos no programa e os do repositório de pacotes, cada um marcado |
| `pack list --installed` | Só os instalados em `packs/`: versão, idioma, termos, tamanho, origem, e `↑` onde há um mais novo incluído ou no repositório |
| `pack install <name>` | Põe um pacote em `packs/`, do repositório ou o incluído no programa. `--included` pega a cópia incluída sem ler o repositório (offline). `--force` substitui `packs/<name>.yaml` mesmo que tenha sido editado aqui |
| `pack update` | Instala versões mais novas dos pacotes instalados |
| `pack create --template <field> --name <n> --lang <l>` | Um pacote novo em `packs/`, com as classes do campo e nenhum termo. Campos: financas, medicina, direito, tecnologia, engenharia, educacao-ciencias, esportes, politica-governo, agro, geral |
| `pack import <file>` | Confere um arquivo de pacote `.yaml` e copia para `packs/`; o nome do arquivo é o nome do pacote. `--force` substitui um pacote de mesmo nome |
| `pack remove <name>` | Apaga um pacote instalado de `packs/`; um incluído continua no programa |
| `pack copy <name>` | Torna seu, para editar, um pacote incluído ou do repositório |
| `pack add-term <pack> <term>` | Acrescenta um termo, ou formas a um termo existente, num pacote seu. `<term>` é a forma canônica, como deve ser escrita. `--class` uma das classes do pacote; `--alias` outro nome correto, repetível; `--variant` um erro de escuta, repetível; `--context TERM,TERM` as variantes (ou, sem elas, o nome do termo) também são palavra comum, então só casam num vídeo onde um desses termos do pacote aparece (duas vezes para aplicar, uma para perguntar); `--unless-near TERM,TERM` com `--context`, pergunta em vez de aplicar a menos de 90 segundos de um desses termos. Conferido e salvo com a próxima versão de patch |
| `pack edit-term <pack> <term>` | Muda um termo de um pacote seu. `--add-alias`, `--add-variant`, `--remove-alias` e `--remove-variant` são repetíveis. `--rename` e `--class`: o --help não descreve |
| `pack remove-term <pack> <term>` | Remove um termo de um pacote seu |
| `pack show <pack>` | Os termos de um pacote com suas formas. `--search TEXT` só os termos com uma forma que contém `TEXT`; `--page N` página N, 20 termos cada |
| `pack export <name>` | Grava o pacote em `<name>-<version>.yaml`. `--to PATH` uma pasta ou um arquivo `.yaml`; padrão: a pasta de dados |
| `pack merge <name>` | Mescla uma versão mais nova de cima na sua cópia, perguntando a cada conflito. `--dry-run` mostra o que aconteceria e não grava nada; `--yes-theirs` responde todo conflito com o lado de cima; `--yes-mine` com o seu; `--force` mescla mesmo quando a de cima não é mais nova que a base |
| `pack propose --whole <name>` | Propõe um pacote inteiro ao repositório de pacotes, como pacote novo ou atualização: mostra, pergunta e abre uma issue preenchida |

O atalho `ingest:propor` cobre `pack propose --pack financas-ptbr`. Sem `--pack`, o `--help`
diz que vale o pacote padrão.

---

## 4. Arquivos gerados em `ingest/runs/<id>/`

| Arquivo | O que é, pelo `--help` |
|---|---|
| `legenda.txt` | A transcrição como recebida, com um cabeçalho dizendo de onde veio |
| `normalized.txt` | A transcrição com as correções aplicadas, mesmas linhas e timestamps |
| `annotations.json` | Toda correção e todo reconhecimento, como dado |
| `report.txt` | O que o comando mostrou |
| `needs-review/` | O que ainda precisa da sua resposta (`pending.txt`); com `--corrections`, também `corrections.csv` |

Com o `ingest:video`, a pasta guarda também a legenda bruta `.vtt` ou `.srt` (`--keep-raw`) e,
quando houve transcrição local, o áudio `<id>.<ext>` (`--keep-audio`).

**A regra da D-106, copiada do `DECISOES.md`:**

> O `trecho_original` de qualquer anotação, heurística ou
> dado extraído de vídeo sai sempre do `legenda.txt`, nunca do `normalized.txt`. O texto
> normalizado contém palavras que ninguém falou, e citá-lo aponta para um instante cujo áudio diz
> outra coisa (RP-005, RF-304). O `normalized.txt` é para leitura; a citação se confere no
> original, que a normalização sobre o `legenda.txt` não altera.

---

## 5. Regras de uso da D-107

Copiadas do `DECISOES.md`. Valem até a subida para a versão da engine que recusar regravar o
`legenda.txt`, em decisão própria.

> Não rodar `ingest:video` duas vezes na
> mesma url; para conferir um vídeo antes de baixar, usar `ingest:info`, que não grava nada. Não
> normalizar `.srt` nem `.vtt` pelo projeto. Manter o backup de `ingest/`.
