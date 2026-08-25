/**
 * Porta publica do @valuation/shared.
 *
 * O construtor Dec e os simbolos INTERNO e CRIAR ficam de fora de proposito:
 * quem consome o pacote trabalha com Money e Rate, e nao alcanca o decimal cru
 * nem, por tabela, o toNumber() dele.
 */
export { Money, brl, usd } from './money'
export type { Moeda } from './money'
export { Rate, bpsDeRate, exigirPositivo, rateDeBps } from './rate'
export type { ModoArredondamento } from './decimal-config'
