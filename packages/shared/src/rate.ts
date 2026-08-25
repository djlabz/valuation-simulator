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

/**
 * Grandeza adimensional do dominio: taxa de desconto, percentual, razao, fator
 * de desconto, beta, multiplicador e peso de cenario (D-047).
 *
 * Tipo nominal, nao alias: o campo privado impede que qualquer objeto com a
 * mesma forma passe por Rate.
 */
export class Rate {
  readonly #valor: DecimalFixo

  private constructor(valor: DecimalFixo) {
    this.#valor = valor
  }

  /** Le taxa a partir de texto decimal. O campo aparece na mensagem de erro. */
  static de(texto: string, campo: string): Rate {
    return new Rate(decimalDeTexto(texto, campo))
  }

  /** Ponte interna para o Money. Nao sai pela porta publica do pacote. */
  static [CRIAR](valor: DecimalFixo): Rate {
    return new Rate(valor)
  }

  [INTERNO](): DecimalFixo {
    return this.#valor
  }

  soma(outra: Rate): Rate {
    return new Rate(garantirFinito(this.#valor.plus(outra.#valor), 'Rate.soma'))
  }

  subtrai(outra: Rate): Rate {
    return new Rate(garantirFinito(this.#valor.minus(outra.#valor), 'Rate.subtrai'))
  }

  multiplicaPor(outra: Rate): Rate {
    return new Rate(garantirFinito(this.#valor.times(outra.#valor), 'Rate.multiplicaPor'))
  }

  divididoPor(outra: Rate, campo: string): Rate {
    exigirDivisorNaoZero(outra.#valor, campo)
    return new Rate(garantirFinito(this.#valor.dividedBy(outra.#valor), 'Rate.divididoPor'))
  }

  igual(outra: Rate): boolean {
    return this.#valor.equals(outra.#valor)
  }

  maiorQue(outra: Rate): boolean {
    return this.#valor.greaterThan(outra.#valor)
  }

  menorQue(outra: Rate): boolean {
    return this.#valor.lessThan(outra.#valor)
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
   * Serializacao implicita nao existe de proposito. Interpolar um Rate em texto
   * esconderia arredondamento e formato, entao aqui isso quebra alto.
   */
  toString(): never {
    throw new TypeError(
      'Rate nao tem serializacao implicita, use paraArmazenamento() ou paraTexto(casas, modo)',
    )
  }
}

/**
 * Guarda opcional para quem precisa de taxa estritamente positiva, tipo o
 * (Ke - g) do valor terminal. Fica aqui como funcao separada porque a aritmetica
 * de Rate continua valendo para negativo: quem exige o sinal e o chamador, nao o
 * tipo.
 */
export function exigirPositivo(taxa: Rate, campo: string): Rate {
  if (!taxa.ehPositivo()) {
    throw new RangeError(
      `campo "${campo}": esperava taxa maior que zero, recebeu ${taxa.paraArmazenamento()}`,
    )
  }
  return taxa
}

/** Basis point e formato de borda, nunca tipo de armazenamento (D-047). */
export function rateDeBps(textoBps: string, campo: string): Rate {
  const bps = Rate.de(textoBps, campo)
  return bps.divididoPor(Rate.de('10000', 'divisor de bps'), 'divisor de bps')
}

export function bpsDeRate(taxa: Rate, casas: number, modo: ModoArredondamento): string {
  return taxa.multiplicaPor(Rate.de('10000', 'multiplicador de bps')).paraTexto(casas, modo)
}
