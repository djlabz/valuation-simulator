import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parse as parseYaml } from 'yaml'
import { describe, expect, it } from 'vitest'

/**
 * O documento de requisitos e conhecimento/playbooks/ precisam continuar iguais
 * (D-064, D-065).
 *
 * A divergência anterior nasceu de os dois lados serem iguais num dia e ninguém
 * garantir o dia seguinte. Levou dois passos para alguém notar. Este teste é a
 * garantia do dia seguinte.
 *
 * Como os blocos são localizados: por conteúdo, não por posição nem por título.
 * Cada bloco ```yaml do documento é parseado, e vale como playbook o que tiver
 * `id` e `modelos_habilitados` no topo. O casamento com o arquivo é pelo `id`.
 *
 * Sobrevive a renumerar seção, reordenar, renomear título, inserir seção antes da
 * 9 e acrescentar outros blocos YAML, como os exemplos de nota e de evento da 9.4.
 * Não sobrevive a trocar a cerca ```yaml por outra coisa, a tirar o bloco, nem a
 * mudar o `id` dentro dele, e nenhum dos três deveria sobreviver.
 */
const RAIZ = resolve(import.meta.dirname, '../../..')
const PASTA_PLAYBOOKS = join(RAIZ, 'conhecimento', 'playbooks')

/** Achado por glob, para o teste não quebrar quando o documento mudar de versão. */
function caminhoDoDocumento(): string {
  const docs = readdirSync(join(RAIZ, 'docs')).filter(
    (nome) => /^REQUISITOS-valuation-simulator-v.+\.md$/.test(nome),
  )
  expect(docs).toHaveLength(1)
  return join(RAIZ, 'docs', docs[0] as string)
}

interface BlocoDeDocumento {
  id: string
  texto: string
  linha: number
}

function playbooksDoDocumento(): BlocoDeDocumento[] {
  const linhas = readFileSync(caminhoDoDocumento(), 'utf8').split('\n')
  const blocos: BlocoDeDocumento[] = []
  for (let i = 0; i < linhas.length; i += 1) {
    if (linhas[i]?.trim() !== '```yaml') continue
    let fim = i + 1
    while (fim < linhas.length && linhas[fim]?.trim() !== '```') fim += 1
    const texto = linhas.slice(i + 1, fim).join('\n').replace(/\n+$/, '')
    let analisado: unknown
    try {
      analisado = parseYaml(texto)
    } catch {
      continue
    }
    const objeto = analisado as Record<string, unknown> | null
    const ehPlaybook =
      objeto !== null &&
      typeof objeto === 'object' &&
      typeof objeto['id'] === 'string' &&
      Array.isArray(objeto['modelos_habilitados'])
    if (ehPlaybook) {
      blocos.push({ id: objeto['id'] as string, texto, linha: i + 1 })
    }
    i = fim
  }
  return blocos
}

function playbooksDoRepositorio(): Map<string, string> {
  const arquivos = readdirSync(PASTA_PLAYBOOKS).filter((n) => n.endsWith('.yaml'))
  const porId = new Map<string, string>()
  for (const arquivo of arquivos) {
    const texto = readFileSync(join(PASTA_PLAYBOOKS, arquivo), 'utf8').replace(/\n+$/, '')
    const objeto = parseYaml(texto) as Record<string, unknown>
    porId.set(objeto['id'] as string, texto)
  }
  return porId
}

describe('a seção 9 do documento e conhecimento/playbooks/ não podem divergir', () => {
  it('encontra os três playbooks dos dois lados', () => {
    const doDocumento = playbooksDoDocumento()
    const doRepositorio = playbooksDoRepositorio()
    expect(doRepositorio.size).toBe(3)
    expect(doDocumento.length).toBe(3)
  })

  it('os dois lados têm exatamente os mesmos ids', () => {
    const idsDoDocumento = playbooksDoDocumento()
      .map((b) => b.id)
      .sort()
    const idsDoRepositorio = [...playbooksDoRepositorio().keys()].sort()
    expect(idsDoDocumento).toEqual(idsDoRepositorio)
  })

  it('cada playbook é idêntico byte a byte nos dois lados', () => {
    const doRepositorio = playbooksDoRepositorio()
    for (const bloco of playbooksDoDocumento()) {
      const doArquivo = doRepositorio.get(bloco.id)
      expect(doArquivo, `playbook ${bloco.id} não existe em conhecimento/playbooks/`).toBeDefined()
      expect(bloco.texto, `divergência em ${bloco.id}, bloco na linha ${bloco.linha}`).toBe(
        doArquivo,
      )
    }
  })

  it('não confunde os exemplos de nota e evento da seção 9.4 com playbook', () => {
    // a nota de exemplo tem modelos_habilitados aninhado em sobreescreve, e cair
    // nessa seria classificar nota como playbook
    const ids = playbooksDoDocumento().map((b) => b.id)
    expect(ids).not.toContain('NA-007')
    expect(ids).not.toContain('EV-023')
  })
})
