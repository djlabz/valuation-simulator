import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { MENSAGEM_R_102 } from './retencao-regulatoria'
import { MENSAGEM_R_103 } from './spread-roe-ke'
import { MENSAGEM_R_104 } from './crescimento-menor-que-ke'

/**
 * A mensagem que o validador lança é a mensagem da regra dura no playbook. Sem este
 * teste, as duas podiam divergir, e esvaziar a constante do validador deixava a
 * suíte verde (sobrevivente do mutation de 27/11/2026). A mensagem de regra dura é
 * redação de validador e muda junto com a regra (CLAUDE.md, seção 3).
 *
 * Leitura por texto de propósito, como no teste da engine: o dominio não depende
 * do parser de YAML. O R-102 usa bloco dobrado (>), e as linhas são juntadas com
 * espaço, que é o que o YAML faz.
 */
const PLAYBOOK = readFileSync(
  join(resolve(import.meta.dirname, '../../../..'), 'conhecimento', 'playbooks', 'bancos-b3.yaml'),
  'utf8',
)

function mensagemDoPlaybook(regra: string): string {
  const linhas = PLAYBOOK.split('\n')
  const inicio = linhas.findIndex((l) => l.trim() === `- id: ${regra}`)
  expect(inicio, `${regra} no playbook`).toBeGreaterThan(-1)
  const linha = linhas.slice(inicio + 1).find((l) => l.trim().startsWith('mensagem:')) as string
  const valor = linha.trim().slice('mensagem:'.length).trim()
  if (valor.startsWith('"')) return valor.slice(1, -1)
  expect(valor).toBe('>')
  const corpo: string[] = []
  for (const l of linhas.slice(linhas.indexOf(linha) + 1)) {
    if (!l.startsWith('      ')) break
    corpo.push(l.trim())
  }
  return corpo.join(' ')
}

describe('a mensagem de cada validador é a da regra dura no playbook bancos-b3', () => {
  it('R-102', () => expect(MENSAGEM_R_102).toBe(mensagemDoPlaybook('R-102')))
  it('R-103', () => expect(MENSAGEM_R_103).toBe(mensagemDoPlaybook('R-103')))
  it('R-104', () => expect(MENSAGEM_R_104).toBe(mensagemDoPlaybook('R-104')))
})
