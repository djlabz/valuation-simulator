import {
  CRIAR,
  INTERNO,
  codigoDoModo,
  decimalDeTexto,
  exigirCasasDecimais,
  exigirDivisorNaoZero,
  garantirFinito,
  type DecimalFixo,
  type ModoArredondamento,
} from './decimal-config'
import { Rate } from './rate'

/** Moedas da v1. A moeda vive no tipo, nao no objeto (D-047). */
export type Moeda = 'BRL' | 'USD'

function nomeDoTipo(valor: unknown): string {
  if (valor === null) return 'null'
  if (typeof valor === 'object') return valor.constructor?.name ?? 'object'
  return typeof valor
}

/**
 * A ponte interna entre Money e Rate usa o mesmo simbolo nas duas classes, entao
 * em runtime um Money passaria por onde se espera um Rate. O tipo ja barra isso na
 * compilacao, e esta guarda barra tambem quem chegar por JavaScript sem tipo, que e
 * o caso do MCP e de qualquer entrada desserializada.
 */
function exigirRate(valor: unknown, operacao: string): Rate {
  if (!(valor instanceof Rate)) {
    throw new TypeError(`${operacao}: esperava Rate, recebeu ${nomeDoTipo(valor)}`)
  }
  return valor
}

/**
 * Dinheiro, com a moeda como parametro de tipo fantasma.
 *
 * O campo __moeda e declare, ou seja, existe so na compilacao e nao e emitido.
 * Ele esta aqui porque sem ele Money<'BRL'> e Money<'USD'> teriam a mesma forma
 * e somar os dois compilaria.
 */
export class Money<C extends Moeda> {
  readonly #valor: DecimalFixo
  declare private readonly __moeda: C

  private constructor(valor: DecimalFixo) {
    this.#valor = valor
  }

  /** Le dinheiro a partir de texto decimal. Moeda e campo aparecem no erro. */
  static de<C extends Moeda>(texto: string, moeda: C, campo: string): Money<C> {
    return new Money<C>(decimalDeTexto(texto, `${campo} (Money<'${moeda}'>)`))
  }

  /**
   * Conversao de moeda, unica porta entre duas moedas. Exige o cambio informado,
   * nunca deduz taxa por conta propria.
   */
  static converter<De extends Moeda, Para extends Moeda>(
    valor: Money<De>,
    para: Para,
    cambio: Rate,
  ): Money<Para> {
    void para
    const validado = exigirRate(cambio, 'Money.converter')
    return new Money<Para>(
      garantirFinito(valor.#valor.times(validado[INTERNO]()), 'Money.converter'),
    )
  }

  soma(outro: Money<C>): Money<C> {
    return new Money<C>(garantirFinito(this.#valor.plus(outro.#valor), 'Money.soma'))
  }

  subtrai(outro: Money<C>): Money<C> {
    return new Money<C>(garantirFinito(this.#valor.minus(outro.#valor), 'Money.subtrai'))
  }

  /** Dinheiro vezes grandeza adimensional devolve dinheiro na mesma moeda. */
  multiplicaPor(taxa: Rate): Money<C> {
    const validada = exigirRate(taxa, 'Money.multiplicaPor')
    return new Money<C>(
      garantirFinito(this.#valor.times(validada[INTERNO]()), 'Money.multiplicaPor'),
    )
  }

  /** Dinheiro dividido por dinheiro da moeda some, o que sobra e adimensional. */
  divididoPor(outro: Money<C>, campo: string): Rate {
    exigirDivisorNaoZero(outro.#valor, campo)
    return Rate[CRIAR](
      garantirFinito(this.#valor.dividedBy(outro.#valor), 'Money.divididoPor'),
    )
  }

  igual(outro: Money<C>): boolean {
    return this.#valor.equals(outro.#valor)
  }

  maiorQue(outro: Money<C>): boolean {
    return this.#valor.greaterThan(outro.#valor)
  }

  menorQue(outro: Money<C>): boolean {
    return this.#valor.lessThan(outro.#valor)
  }

  ehZero(): boolean {
    return this.#valor.isZero()
  }

  ehNegativo(): boolean {
    return this.#valor.isNegative() && !this.#valor.isZero()
  }

  ehPositivo(): boolean {
    return this.#valor.isPositive() && !this.#valor.isZero()
  }

  /** Texto para exibicao. Casas e modo de arredondamento vem de quem chama. */
  paraTexto(casas: number, modo: ModoArredondamento): string {
    return this.#valor.toFixed(exigirCasasDecimais(casas, 'casas'), codigoDoModo(modo))
  }

  /** Texto para armazenamento, sem arredondar e sem notacao exponencial. */
  paraArmazenamento(): string {
    return this.#valor.toString()
  }

  toJSON(): string {
    return this.paraArmazenamento()
  }

  /**
   * Serializacao implicita nao existe de proposito. Dinheiro interpolado em texto
   * esconde arredondamento e moeda, entao aqui isso quebra alto.
   */
  toString(): never {
    throw new TypeError(
      'Money nao tem serializacao implicita, use paraArmazenamento() ou paraTexto(casas, modo)',
    )
  }
}

export function brl(texto: string, campo: string): Money<'BRL'> {
  return Money.de(texto, 'BRL', campo)
}

export function usd(texto: string, campo: string): Money<'USD'> {
  return Money.de(texto, 'USD', campo)
}
