/**
 * Porta pública do @valuation/dominio.
 *
 * Engines e validadores moram no mesmo pacote de propósito: compartilham os tipos
 * de dinheiro e versionam juntos. Duas engines, fcff_por_concessao e ddm; os
 * validadores da ddm rodam pelo ponto único executarDdm (D-121).
 */
export { ErroDePremissa, ErroDeRegraDura } from './erros'
export {
  AcoesExTesouraria,
  AnoDoResultado,
  BaseNominalOuReal,
  ComposicaoDaUnit,
  EntradaDdm,
  PerpetuidadeDoResultado,
  ResultadoDdm,
  VERSAO_ENGINE_DDM,
  calcularDdm,
} from './engines/ddm'
export { executarDdm } from './validadores/executar-ddm'
export { R_104, validarCrescimentoMenorQueKe } from './validadores/crescimento-menor-que-ke'
export { R_102, validarRetencaoRegulatoria } from './validadores/retencao-regulatoria'
export { R_103, validarSpreadROEKe } from './validadores/spread-roe-ke'
export { porConvergencia } from './atalhos/convergencia'
export {
  ConcessaoDeEntrada,
  ConcessaoDoResultado,
  EntradaFcffPorConcessao,
  IndiceDeReajuste,
  PeriodoDoResultado,
  ReducaoContratual,
  ResultadoFcffPorConcessao,
  VERSAO_ENGINE,
  calcularFcffPorConcessao,
} from './engines/fcff-por-concessao'
