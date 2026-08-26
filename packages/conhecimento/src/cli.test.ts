import { execFileSync } from 'node:child_process'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * O contrato do CLI é o exit code (RF-101). Testar a função de validação não
 * prova esse contrato, porque o exit code mora no tool. Aqui o CLI roda de
 * verdade, como o PROTOCOLO manda usar na verificação de etapa.
 */
const RAIZ = resolve(import.meta.dirname, '../../..')
const CLI = join(RAIZ, 'tools', 'validar-conhecimento.ts')

function rodar(argumentos: string[]): { saida: string; codigo: number } {
  try {
    const saida = execFileSync('bun', [CLI, ...argumentos], {
      cwd: RAIZ,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    return { saida, codigo: 0 }
  } catch (erro) {
    const falha = erro as { status?: number; stdout?: string; stderr?: string }
    return {
      saida: `${falha.stdout ?? ''}${falha.stderr ?? ''}`,
      codigo: falha.status ?? -1,
    }
  }
}

describe('o CLI sai com exit code, que é o contrato da etapa', () => {
  it('sai diferente de zero quando a fixture quebra uma regra, citando o requisito', () => {
    const { saida, codigo } = rodar([
      join('conhecimento', 'fixtures-invalidas', 'eventos', 'sem-revisar-em.yaml'),
    ])
    expect(codigo).toBe(1)
    expect(saida).toContain('RF-110')
    expect(saida).toContain('arquivos verificados: 1')
  })

  it('checa nota contra playbook mesmo no modo arquivo, sem falso verde', () => {
    const { saida, codigo } = rodar([
      join('conhecimento', 'fixtures-invalidas', 'notas', 'amplia-modelos.yaml'),
    ])
    expect(codigo).toBe(1)
    expect(saida).toContain('RF-109')
    expect(saida).toContain('não habilita')
  })

  it('recusa arquivo cuja pasta não diz o tipo do item', () => {
    const { saida, codigo } = rodar([join('package.json')])
    expect(codigo).toBe(1)
    expect(saida).toContain('RF-101')
  })
})
