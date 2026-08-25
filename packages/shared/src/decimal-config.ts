import Decimal from 'decimal.js'

/**
 * Construtor clonado do decimal.js, com a configuracao fixada em D-046.
 *
 * Este e o unico arquivo do projeto que importa decimal.js. Todo o resto usa
 * este construtor, ou os tipos Money e Rate que ficam por cima dele.
 *
 * O clone existe para nao depender do construtor global do modulo: uma
 * dependencia transitiva que chame Decimal.set sobrescreveria a configuracao do
 * projeto em silencio, e o efeito apareceria como resultado numerico levemente
 * diferente, sem erro nenhum.
 */
export const Dec = Decimal.clone({
  precision: 34,
  rounding: Decimal.ROUND_HALF_EVEN,
  toExpNeg: -9e15,
  toExpPos: 9e15,
})

export type DecimalFixo = InstanceType<typeof Dec>

/**
 * Chaves de acesso ao decimal guardado dentro de Money e de Rate.
 *
 * Money precisa ler o decimal de um Rate para multiplicar, e precisa criar um
 * Rate ao dividir dinheiro por dinheiro. Campo privado de classe nao atravessa
 * arquivo, entao a ponte e feita por estes dois simbolos, que o index.ts nao
 * reexporta. Quem consome o pacote pela porta publica nao alcanca o decimal cru,
 * e portanto nao alcanca toNumber().
 */
export const INTERNO: unique symbol = Symbol('decimal interno')
export const CRIAR: unique symbol = Symbol('construtor interno')

/**
 * Texto decimal aceito na entrada: sinal opcional, digitos, casas opcionais e
 * expoente opcional. Recusa texto vazio, "NaN", "Infinity" e qualquer coisa que
 * nao seja numero escrito por extenso.
 */
const PADRAO_DECIMAL = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/

function descrever(valor: unknown): string {
  if (typeof valor === 'string') return `texto ${JSON.stringify(valor)}`
  if (typeof valor === 'number') return `number ${String(valor)}`
  if (typeof valor === 'bigint') return `bigint ${String(valor)}`
  if (valor === null) return 'null'
  return typeof valor
}

/** Le texto decimal e devolve Decimal, ou levanta erro dizendo campo e valor recebido. */
export function decimalDeTexto(texto: string, campo: string): DecimalFixo {
  if (typeof texto !== 'string') {
    throw new TypeError(
      `campo "${campo}": esperava texto decimal, recebeu ${descrever(texto)}`,
    )
  }
  if (!PADRAO_DECIMAL.test(texto)) {
    throw new TypeError(
      `campo "${campo}": esperava texto decimal no formato [sinal]digitos[.digitos], ` +
        `recebeu ${descrever(texto)}`,
    )
  }
  const valor = new Dec(texto)
  if (!valor.isFinite()) {
    throw new RangeError(
      `campo "${campo}": esperava numero finito, recebeu ${descrever(texto)}`,
    )
  }
  return valor
}

/** Barra resultado nao finito antes de ele virar Money ou Rate. */
export function garantirFinito(valor: DecimalFixo, operacao: string): DecimalFixo {
  if (!valor.isFinite()) {
    throw new RangeError(`${operacao}: resultado nao finito`)
  }
  return valor
}

/** Divisao por zero levanta erro em vez de devolver Infinity. */
export function exigirDivisorNaoZero(divisor: DecimalFixo, campo: string): void {
  if (divisor.isZero()) {
    throw new RangeError(`campo "${campo}": divisor recebido e zero, divisao nao executada`)
  }
}

/**
 * Casas decimais de saida. E contagem de posicoes, nao grandeza financeira, por
 * isso e number. Quem chama declara, a API nunca escolhe.
 */
export function exigirCasasDecimais(casas: number, campo: string): number {
  if (!Number.isInteger(casas) || casas < 0) {
    throw new RangeError(
      `campo "${campo}": esperava inteiro maior ou igual a zero em casas, ` +
        `recebeu ${descrever(casas)}`,
    )
  }
  return casas
}

/** Modo de arredondamento nomeado, para o chamador nao passar codigo numerico. */
export type ModoArredondamento =
  | 'meio-par'
  | 'meio-para-cima'
  | 'para-cima'
  | 'para-baixo'
  | 'piso'
  | 'teto'

const CODIGO_DO_MODO: Record<ModoArredondamento, Decimal.Rounding> = {
  'meio-par': Decimal.ROUND_HALF_EVEN,
  'meio-para-cima': Decimal.ROUND_HALF_UP,
  'para-cima': Decimal.ROUND_UP,
  'para-baixo': Decimal.ROUND_DOWN,
  piso: Decimal.ROUND_FLOOR,
  teto: Decimal.ROUND_CEIL,
}

export function codigoDoModo(modo: ModoArredondamento): Decimal.Rounding {
  const codigo = CODIGO_DO_MODO[modo]
  if (codigo === undefined) {
    throw new RangeError(`modo de arredondamento desconhecido: ${descrever(modo)}`)
  }
  return codigo
}
