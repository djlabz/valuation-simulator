/**
 * Porta pública do @valuation/conhecimento.
 *
 * Aqui mora o schema dos quatro tipos de item e a validação que o CLI usa. O
 * loader que lê a pasta no boot e monta o conhecimento em memória é do Passo 4 e
 * ainda não existe.
 */
export { Confianca, FaixaReferencia } from './comum'
export { Evento } from './evento'
export { Heuristica, SeveridadeHeuristica } from './heuristica'
export { Nota } from './nota'
export {
  HorizonteProjecao,
  InputObrigatorio,
  ModoGranularidade,
  MultiploBloqueado,
  Playbook,
  PremissaDoUsuario,
  RegraDura,
  SeveridadeMultiplo,
} from './playbook'
export {
  PASTAS_VALIDAS,
  tipoPeloCaminho,
  validarArquivo,
  validarNotasContraPlaybooks,
  validarPasta,
} from './validar'
export type { Problema, Resultado, TipoItem } from './validar'
