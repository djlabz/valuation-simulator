import { z } from 'zod'
import { textoSemValorDePremissa } from './comum'

/**
 * Mecanismo de cálculo (RF-125, D-120).
 *
 * Explica o efeito de uma premissa, ou de uma parte do modelo, no resultado. Não
 * é heurística de leitura: não aponta documento, não tem severidade nem confiança
 * e não gera alerta (RF-106, RF-116). Por isso não tem nenhum desses campos, e o
 * strictObject recusa quem tentar trazê-los.
 *
 * Todo campo de texto passa pelo filtro valorativo e pelo de valor de premissa,
 * sem exceção por `fonte`, porque o mecanismo não tem `fonte` (D-120). O id e os
 * ids de playbook também, de propósito: são texto, e a exceção a um filtro
 * precisa ser dita no diff (D-062), não presumida.
 *
 * O que o schema não faz sozinho, porque exige ler os playbooks, mora em
 * `validarMecanismosContraPlaybooks`: cada playbook da lista existe, e `modelo` e
 * `campo_relacionado`, quando declarados, valem em todos eles.
 */
export const Mecanismo = z.strictObject(
  {
    id: textoSemValorDePremissa('id', 'RF-125'),
    // lista e não um só, porque o mesmo mecanismo pode valer para mais de um
    // setor, e uma cópia por playbook divergiria com o tempo (D-120)
    playbooks: z
      .array(textoSemValorDePremissa('playbooks', 'RF-125'), {
        error: 'RF-125: playbooks é lista de ids de playbook',
      })
      .min(1, { error: 'RF-125: playbooks precisa de pelo menos um id de playbook' }),
    modelo: textoSemValorDePremissa('modelo', 'RF-125').optional(),
    campo_relacionado: textoSemValorDePremissa('campo_relacionado', 'RF-125').optional(),
    texto: textoSemValorDePremissa('texto', 'RF-125'),
  },
  {
    error:
      'RF-125, D-120: mecanismo declara id, playbooks e texto, e pode declarar modelo e ' +
      'campo_relacionado. Não aponta documento nem tem severidade, confiança ou fonte, ' +
      'porque não é heurística de leitura e não gera alerta (RF-106, RF-116)',
  },
)

export type Mecanismo = z.infer<typeof Mecanismo>
