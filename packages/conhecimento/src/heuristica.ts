import { z } from 'zod'
import { Confianca, primeiroValor, texto } from './comum'

/** Severidade de heurística (RF-106). Não confundir com a de múltiplo bloqueado. */
export const SeveridadeHeuristica = z.enum(['informativo', 'bloqueia_ate_ciente'], {
  error: 'RF-106: severidade de heurística é informativo ou bloqueia_ate_ciente',
})

/**
 * `onde_olhar` diz onde ler no documento. Número decimal fica, porque "Nota 24.1
 * do ITR" é o que o campo existe para carregar; percentual e valor em reais saem
 * sempre, com ou sem fonte (D-111). Regra do campo, e não do objeto, então roda
 * mesmo quando outro campo da heurística está quebrado.
 */
const ondeOlhar = texto('onde_olhar', 'RF-106, RF-116').superRefine((valor, ctx) => {
  const achado = primeiroValor(valor, ['percentual', 'valor em reais'])
  if (achado === null) return
  ctx.addIssue({
    code: 'custom',
    message:
      `RF-112, RP-006, D-111: onde_olhar da heurística contém ${achado.nome} ` +
      `("${achado.trecho}"). Esse campo diz onde ler no documento e não carrega ` +
      'percentual nem valor em reais, com ou sem fonte',
  })
})

/** Campos em que número só entra com `fonte` preenchida (D-111). */
const CAMPOS_COM_NUMERO_SO_COM_FONTE = ['o_que_verificar', 'por_que_importa'] as const

/**
 * Heurística de leitura (RF-106, RF-107, RF-108, RF-112, D-111).
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
    onde_olhar: ondeOlhar,
    o_que_verificar: texto('o_que_verificar', 'RF-106, RF-116'),
    por_que_importa: texto('por_que_importa', 'RF-106, RF-116'),
    acao_do_agente: texto('acao_do_agente', 'RF-106').optional(),
    severidade: SeveridadeHeuristica,
    confianca: Confianca,
    // D-108: opcional. Preenchida quando a heurística se apoia em documento da
    // companhia ou em norma; presente, continua não vazia e passa pelo filtro
    // de RP-004 (D-061, D-062), porque vira tela pelo bloco 1 do alerta (RF-116)
    fonte: texto('fonte', 'RF-106, RF-116').optional(),
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
    // D-111: número com origem em documento da companhia ou em norma é fato, e a
    // origem é a fonte. Sem fonte, o número é valor solto e chegaria à tela como
    // orientação do app (RF-112). Este refine é do objeto e não roda quando outro
    // campo está quebrado (D-073), por isso os testes provam com o resto válido.
    if (heuristica.fonte === undefined) {
      for (const campo of CAMPOS_COM_NUMERO_SO_COM_FONTE) {
        const achado = primeiroValor(heuristica[campo])
        if (achado === null) continue
        ctx.addIssue({
          code: 'custom',
          path: [campo],
          message:
            `RF-112, RP-006, D-111: ${campo} da heurística contém ${achado.nome} ` +
            `("${achado.trecho}") e a heurística não tem fonte. Número em texto de ` +
            'heurística só entra com fonte que diga de onde ele veio',
        })
      }
    }
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
