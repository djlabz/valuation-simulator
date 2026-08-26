import { readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, join } from 'node:path'
import { parse as parseYaml } from 'yaml'
import { z, type ZodType } from 'zod'
import { Evento } from './evento'
import { Heuristica } from './heuristica'
import { Nota } from './nota'
import { Playbook } from './playbook'

/**
 * Leituras mínimas para a checagem cruzada de RF-109. Não são schema de
 * validação, são extração dos dois campos de que a comparação precisa, para ela
 * funcionar mesmo quando o arquivo tem outro problema em outro lugar.
 */
const IdentidadeDePlaybook = z.object({
  id: z.string(),
  modelos_habilitados: z.array(z.string()),
})

const IdentidadeDeNota = z.object({
  playbook: z.string().optional(),
  sobreescreve: z.object({ modelos_habilitados: z.array(z.string()).optional() }).optional(),
})

/**
 * Validação da pasta conhecimento/ (RF-101).
 *
 * A varredura usa lista branca de pastas, não lista negra. Só entram playbooks,
 * heuristicas, notas e eventos. Qualquer outra pasta dentro de conhecimento/ é
 * ignorada, e é assim que conhecimento/fixtures-invalidas/ fica de fora da
 * validação normal sem depender de ninguém lembrar de excluí-la.
 */
export const PASTAS_VALIDAS = ['playbooks', 'heuristicas', 'notas', 'eventos'] as const
export type TipoItem = (typeof PASTAS_VALIDAS)[number]

const SCHEMA_POR_TIPO: Record<TipoItem, ZodType> = {
  playbooks: Playbook,
  heuristicas: Heuristica,
  notas: Nota,
  eventos: Evento,
}

export interface Problema {
  arquivo: string
  campo: string
  mensagem: string
}

export interface Resultado {
  arquivosLidos: string[]
  problemas: Problema[]
}

function ehTipoConhecido(nome: string): nome is TipoItem {
  return (PASTAS_VALIDAS as readonly string[]).includes(nome)
}

function listarYaml(pasta: string): string[] {
  let entradas: string[]
  try {
    entradas = readdirSync(pasta)
  } catch {
    return []
  }
  return entradas
    .filter((nome) => nome.endsWith('.yaml') || nome.endsWith('.yml'))
    .map((nome) => join(pasta, nome))
    .sort()
}

/**
 * Valida um arquivo. O tipo vem do nome da pasta que o contém, o que vale tanto
 * para conhecimento/playbooks/x.yaml quanto para
 * conhecimento/fixtures-invalidas/eventos/x.yaml.
 */
export function validarArquivo(caminho: string, tipo: TipoItem): Problema[] {
  let bruto: string
  try {
    bruto = readFileSync(caminho, 'utf8')
  } catch (erro) {
    return [
      {
        arquivo: caminho,
        campo: '(arquivo)',
        mensagem: `RF-101: arquivo não pôde ser lido: ${(erro as Error).message}`,
      },
    ]
  }

  let documento: unknown
  try {
    documento = parseYaml(bruto)
  } catch (erro) {
    return [
      {
        arquivo: caminho,
        campo: '(yaml)',
        mensagem: `RF-101: YAML malformado, ${(erro as Error).message}`,
      },
    ]
  }

  const schema = SCHEMA_POR_TIPO[tipo]
  const resultado = schema.safeParse(documento)
  if (resultado.success) return []

  return resultado.error.issues.map((issue) => ({
    arquivo: caminho,
    campo: issue.path.length > 0 ? issue.path.join('.') : '(raiz)',
    mensagem: issue.message,
  }))
}

/**
 * RF-109 e D-020, a metade que o schema não faz sozinho.
 *
 * Nota pode restringir a lista de modelos, nunca ampliar. Saber se ampliou exige
 * a lista do playbook, que a nota não carrega. Com `playbook` declarado, a
 * comparação é direta. Sem ele, sobra a checagem fraca: modelo que não existe em
 * playbook nenhum é necessariamente ampliação.
 */
export function validarNotasContraPlaybooks(
  notas: { caminho: string; documento: unknown }[],
  playbooks: { caminho: string; documento: unknown }[],
): Problema[] {
  const problemas: Problema[] = []
  const modelosPorPlaybook = new Map<string, string[]>()
  const todosOsModelos = new Set<string>()

  for (const { caminho, documento } of playbooks) {
    // Leitura mínima de propósito. Se isto exigisse playbook inteiro válido, a
    // checagem de RF-109 se calaria justamente no playbook que tem outro defeito,
    // que é o pior momento possível para uma proteção ficar em silêncio.
    const identidade = IdentidadeDePlaybook.safeParse(documento)
    if (!identidade.success) {
      problemas.push({
        arquivo: caminho,
        campo: 'modelos_habilitados',
        mensagem:
          'RF-109: playbook sem id ou sem modelos_habilitados legíveis. ' +
          'Sem essa lista não há como verificar se alguma nota amplia os modelos',
      })
      continue
    }
    modelosPorPlaybook.set(identidade.data.id, identidade.data.modelos_habilitados)
    for (const modelo of identidade.data.modelos_habilitados) todosOsModelos.add(modelo)
  }

  for (const { caminho, documento } of notas) {
    const analisada = IdentidadeDeNota.safeParse(documento)
    if (!analisada.success) continue
    const restricao = analisada.data.sobreescreve?.modelos_habilitados
    if (restricao === undefined) continue

    const doPlaybook =
      analisada.data.playbook === undefined
        ? undefined
        : modelosPorPlaybook.get(analisada.data.playbook)

    if (analisada.data.playbook !== undefined && doPlaybook === undefined) {
      problemas.push({
        arquivo: caminho,
        campo: 'playbook',
        mensagem: `RF-109: nota aponta para playbook ${analisada.data.playbook}, que não existe`,
      })
      continue
    }

    const permitidos = doPlaybook ?? [...todosOsModelos]
    const origem =
      doPlaybook === undefined
        ? 'nenhum playbook do repositório habilita'
        : `o playbook ${analisada.data.playbook} não habilita`

    for (const modelo of restricao) {
      if (!permitidos.includes(modelo)) {
        problemas.push({
          arquivo: caminho,
          campo: 'sobreescreve.modelos_habilitados',
          mensagem:
            `RF-109, D-020: nota inclui o modelo ${modelo}, que ${origem}. ` +
            'Nota restringe a lista, nunca amplia',
        })
      }
    }
  }
  return problemas
}

/** Valida a pasta inteira, só as pastas da lista branca. */
export function validarPasta(raiz: string): Resultado {
  const arquivosLidos: string[] = []
  const problemas: Problema[] = []
  const porTipo = new Map<TipoItem, { caminho: string; documento: unknown }[]>()

  let entradas: string[]
  try {
    entradas = readdirSync(raiz)
  } catch (erro) {
    return {
      arquivosLidos: [],
      problemas: [
        {
          arquivo: raiz,
          campo: '(pasta)',
          mensagem: `RF-101: pasta de conhecimento não pôde ser lida: ${(erro as Error).message}`,
        },
      ],
    }
  }

  for (const entrada of entradas) {
    const caminhoPasta = join(raiz, entrada)
    if (!statSync(caminhoPasta).isDirectory()) continue
    if (!ehTipoConhecido(entrada)) continue

    const doTipo: { caminho: string; documento: unknown }[] = []
    for (const arquivo of listarYaml(caminhoPasta)) {
      arquivosLidos.push(arquivo)
      problemas.push(...validarArquivo(arquivo, entrada))
      try {
        doTipo.push({ caminho: arquivo, documento: parseYaml(readFileSync(arquivo, 'utf8')) })
      } catch {
        // problema de leitura ou de parse já foi registrado por validarArquivo
      }
    }
    porTipo.set(entrada, doTipo)
  }

  problemas.push(
    ...validarNotasContraPlaybooks(porTipo.get('notas') ?? [], porTipo.get('playbooks') ?? []),
  )

  return { arquivosLidos, problemas }
}

/** Tipo inferido pelo nome da pasta que contém o arquivo. */
export function tipoPeloCaminho(caminho: string): TipoItem | undefined {
  const pasta = basename(caminho.slice(0, caminho.lastIndexOf('/')))
  return ehTipoConhecido(pasta) ? pasta : undefined
}
