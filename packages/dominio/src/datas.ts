/**
 * Aritmética de data em texto, pura.
 *
 * Não usa `Date` de propósito. RF-501 e RNF-003 proíbem relógio na engine, e o
 * objeto `Date` é a porta mais fácil para ele entrar sem ninguém notar, porque
 * `new Date(texto)` e `new Date()` moram na mesma classe. Sem `Date` no pacote,
 * a varredura de pureza fica trivial de escrever e impossível de burlar por
 * distração.
 */
export interface Data {
  ano: number
  mes: number
  dia: number
}

const PADRAO = /^(\d{4})-(\d{2})-(\d{2})$/

export function lerData(texto: string, campo: string): Data {
  const achado = PADRAO.exec(texto)
  if (achado === null) {
    throw new RangeError(`campo "${campo}": esperava data no formato AAAA-MM-DD, recebeu "${texto}"`)
  }
  const ano = Number(achado[1])
  const mes = Number(achado[2])
  const dia = Number(achado[3])
  if (mes < 1 || mes > 12 || dia < 1 || dia > 31) {
    throw new RangeError(`campo "${campo}": data fora de faixa, recebeu "${texto}"`)
  }
  return { ano, mes, dia }
}

export function escreverData(data: Data): string {
  const mes = String(data.mes).padStart(2, '0')
  const dia = String(data.dia).padStart(2, '0')
  return `${data.ano}-${mes}-${dia}`
}

/** Negativo se a vem antes de b, zero se iguais, positivo se depois. */
export function compararDatas(a: Data, b: Data): number {
  if (a.ano !== b.ano) return a.ano - b.ano
  if (a.mes !== b.mes) return a.mes - b.mes
  return a.dia - b.dia
}

/** Soma anos inteiros preservando mês e dia. */
export function somarAnos(data: Data, anos: number): Data {
  return { ano: data.ano + anos, mes: data.mes, dia: data.dia }
}

/**
 * Quantos períodos anuais inteiros cabem entre base e limite.
 *
 * Período t termina em base mais t anos. Conta t enquanto o fim do período não
 * passa do limite. Limite anterior ou igual à base devolve zero.
 */
export function periodosAnuaisInteiros(base: Data, limite: Data): number {
  let periodos = 0
  while (compararDatas(somarAnos(base, periodos + 1), limite) <= 0) {
    periodos += 1
  }
  return periodos
}
