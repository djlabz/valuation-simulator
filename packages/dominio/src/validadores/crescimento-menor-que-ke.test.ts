import { describe, expect, it } from 'vitest'
import { EntradaDdm } from '../engines/ddm'
import { bancoTresAnos } from '../engines/ddm.fixtures'
import { ErroDeRegraDura } from '../erros'
import { MENSAGEM_R_104, R_104, validarCrescimentoMenorQueKe } from './crescimento-menor-que-ke'

function entrada(g: string, ke: string) {
  return EntradaDdm.parse({ ...bancoTresAnos(), crescimento_perpetuidade: g, custo_capital_proprio_ke: ke })
}

describe('R-104, crescimento da perpetuidade menor que o custo de capital próprio', () => {
  it('aprova g menor que Ke, inclusive por pouco e com g negativo', () => {
    expect(() => validarCrescimentoMenorQueKe(entrada('0.04', '0.13'))).not.toThrow()
    expect(() => validarCrescimentoMenorQueKe(entrada('0.1299', '0.13'))).not.toThrow()
    expect(() => validarCrescimentoMenorQueKe(entrada('-0.02', '0.13'))).not.toThrow()
  })

  it('reprova g igual a Ke, porque o denominador zera', () => {
    expect(() => validarCrescimentoMenorQueKe(entrada('0.13', '0.13'))).toThrow(ErroDeRegraDura)
  })

  it('reprova g maior que Ke, com id, mensagem do playbook e motivo', () => {
    try {
      validarCrescimentoMenorQueKe(entrada('0.2', '0.13'))
      expect.unreachable('devia ter reprovado')
    } catch (erro) {
      const e = erro as ErroDeRegraDura
      expect(e).toBeInstanceOf(ErroDeRegraDura)
      expect(e.regra).toBe(R_104)
      expect(e.regra).toBe('R-104')
      expect(e.message).toContain(MENSAGEM_R_104)
      expect(e.message).toContain('crescimento 0.2, custo de capital próprio 0.13')
      expect(e.motivo).toContain('Ke menos g')
    }
  })
})
