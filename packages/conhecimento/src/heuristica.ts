import { z } from 'zod'
import { Confianca, texto } from './comum'

/** Severidade de heurística (RF-106). Não confundir com a de múltiplo bloqueado. */
export const SeveridadeHeuristica = z.enum(['informativo', 'bloqueia_ate_ciente'], {
  error: 'RF-106: severidade de heurística é informativo ou bloqueia_ate_ciente',
})

/**
 * Heurística de leitura (RF-106, RF-107, RF-108).
 *
 * Ela diz onde olhar e do que desconfiar. Nunca carrega valor, e por isso não
 * tem campo numérico nenhum: o que ela produz é alerta, não premissa (RF-112).
 */
export const Heuristica = z
  .strictObject({
    id: texto('id', 'RF-106'),
    aplica_em: z
      .array(texto('aplica_em', 'RF-106'), {
        error: 'RF-106: aplica_em é lista de documentos onde a heurística vale',
      })
      .min(1, { error: 'RF-106: aplica_em precisa de pelo menos um documento' }),
    onde_olhar: texto('onde_olhar', 'RF-106, RF-116'),
    o_que_verificar: texto('o_que_verificar', 'RF-106, RF-116'),
    por_que_importa: texto('por_que_importa', 'RF-106, RF-116'),
    acao_do_agente: texto('acao_do_agente', 'RF-106').optional(),
    severidade: SeveridadeHeuristica,
    confianca: Confianca,
    fonte: texto('fonte', 'RF-106, RF-116'),
    // RF-107: vincula a heurística a uma premissa, e o alerta aparece junto ao campo
    campo_relacionado: texto('campo_relacionado', 'RF-107').optional(),
    // RF-108: divergência exige as visões conflitantes lado a lado
    divergencia: z.boolean().optional(),
    visoes: z
      .array(
        z.strictObject({
          fonte: texto('visoes.fonte', 'RF-108'),
          posicao: texto('visoes.posicao', 'RF-108'),
        }),
      )
      .optional(),
  })
  .superRefine((heuristica, ctx) => {
    if (heuristica.divergencia === true && (heuristica.visoes?.length ?? 0) < 2) {
      ctx.addIssue({
        code: 'custom',
        message:
          'RF-108: heurística com divergencia: true precisa de pelo menos duas visões em ' +
          'visoes, para as posições aparecerem lado a lado sem o sistema escolher uma',
      })
    }
    if (heuristica.divergencia !== true && heuristica.visoes !== undefined) {
      ctx.addIssue({
        code: 'custom',
        message: 'RF-108: visoes só faz sentido com divergencia: true',
      })
    }
  })

export type Heuristica = z.infer<typeof Heuristica>
