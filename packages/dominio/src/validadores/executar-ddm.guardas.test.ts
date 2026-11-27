import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ResultadoDdm } from '../engines/ddm'
import { BANCO_TRES_ANOS } from '../engines/ddm.fixtures'
import { ErroDeRegraDura } from '../erros'

/**
 * As guardas de saída só reprovam engine com defeito (D-121), e a engine de verdade
 * não tem. Sem este arquivo, tirar a chamada de uma guarda de dentro do executarDdm
 * deixava a suíte verde: medido no exercício manual de 27/11/2026, com o R-102 e o
 * R-103 desligados um de cada vez.
 *
 * Aqui a engine é trocada por uma que devolve o resultado verdadeiro adulterado, e
 * o teste exige que o executarDdm pare na guarda certa. A troca vale só para este
 * arquivo: o mock do vitest é por módulo de teste.
 */
const adulterar = vi.hoisted(() => ({ fn: (r: unknown) => r }))

vi.mock('../engines/ddm', async (original) => {
  const real = await original<typeof import('../engines/ddm')>()
  return { ...real, calcularDdm: (e: unknown) => adulterar.fn(real.calcularDdm(e)) }
})

const { executarDdm } = await import('./executar-ddm')

function regraDe(fn: () => unknown): string | undefined {
  try {
    fn()
  } catch (erro) {
    return erro instanceof ErroDeRegraDura ? erro.regra : `outro: ${(erro as Error).name}`
  }
  return undefined
}

describe('D-121, o executarDdm passa o resultado da engine pelas duas guardas', () => {
  beforeEach(() => {
    adulterar.fn = (r) => r
  })

  it('sem adulteração, nenhuma guarda dispara', () => {
    expect(regraDe(() => executarDdm(BANCO_TRES_ANOS))).toBeUndefined()
  })

  it('engine que paga dividendo acima do lucro menos a retenção para no R-102', () => {
    adulterar.fn = (r) => {
      const c = structuredClone(r) as ResultadoDdm
      c.anos[0]!.dividendo = '1000'
      return c
    }
    expect(regraDe(() => executarDdm(BANCO_TRES_ANOS))).toBe('R-102')
  })

  it('engine que troca a base no resultado para no R-103', () => {
    adulterar.fn = (r) => ({ ...(r as ResultadoDdm), base_nominal_ou_real: 'real' })
    expect(regraDe(() => executarDdm(BANCO_TRES_ANOS))).toBe('R-103')
  })
})
