import { z } from 'zod'
import {
  Confianca,
  FaixaReferencia,
  texto,
  textoSemValorDePremissa,
} from './comum'
import { Heuristica } from './heuristica'

/** Severidade de múltiplo bloqueado (RF-104). */
export const SeveridadeMultiplo = z.enum(['bloqueio_total', 'alerta'], {
  error: 'RF-104: severidade de múltiplo bloqueado é bloqueio_total ou alerta',
})

/** RF-104: múltiplo bloqueado declara severidade e motivo exibível. */
export const MultiploBloqueado = z.strictObject({
  metrica: texto('metrica', 'RF-104'),
  severidade: SeveridadeMultiplo,
  // RF-104: o motivo aparece na tela no lugar do múltiplo bloqueado
  motivo: texto('motivo', 'RF-104'),
})

/** RF-103: todo input obrigatório declara onde_encontrar. */
export const InputObrigatorio = z.strictObject({
  campo: texto('campo', 'RF-103'),
  tipo: texto('tipo', 'RF-103').optional(),
  descricao: texto('descricao', 'RF-103').optional(),
  subcampos: z.array(texto('subcampos', 'RF-103')).optional(),
  // RF-302: o texto acompanha a pendência exibida quando o dado não é localizado
  onde_encontrar: texto('onde_encontrar', 'RF-302'),
  fallback_manual: z.boolean().optional(),
  uso: texto('uso', 'RF-103').optional(),
})

/**
 * Premissa do usuário (RF-112, RF-421, D-006, D-040).
 *
 * Duas proteções moram aqui e são as mais delicadas do schema.
 *
 * RF-112 e RP-006, nenhum valor de premissa. O critério é dois: a lista de chaves
 * é fechada por strictObject, então não existe onde enfiar um valor com nome
 * novo; e `default` só aceita null, ou seja, a única coisa que o playbook pode
 * dizer é "não tem default". Texto de ajuda passa por varredura de percentual,
 * decimal e valor em reais, que é rede e não prova.
 *
 * RF-421 e D-040, nenhuma flag booleana. `tipo: booleano` é recusado por nome, e
 * nenhuma chave desta lista aceita boolean a não ser `obrigatorio`, que é
 * metadado sobre a premissa e não a premissa. A inclusão de um efeito continua
 * derivando da presença do valor informado pelo usuário.
 */
export const PremissaDoUsuario = z.strictObject(
  {
    campo: texto('campo', 'RF-112'),
    obrigatorio: z.boolean({ error: 'RF-112: obrigatorio é true ou false' }),
    default: z
      .null({
        error:
          'RF-112, RP-003, D-006: premissa não tem valor default. ' +
          'O campo aceita apenas null, que declara a ausência',
      })
      .optional(),
    tipo: z
      .string()
      .refine((valor) => valor !== 'booleano' && valor !== 'boolean', {
        error:
          'RF-421, D-040: flag booleana de premissa é proibida. ' +
          'A inclusão ou exclusão do efeito deriva da presença do valor informado',
      })
      .optional(),
    composicao_disponivel: z.enum(['capm'], {
      error: 'RF-112: composicao_disponivel só aceita capm nesta versão',
    }).optional(),
    // D-059: null explícito declara ausência deliberada, distinta de omissão
    faixa_referencia: FaixaReferencia.nullish(),
    subcampos: z.array(texto('subcampos', 'RF-112')).optional(),
    ajuda: textoSemValorDePremissa('ajuda', 'RF-112').optional(),
  },
  {
    error:
      'RF-112, RP-006, D-006: a lista de chaves de uma premissa é fechada. ' +
      'Chave a mais é onde um valor de premissa entraria com nome novo, tipo ' +
      'valor_sugerido ou exemplo, e por isso nenhuma é aceita',
  },
)

/** RF-105: modo de granularidade reduzida exige aviso obrigatório. */
export const ModoGranularidade = z
  .strictObject({
    id: texto('id', 'RF-105'),
    label: texto('label', 'RF-105'),
    precisao: z.enum(['alta', 'reduzida'], {
      error: 'RF-105: precisao é alta ou reduzida',
    }),
    aviso_obrigatorio: texto('aviso_obrigatorio', 'RF-105').optional(),
    inputs: z.array(texto('inputs', 'RF-105')).optional(),
  })
  .superRefine((modo, ctx) => {
    if (modo.precisao === 'reduzida' && modo.aviso_obrigatorio === undefined) {
      ctx.addIssue({
        code: 'custom',
        message:
          `RF-105: modo ${modo.id} tem precisao reduzida e precisa de aviso_obrigatorio, ` +
          'exibido antes da seleção',
      })
    }
  })

export const RegraDura = z.strictObject({
  id: texto('id', 'RF-102'),
  validador: texto('validador', 'RF-102'),
  // RF-507: a mensagem da regra dura vai no erro estruturado que aborta o cálculo
  mensagem: texto('mensagem', 'RF-507'),
})

export const HorizonteProjecao = z.strictObject({
  tipo: z.enum(['derivado_de_fato', 'convencao_setorial'], {
    error: 'RF-102: horizonte é derivado_de_fato ou convencao_setorial',
  }),
  origem: texto('origem', 'RF-102').optional(),
  anos: z.number().int().positive().optional(),
  ajustavel_pelo_usuario: z.boolean({
    error: 'RF-102: horizonte declara se é ajustável pelo usuário',
  }),
  // RF-419: a justificativa do horizonte é exibida quando o usuário ajusta
  justificativa: texto('justificativa', 'RF-419').optional(),
})

/**
 * Valor de sinal de detecção, em qualquer profundidade.
 *
 * O bloco de detecção tem forma livre por natureza: chave e valor variam por
 * setor, e há um nível de aninhamento em subtipos. Antes ele era `z.unknown()`,
 * ou seja, texto que ninguém olhava. Pela D-062 isso não se sustenta: o sinal
 * alimenta a classificação, e a proposta de modelo é confirmada em tela
 * (RF-902), então o texto pode chegar ao usuário. Recursivo para nenhuma string
 * escapar por estar fundo demais.
 */
const ValorDeSinal: z.ZodType = z.lazy(() =>
  z.union([
    texto('deteccao', 'RF-102'),
    z.boolean(),
    z.number(),
    z.array(ValorDeSinal),
    z.record(z.string(), ValorDeSinal),
  ]),
)

export const Deteccao = z.strictObject({
  sinais_fortes: z.array(ValorDeSinal).min(1, {
    error: 'RF-102: detecção precisa de pelo menos um sinal forte',
  }),
  sinais_fracos: z.array(ValorDeSinal).optional(),
  exemplos: z.array(texto('exemplos', 'RF-102')).optional(),
  subtipos: z.array(ValorDeSinal).optional(),
  nao_confundir_com: z
    .array(
      z.strictObject({
        id: texto('nao_confundir_com.id', 'RF-102'),
        criterio: texto('nao_confundir_com.criterio', 'RF-102'),
      }),
    )
    .optional(),
})

/** RF-102: os campos que um playbook setorial precisa declarar. */
export const Playbook = z.strictObject({
  id: texto('id', 'RF-102'),
  versao: texto('versao', 'RF-102'),
  mercado: texto('mercado', 'RF-102'),
  nome_exibicao: texto('nome_exibicao', 'RF-102'),
  deteccao: Deteccao,
  multiplos_bloqueados: z.array(MultiploBloqueado).min(1, {
    error: 'RF-102, RF-104: playbook declara os múltiplos bloqueados do setor',
  }),
  modelos_habilitados: z.array(texto('modelos_habilitados', 'RF-102')).min(1, {
    error: 'RF-102: playbook declara pelo menos um modelo habilitado',
  }),
  // D-071: opcional porque bancos não deriva horizonte de fato, e nesse caso o
  // horizonte é premissa do usuário (RF-416, RF-419). null explícito declara a
  // ausência, omitir a chave seria indistinguível de esquecer (D-059)
  horizonte_projecao: HorizonteProjecao.nullish(),
  regras_duras: z.array(RegraDura).min(1, {
    error: 'RF-102: playbook declara as regras duras do setor',
  }),
  // D-071: opcional. A proteção de RF-105 é condicional à presença de um modo com
  // precisao reduzida, não à existência do campo, então ela continua de pé com modos
  // ausente. O conteúdo saiu por D-067 e volta na Etapa do Conhecimento
  modos: z
    .array(ModoGranularidade)
    .min(1, { error: 'RF-105: a lista de modos, quando existe, não pode ser vazia' })
    .nullish(),
  inputs_obrigatorios: z.array(InputObrigatorio).min(1, {
    error: 'RF-102, RF-103: playbook declara os inputs obrigatórios do setor',
  }),
  premissas_do_usuario: z.array(PremissaDoUsuario).min(1, {
    error: 'RF-102: playbook declara as premissas que o usuário informa',
  }),
  // D-071: opcional. Heurística é conhecimento analítico e não é escrita por agente
  // (RNF-013), então o campo espera a Etapa do Conhecimento em vez de ser preenchido
  heuristicas_de_leitura: z
    .array(Heuristica)
    .min(1, { error: 'RF-106: a lista de heurísticas, quando existe, não pode ser vazia' })
    .nullish(),
  fonte: texto('fonte', 'RF-102'),
  confianca: Confianca.optional(),
})

export type Playbook = z.infer<typeof Playbook>
export type PremissaDoUsuario = z.infer<typeof PremissaDoUsuario>
