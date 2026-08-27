import { z } from 'zod'
import {
  Confianca,
  dataCompleta,
  texto,
  textoSemProbabilidade,
} from './comum'

/**
 * Evento (RF-110, RF-111).
 *
 * Circunstância temporária. Exige DOIS prazos, validade_ate e revisar_em, e não
 * um só: o handoff histórico descreve essa validação com um campo apenas e está
 * errado, a fonte de verdade exige os dois.
 */
export const Evento = z.strictObject({
  id: texto('id', 'RF-110'),
  ativo: texto('ativo', 'RF-110'),
  tipo: texto('tipo', 'RF-110'),
  descricao: textoSemProbabilidade('descricao', 'RF-111'),
  mecanismo: textoSemProbabilidade('mecanismo', 'RF-111').optional(),
  acao: texto('acao', 'RF-110').optional(),
  campo_relacionado: texto('campo_relacionado', 'RF-110').optional(),
  apresenta_cenarios: z.array(texto('apresenta_cenarios', 'RF-110')).optional(),
  validade_ate: dataCompleta('validade_ate', 'RF-110'),
  revisar_em: dataCompleta('revisar_em', 'RF-110'),
  confianca: Confianca,
  fonte: texto('fonte', 'RF-116'),
})

export type Evento = z.infer<typeof Evento>
