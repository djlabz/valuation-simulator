import type { EntradaFcffPorConcessao } from './fcff-por-concessao'

/**
 * Fixtures SINTÉTICAS. Nenhum dado de companhia real, nenhuma procedência de
 * documento, nenhum número observado.
 *
 * Dado real com procedência fica para os casos de referência da Fase 8, que a
 * D-016 governa. Fixture com dado real seria indistinguível de nota de ativo num
 * projeto que acabou de expurgar conteúdo não autorado (D-067, RNF-013).
 *
 * Os números são redondos de propósito, para o valor esperado de cada etapa ser
 * conferível na mão por quem lê o teste.
 */

/** Uma concessão, três períodos, sem redução e sem sócio. O caso mais simples. */
export const CONCESSAO_UNICA: EntradaFcffPorConcessao = {
  data_base: '2026-01-01',
  concessoes: [
    {
      nome: 'CONCESSAO-A',
      rap_bruta_ciclo_atual: '1000',
      indice_reajuste: 'IPCA',
      data_vencimento: '2029-01-01',
      percentual_participacao: '1',
      reducao_contratual: null,
    },
  ],
  deducoes_sobre_rap: '0.1',
  taxa_desconto: '0.1',
  inflacao_projetada_longo_prazo: '0',
}

/**
 * A forma da estrutura real de uma transmissora, com números inventados: três
 * concessões com vencimentos escalonados, uma com redução contratual e uma com
 * participação parcial.
 */
export const CARTEIRA_ESCALONADA: EntradaFcffPorConcessao = {
  data_base: '2026-01-01',
  concessoes: [
    {
      nome: 'CONCESSAO-CURTA',
      rap_bruta_ciclo_atual: '1000',
      indice_reajuste: 'IPCA',
      data_vencimento: '2028-01-01',
      percentual_participacao: '1',
      reducao_contratual: null,
    },
    {
      nome: 'CONCESSAO-COM-REDUCAO',
      rap_bruta_ciclo_atual: '2000',
      indice_reajuste: 'IPCA',
      data_vencimento: '2030-01-01',
      percentual_participacao: '1',
      // 0.3 e não 0.5 de propósito: 0.5 é o próprio complemento, então uma
      // fixture com 0.5 fica verde nas duas convenções e não exercita a
      // direção que o nome do campo acabou de fixar (D-078)
      reducao_contratual: { percentual_reducao: '0.3', a_partir_de: '2029-01-01' },
    },
    {
      nome: 'CONCESSAO-EM-CONSORCIO',
      rap_bruta_ciclo_atual: '4000',
      indice_reajuste: 'IGPM',
      data_vencimento: '2031-01-01',
      percentual_participacao: '0.25',
      reducao_contratual: null,
    },
  ],
  deducoes_sobre_rap: '0.2',
  taxa_desconto: '0.1',
  inflacao_projetada_longo_prazo: '0',
}

/**
 * Data base exatamente em 1º de julho, que é a virada do ciclo tarifário.
 *
 * Existe porque a projeção abre no próprio ciclo quando a data base cai na
 * virada, e abre no seguinte em qualquer outro dia. As duas aberturas são
 * caminhos diferentes no código e a fixture principal só exercita uma (D-079).
 * Vencimento em 30 de junho fecha o terceiro ciclo exatamente, sem sobra.
 */
export const CICLO_ALINHADO: EntradaFcffPorConcessao = {
  data_base: '2026-07-01',
  concessoes: [
    {
      nome: 'CONCESSAO-ALINHADA',
      rap_bruta_ciclo_atual: '1000',
      indice_reajuste: 'IPCA',
      data_vencimento: '2029-06-30',
      percentual_participacao: '1',
      reducao_contratual: null,
    },
  ],
  deducoes_sobre_rap: '0.1',
  taxa_desconto: '0.1',
  inflacao_projetada_longo_prazo: '0',
}

/**
 * A única fixture com inflação diferente de zero, e ela existe por causa da D-079.
 *
 * Todas as outras têm `inflacao_projetada_longo_prazo: "0"`, e com inflação zero o
 * reajuste é invisível: a RAP reajustada é igual à RAP líquida em todo período, e
 * a base sobre a qual a redução contratual incide fica invariante entre as duas
 * leituras plausíveis, valor nominal e valor já reajustado. Ou seja, nenhuma
 * fixture exercitava a seção 4 da consolidação.
 *
 * Números escolhidos para conferência na mão: RAP 1000 sem deduções, inflação de
 * 10%, então a reajustada é 1100, 1210, 1331 e 1464,1. Corte de 40% a partir do
 * ciclo que fecha em 2029-06-30, que é o terceiro.
 */
export const REDUCAO_COM_REAJUSTE: EntradaFcffPorConcessao = {
  data_base: '2026-07-01',
  concessoes: [
    {
      nome: 'CONCESSAO-REDUZIDA',
      rap_bruta_ciclo_atual: '1000',
      indice_reajuste: 'IPCA',
      data_vencimento: '2030-06-30',
      percentual_participacao: '1',
      reducao_contratual: { percentual_reducao: '0.4', a_partir_de: '2029-06-30' },
    },
  ],
  deducoes_sobre_rap: '0',
  taxa_desconto: '0.1',
  inflacao_projetada_longo_prazo: '0.1',
}

/** Carteira vazia, que precisa produzir zero e não quebrar. */
export const CARTEIRA_VAZIA: EntradaFcffPorConcessao = {
  data_base: '2026-01-01',
  concessoes: [],
  deducoes_sobre_rap: '0',
  taxa_desconto: '0.1',
  inflacao_projetada_longo_prazo: '0',
}

/** Vencimento anterior à data base: concessão já encerrada. */
export const CONCESSAO_VENCIDA: EntradaFcffPorConcessao = {
  ...CONCESSAO_UNICA,
  concessoes: [{ ...CONCESSAO_UNICA.concessoes[0]!, data_vencimento: '2024-01-01' }],
}

/**
 * A concessão mais longa vem PRIMEIRO na lista, de propósito. Serve para provar
 * que o período da indenização usa o maior prazo e não o prazo da última
 * concessão iterada, que é diferença que nenhuma carteira em ordem crescente
 * consegue mostrar.
 */
export const MAIS_LONGA_PRIMEIRO: EntradaFcffPorConcessao = {
  data_base: '2026-01-01',
  concessoes: [
    {
      nome: 'CONCESSAO-LONGA',
      rap_bruta_ciclo_atual: '1000',
      indice_reajuste: 'IPCA',
      data_vencimento: '2031-01-01',
      percentual_participacao: '1',
      reducao_contratual: null,
    },
    {
      nome: 'CONCESSAO-BREVE',
      rap_bruta_ciclo_atual: '1000',
      indice_reajuste: 'IPCA',
      data_vencimento: '2028-01-01',
      percentual_participacao: '1',
      // campo OMITIDO em vez de null, que é o outro jeito de dizer que não há redução
    },
  ],
  deducoes_sobre_rap: '0',
  taxa_desconto: '0.1',
  inflacao_projetada_longo_prazo: '0',
  indenizacao_rab_estimada: '1000',
}
