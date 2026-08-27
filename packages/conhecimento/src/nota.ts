import { z } from 'zod'
import { Confianca, texto } from './comum'
import { Heuristica } from './heuristica'

/**
 * Nota de ativo (RF-109).
 *
 * Pode restringir modelos habilitados e adicionar heurística. Não pode ampliar a
 * lista, alterar regra dura nem múltiplo bloqueado.
 *
 * O strictObject em `sobreescreve` faz metade do trabalho sozinho: `regras_duras`
 * e `multiplos_bloqueados` são chaves desconhecidas e caem na hora. A outra
 * metade, que é "restringe mas não amplia", o schema não tem como fazer sozinho,
 * porque depende da lista do playbook do setor, que a nota não conhece. Essa
 * parte é validação cruzada do CLI, ver validar.ts.
 */
export const Nota = z.strictObject({
  id: texto('id', 'RF-109'),
  ativo: texto('ativo', 'RF-109'),
  tipo: texto('tipo', 'RF-109'),
  playbook: texto('playbook', 'RF-109').optional(),
  sobreescreve: z
    .strictObject(
      {
        modelos_habilitados: z
          .array(texto('modelos_habilitados', 'RF-109'))
          .min(1, { error: 'RF-109: lista de modelos restringida não pode ser vazia' })
          .optional(),
      },
      {
        error:
          'RF-109, D-020: nota só pode sobrescrever modelos_habilitados. ' +
          'Regra dura e múltiplo bloqueado não são alteráveis por nota, senão toda ' +
          'proteção vira opcional, bastando redigir a nota',
      },
    )
    .optional(),
  heuristicas_extras: z.array(texto('heuristicas_extras', 'RF-109')).optional(),
  heuristicas: z.array(Heuristica).optional(),
  justificativa: texto('justificativa', 'RF-116'),
  confianca: Confianca,
  fonte: texto('fonte', 'RF-116'),
})

export type Nota = z.infer<typeof Nota>
