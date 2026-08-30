import { Money, Rate, exigirPositivo } from '@valuation/shared'
import { z } from 'zod'
import { compararDatas, escreverData, lerData } from '../datas'
import {
  cicloNaPosicao,
  ciclosInteirosAte,
  descreverTrecho,
  primeiroCicloQueComecaEmOuApos,
} from '../grades'

/**
 * Engine fcff_por_concessao, do playbook transmissao-energia-b3.
 *
 * Função pura (RF-501): sem I/O, sem rede, sem relógio, sem aleatoriedade. A
 * âncora temporal é `data_base`, que entra como input, e não o relógio.
 *
 * Toda grandeza financeira entra e sai como texto decimal, e vira Money ou Rate
 * dentro (RF-503, RNF-001, D-045). O único `number` do contrato é contagem de
 * período, que o CLAUDE.md seção 3 registra como caso de fronteira permitido.
 *
 * O resultado é desagregado por etapa (RF-504), e cada etapa se identifica por
 * nome e não por posição em array.
 *
 * PREMISSAS DE INTERPRETAÇÃO: esta engine foi escrita como sonda e assume coisas
 * sobre a natureza dos números que ninguém conferiu contra fonte primária. A
 * lista está em `docs/premissas-de-interpretacao-fcff-por-concessao.md` e é
 * entregável tão importante quanto este arquivo.
 */

export const VERSAO_ENGINE = '0.3.0'
const MOEDA = 'BRL' as const

const textoDecimal = (campo: string) =>
  z.string({ error: `${campo}: esperava texto decimal entre aspas, nunca number (D-045)` })

const dataTexto = (campo: string) =>
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    error: `${campo}: esperava data no formato AAAA-MM-DD`,
  })

/**
 * `percentual_reducao` é o que se CORTA, e não o que sobra: "0.5" é redução de
 * metade da RAP. A convenção está no nome porque o nome anterior, `fator`, não
 * dizia a direção, e um campo cujo valor serve às duas leituras não tem como ser
 * conferido contra o contrato de onde ele foi transcrito (D-078).
 *
 * O que o nome NÃO resolve, e continua em aberto na B8: se a redução incide
 * sobre a RAP original ou sobre a já reajustada. Aqui ela incide sobre a
 * reajustada, ver o laço de períodos.
 */
export const ReducaoContratual = z.strictObject({
  percentual_reducao: textoDecimal('reducao_contratual.percentual_reducao'),
  a_partir_de: dataTexto('reducao_contratual.a_partir_de'),
})

export const ConcessaoDeEntrada = z.strictObject({
  nome: z.string().trim().min(1, { error: 'concessao.nome não pode ser vazio' }),
  rap_bruta_ciclo_atual: textoDecimal('rap_bruta_ciclo_atual'),
  indice_reajuste: z.enum(['IPCA', 'IGPM'], {
    error: 'indice_reajuste é IPCA ou IGPM, conforme o playbook',
  }),
  data_vencimento: dataTexto('data_vencimento'),
  percentual_participacao: textoDecimal('percentual_participacao'),
  reducao_contratual: ReducaoContratual.nullish(),
})

/** RF-502, schema de entrada. */
export const EntradaFcffPorConcessao = z.strictObject({
  data_base: dataTexto('data_base'),
  concessoes: z.array(ConcessaoDeEntrada),
  deducoes_sobre_rap: textoDecimal('deducoes_sobre_rap'),
  taxa_desconto: textoDecimal('taxa_desconto'),
  inflacao_projetada_longo_prazo: textoDecimal('inflacao_projetada_longo_prazo'),
  indenizacao_rab_estimada: textoDecimal('indenizacao_rab_estimada').nullish(),
  // horizonte em CICLOS tarifários, não em anos civis. O nome carrega a grade de
  // propósito, porque "anos" era o que deixava a grade implícita (D-081)
  horizonte_maximo_ciclos: z.number().int().positive().nullish(),
})

export const PeriodoDoResultado = z.strictObject({
  periodo: z.number().int().positive(),
  ciclo: z.string(),
  ciclo_inicio: dataTexto('ciclo_inicio'),
  ciclo_fim: dataTexto('ciclo_fim'),
  rap_liquida_reajustada: z.string(),
  fator_remanescente_aplicado: z.string(),
  rap_apos_reducao: z.string(),
  fluxo_atribuivel: z.string(),
  fator_desconto: z.string(),
  fluxo_descontado: z.string(),
})

export const ConcessaoDoResultado = z.strictObject({
  nome: z.string(),
  data_vencimento: dataTexto('data_vencimento'),
  ciclos_projetados: z.number().int().nonnegative(),
  // vencimento é data de contrato e pode cair no meio de um ciclo. O trecho que
  // sobra não é projetado, e sai aqui em vez de sumir (D-081, premissa B11)
  trecho_final_nao_projetado: z
    .strictObject({
      inicio: dataTexto('trecho_final_nao_projetado.inicio'),
      fim: dataTexto('trecho_final_nao_projetado.fim'),
    })
    .nullable(),
  rap_bruta_ciclo_atual: z.string(),
  deducoes_aplicadas: z.string(),
  rap_liquida_ciclo_atual: z.string(),
  percentual_participacao: z.string(),
  periodos: z.array(PeriodoDoResultado),
  valor_presente_da_concessao: z.string(),
  valor_residual: z.string(),
})

/** RF-502, schema de saída. */
export const ResultadoFcffPorConcessao = z.strictObject({
  engine: z.literal('fcff_por_concessao'),
  versao_engine: z.string(),
  moeda: z.literal('BRL'),
  data_base: dataTexto('data_base'),
  // a grade sai nomeada no resultado para o snapshot não deixar ninguém supor
  // qual delas foi usada (RF-504)
  grade_de_projecao: z.literal('ciclo_tarifario'),
  primeiro_ciclo_projetado: z.strictObject({
    rotulo: z.string(),
    inicio: dataTexto('primeiro_ciclo_projetado.inicio'),
    fim: dataTexto('primeiro_ciclo_projetado.fim'),
  }),
  trecho_inicial_nao_projetado: z
    .strictObject({
      inicio: dataTexto('trecho_inicial_nao_projetado.inicio'),
      fim: dataTexto('trecho_inicial_nao_projetado.fim'),
    })
    .nullable(),
  concessoes: z.array(ConcessaoDoResultado),
  valor_presente_das_concessoes: z.string(),
  indenizacao_rab_estimada: z.string().nullable(),
  // nomeia a grade: é posição de CICLO tarifário, não de ano civil (D-081)
  ciclo_da_indenizacao: z.number().int().nonnegative().nullable(),
  indenizacao_descontada: z.string(),
  valor_perpetuidade: z.literal('0'),
  valor_presente_total: z.string(),
})

export type EntradaFcffPorConcessao = z.infer<typeof EntradaFcffPorConcessao>
export type ResultadoFcffPorConcessao = z.infer<typeof ResultadoFcffPorConcessao>

/** Erro de regra dura, com o id da regra, como RF-507 manda para o validador. */
export class ErroDeRegraDura extends Error {
  readonly regra: string
  constructor(regra: string, mensagem: string) {
    super(`${regra}: ${mensagem}`)
    this.regra = regra
    this.name = 'ErroDeRegraDura'
  }
}

function brl(texto: string, campo: string): Money<'BRL'> {
  return Money.de(texto, MOEDA, campo)
}

/**
 * Converte o percentual cortado no fator que multiplica a RAP, que é `1 - p`.
 *
 * A faixa de 0 a 1 fecha o erro de escala que o nome deixa em aberto, alguém
 * escrever "50" quando quer dizer 50%. Esse erro é detectável, e foi por ele ser
 * detectável que o nome `percentual_reducao` venceu `fator_remanescente`: o erro
 * que sobrava do outro nome, escrever o corte onde se pede o remanescente,
 * produz "0.5" nos dois casos e nenhum validador o pega (D-078).
 */
function fatorRemanescenteDe(texto: string, campo: string): Rate {
  const um = Rate.de('1', 'um')
  const percentual = Rate.de(texto, campo)
  if (percentual.ehNegativo() || percentual.maiorQue(um)) {
    throw new RangeError(
      `${campo}: esperava fração entre "0" e "1", recebi "${texto}". ` +
        'Redução de 50% se escreve "0.5"',
    )
  }
  return um.subtrai(percentual)
}

export function calcularFcffPorConcessao(
  entradaBruta: unknown,
): ResultadoFcffPorConcessao {
  const entrada = EntradaFcffPorConcessao.parse(entradaBruta)
  const base = lerData(entrada.data_base, 'data_base')

  // A projeção corre na grade do CICLO TARIFÁRIO, 1º de julho a 30 de junho, que
  // é a base da RAP homologada. O trecho entre a data base e a virada do ciclo
  // não é projetado: incluí-lo inteiro traria caixa já passado, e ratear exigiria
  // a convenção de duodécimo, que não tem fonte (D-081)
  const primeiroCiclo = primeiroCicloQueComecaEmOuApos(base)
  const trechoInicial =
    compararDatas(base, primeiroCiclo.inicio) < 0
      ? descreverTrecho(base, { ano: primeiroCiclo.inicio.ano, mes: 6, dia: 30 })
      : null

  const um = Rate.de('1', 'um')
  const deducoes = Rate.de(entrada.deducoes_sobre_rap, 'deducoes_sobre_rap')
  const ke = Rate.de(entrada.taxa_desconto, 'taxa_desconto')
  const inflacao = Rate.de(entrada.inflacao_projetada_longo_prazo, 'inflacao_projetada_longo_prazo')
  const umMaisKe = exigirPositivo(um.soma(ke), 'um mais taxa_desconto')
  const umMaisInflacao = um.soma(inflacao)
  const fracaoLiquida = um.subtrai(deducoes)

  const nomesVistos = new Set<string>()
  const concessoes: ResultadoFcffPorConcessao['concessoes'] = []
  let totalDasConcessoes = brl('0', 'total')
  let maiorCiclo = 0

  for (const concessao of entrada.concessoes) {
    if (nomesVistos.has(concessao.nome)) {
      throw new ErroDeRegraDura(
        'R-002',
        `concessão "${concessao.nome}" aparece mais de uma vez, e o fluxo de cada ` +
          'concessão termina na sua própria data de vencimento',
      )
    }
    nomesVistos.add(concessao.nome)

    const vencimento = lerData(concessao.data_vencimento, 'data_vencimento')
    const ciclosDerivados = ciclosInteirosAte(primeiroCiclo, vencimento)

    // RF-420: horizonte informado que exceda o fato derivado é bloqueado
    if (
      entrada.horizonte_maximo_ciclos !== undefined &&
      entrada.horizonte_maximo_ciclos !== null &&
      entrada.horizonte_maximo_ciclos > ciclosDerivados
    ) {
      throw new ErroDeRegraDura(
        'R-002',
        `horizonte informado de ${entrada.horizonte_maximo_ciclos} ciclos tarifários ` +
          `excede os ${ciclosDerivados} ciclos derivados do vencimento de ` +
          `"${concessao.nome}" (RF-417, RF-420)`,
      )
    }
    const ciclosProjetados =
      entrada.horizonte_maximo_ciclos === undefined || entrada.horizonte_maximo_ciclos === null
        ? ciclosDerivados
        : Math.min(entrada.horizonte_maximo_ciclos, ciclosDerivados)

    // o ciclo seguinte ao último projetado começa antes do vencimento quando o
    // vencimento cai no meio dele. Esse pedaço fica de fora e é declarado
    const cicloSeguinte = cicloNaPosicao(primeiroCiclo, ciclosProjetados + 1)
    const trechoFinal =
      compararDatas(cicloSeguinte.inicio, vencimento) <= 0
        ? descreverTrecho(cicloSeguinte.inicio, vencimento)
        : null

    const rapBruta = brl(concessao.rap_bruta_ciclo_atual, `${concessao.nome}.rap_bruta_ciclo_atual`)
    const rapLiquida = rapBruta.multiplicaPor(fracaoLiquida)
    const participacao = Rate.de(
      concessao.percentual_participacao,
      `${concessao.nome}.percentual_participacao`,
    )
    const reducao =
      concessao.reducao_contratual === undefined || concessao.reducao_contratual === null
        ? undefined
        : {
            fatorRemanescente: fatorRemanescenteDe(
              concessao.reducao_contratual.percentual_reducao,
              `${concessao.nome}.reducao_contratual.percentual_reducao`,
            ),
            aPartirDe: lerData(
              concessao.reducao_contratual.a_partir_de,
              `${concessao.nome}.reducao_contratual.a_partir_de`,
            ),
          }

    const periodos: ResultadoFcffPorConcessao['concessoes'][number]['periodos'] = []
    let rapReajustada = rapLiquida
    let fatorDesconto = um
    let valorPresente = brl('0', `${concessao.nome}.valor_presente`)

    for (let periodo = 1; periodo <= ciclosProjetados; periodo += 1) {
      const ciclo = cicloNaPosicao(primeiroCiclo, periodo)
      const fim = ciclo.fim
      rapReajustada = rapReajustada.multiplicaPor(umMaisInflacao)
      fatorDesconto = fatorDesconto.divididoPor(umMaisKe, 'fator de desconto')

      const aplicaReducao =
        reducao !== undefined && compararDatas(fim, reducao.aPartirDe) >= 0
      // a redução incide sobre a RAP já reajustada, e não sobre a original. É a
      // metade da B8 que o nome do campo não resolve, e que espera o contrato
      const fatorRemanescente =
        aplicaReducao && reducao !== undefined ? reducao.fatorRemanescente : um
      const rapAposReducao = rapReajustada.multiplicaPor(fatorRemanescente)
      // CONVENÇÃO DECLARADA, e ela contraria a regra formal (D-082). Pelo CPC
      // 18/R2 a participação não incide sobre a RAP: a RAP é receita integral da
      // SPE, e o que chega à investidora é o dividendo efetivamente pago, sujeito
      // a covenants da SPE. Ponderar a RAP pelo percentual é atalho defensável
      // como convenção, e a alternativa exigiria dívida da SPE e política de
      // distribuição, que não têm campo no playbook. Ver premissa B7
      const fluxoAtribuivel = rapAposReducao.multiplicaPor(participacao)
      const fluxoDescontado = fluxoAtribuivel.multiplicaPor(fatorDesconto)
      valorPresente = valorPresente.soma(fluxoDescontado)

      periodos.push({
        periodo,
        ciclo: ciclo.rotulo,
        ciclo_inicio: escreverData(ciclo.inicio),
        ciclo_fim: escreverData(ciclo.fim),
        rap_liquida_reajustada: rapReajustada.paraArmazenamento(),
        fator_remanescente_aplicado: fatorRemanescente.paraArmazenamento(),
        rap_apos_reducao: rapAposReducao.paraArmazenamento(),
        fluxo_atribuivel: fluxoAtribuivel.paraArmazenamento(),
        fator_desconto: fatorDesconto.paraArmazenamento(),
        fluxo_descontado: fluxoDescontado.paraArmazenamento(),
      })
    }

    if (ciclosProjetados > maiorCiclo) maiorCiclo = ciclosProjetados
    totalDasConcessoes = totalDasConcessoes.soma(valorPresente)

    concessoes.push({
      nome: concessao.nome,
      data_vencimento: concessao.data_vencimento,
      ciclos_projetados: ciclosProjetados,
      trecho_final_nao_projetado: trechoFinal,
      rap_bruta_ciclo_atual: rapBruta.paraArmazenamento(),
      deducoes_aplicadas: deducoes.paraArmazenamento(),
      rap_liquida_ciclo_atual: rapLiquida.paraArmazenamento(),
      percentual_participacao: participacao.paraArmazenamento(),
      periodos,
      valor_presente_da_concessao: valorPresente.paraArmazenamento(),
      // R-003: residual é zero, salvo indenização informada, que entra no total
      valor_residual: '0',
    })
  }

  // R-003: indenização informada é o único caminho para valor além do fluxo
  let indenizacaoDescontada = brl('0', 'indenizacao_descontada')
  let cicloDaIndenizacao: number | null = null
  if (
    entrada.indenizacao_rab_estimada !== undefined &&
    entrada.indenizacao_rab_estimada !== null
  ) {
    const indenizacao = brl(entrada.indenizacao_rab_estimada, 'indenizacao_rab_estimada')
    cicloDaIndenizacao = maiorCiclo
    let fator = um
    for (let ciclo = 1; ciclo <= maiorCiclo; ciclo += 1) {
      fator = fator.divididoPor(umMaisKe, 'fator de desconto da indenização')
    }
    indenizacaoDescontada = indenizacao.multiplicaPor(fator)
  }

  const total = totalDasConcessoes.soma(indenizacaoDescontada)

  return ResultadoFcffPorConcessao.parse({
    engine: 'fcff_por_concessao',
    versao_engine: VERSAO_ENGINE,
    moeda: MOEDA,
    data_base: entrada.data_base,
    grade_de_projecao: 'ciclo_tarifario',
    primeiro_ciclo_projetado: {
      rotulo: primeiroCiclo.rotulo,
      inicio: escreverData(primeiroCiclo.inicio),
      fim: escreverData(primeiroCiclo.fim),
    },
    trecho_inicial_nao_projetado: trechoInicial,
    concessoes,
    valor_presente_das_concessoes: totalDasConcessoes.paraArmazenamento(),
    indenizacao_rab_estimada:
      entrada.indenizacao_rab_estimada === undefined ||
      entrada.indenizacao_rab_estimada === null
        ? null
        : entrada.indenizacao_rab_estimada,
    ciclo_da_indenizacao: cicloDaIndenizacao,
    indenizacao_descontada: indenizacaoDescontada.paraArmazenamento(),
    // R-001: concessão tem vencimento definido, não há perpetuidade. Sai no
    // resultado como zero explícito para a regra ficar auditável no snapshot
    valor_perpetuidade: '0',
    valor_presente_total: total.paraArmazenamento(),
  })
}
