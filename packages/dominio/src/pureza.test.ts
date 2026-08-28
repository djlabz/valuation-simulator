import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * RF-501 e RNF-003 em teste, não em disciplina.
 *
 * Até esta etapa, "engine não acessa relógio, rede nem aleatoriedade" era
 * verificado por grep manual durante a inspeção, o que depende de alguém lembrar.
 * Aqui vira teste: a suíte varre os arquivos de produção do pacote e falha se
 * achar padrão proibido.
 */
const RAIZ = resolve(import.meta.dirname, '..')

const PROIBIDOS: { padrao: RegExp; motivo: string }[] = [
  { padrao: /\bnew\s+Date\b/, motivo: 'RNF-003: relógio' },
  { padrao: /\bDate\s*\.\s*now\b/, motivo: 'RNF-003: relógio' },
  { padrao: /\bperformance\s*\.\s*now\b/, motivo: 'RNF-003: relógio' },
  { padrao: /\bMath\s*\.\s*random\b/, motivo: 'RNF-003: aleatoriedade' },
  { padrao: /\bcrypto\s*\.\s*(randomUUID|getRandomValues|randomBytes)\b/, motivo: 'RNF-003: aleatoriedade' },
  { padrao: /\bfetch\s*\(/, motivo: 'RF-501: rede' },
  { padrao: /\bXMLHttpRequest\b/, motivo: 'RF-501: rede' },
  { padrao: /from\s+['"]node:(fs|http|https|net|dns|child_process)['"]/, motivo: 'RF-501: I/O' },
  { padrao: /\brequire\s*\(\s*['"]node:(fs|http|https|net|dns|child_process)['"]/, motivo: 'RF-501: I/O' },
  { padrao: /\bprocess\s*\.\s*env\b/, motivo: 'RF-501: ambiente é entrada escondida' },
]

function arquivosDeProducao(pasta: string): string[] {
  const achados: string[] = []
  for (const entrada of readdirSync(pasta)) {
    const caminho = join(pasta, entrada)
    if (statSync(caminho).isDirectory()) {
      achados.push(...arquivosDeProducao(caminho))
      continue
    }
    if (!entrada.endsWith('.ts')) continue
    // fixture NÃO é exceção: ela alimenta a engine, e `data_base: new Date()`
    // numa fixture injeta o relógio no cálculo sem tocar em nenhum arquivo de
    // produção. Só arquivo de teste fica de fora
    if (entrada.endsWith('.test.ts')) continue
    achados.push(caminho)
  }
  return achados
}

describe('RF-501 e RNF-003, pureza do pacote dominio verificada por teste', () => {
  const arquivos = arquivosDeProducao(join(RAIZ, 'src'))

  it('a varredura enxerga os arquivos de produção e as fixtures do pacote', () => {
    expect(arquivos.length).toBeGreaterThan(0)
    expect(arquivos.some((a) => a.endsWith('fcff-por-concessao.ts'))).toBe(true)
    expect(arquivos.some((a) => a.endsWith('.fixtures.ts'))).toBe(true)
    expect(arquivos.some((a) => a.endsWith('.test.ts'))).toBe(false)
  })

  it('nenhum arquivo varrido usa relógio, rede, I/O ou aleatoriedade', () => {
    const violacoes: string[] = []
    for (const arquivo of arquivos) {
      const linhas = readFileSync(arquivo, 'utf8').split('\n')
      linhas.forEach((linha, i) => {
        // comentário citando o padrão não é uso dele
        const semComentario = linha.replace(/\/\/.*$/, '').replace(/^\s*\*.*$/, '')
        for (const { padrao, motivo } of PROIBIDOS) {
          if (padrao.test(semComentario)) {
            violacoes.push(`${arquivo}:${i + 1} ${motivo} -> ${linha.trim()}`)
          }
        }
      })
    }
    expect(violacoes).toEqual([])
  })

  it('a varredura pega o padrão quando ele existe, senão ela é decoração', () => {
    // controle negativo: prova que a expressão de fato casa
    const amostra = 'const agora = new Date()'
    expect(PROIBIDOS.some((p) => p.padrao.test(amostra))).toBe(true)
    const amostra2 = 'const x = Math.random()'
    expect(PROIBIDOS.some((p) => p.padrao.test(amostra2))).toBe(true)
  })
})
