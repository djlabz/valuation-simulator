import { Rate } from '@valuation/shared'
import type { EntradaDdm } from '../engines/ddm'
import { ErroDeRegraDura } from '../erros'

/**
 * R-104, validador de entrada (RF-506, RF-507, D-114, D-121).
 *
 * O crescimento da perpetuidade precisa ser estritamente menor que o custo de
 * capital próprio. Igual também bloqueia: com Ke − g igual a zero a fórmula da
 * perpetuidade divide por zero, e com Ke − g negativo o valor terminal troca de
 * sinal sem a conta avisar.
 */
export const R_104 = 'R-104'

export const MENSAGEM_R_104 =
  'Crescimento da perpetuidade precisa ser menor que o custo de capital próprio'

export function validarCrescimentoMenorQueKe(entrada: EntradaDdm): void {
  const ke = Rate.de(entrada.custo_capital_proprio_ke, 'custo_capital_proprio_ke')
  const g = Rate.de(entrada.crescimento_perpetuidade, 'crescimento_perpetuidade')
  if (g.menorQue(ke)) return
  throw new ErroDeRegraDura(
    R_104,
    `${MENSAGEM_R_104}: crescimento ${g.paraArmazenamento()}, custo de capital próprio ` +
      `${ke.paraArmazenamento()}`,
    'o valor terminal é o dividendo do primeiro ano da perpetuidade dividido por Ke menos g; ' +
      'com g igual a Ke o denominador é zero, e com g maior o valor terminal troca de sinal',
  )
}
