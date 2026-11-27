import { describe, expect, it } from 'vitest'
import { EntradaDdm, calcularDdm } from '../engines/ddm'
import { bancoTresAnos } from '../engines/ddm.fixtures'
import { ErroDeRegraDura } from '../erros'
import { MENSAGEM_R_103, R_103, validarSpreadROEKe } from './spread-roe-ke'

describe('R-103, guarda de saída: o resultado declara a base da entrada', () => {
  for (const base of ['nominal', 'real'] as const) {
    it(`aprova o resultado da engine com base ${base}`, () => {
      const entrada = EntradaDdm.parse({ ...bancoTresAnos(), base_nominal_ou_real: base })
      expect(() => validarSpreadROEKe(entrada, calcularDdm(entrada))).not.toThrow()
    })
  }

  it('reprova resultado com a base trocada, com id, mensagem e motivo', () => {
    const entrada = EntradaDdm.parse(bancoTresAnos())
    const r = { ...calcularDdm(entrada), base_nominal_ou_real: 'real' as const }
    try {
      validarSpreadROEKe(entrada, r)
      expect.unreachable('devia ter reprovado')
    } catch (erro) {
      const e = erro as ErroDeRegraDura
      expect(e).toBeInstanceOf(ErroDeRegraDura)
      expect(e.regra).toBe(R_103)
      expect(e.regra).toBe('R-103')
      expect(e.message).toContain(MENSAGEM_R_103)
      expect(e.message).toContain('a entrada é nominal e o resultado declara real')
      expect(e.motivo).toContain('inflação')
    }
  })
})
