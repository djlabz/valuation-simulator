/**
 * Fixtures sintéticas da ddm. Nenhum número é de companhia nem de terceiro (D-113):
 * são valores redondos escolhidos para cada ano exercitar um caso diferente.
 *
 * Por que estes valores, pela D-079 (valor não pode ser invariante sob a ambiguidade
 * que exercita):
 * - a razão de capital atual (100 / 800 = 12,5%) é diferente da Basileia alvo de cada
 *   ano, então a retenção do ano 1 não é zero e o salto até o alvo aparece;
 * - o ROE muda a cada ano, então trocar PL do início por PL do fim, ou por PL médio,
 *   muda o lucro;
 * - o crescimento dos RWA muda a cada ano, então trocar RWA do fim por RWA médio
 *   muda o capital exigido;
 * - ano 1 com retenção negativa (dividendo maior que o lucro), ano 2 com dividendo
 *   negativo (aporte implícito), ano 3 com payout comum;
 * - composição da unit com quantidades diferentes de ON e PN.
 *
 * Os valores esperados dos testes foram calculados fora da engine, com o módulo
 * decimal do Python na mesma precisão (34 dígitos, HALF_EVEN), em 26/11/2026.
 */
export const BANCO_TRES_ANOS = {
  patrimonio_liquido_inicial: '100',
  rwa_atual: '800',
  acoes_ex_tesouraria: {
    quantidade_total: '1000',
    quantidade_tesouraria: '40',
    composicao_unit: { acoes_on: 1, acoes_pn: 2 },
  },
  base_nominal_ou_real: 'nominal',
  horizonte_anos: 3,
  roe_projetado_por_ano: ['0.15', '0.17', '0.12'],
  crescimento_rwa: ['0.05', '0.08', '0.06'],
  basileia_alvo: ['0.11', '0.12', '0.12'],
  custo_capital_proprio_ke: '0.13',
  crescimento_perpetuidade: '0.04',
  roe_sustentavel_projetado: '0.14',
} as const

/** Cópia mutável, para cada teste mexer num campo só. */
export function bancoTresAnos(): Record<string, unknown> {
  return structuredClone(BANCO_TRES_ANOS) as unknown as Record<string, unknown>
}
