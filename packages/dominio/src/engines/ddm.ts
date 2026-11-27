import { Money, Rate, exigirPositivo } from '@valuation/shared'
import { z } from 'zod'

/**
 * Engine ddm, do playbook bancos-b3, com o modelo de retenção da D-114.
 *
 * Função pura (RF-501): sem I/O, sem rede, sem relógio, sem aleatoriedade. Não há
 * data na entrada: o desconto é por índice de ano, com o dividendo no fim de cada
 * ano e o ano 1 descontado inteiro (premissas C5 e A2 do arquivo de premissas).
 *
 * O payout não é entrada. A cada ano a engine deriva:
 *
 *   lucro           = ROE do ano × PL do início do ano
 *   capital exigido = Basileia alvo do ano × RWA do fim do ano
 *   retenção        = capital exigido − PL do início do ano
 *   dividendo       = lucro − retenção
 *   payout          = dividendo / lucro, só como saída
 *
 * Na perpetuidade, o lucro do primeiro ano depois do horizonte é o ROE da
 * perpetuidade × PL do fim do horizonte, a retenção é o crescimento da
 * perpetuidade × esse PL, e o dividendo cresce à taxa da perpetuidade.
 *
 * Nenhum valor é escolhido aqui. Dividendo negativo é mantido e marcado como
 * aporte implícito (D-121); payout sem lucro positivo sai nulo com o motivo.
 *
 * Toda grandeza financeira entra e sai como texto decimal (RF-503, RNF-001, D-045).
 * `number` só em contagem: ano, horizonte e quantidade de ações por unit.
 *
 * PREMISSAS DE INTERPRETAÇÃO: `docs/premissas-de-interpretacao-ddm.md`, entregável
 * tão importante quanto este arquivo, como na fcff (D-075, D-105).
 */

export const VERSAO_ENGINE_DDM = '0.1.0'
const MOEDA = 'BRL' as const

const textoDecimal = (campo: string) =>
  z.string({ error: `${campo}: esperava texto decimal entre aspas, nunca number (D-045)` })

/**
 * Quantidade de ações em texto inteiro. Não é dinheiro, mas divide dinheiro, e
 * quantidade de ações de banco grande passa de dez bilhões; texto fecha qualquer
 * dúvida de precisão sem depender do limite do `number`.
 */
const inteiroEmTexto = (campo: string) =>
  z
    .string({ error: `${campo}: esperava inteiro em texto, entre aspas` })
    .regex(/^\d+$/, { error: `${campo}: esperava inteiro não negativo em texto, sem separador` })

/** Quantas ações de cada classe compõem uma unit. Contagem pequena, `number`. */
export const ComposicaoDaUnit = z
  .strictObject({
    acoes_on: z.number().int().nonnegative(),
    acoes_pn: z.number().int().nonnegative(),
  })
  .refine((c) => c.acoes_on + c.acoes_pn > 0, {
    error: 'acoes_ex_tesouraria.composicao_unit: a unit precisa de pelo menos uma ação',
  })

export const AcoesExTesouraria = z
  .strictObject({
    quantidade_total: inteiroEmTexto('acoes_ex_tesouraria.quantidade_total'),
    quantidade_tesouraria: inteiroEmTexto('acoes_ex_tesouraria.quantidade_tesouraria'),
    // null declara que o papel não tem unit (D-059)
    composicao_unit: ComposicaoDaUnit.nullish(),
  })
  .refine(
    // o refine do objeto roda mesmo com campo quebrado; texto que não é inteiro já
    // foi recusado pelo campo, e BigInt dele lançaria em vez de reprovar
    (a) =>
      !/^\d+$/.test(a.quantidade_total) ||
      !/^\d+$/.test(a.quantidade_tesouraria) ||
      BigInt(a.quantidade_tesouraria) < BigInt(a.quantidade_total),
    {
    error:
      'acoes_ex_tesouraria: a tesouraria precisa ser menor que o total, senão não sobra ' +
      'ação em circulação para dividir o valor',
  })

export const BaseNominalOuReal = z.enum(['nominal', 'real'], {
  error: 'base_nominal_ou_real é nominal ou real, sem default (D-114)',
})

/** RF-502, schema de entrada. Os nomes são os do playbook bancos-b3 0.5.0. */
export const EntradaDdm = z
  .strictObject({
    patrimonio_liquido_inicial: textoDecimal('patrimonio_liquido_inicial'),
    rwa_atual: textoDecimal('rwa_atual'),
    acoes_ex_tesouraria: AcoesExTesouraria,
    base_nominal_ou_real: BaseNominalOuReal,
    horizonte_anos: z
      .number({ error: 'horizonte_anos: contagem de anos, inteiro' })
      .int({ error: 'horizonte_anos precisa ser inteiro' })
      .positive({ error: 'horizonte_anos precisa ser maior que zero' }),
    roe_projetado_por_ano: z.array(textoDecimal('roe_projetado_por_ano')),
    crescimento_rwa: z.array(textoDecimal('crescimento_rwa')),
    basileia_alvo: z.array(textoDecimal('basileia_alvo')),
    custo_capital_proprio_ke: textoDecimal('custo_capital_proprio_ke'),
    crescimento_perpetuidade: textoDecimal('crescimento_perpetuidade'),
    // é o ROE da perpetuidade (D-114); o nome do playbook fica
    roe_sustentavel_projetado: textoDecimal('roe_sustentavel_projetado'),
  })
  .superRefine((entrada, ctx) => {
    // PL e RWA de partida são fatos da companhia e dividem o modelo inteiro: sem
    // eles positivos, lucro sobre PL e capital sobre RWA não querem dizer nada
    for (const campo of ['patrimonio_liquido_inicial', 'rwa_atual'] as const) {
      let positivo = false
      try {
        positivo = Rate.de(entrada[campo], campo).ehPositivo()
      } catch {
        // texto que não é decimal é recusado abaixo, pelo construtor, com a mensagem dele
        positivo = true
      }
      if (!positivo) {
        ctx.addIssue({
          code: 'custom',
          path: [campo],
          message: `${campo}: esperava valor maior que zero, recebi "${entrada[campo]}"`,
        })
      }
    }
    // D-114: lista com tamanho diferente do horizonte é erro de estrutura de
    // entrada, e não regra dura. A engine recusa, e não completa nem corta: completar
    // repetindo o último valor seria a engine escolher premissa (RP-003)
    for (const campo of ['roe_projetado_por_ano', 'crescimento_rwa', 'basileia_alvo'] as const) {
      if (entrada[campo].length !== entrada.horizonte_anos) {
        ctx.addIssue({
          code: 'custom',
          path: [campo],
          message:
            `D-114, D-116: ${campo} tem ${entrada[campo].length} valores e o horizonte tem ` +
            `${entrada.horizonte_anos} anos. É um valor por ano, e a engine não completa nem ` +
            'corta a lista',
        })
      }
    }
  })

export type EntradaDdm = z.infer<typeof EntradaDdm>

export const MotivoPayoutIndefinido = z.enum(['lucro_zero', 'lucro_negativo'])

export const AnoDoResultado = z.strictObject({
  ano: z.number().int().positive(),
  roe_aplicado: z.string(),
  crescimento_rwa_aplicado: z.string(),
  basileia_alvo_aplicada: z.string(),
  pl_inicio: z.string(),
  rwa_fim: z.string(),
  lucro: z.string(),
  capital_exigido: z.string(),
  retencao: z.string(),
  dividendo: z.string(),
  // D-121: dividendo negativo é mantido, e o ano sai marcado
  aporte_implicito: z.boolean(),
  // dividendo / lucro, nulo quando o lucro não é positivo, com o motivo ao lado
  payout: z.string().nullable(),
  payout_indefinido_porque: MotivoPayoutIndefinido.nullable(),
  pl_fim: z.string(),
  fator_desconto: z.string(),
  dividendo_descontado: z.string(),
})

export const PerpetuidadeDoResultado = z.strictObject({
  roe_aplicado: z.string(),
  crescimento_aplicado: z.string(),
  pl_base: z.string(),
  lucro_primeiro_ano: z.string(),
  retencao_primeiro_ano: z.string(),
  dividendo_primeiro_ano: z.string(),
  aporte_implicito: z.boolean(),
  payout: z.string().nullable(),
  payout_indefinido_porque: MotivoPayoutIndefinido.nullable(),
  valor_terminal_no_horizonte: z.string(),
  fator_desconto: z.string(),
  valor_terminal_descontado: z.string(),
})

/** RF-502, schema de saída. */
export const ResultadoDdm = z.strictObject({
  engine: z.literal('ddm'),
  versao_engine: z.string(),
  base_nominal_ou_real: BaseNominalOuReal,
  custo_capital_proprio_ke: z.string(),
  horizonte_anos: z.number().int().positive(),
  anos: z.array(AnoDoResultado),
  perpetuidade: PerpetuidadeDoResultado,
  valor_presente_dividendos: z.string(),
  valor_do_patrimonio: z.string(),
  acoes_em_circulacao: z.string(),
  valor_por_acao: z.string(),
  acoes_por_unit: z.number().int().positive().nullable(),
  valor_por_unit: z.string().nullable(),
})

export type ResultadoDdm = z.infer<typeof ResultadoDdm>

function brl(texto: string, campo: string): Money<'BRL'> {
  return Money.de(texto, MOEDA, campo)
}

/** Payout só existe com lucro positivo; fora disso, nulo e o porquê (premissa C2). */
function payoutDe(dividendo: Money<'BRL'>, lucro: Money<'BRL'>, campo: string) {
  if (lucro.ehZero()) return { payout: null, payout_indefinido_porque: 'lucro_zero' as const }
  if (lucro.ehNegativo()) {
    return { payout: null, payout_indefinido_porque: 'lucro_negativo' as const }
  }
  return {
    payout: dividendo.divididoPor(lucro, campo).paraArmazenamento(),
    payout_indefinido_porque: null,
  }
}

export function calcularDdm(entradaBruta: unknown): ResultadoDdm {
  const entrada = EntradaDdm.parse(entradaBruta)
  const um = Rate.de('1', 'um')
  const ke = Rate.de(entrada.custo_capital_proprio_ke, 'custo_capital_proprio_ke')
  const umMaisKe = exigirPositivo(um.soma(ke), 'um mais custo_capital_proprio_ke')
  const g = Rate.de(entrada.crescimento_perpetuidade, 'crescimento_perpetuidade')
  const roePerpetuidade = Rate.de(entrada.roe_sustentavel_projetado, 'roe_sustentavel_projetado')

  let pl = brl(entrada.patrimonio_liquido_inicial, 'patrimonio_liquido_inicial')
  let rwa = brl(entrada.rwa_atual, 'rwa_atual')
  let fatorDesconto = um
  let valorPresenteDividendos = brl('0', 'valor presente dos dividendos')
  const anos: ResultadoDdm['anos'] = []

  for (let i = 0; i < entrada.horizonte_anos; i += 1) {
    const ano = i + 1
    const roe = Rate.de(entrada.roe_projetado_por_ano[i] as string, `roe_projetado_por_ano[${i}]`)
    const crescimentoRwa = Rate.de(entrada.crescimento_rwa[i] as string, `crescimento_rwa[${i}]`)
    const basileia = Rate.de(entrada.basileia_alvo[i] as string, `basileia_alvo[${i}]`)

    const plInicio = pl
    const rwaFim = rwa.multiplicaPor(um.soma(crescimentoRwa))
    const lucro = plInicio.multiplicaPor(roe)
    const capitalExigido = rwaFim.multiplicaPor(basileia)
    const retencao = capitalExigido.subtrai(plInicio)
    const dividendo = lucro.subtrai(retencao)
    // PL do fim = PL do início + lucro − dividendo, que é o capital exigido. Escrito
    // pela soma, e não copiado do capital exigido, para a identidade ser conferível
    // pela guarda e pelo teste, e não verdadeira por atribuição
    const plFim = plInicio.soma(lucro).subtrai(dividendo)
    fatorDesconto = fatorDesconto.divididoPor(umMaisKe, 'fator de desconto')
    const dividendoDescontado = dividendo.multiplicaPor(fatorDesconto)
    valorPresenteDividendos = valorPresenteDividendos.soma(dividendoDescontado)

    anos.push({
      ano,
      roe_aplicado: roe.paraArmazenamento(),
      crescimento_rwa_aplicado: crescimentoRwa.paraArmazenamento(),
      basileia_alvo_aplicada: basileia.paraArmazenamento(),
      pl_inicio: plInicio.paraArmazenamento(),
      rwa_fim: rwaFim.paraArmazenamento(),
      lucro: lucro.paraArmazenamento(),
      capital_exigido: capitalExigido.paraArmazenamento(),
      retencao: retencao.paraArmazenamento(),
      dividendo: dividendo.paraArmazenamento(),
      aporte_implicito: dividendo.ehNegativo(),
      ...payoutDe(dividendo, lucro, `payout do ano ${ano}`),
      pl_fim: plFim.paraArmazenamento(),
      fator_desconto: fatorDesconto.paraArmazenamento(),
      dividendo_descontado: dividendoDescontado.paraArmazenamento(),
    })
    pl = plFim
    rwa = rwaFim
  }

  // Perpetuidade (D-114). O denominador é Ke − g. Quem bloqueia g >= Ke com
  // mensagem de regra dura é o R-104, validador de entrada que roda antes; esta
  // guarda é aritmética, para a engine chamada sozinha não dividir por zero nem
  // devolver valor terminal com sinal trocado
  const keMenosG = exigirPositivo(ke.subtrai(g), 'custo_capital_proprio_ke menos crescimento_perpetuidade')
  const lucroPerpetuidade = pl.multiplicaPor(roePerpetuidade)
  const retencaoPerpetuidade = pl.multiplicaPor(g)
  const dividendoPerpetuidade = lucroPerpetuidade.subtrai(retencaoPerpetuidade)
  const valorTerminal = dividendoPerpetuidade.multiplicaPor(
    um.divididoPor(keMenosG, 'custo_capital_proprio_ke menos crescimento_perpetuidade'),
  )
  const valorTerminalDescontado = valorTerminal.multiplicaPor(fatorDesconto)
  const valorDoPatrimonio = valorPresenteDividendos.soma(valorTerminalDescontado)

  const acoes = entrada.acoes_ex_tesouraria
  const emCirculacao = (
    BigInt(acoes.quantidade_total) - BigInt(acoes.quantidade_tesouraria)
  ).toString()
  const valorPorAcao = valorDoPatrimonio.multiplicaPor(
    um.divididoPor(Rate.de(emCirculacao, 'acoes em circulacao'), 'acoes em circulacao'),
  )
  const composicao = acoes.composicao_unit ?? null
  const acoesPorUnit = composicao === null ? null : composicao.acoes_on + composicao.acoes_pn
  // premissa C6: a unit vale a soma das ações dela, com o mesmo valor por ação
  // em ON e PN, porque a engine não tem dado para distinguir as classes
  const valorPorUnit =
    acoesPorUnit === null
      ? null
      : valorPorAcao.multiplicaPor(Rate.de(String(acoesPorUnit), 'acoes por unit')).paraArmazenamento()

  return {
    engine: 'ddm',
    versao_engine: VERSAO_ENGINE_DDM,
    base_nominal_ou_real: entrada.base_nominal_ou_real,
    custo_capital_proprio_ke: ke.paraArmazenamento(),
    horizonte_anos: entrada.horizonte_anos,
    anos,
    perpetuidade: {
      roe_aplicado: roePerpetuidade.paraArmazenamento(),
      crescimento_aplicado: g.paraArmazenamento(),
      pl_base: pl.paraArmazenamento(),
      lucro_primeiro_ano: lucroPerpetuidade.paraArmazenamento(),
      retencao_primeiro_ano: retencaoPerpetuidade.paraArmazenamento(),
      dividendo_primeiro_ano: dividendoPerpetuidade.paraArmazenamento(),
      aporte_implicito: dividendoPerpetuidade.ehNegativo(),
      ...payoutDe(dividendoPerpetuidade, lucroPerpetuidade, 'payout da perpetuidade'),
      valor_terminal_no_horizonte: valorTerminal.paraArmazenamento(),
      fator_desconto: fatorDesconto.paraArmazenamento(),
      valor_terminal_descontado: valorTerminalDescontado.paraArmazenamento(),
    },
    valor_presente_dividendos: valorPresenteDividendos.paraArmazenamento(),
    valor_do_patrimonio: valorDoPatrimonio.paraArmazenamento(),
    acoes_em_circulacao: emCirculacao,
    valor_por_acao: valorPorAcao.paraArmazenamento(),
    acoes_por_unit: acoesPorUnit,
    valor_por_unit: valorPorUnit,
  }
}
