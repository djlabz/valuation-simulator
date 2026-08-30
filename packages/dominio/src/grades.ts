import { compararDatas, escreverData, type Data } from './datas'

/**
 * As três grades temporais do módulo de transmissão, cada uma com tipo próprio.
 *
 * Existem três grades no mesmo módulo e elas NÃO são conversíveis por constante:
 *
 * 1. CICLO TARIFÁRIO, de 1º de julho a 30 de junho. É a base da RAP homologada
 *    (consolidação, seção 2, classe A)
 * 2. COMPETÊNCIA MENSAL, porque a RAP é faturada em duodécimos. Confundir valor
 *    anual homologado com receita mensal é erro de 12x (consolidação, item 3 da
 *    seção de contradições)
 * 3. EXERCÍCIO SOCIAL civil, de 1º de janeiro a 31 de dezembro, que é a base de
 *    imposto e de demonstração contábil
 *
 * O campo `grade` é o discriminante e existe para o compilador recusar a troca de
 * uma pela outra. Não é decoração: era exatamente essa troca que a engine fazia
 * em silêncio quando projetava ano civil ancorado na data base e chamava aquilo
 * de período da RAP (D-081).
 *
 * DOIS RELÓGIOS, e eles também são coisas diferentes. O reajuste é anual e cai na
 * virada do ciclo, 1º de julho. A revisão tarifária periódica acontece a cada
 * quatro ou cinco anos conforme contrato e NÃO é modelada aqui. Um parâmetro só
 * para os dois é bug de modelagem, e é o que a consolidação aponta na seção 2.
 *
 * AUSÊNCIAS DELIBERADAS, porque a tentação é escrever uma delas:
 * não existe função que converta ciclo em exercício, nem exercício em ciclo, nem
 * fator que transforme competência em fração de ciclo. Qualquer uma dessas seria
 * uma convenção de harmonização temporal, que a consolidação classifica como
 * plausível e sem fonte, e escrever convenção sem fonte é RNF-013.
 */

/** Mês em que o ciclo tarifário vira, e em que o reajuste anual incide. */
export const MES_DE_VIRADA_DO_CICLO = 7

/** Quantas competências mensais compõem um ciclo. Não é fator de conversão de dinheiro. */
export const COMPETENCIAS_POR_CICLO = 12

export interface CicloTarifario {
  readonly grade: 'ciclo_tarifario'
  readonly rotulo: string
  readonly inicio: Data
  readonly fim: Data
}

export interface ExercicioSocial {
  readonly grade: 'exercicio_social'
  readonly rotulo: string
  readonly inicio: Data
  readonly fim: Data
}

export interface CompetenciaMensal {
  readonly grade: 'competencia_mensal'
  readonly rotulo: string
  readonly ano: number
  readonly mes: number
}

const ULTIMO_DIA_DE_JUNHO = 30
const ULTIMO_DIA_DE_DEZEMBRO = 31

function cicloQueComecaEm(ano: number): CicloTarifario {
  return {
    grade: 'ciclo_tarifario',
    rotulo: `${ano}-${ano + 1}`,
    inicio: { ano, mes: MES_DE_VIRADA_DO_CICLO, dia: 1 },
    fim: { ano: ano + 1, mes: MES_DE_VIRADA_DO_CICLO - 1, dia: ULTIMO_DIA_DE_JUNHO },
  }
}

/** O ciclo tarifário que contém a data. Julho em diante pertence ao ciclo que abre no ano. */
export function cicloTarifarioQueContem(data: Data): CicloTarifario {
  const ano = data.mes >= MES_DE_VIRADA_DO_CICLO ? data.ano : data.ano - 1
  return cicloQueComecaEm(ano)
}

/**
 * O primeiro ciclo que começa em ou depois da data.
 *
 * É o ciclo em que a projeção abre. Data que caia exatamente em 1º de julho abre
 * no próprio ciclo dela; qualquer outra abre no seguinte, e o trecho entre a data
 * e a virada fica de fora da projeção, declarado no resultado (D-081).
 */
export function primeiroCicloQueComecaEmOuApos(data: Data): CicloTarifario {
  const contem = cicloTarifarioQueContem(data)
  if (compararDatas(contem.inicio, data) >= 0) return contem
  return proximoCiclo(contem)
}

export function proximoCiclo(ciclo: CicloTarifario): CicloTarifario {
  return cicloQueComecaEm(ciclo.inicio.ano + 1)
}

/** O exercício social civil que contém a data. Existe para a grade ter nome, não para converter. */
export function exercicioSocialQueContem(data: Data): ExercicioSocial {
  return {
    grade: 'exercicio_social',
    rotulo: String(data.ano),
    inicio: { ano: data.ano, mes: 1, dia: 1 },
    fim: { ano: data.ano, mes: 12, dia: ULTIMO_DIA_DE_DEZEMBRO },
  }
}

/**
 * As doze competências de um ciclo, de julho a junho.
 *
 * Serve para a grade mensal existir nomeada e para quem ler o módulo ver que ela
 * NÃO começa em janeiro. Nenhuma aritmética de dinheiro passa por aqui: o
 * duodécimo é estrutura de faturamento, e a engine hoje não tem nada que consuma
 * valor mensal, porque imposto e OPEX dependem da B1, que segue aberta.
 */
export function competenciasDoCiclo(ciclo: CicloTarifario): CompetenciaMensal[] {
  const competencias: CompetenciaMensal[] = []
  for (let i = 0; i < COMPETENCIAS_POR_CICLO; i += 1) {
    const bruto = ciclo.inicio.mes + i
    const mes = ((bruto - 1) % 12) + 1
    const ano = ciclo.inicio.ano + Math.floor((bruto - 1) / 12)
    competencias.push({
      grade: 'competencia_mensal',
      rotulo: `${ano}-${String(mes).padStart(2, '0')}`,
      ano,
      mes,
    })
  }
  return competencias
}

/**
 * Quantos ciclos completos cabem entre o primeiro ciclo projetado e o limite.
 *
 * Ciclo só conta se ele termina em ou antes do limite. Vencimento que caia no
 * meio de um ciclo deixa aquele ciclo inteiro de fora, e o trecho descartado sai
 * no resultado em vez de sumir (D-081).
 */
export function ciclosInteirosAte(primeiro: CicloTarifario, limite: Data): number {
  let contagem = 0
  let ciclo = primeiro
  while (compararDatas(ciclo.fim, limite) <= 0) {
    contagem += 1
    ciclo = proximoCiclo(ciclo)
  }
  return contagem
}

/** O n-ésimo ciclo a partir do primeiro, com n começando em 1. */
export function cicloNaPosicao(primeiro: CicloTarifario, posicao: number): CicloTarifario {
  return cicloQueComecaEm(primeiro.inicio.ano + posicao - 1)
}

/** Descrição textual de um trecho de tempo que ficou fora da projeção. */
export function descreverTrecho(inicio: Data, fim: Data): { inicio: string; fim: string } {
  return { inicio: escreverData(inicio), fim: escreverData(fim) }
}
