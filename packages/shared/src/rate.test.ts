import { describe, expect, it } from 'vitest'
import { Rate, bpsDeRate, exigirPositivo, rateDeBps } from './rate'

describe('grupo 2 e 3, Rate recusa number e entrada quebrada', () => {
  it('recusa number no tipo e em runtime', () => {
    expect(() => {
      // @ts-expect-error Rate aceita texto decimal, nunca number (D-045)
      Rate.de(0.12, 'ke')
    }).toThrow(TypeError)
  })

  it('recusa vazio, nao numerico, NaN e Infinity', () => {
    for (const entrada of ['', '  ', 'abc', 'NaN', 'Infinity', '0,12']) {
      expect(() => Rate.de(entrada, 'ke')).toThrow(TypeError)
    }
  })

  it('a mensagem nomeia o campo do dominio', () => {
    expect(() => Rate.de('', 'premio_de_risco')).toThrow('campo "premio_de_risco"')
  })
})

describe('grupo 5, comparacao so por metodo', () => {
  it('igual, maiorQue e menorQue existem, === nao serve', () => {
    const a = Rate.de('0.12', 'a')
    const b = Rate.de('0.12', 'b')
    expect(a === b).toBe(false)
    expect(a.igual(b)).toBe(true)
    expect(a.maiorQue(Rate.de('0.11', 'c'))).toBe(true)
    expect(a.menorQue(Rate.de('0.13', 'c'))).toBe(true)
  })

  it('nao existe toNumber nem serializacao implicita', () => {
    const a = Rate.de('0.12', 'a')
    expect('toNumber' in a).toBe(false)
    expect(() => String(a)).toThrow(TypeError)
    expect(JSON.stringify({ ke: a })).toBe('{"ke":"0.12"}')
  })
})

describe('grupo 6, algebra adimensional fechada em Rate', () => {
  it('soma, subtrai, multiplica e divide devolvem Rate', () => {
    const a = Rate.de('0.10', 'a')
    const b = Rate.de('0.02', 'b')
    expect(a.soma(b).paraArmazenamento()).toBe('0.12')
    expect(a.subtrai(b).paraArmazenamento()).toBe('0.08')
    expect(a.multiplicaPor(b).paraArmazenamento()).toBe('0.002')
    expect(a.divididoPor(b, 'razao').paraArmazenamento()).toBe('5')
    expect(a.soma(b)).toBeInstanceOf(Rate)
  })

  it('dividir por zero levanta erro nomeando o campo', () => {
    expect(() => Rate.de('0.10', 'a').divididoPor(Rate.de('0', 'b'), 'spread')).toThrow(
      'campo "spread": divisor recebido e zero, divisao nao executada',
    )
  })

  it('CAPM composto por partes continua sendo aritmetica de Rate', () => {
    const rf = Rate.de('0.1075', 'rf')
    const beta = Rate.de('0.72', 'beta')
    const erp = Rate.de('0.055', 'erp')
    expect(rf.soma(beta.multiplicaPor(erp)).paraArmazenamento()).toBe('0.1471')
  })
})

describe('grupo 11, Bps e formato de borda, nao tipo', () => {
  it('entra em bps por funcao de conversao e vira Rate', () => {
    expect(rateDeBps('125', 'spread').paraArmazenamento()).toBe('0.0125')
  })

  it('sai para bps por funcao de conversao, com casas e modo declarados', () => {
    expect(bpsDeRate(Rate.de('0.0125', 'spread'), 0, 'meio-par')).toBe('125')
    expect(bpsDeRate(Rate.de('0.012567', 'spread'), 1, 'meio-par')).toBe('125.7')
  })

  it('ida e volta por bps nao arredonda sozinha', () => {
    const original = Rate.de('0.012567', 'spread')
    expect(rateDeBps(bpsDeRate(original, 4, 'meio-par'), 'spread').igual(original)).toBe(true)
  })

  it('beta nao tem representacao em bps e continua sendo Rate normal', () => {
    const beta = Rate.de('0.72', 'beta')
    expect(beta.paraArmazenamento()).toBe('0.72')
  })
})

describe('guarda de sinal, opcional e pedida pelo chamador', () => {
  it('deixa passar taxa positiva e devolve a mesma taxa', () => {
    const taxa = Rate.de('0.03', 'Ke - g')
    expect(exigirPositivo(taxa, 'Ke - g').igual(taxa)).toBe(true)
  })

  it('barra zero e negativo com mensagem factual', () => {
    expect(() => exigirPositivo(Rate.de('0', 'x'), 'Ke - g')).toThrow(RangeError)
    expect(() => exigirPositivo(Rate.de('-0.02', 'x'), 'Ke - g')).toThrow(RangeError)
  })

  it('a aritmetica de Rate continua aceitando negativo, quem exige sinal e o chamador', () => {
    expect(Rate.de('0.08', 'ke').subtrai(Rate.de('0.10', 'g')).ehNegativo()).toBe(true)
  })
})

describe('sinal da taxa, cada predicado com os tres casos', () => {
  it('zero, positivo e negativo nao se confundem', () => {
    const zero = Rate.de('0', 'zero')
    const positivo = Rate.de('0.0001', 'positivo')
    const negativo = Rate.de('-0.0001', 'negativo')

    expect([zero.ehZero(), zero.ehPositivo(), zero.ehNegativo()]).toEqual([true, false, false])
    expect([positivo.ehZero(), positivo.ehPositivo(), positivo.ehNegativo()]).toEqual([
      false,
      true,
      false,
    ])
    expect([negativo.ehZero(), negativo.ehPositivo(), negativo.ehNegativo()]).toEqual([
      false,
      false,
      true,
    ])
  })
})

describe('overflow em cada operacao de Rate vira erro', () => {
  const enorme = '9e9000000000000000'

  it('soma, subtracao, multiplicacao e divisao barram resultado nao finito', () => {
    expect(() => Rate.de(enorme, 'a').soma(Rate.de(enorme, 'b'))).toThrow(
      'Rate.soma: resultado nao finito',
    )
    expect(() => Rate.de(enorme, 'a').subtrai(Rate.de(`-${enorme}`, 'b'))).toThrow(
      'Rate.subtrai: resultado nao finito',
    )
    expect(() => Rate.de(enorme, 'a').multiplicaPor(Rate.de('10', 'b'))).toThrow(
      'Rate.multiplicaPor: resultado nao finito',
    )
    expect(() => Rate.de(enorme, 'a').divididoPor(Rate.de('1e-9000000000000000', 'b'), 'r')).toThrow(
      'Rate.divididoPor: resultado nao finito',
    )
  })
})

describe('mensagens de Rate nomeiam campo e metodo', () => {
  it('formatar com casas quebradas nomeia o campo casas', () => {
    expect(() => Rate.de('0.12', 'ke').paraTexto(-1, 'meio-par')).toThrow('campo "casas"')
  })

  it('a serializacao implicita diz qual metodo usar no lugar', () => {
    expect(() => String(Rate.de('0.12', 'ke'))).toThrow(
      'Rate nao tem serializacao implicita, use paraArmazenamento() ou paraTexto(casas, modo)',
    )
  })

  it('a conversao de bps nomeia o divisor quando algo quebra', () => {
    expect(() => rateDeBps('abc', 'spread')).toThrow('campo "spread"')
    expect(() => bpsDeRate(Rate.de('0.01', 'x'), 1.5, 'meio-par')).toThrow('campo "casas"')
  })
})
