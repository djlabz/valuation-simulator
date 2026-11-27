import { EntradaDdm, type ResultadoDdm, calcularDdm } from '../engines/ddm'
import { validarCrescimentoMenorQueKe } from './crescimento-menor-que-ke'
import { validarRetencaoRegulatoria } from './retencao-regulatoria'
import { validarSpreadROEKe } from './spread-roe-ke'

/**
 * Ponto único da ddm (D-121): validadores de entrada, engine, guardas de saída,
 * nessa ordem. Função pura, como a engine.
 *
 * Primeiro o schema de entrada, para estrutura quebrada (lista de tamanho errado,
 * number em campo financeiro) falhar como estrutura e não como regra dura. Depois
 * o R-104, antes da engine. Depois a engine. Depois R-102 e R-103 sobre o resultado,
 * antes de ele ser devolvido. Nenhuma falha é contornável por parâmetro (RF-508):
 * a função não recebe opção de pular regra.
 */
export function executarDdm(entradaBruta: unknown): ResultadoDdm {
  const entrada = EntradaDdm.parse(entradaBruta)
  validarCrescimentoMenorQueKe(entrada)
  const resultado = calcularDdm(entrada)
  validarRetencaoRegulatoria(resultado)
  validarSpreadROEKe(entrada, resultado)
  return resultado
}
