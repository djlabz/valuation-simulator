/**
 * Porta pública do @valuation/dominio.
 *
 * Engines e validadores moram no mesmo pacote de propósito: compartilham os tipos
 * de dinheiro e versionam juntos. Hoje só existe uma engine, e nenhum validador.
 */
export {
  ConcessaoDeEntrada,
  ConcessaoDoResultado,
  EntradaFcffPorConcessao,
  ErroDePremissa,
  ErroDeRegraDura,
  IndiceDeReajuste,
  PeriodoDoResultado,
  ReducaoContratual,
  ResultadoFcffPorConcessao,
  VERSAO_ENGINE,
  calcularFcffPorConcessao,
} from './engines/fcff-por-concessao'
