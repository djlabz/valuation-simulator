import { describe, expect, it } from 'vitest'
import { Dec, decimalDeTexto, exigirCasasDecimais, garantirFinito } from './decimal-config'

describe('grupo 1, a configuracao de D-046 esta ativa', () => {
  it('os quatro valores estao no construtor exportado', () => {
    expect(Dec.precision).toBe(34)
    expect(Dec.rounding).toBe(6)
    expect(Dec.toExpNeg).toBe(-9e15)
    expect(Dec.toExpPos).toBe(9e15)
  })

  it('rounding 6 e ROUND_HALF_EVEN, e arredonda sem vies de direcao', () => {
    expect(new Dec('2.5').toFixed(0, Dec.rounding)).toBe('2')
    expect(new Dec('3.5').toFixed(0, Dec.rounding)).toBe('4')
  })

  it('o construtor do projeto e independente do global do modulo', async () => {
    const decimalGlobal = (await import('decimal.js')).default
    decimalGlobal.set({ precision: 7 })
    expect(Dec.precision).toBe(34)
    decimalGlobal.set({ precision: 20 })
  })
})

describe('grupo 3, o construtor recusa entrada que nao e decimal', () => {
  it('recusa texto vazio e texto so com espaco', () => {
    expect(() => decimalDeTexto('', 'preco')).toThrow(TypeError)
    expect(() => decimalDeTexto('   ', 'preco')).toThrow(TypeError)
  })

  it('recusa NaN e Infinity escritos como texto', () => {
    expect(() => decimalDeTexto('NaN', 'preco')).toThrow(TypeError)
    expect(() => decimalDeTexto('Infinity', 'preco')).toThrow(TypeError)
    expect(() => decimalDeTexto('-Infinity', 'preco')).toThrow(TypeError)
  })

  it('recusa texto nao numerico e numero pela metade', () => {
    for (const entrada of ['abc', '12,50', 'R$ 12.50', '1.2.3', '12.', '.5', '1_000']) {
      expect(() => decimalDeTexto(entrada, 'preco')).toThrow(TypeError)
    }
  })

  it('recusa expoente que estoura a faixa e vira Infinity', () => {
    expect(() => decimalDeTexto('1e9000000000000001', 'preco')).toThrow(RangeError)
    expect(() => decimalDeTexto('1e9000000000000001', 'preco')).toThrow(
      'campo "preco": esperava numero finito, recebeu texto "1e9000000000000001"',
    )
  })

  it('a mensagem diz o campo e o valor recebido, sem adjetivo', () => {
    expect(() => decimalDeTexto('', 'taxa_de_desconto')).toThrow(
      'campo "taxa_de_desconto": esperava texto decimal no formato [sinal]digitos[.digitos], recebeu texto ""',
    )
  })

  it('casas decimais recusa fracionario e negativo', () => {
    expect(() => exigirCasasDecimais(2.5, 'casas')).toThrow(RangeError)
    expect(() => exigirCasasDecimais(-1, 'casas')).toThrow(RangeError)
    expect(exigirCasasDecimais(0, 'casas')).toBe(0)
  })
})

describe('grupo 4, round trip de texto sem notacao exponencial', () => {
  it('valor muito pequeno volta em texto plano', () => {
    const pequeno = '0.000000000000001'
    expect(decimalDeTexto(pequeno, 'fator').toString()).toBe(pequeno)
    expect(decimalDeTexto(pequeno, 'fator').toString()).not.toContain('e')
  })

  it('valor muito grande volta em texto plano', () => {
    const grande = '99999999999999999999999999.99'
    expect(decimalDeTexto(grande, 'valor').toString()).toBe(grande)
    expect(decimalDeTexto(grande, 'valor').toString()).not.toContain('e')
  })

  it('entrada em notacao exponencial sai normalizada em texto plano', () => {
    expect(decimalDeTexto('1e-9', 'fator').toString()).toBe('0.000000001')
  })
})

describe('a recusa descreve o tipo do que chegou, para a mensagem servir de diagnostico', () => {
  it('nomeia number, bigint, null, undefined e objeto', () => {
    expect(() => decimalDeTexto(10 as unknown as string, 'preco')).toThrow('recebeu number 10')
    expect(() => decimalDeTexto(10n as unknown as string, 'preco')).toThrow('recebeu bigint 10')
    expect(() => decimalDeTexto(null as unknown as string, 'preco')).toThrow('recebeu null')
    expect(() => decimalDeTexto(undefined as unknown as string, 'preco')).toThrow(
      'recebeu undefined',
    )
    expect(() => decimalDeTexto({} as unknown as string, 'preco')).toThrow('recebeu object')
  })
})

describe('overflow vira erro, nunca Infinity silencioso', () => {
  it('resultado fora da faixa levanta erro nomeando a operacao', () => {
    const enorme = new Dec('9e9000000000000000')
    expect(garantirFinito(enorme, 'teste')).toBe(enorme)
    expect(() => garantirFinito(enorme.times(10), 'teste.multiplicacao')).toThrow(
      'teste.multiplicacao: resultado nao finito',
    )
  })
})
