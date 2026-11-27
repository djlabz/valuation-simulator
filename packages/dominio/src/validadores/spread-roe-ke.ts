import type { EntradaDdm, ResultadoDdm } from '../engines/ddm'
import { ErroDeRegraDura } from '../erros'

/**
 * R-103, guarda de saída (RF-506, RF-507, D-114, D-121).
 *
 * Com a base única da D-114, ROE e Ke não têm como entrar em bases diferentes:
 * há um campo só, `base_nominal_ou_real`. A guarda confere que o resultado declara
 * a mesma base que a entrada, e pega engine que a troque ou a perca.
 */
export const R_103 = 'R-103'

export const MENSAGEM_R_103 = 'ROE e custo de capital próprio na mesma base, nominal ou real'

export function validarSpreadROEKe(entrada: EntradaDdm, resultado: ResultadoDdm): void {
  if (resultado.base_nominal_ou_real === entrada.base_nominal_ou_real) return
  throw new ErroDeRegraDura(
    R_103,
    `${MENSAGEM_R_103}: a entrada é ${entrada.base_nominal_ou_real} e o resultado declara ` +
      `${resultado.base_nominal_ou_real}`,
    'ROE e custo de capital próprio comparados em bases diferentes misturam inflação com ' +
      'retorno real, e a diferença entre os dois deixa de medir o que a fórmula supõe',
  )
}
