import { z } from 'zod'
import {
  Confianca,
  FaixaReferencia,
  textoDeInterface,
  textoDeInterfaceSemValor,
  textoNaoVazio,
} from './comum'
import { Heuristica } from './heuristica'

/** Severidade de múltiplo bloqueado (RF-104). */
export const SeveridadeMultiplo = z.enum(['bloqueio_total', 'alerta'], {
  error: 'RF-104: severidade de múltiplo bloqueado é bloqueio_total ou alerta',
})

/** RF-104: múltiplo bloqueado declara severidade e motivo exibível. */
export const MultiploBloqueado = z.strictObject({
  metrica: textoNaoVazio('metrica', 'RF-104'),
  severidade: SeveridadeMultiplo,
  // RF-104: o motivo aparece na tela no lugar do múltiplo bloqueado
  motivo: textoDeInterface('motivo', 'RF-104'),
})

/** RF-103: todo input obrigatório declara onde_encontrar. */
export const InputObrigatorio = z.strictObject({
  campo: textoNaoVazio('campo', 'RF-103'),
  tipo: textoNaoVazio('tipo', 'RF-103').optional(),
  descricao: textoDeInterface('descricao', 'RF-103').optional(),
  subcampos: z.array(textoNaoVazio('subcampos', 'RF-103')).optional(),
  // RF-302: o texto acompanha a pendência exibida quando o dado não é localizado
  onde_encontrar: textoDeInterface('onde_encontrar', 'RF-302'),
  fallback_manual: z.boolean().optional(),
  uso: textoNaoVazio('uso', 'RF-103').optional(),
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
    campo: textoNaoVazio('campo', 'RF-112'),
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
    subcampos: z.array(textoNaoVazio('subcampos', 'RF-112')).optional(),
    ajuda: textoDeInterfaceSemValor('ajuda', 'RF-112').optional(),
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
    id: textoNaoVazio('id', 'RF-105'),
    label: textoDeInterface('label', 'RF-105'),
    precisao: z.enum(['alta', 'reduzida'], {
      error: 'RF-105: precisao é alta ou reduzida',
    }),
    aviso_obrigatorio: textoDeInterface('aviso_obrigatorio', 'RF-105').optional(),
    inputs: z.array(textoNaoVazio('inputs', 'RF-105')).optional(),
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
  id: textoNaoVazio('id', 'RF-102'),
  validador: textoNaoVazio('validador', 'RF-102'),
  // RF-507: a mensagem da regra dura vai no erro estruturado que aborta o cálculo
  mensagem: textoDeInterface('mensagem', 'RF-507'),
})

export const HorizonteProjecao = z.strictObject({
  tipo: z.enum(['derivado_de_fato', 'convencao_setorial'], {
    error: 'RF-102: horizonte é derivado_de_fato ou convencao_setorial',
  }),
  origem: textoNaoVazio('origem', 'RF-102').optional(),
  anos: z.number().int().positive().optional(),
  ajustavel_pelo_usuario: z.boolean({
    error: 'RF-102: horizonte declara se é ajustável pelo usuário',
  }),
  // RF-419: a justificativa do horizonte é exibida quando o usuário ajusta
  justificativa: textoDeInterface('justificativa', 'RF-419').optional(),
})

export const Deteccao = z.strictObject({
  sinais_fortes: z.array(z.unknown()).min(1, {
    error: 'RF-102: detecção precisa de pelo menos um sinal forte',
  }),
  sinais_fracos: z.array(z.unknown()).optional(),
  exemplos: z.array(textoNaoVazio('exemplos', 'RF-102')).optional(),
  subtipos: z.array(z.unknown()).optional(),
  nao_confundir_com: z
    .array(
      z.strictObject({
        id: textoNaoVazio('nao_confundir_com.id', 'RF-102'),
        criterio: textoNaoVazio('nao_confundir_com.criterio', 'RF-102'),
      }),
    )
    .optional(),
})

/** RF-102: os campos que um playbook setorial precisa declarar. */
export const Playbook = z.strictObject({
  id: textoNaoVazio('id', 'RF-102'),
  versao: textoNaoVazio('versao', 'RF-102'),
  mercado: textoNaoVazio('mercado', 'RF-102'),
  nome_exibicao: textoNaoVazio('nome_exibicao', 'RF-102'),
  deteccao: Deteccao,
  multiplos_bloqueados: z.array(MultiploBloqueado).min(1, {
    error: 'RF-102, RF-104: playbook declara os múltiplos bloqueados do setor',
  }),
  modelos_habilitados: z.array(textoNaoVazio('modelos_habilitados', 'RF-102')).min(1, {
    error: 'RF-102: playbook declara pelo menos um modelo habilitado',
  }),
  horizonte_projecao: HorizonteProjecao,
  regras_duras: z.array(RegraDura).min(1, {
    error: 'RF-102: playbook declara as regras duras do setor',
  }),
  modos: z
    .array(ModoGranularidade, {
      error:
        'RF-102: playbook declara os modos de granularidade do setor. ' +
        'Sem modos, RF-105 não tem onde exigir o aviso de precisão reduzida',
    })
    .min(1, {
      error: 'RF-102, RF-105: a lista de modos não pode ser vazia',
    }),
  inputs_obrigatorios: z.array(InputObrigatorio).min(1, {
    error: 'RF-102, RF-103: playbook declara os inputs obrigatórios do setor',
  }),
  premissas_do_usuario: z.array(PremissaDoUsuario).min(1, {
    error: 'RF-102: playbook declara as premissas que o usuário informa',
  }),
  heuristicas_de_leitura: z
    .array(Heuristica, {
      error: 'RF-102, RF-106: playbook declara as heurísticas de leitura do setor',
    })
    .min(1, { error: 'RF-102: a lista de heurísticas não pode ser vazia' }),
  alertas: z.array(textoNaoVazio('alertas', 'RF-102')).optional(),
  fonte: textoNaoVazio('fonte', 'RF-102'),
  confianca: Confianca.optional(),
})

export type Playbook = z.infer<typeof Playbook>
export type PremissaDoUsuario = z.infer<typeof PremissaDoUsuario>
