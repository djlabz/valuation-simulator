import { describe, expect, it } from 'vitest'
import { Dec } from './decimal-config'
import { Money, brl, usd } from './money'
import { Rate, exigirPositivo } from './rate'

describe('grupo 2, o construtor recusa number', () => {
  it('recusa number no tipo e em runtime', () => {
    expect(() => {
      // @ts-expect-error construtor de Money aceita texto decimal, nunca number (D-045)
      Money.de(10, 'BRL', 'preco')
    }).toThrow(TypeError)
  })

  it('a mensagem de recusa diz que veio number e qual era o campo', () => {
    expect(() => Money.de(10 as unknown as string, 'BRL', 'preco')).toThrow(
      'campo "preco (Money<\'BRL\'>)": esperava texto decimal, recebeu number 10',
    )
  })

  it('nao existe porta de entrada a partir de number', () => {
    expect(Object.getOwnPropertyNames(Money)).not.toContain('deNumber')
    expect(Object.getOwnPropertyNames(Money)).not.toContain('fromNumber')
  })
})

describe('grupo 3, o construtor recusa entrada quebrada', () => {
  it('recusa vazio, nao numerico, NaN e Infinity', () => {
    for (const entrada of ['', 'abc', 'NaN', 'Infinity', '12,50']) {
      expect(() => brl(entrada, 'preco')).toThrow(TypeError)
    }
    expect(() => brl('1e9000000000000001', 'preco')).toThrow(RangeError)
  })
})

describe('grupo 5, comparacao so por metodo', () => {
  it('duas instancias de mesmo valor nao sao a mesma instancia', () => {
    const a = brl('10.00', 'a')
    const b = brl('10.00', 'b')
    expect(a === b).toBe(false)
    expect(a.igual(b)).toBe(true)
    expect(a.maiorQue(brl('9.99', 'c'))).toBe(true)
    expect(a.menorQue(brl('10.01', 'c'))).toBe(true)
  })

  it('operador aritmetico nao compila, e o relacional quebra em runtime', () => {
    const a = brl('10.00', 'a')
    const b = brl('20.00', 'b')
    expect(() => {
      // @ts-expect-error operador aritmetico nao se aplica a Money, use subtrai()
      a - b
    }).toThrow(TypeError)
    // @ts-expect-error Money nao e number e nao se atribui a number
    const naoEhNumero: number = a
    expect(naoEhNumero).toBeInstanceOf(Money)
    // o TypeScript aceita a > b entre dois objetos do mesmo tipo, entao neste caso
    // quem barra e o runtime: sem valueOf numerico, a comparacao cai no toString
    expect(() => {
      a > b
    }).toThrow(TypeError)
  })

  it('nao existe toNumber nem serializacao implicita', () => {
    const a = brl('10.00', 'a')
    expect('toNumber' in a).toBe(false)
    expect(() => {
      // @ts-expect-error toNumber nao existe na API publica do shared (D-045)
      a.toNumber()
    }).toThrow(TypeError)
    expect(() => String(a)).toThrow(TypeError)
    expect(() => `${a}`).toThrow(TypeError)
  })

  it('serializacao explicita continua funcionando', () => {
    const a = brl('10.5', 'a')
    expect(a.paraArmazenamento()).toBe('10.5')
    expect(a.paraTexto(2, 'meio-par')).toBe('10.50')
    expect(JSON.stringify({ preco: a })).toBe('{"preco":"10.5"}')
  })
})

describe('grupo 6, dimensao imposta pelo tipo', () => {
  it('dinheiro vezes dinheiro nao compila', () => {
    const a = brl('10.00', 'a')
    const b = brl('20.00', 'b')
    expect(() => {
      // @ts-expect-error real vezes real nao tem significado (D-047)
      a.multiplicaPor(b)
    }).toThrow(TypeError)
  })

  it('dinheiro vezes taxa devolve dinheiro', () => {
    const resultado = brl('100.00', 'preco').multiplicaPor(Rate.de('1.1', 'reajuste'))
    expect(resultado).toBeInstanceOf(Money)
    expect(resultado.paraArmazenamento()).toBe('110')
  })

  it('dinheiro dividido por dinheiro devolve taxa', () => {
    const resultado = brl('50.00', 'parte').divididoPor(brl('200.00', 'todo'), 'participacao')
    expect(resultado).toBeInstanceOf(Rate)
    expect(resultado.paraArmazenamento()).toBe('0.25')
  })

  it('dividir por dinheiro zero levanta erro em vez de devolver Infinity', () => {
    expect(() => brl('50.00', 'parte').divididoPor(brl('0', 'todo'), 'participacao')).toThrow(
      'campo "participacao": divisor recebido e zero, divisao nao executada',
    )
  })
})

describe('grupo 7, moeda imposta pelo tipo', () => {
  it('somar BRL com USD nao compila', () => {
    const real = brl('10.00', 'real')
    const dolar = usd('10.00', 'dolar')
    // @ts-expect-error moedas diferentes nao somam (D-047)
    real.soma(dolar)
    // @ts-expect-error Money<'USD'> nao e Money<'BRL'>
    const _atribuicao: Money<'BRL'> = dolar
    expect(_atribuicao).toBeInstanceOf(Money)
  })

  it('conversao existe so por funcao explicita, com cambio informado', () => {
    const dolar = usd('100.00', 'dolar')
    const convertido = Money.converter(dolar, 'BRL', Rate.de('5.4321', 'cambio'))
    expect(convertido.paraArmazenamento()).toBe('543.21')
    expect(convertido.soma(brl('10.00', 'real')).paraArmazenamento()).toBe('553.21')
  })
})

describe('grupo 8, aritmetica exata onde float falha', () => {
  it('0.1 mais 0.2 da exatamente 0.3', () => {
    expect(brl('0.1', 'a').soma(brl('0.2', 'b')).paraArmazenamento()).toBe('0.3')
  })

  it('reajuste composto por doze periodos bate com o valor exato', () => {
    let valor = brl('100', 'principal')
    const indice = Rate.de('1.05', 'indice')
    for (let periodo = 1; periodo <= 12; periodo += 1) {
      valor = valor.multiplicaPor(indice)
    }
    expect(valor.paraArmazenamento()).toBe('179.5856326022129150390625')
  })
})

describe('grupo 9, cadeia de desconto de trinta periodos', () => {
  const fluxo = brl('1000', 'fluxo')
  const um = Rate.de('1', 'um')
  const umMaisKe = um.soma(Rate.de('0.12', 'ke'))

  function descontarTrintaPeriodos(): Money<'BRL'> {
    let fator = um
    let total = brl('0', 'total')
    for (let periodo = 1; periodo <= 30; periodo += 1) {
      fator = fator.divididoPor(umMaisKe, 'fator de desconto')
      total = total.soma(fluxo.multiplicaPor(fator))
    }
    return total
  }

  it('bate com referencia calculada em precisao 60, ate 25 digitos significativos', () => {
    const alto = Dec.clone({ precision: 60 })
    let fatorRef = new alto('1')
    let totalRef = new alto('0')
    for (let periodo = 1; periodo <= 30; periodo += 1) {
      fatorRef = fatorRef.dividedBy(new alto('1.12'))
      totalRef = totalRef.plus(fatorRef.times(new alto('1000')))
    }
    const esperado = totalRef.toSignificantDigits(25, 6).toString()
    const obtido = new alto(descontarTrintaPeriodos().paraArmazenamento())
      .toSignificantDigits(25, 6)
      .toString()
    expect(obtido).toBe(esperado)
  })
})

describe('grupo 10, valor terminal com denominador pequeno', () => {
  const fluxo = brl('1000', 'fluxo')
  const um = Rate.de('1', 'um')

  it('denominador minusculo nao colapsa a precisao', () => {
    const spread = Rate.de('0.0001', 'Ke - g')
    const terminal = fluxo.multiplicaPor(um.divididoPor(spread, 'Ke - g'))
    expect(terminal.paraArmazenamento()).toBe('10000000')
  })

  it('denominador zero levanta erro explicito, nao Infinity', () => {
    const spread = Rate.de('0.12', 'ke').subtrai(Rate.de('0.12', 'g'))
    expect(spread.ehZero()).toBe(true)
    expect(() => um.divididoPor(spread, 'Ke - g')).toThrow(
      'campo "Ke - g": divisor recebido e zero, divisao nao executada',
    )
    expect(() => exigirPositivo(spread, 'Ke - g')).toThrow(
      'campo "Ke - g": esperava taxa maior que zero, recebeu 0',
    )
  })

  it('denominador negativo e barrado pela guarda e nunca vira numero plausivel', () => {
    const spread = Rate.de('0.08', 'ke').subtrai(Rate.de('0.10', 'g'))
    expect(spread.ehNegativo()).toBe(true)
    expect(() => exigirPositivo(spread, 'Ke - g')).toThrow(
      'campo "Ke - g": esperava taxa maior que zero, recebeu -0.02',
    )
    const semGuarda = fluxo.multiplicaPor(um.divididoPor(spread, 'Ke - g'))
    expect(semGuarda.ehNegativo()).toBe(true)
  })
})

describe('grupo 11, arredondamento so onde o chamador pede', () => {
  it('o construtor nao arredonda a entrada', () => {
    const longo = '1.23456789012345678901234567890123456789'
    expect(brl(longo, 'preco').paraArmazenamento()).toBe(longo)
  })

  it('multiplicacao guarda todas as casas ate alguem pedir formato', () => {
    const preco = brl('100.00', 'preco')
    const fator = Rate.de('0.333333333333', 'fator')
    expect(preco.multiplicaPor(fator).paraArmazenamento()).toBe('33.3333333333')
    expect(preco.multiplicaPor(fator).paraTexto(2, 'meio-par')).toBe('33.33')
  })

  it('formatar sem declarar o modo nao compila e ainda quebra em runtime', () => {
    const preco = brl('100.00', 'preco')
    expect(() => {
      // @ts-expect-error o modo de arredondamento e obrigatorio, nao existe default (RP-003)
      preco.paraTexto(2)
    }).toThrow('modo de arredondamento desconhecido: undefined')
  })

  it('o mesmo valor em modos diferentes da resultados diferentes, e quem escolhe e o chamador', () => {
    const preco = brl('2.345', 'preco')
    expect(preco.paraTexto(2, 'meio-par')).toBe('2.34')
    expect(preco.paraTexto(2, 'meio-para-cima')).toBe('2.35')
    expect(preco.paraTexto(2, 'piso')).toBe('2.34')
    expect(preco.paraTexto(2, 'teto')).toBe('2.35')
  })
})

describe('grupo 12, determinismo (RNF-003)', () => {
  function cadeia(): string {
    const fluxo = brl('1234.56', 'fluxo')
    const umMaisKe = Rate.de('1', 'um').soma(Rate.de('0.1075', 'ke'))
    let fator = Rate.de('1', 'um')
    let total = brl('0', 'total')
    for (let periodo = 1; periodo <= 30; periodo += 1) {
      fator = fator.divididoPor(umMaisKe, 'fator de desconto')
      total = total.soma(fluxo.multiplicaPor(fator))
    }
    return total.paraArmazenamento()
  }

  it('a mesma entrada devolve saida identica em execucoes repetidas', () => {
    const execucoes = [cadeia(), cadeia(), cadeia()]
    expect(new Set(execucoes).size).toBe(1)
  })

  it('a saida nao depende de ordem de leitura nem de estado anterior', () => {
    const primeira = cadeia()
    brl('999999.99', 'ruido').multiplicaPor(Rate.de('3.7', 'ruido'))
    expect(cadeia()).toBe(primeira)
  })
})

describe('sinal do dinheiro, cada predicado com os tres casos', () => {
  it('zero, positivo e negativo nao se confundem', () => {
    const zero = brl('0', 'zero')
    const positivo = brl('0.01', 'positivo')
    const negativo = brl('-0.01', 'negativo')

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

describe('guarda de dimensao em runtime, para quem chega sem tipo', () => {
  it('multiplicaPor diz o que recebeu no lugar do Rate', () => {
    const a = brl('10.00', 'a')
    const casos: Array<[unknown, string]> = [
      [brl('2', 'b'), 'Money'],
      [null, 'null'],
      [undefined, 'undefined'],
      [2, 'number'],
      ['0.1', 'string'],
      [{}, 'Object'],
      [Object.create(null), 'object'],
    ]
    for (const [entrada, esperado] of casos) {
      expect(() => a.multiplicaPor(entrada as Rate)).toThrow(
        `Money.multiplicaPor: esperava Rate, recebeu ${esperado}`,
      )
    }
  })

  it('converter exige Rate de cambio informado', () => {
    expect(() => Money.converter(usd('10', 'd'), 'BRL', '5.4' as unknown as Rate)).toThrow(
      'Money.converter: esperava Rate, recebeu string',
    )
  })

  it('com Rate de verdade a guarda deixa passar', () => {
    expect(brl('10', 'a').multiplicaPor(Rate.de('2', 'f')).paraArmazenamento()).toBe('20')
  })
})

describe('overflow em cada operacao vira erro, nunca Infinity', () => {
  const enorme = '9e9000000000000000'

  it('soma, subtracao, multiplicacao, divisao e conversao barram resultado nao finito', () => {
    expect(() => brl(enorme, 'a').soma(brl(enorme, 'b'))).toThrow(
      'Money.soma: resultado nao finito',
    )
    expect(() => brl(enorme, 'a').subtrai(brl(`-${enorme}`, 'b'))).toThrow(
      'Money.subtrai: resultado nao finito',
    )
    expect(() => brl(enorme, 'a').multiplicaPor(Rate.de('10', 'f'))).toThrow(
      'Money.multiplicaPor: resultado nao finito',
    )
    expect(() => brl(enorme, 'a').divididoPor(brl('1e-9000000000000000', 'b'), 'razao')).toThrow(
      'Money.divididoPor: resultado nao finito',
    )
    expect(() => Money.converter(usd(enorme, 'd'), 'BRL', Rate.de('10', 'cambio'))).toThrow(
      'Money.converter: resultado nao finito',
    )
  })
})

describe('as mensagens de erro carregam moeda e campo, que e o que serve no diagnostico', () => {
  it('a moeda aparece na mensagem de cada construtor', () => {
    expect(() => brl('', 'preco')).toThrow(`campo "preco (Money<'BRL'>)"`)
    expect(() => usd('', 'preco')).toThrow(`campo "preco (Money<'USD'>)"`)
  })

  it('formatar com casas quebradas nomeia o campo casas', () => {
    expect(() => brl('10', 'a').paraTexto(1.5, 'meio-par')).toThrow(
      'campo "casas": esperava inteiro maior ou igual a zero em casas, recebeu number 1.5',
    )
  })

  it('a serializacao implicita diz qual metodo usar no lugar', () => {
    expect(() => String(brl('10', 'a'))).toThrow(
      'Money nao tem serializacao implicita, use paraArmazenamento() ou paraTexto(casas, modo)',
    )
  })
})
