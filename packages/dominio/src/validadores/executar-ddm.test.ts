import { Money } from '@valuation/shared'
import { describe, expect, it } from 'vitest'
import { calcularDdm } from '../engines/ddm'
import { BANCO_TRES_ANOS, bancoTresAnos } from '../engines/ddm.fixtures'
import { ErroDeRegraDura } from '../erros'
import { executarDdm } from './executar-ddm'

function regraDe(fn: () => unknown): string | undefined {
  try {
    fn()
  } catch (erro) {
    return erro instanceof ErroDeRegraDura ? erro.regra : `outro: ${(erro as Error).name}`
  }
  return undefined
}

describe('D-121, executarDdm roda validador de entrada, engine e guardas, nessa ordem', () => {
  it('com tudo válido devolve o mesmo resultado da engine', () => {
    expect(executarDdm(BANCO_TRES_ANOS)).toEqual(calcularDdm(BANCO_TRES_ANOS))
  })

  it('R-102 vale por construção: em cada ano e na perpetuidade, dividendo = lucro − retenção', () => {
    const r = executarDdm(BANCO_TRES_ANOS)
    const brl = (t: string) => Money.de(t, 'BRL', 'teste')
    for (const a of r.anos) {
      expect(brl(a.dividendo).igual(brl(a.lucro).subtrai(brl(a.retencao))), `ano ${a.ano}`).toBe(true)
    }
    const p = r.perpetuidade
    expect(
      brl(p.dividendo_primeiro_ano).igual(brl(p.lucro_primeiro_ano).subtrai(brl(p.retencao_primeiro_ano))),
    ).toBe(true)
  })

  it('g igual ou maior que Ke para no R-104, antes da engine, e não na aritmética dela', () => {
    for (const g of ['0.13', '0.2']) {
      expect(regraDe(() => executarDdm({ ...bancoTresAnos(), crescimento_perpetuidade: g }))).toBe('R-104')
    }
  })

  it('estrutura quebrada falha como estrutura, antes de qualquer regra dura', () => {
    const entrada = { ...bancoTresAnos(), basileia_alvo: ['0.11'], crescimento_perpetuidade: '0.2' }
    expect(regraDe(() => executarDdm(entrada))).toBe('outro: ZodError')
  })
})
