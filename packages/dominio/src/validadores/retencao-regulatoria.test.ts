import { describe, expect, it } from 'vitest'
import { calcularDdm } from '../engines/ddm'
import { BANCO_TRES_ANOS } from '../engines/ddm.fixtures'
import { ErroDeRegraDura } from '../erros'
import { MENSAGEM_R_102, R_102, validarRetencaoRegulatoria } from './retencao-regulatoria'

describe('R-102, guarda de saída: dividendo não passa do lucro menos a retenção', () => {
  it('aprova o resultado da engine, em que a regra vale por construção', () => {
    expect(() => validarRetencaoRegulatoria(calcularDdm(BANCO_TRES_ANOS))).not.toThrow()
  })

  it('aprova dividendo menor que o limite, que a regra permite', () => {
    const r = structuredClone(calcularDdm(BANCO_TRES_ANOS))
    r.anos[2]!.dividendo = '0'
    expect(() => validarRetencaoRegulatoria(r)).not.toThrow()
  })

  it('reprova resultado adulterado num ano, nomeando o ano, com motivo', () => {
    const r = structuredClone(calcularDdm(BANCO_TRES_ANOS))
    r.anos[1]!.dividendo = '0'
    try {
      validarRetencaoRegulatoria(r)
      expect.unreachable('devia ter reprovado')
    } catch (erro) {
      const e = erro as ErroDeRegraDura
      expect(e).toBeInstanceOf(ErroDeRegraDura)
      expect(e.regra).toBe(R_102)
      expect(e.regra).toBe('R-102')
      expect(e.message).toContain(MENSAGEM_R_102)
      expect(e.message).toContain('ano 2, dividendo 0, lucro menos retenção -0.756')
      expect(e.motivo).toContain('crescimento dos RWA exige')
    }
  })

  it('reprova resultado adulterado na perpetuidade', () => {
    const r = structuredClone(calcularDdm(BANCO_TRES_ANOS))
    r.perpetuidade.dividendo_primeiro_ano = '12'
    expect(() => validarRetencaoRegulatoria(r)).toThrow(/perpetuidade, dividendo 12/)
  })

  it('reprova por um centavo, sem tolerância', () => {
    const r = structuredClone(calcularDdm(BANCO_TRES_ANOS))
    r.anos[0]!.dividendo = '22.61'
    expect(() => validarRetencaoRegulatoria(r)).toThrow(ErroDeRegraDura)
  })
})
