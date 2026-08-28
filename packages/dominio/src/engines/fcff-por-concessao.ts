import { Money, Rate, exigirPositivo } from '@valuation/shared'
import { z } from 'zod'
import {
  compararDatas,
  escreverData,
  lerData,
  periodosAnuaisInteiros,
  somarAnos,
} from '../datas'

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

export const VERSAO_ENGINE = '0.1.0'
const MOEDA = 'BRL' as const

const textoDecimal = (campo: string) =>
  z.string({ error: `${campo}: esperava texto decimal entre aspas, nunca number (D-045)` })

const dataTexto = (campo: string) =>
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    error: `${campo}: esperava data no formato AAAA-MM-DD`,
  })

export const ReducaoContratual = z.strictObject({
  fator: textoDecimal('reducao_contratual.fator'),
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
  horizonte_maximo_anos: z.number().int().positive().nullish(),
})

export const PeriodoDoResultado = z.strictObject({
  periodo: z.number().int().positive(),
  data_fim: dataTexto('data_fim'),
  rap_liquida_reajustada: z.string(),
  fator_reducao_contratual: z.string(),
  rap_apos_reducao: z.string(),
  fluxo_atribuivel: z.string(),
  fator_desconto: z.string(),
  fluxo_descontado: z.string(),
})

export const ConcessaoDoResultado = z.strictObject({
  nome: z.string(),
  data_vencimento: dataTexto('data_vencimento'),
  periodos_projetados: z.number().int().nonnegative(),
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
  concessoes: z.array(ConcessaoDoResultado),
  valor_presente_das_concessoes: z.string(),
  indenizacao_rab_estimada: z.string().nullable(),
  periodo_da_indenizacao: z.number().int().nonnegative().nullable(),
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

export function calcularFcffPorConcessao(
  entradaBruta: unknown,
): ResultadoFcffPorConcessao {
  const entrada = EntradaFcffPorConcessao.parse(entradaBruta)
  const base = lerData(entrada.data_base, 'data_base')

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
  let maiorPeriodo = 0

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
    const periodosDerivados = periodosAnuaisInteiros(base, vencimento)

    // RF-420: horizonte informado que exceda o fato derivado é bloqueado
    if (
      entrada.horizonte_maximo_anos !== undefined &&
      entrada.horizonte_maximo_anos !== null &&
      entrada.horizonte_maximo_anos > periodosDerivados
    ) {
      throw new ErroDeRegraDura(
        'R-002',
        `horizonte informado de ${entrada.horizonte_maximo_anos} anos excede os ` +
          `${periodosDerivados} anos derivados do vencimento de "${concessao.nome}" ` +
          '(RF-417, RF-420)',
      )
    }
    const periodosProjetados =
      entrada.horizonte_maximo_anos === undefined || entrada.horizonte_maximo_anos === null
        ? periodosDerivados
        : Math.min(entrada.horizonte_maximo_anos, periodosDerivados)

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
            fator: Rate.de(
              concessao.reducao_contratual.fator,
              `${concessao.nome}.reducao_contratual.fator`,
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

    for (let periodo = 1; periodo <= periodosProjetados; periodo += 1) {
      const fim = somarAnos(base, periodo)
      rapReajustada = rapReajustada.multiplicaPor(umMaisInflacao)
      fatorDesconto = fatorDesconto.divididoPor(umMaisKe, 'fator de desconto')

      const aplicaReducao =
        reducao !== undefined && compararDatas(fim, reducao.aPartirDe) >= 0
      const fatorReducao = aplicaReducao && reducao !== undefined ? reducao.fator : um
      const rapAposReducao = rapReajustada.multiplicaPor(fatorReducao)
      const fluxoAtribuivel = rapAposReducao.multiplicaPor(participacao)
      const fluxoDescontado = fluxoAtribuivel.multiplicaPor(fatorDesconto)
      valorPresente = valorPresente.soma(fluxoDescontado)

      periodos.push({
        periodo,
        data_fim: escreverData(fim),
        rap_liquida_reajustada: rapReajustada.paraArmazenamento(),
        fator_reducao_contratual: fatorReducao.paraArmazenamento(),
        rap_apos_reducao: rapAposReducao.paraArmazenamento(),
        fluxo_atribuivel: fluxoAtribuivel.paraArmazenamento(),
        fator_desconto: fatorDesconto.paraArmazenamento(),
        fluxo_descontado: fluxoDescontado.paraArmazenamento(),
      })
    }

    if (periodosProjetados > maiorPeriodo) maiorPeriodo = periodosProjetados
    totalDasConcessoes = totalDasConcessoes.soma(valorPresente)

    concessoes.push({
      nome: concessao.nome,
      data_vencimento: concessao.data_vencimento,
      periodos_projetados: periodosProjetados,
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
  let periodoDaIndenizacao: number | null = null
  if (
    entrada.indenizacao_rab_estimada !== undefined &&
    entrada.indenizacao_rab_estimada !== null
  ) {
    const indenizacao = brl(entrada.indenizacao_rab_estimada, 'indenizacao_rab_estimada')
    periodoDaIndenizacao = maiorPeriodo
    let fator = um
    for (let periodo = 1; periodo <= maiorPeriodo; periodo += 1) {
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
    concessoes,
    valor_presente_das_concessoes: totalDasConcessoes.paraArmazenamento(),
    indenizacao_rab_estimada:
      entrada.indenizacao_rab_estimada === undefined ||
      entrada.indenizacao_rab_estimada === null
        ? null
        : entrada.indenizacao_rab_estimada,
    periodo_da_indenizacao: periodoDaIndenizacao,
    indenizacao_descontada: indenizacaoDescontada.paraArmazenamento(),
    // R-001: concessão tem vencimento definido, não há perpetuidade. Sai no
    // resultado como zero explícito para a regra ficar auditável no snapshot
    valor_perpetuidade: '0',
    valor_presente_total: total.paraArmazenamento(),
  })
}
