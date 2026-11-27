import { Money } from '@valuation/shared'
import type { ResultadoDdm } from '../engines/ddm'
import { ErroDeRegraDura } from '../erros'

/**
 * R-102, guarda de saída (RF-506, RF-507, D-114, D-121).
 *
 * Com o dividendo derivado, dividendo = lucro − retenção vale por construção, e
 * por isso não há o que validar na entrada. A guarda confere, no resultado
 * desagregado, em cada ano e no primeiro ano da perpetuidade, que o dividendo não
 * passa do lucro menos a retenção, e pega defeito da engine que quebre isso.
 *
 * O que ela NÃO faz: aplicar as faixas de retenção da Res. CMN 4.958 (premissa A4).
 * A norma define piso e trava, não teto de payout (N12 da fcff).
 */
export const R_102 = 'R-102'

export const MENSAGEM_R_102 =
  'Dividendo projetado não pode exceder o lucro menos a retenção exigida para sustentar o ' +
  'crescimento dos RWA'

const MOTIVO_R_102 =
  'o dividendo é derivado do capital que o crescimento dos RWA exige; se ele passa do lucro ' +
  'menos essa retenção, o capital do fim do ano fica abaixo do exigido e a conta do ano ' +
  'seguinte parte de um PL que o banco não teria'

function brl(texto: string, campo: string): Money<'BRL'> {
  return Money.de(texto, 'BRL', campo)
}

function conferir(dividendo: string, lucro: string, retencao: string, onde: string): void {
  const limite = brl(lucro, `${onde}, lucro`).subtrai(brl(retencao, `${onde}, retencao`))
  if (!brl(dividendo, `${onde}, dividendo`).maiorQue(limite)) return
  throw new ErroDeRegraDura(
    R_102,
    `${MENSAGEM_R_102}: ${onde}, dividendo ${dividendo}, lucro menos retenção ` +
      `${limite.paraArmazenamento()}`,
    MOTIVO_R_102,
  )
}

export function validarRetencaoRegulatoria(resultado: ResultadoDdm): void {
  for (const ano of resultado.anos) {
    conferir(ano.dividendo, ano.lucro, ano.retencao, `ano ${ano.ano}`)
  }
  const p = resultado.perpetuidade
  conferir(p.dividendo_primeiro_ano, p.lucro_primeiro_ano, p.retencao_primeiro_ano, 'perpetuidade')
}
