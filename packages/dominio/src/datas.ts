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

/*
 * `somarAnos` e `periodosAnuaisInteiros` viviam aqui e foram removidos com a
 * D-081. Eles existiam para projetar período anual ancorado na data base, que é a
 * grade errada: a RAP é homologada por ciclo tarifário de 1º de julho a 30 de
 * junho. A contagem de período agora mora em `grades.ts`, sobre datas fixas de
 * virada, e por isso o caso do 29 de fevereiro deixou de existir junto: nenhum
 * limite de ciclo cai em fevereiro.
 */
