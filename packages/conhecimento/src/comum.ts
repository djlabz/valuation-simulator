import { Rate } from '@valuation/shared'
import { z, type RefinementCtx } from 'zod'

/**
 * Peças compartilhadas pelos quatro tipos de item de conhecimento.
 *
 * Toda mensagem de recusa cita o requisito que a sustenta, porque relatório de
 * validação sem ID de requisito obriga quem lê a adivinhar qual regra pegou.
 */

export const Confianca = z.enum(['alta', 'media', 'baixa'], {
  error: 'RF-106: confianca precisa ser alta, media ou baixa',
})

const textoBase = (campo: string, requisito: string) =>
  z
    .string({ error: `${requisito}: ${campo} precisa ser texto` })
    .trim()
    .min(1, { error: `${requisito}: ${campo} não pode ser vazio` })

/**
 * Grandeza adimensional em texto decimal (D-058).
 *
 * YAML sem aspas entrega 0.09 como number, que é float e a D-045 proíbe para
 * taxa. Aqui a recusa é explícita em vez de aceitar e converter, porque
 * converter esconderia o float que já passou pelo parser.
 */
export const taxaEmTexto = (campo: string, requisito: string) =>
  z
    .string({
      error:
        `${requisito}, D-045, D-058: ${campo} precisa vir como texto decimal entre aspas. ` +
        'Sem aspas o YAML entrega number, que é float e não serve para taxa',
    })
    .refine(
      (valor) => {
        try {
          Rate.de(valor, campo)
          return true
        } catch {
          return false
        }
      },
      { error: `D-046: ${campo} não é texto decimal válido para o construtor do projeto` },
    )

/** Data no formato AAAA-MM, que é o que as faixas de referência usam. */
export const anoMes = (campo: string, requisito: string) =>
  z
    .string({ error: `${requisito}: ${campo} precisa ser texto no formato AAAA-MM` })
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, {
      error: `${requisito}: ${campo} precisa estar no formato AAAA-MM`,
    })

/** Data no formato AAAA-MM-DD, que é o que prazo de evento usa. */
export const dataCompleta = (campo: string, requisito: string) =>
  z
    .string({ error: `${requisito}: ${campo} precisa ser texto no formato AAAA-MM-DD` })
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
      error: `${requisito}: ${campo} precisa estar no formato AAAA-MM-DD`,
    })

// ---------------------------------------------------------------------------
// Os três filtros de texto. Ficam como função de checagem para poderem ser
// compostos: campo de ajuda de premissa é texto de interface E não pode carregar
// valor, e descrição de evento é texto de interface E não pode qualificar
// probabilidade. Duplicar a lista de padrões para cada combinação daria duas
// cópias que divergem.
// ---------------------------------------------------------------------------

/**
 * Números escritos em texto livre que se comportam como valor de premissa
 * (RF-112, RP-006).
 *
 * Pega percentual, decimal e valor em reais. Não pega inteiro sem unidade nem
 * número por extenso. É rede, não prova.
 */
const PADROES_DE_VALOR = [
  { padrao: /\d+(?:[.,]\d+)?\s*%/, nome: 'percentual' },
  { padrao: /\d+[.,]\d+/, nome: 'número decimal' },
  { padrao: /R\$\s*\d/, nome: 'valor em reais' },
]

function checarValorDePremissa(
  valor: string,
  ctx: RefinementCtx,
  campo: string,
  requisito: string,
): void {
  for (const { padrao, nome } of PADROES_DE_VALOR) {
    const achado = padrao.exec(valor)
    if (achado !== null) {
      ctx.addIssue({
        code: 'custom',
        message:
          `${requisito}, RP-006: ${campo} contém ${nome} ("${achado[0]}"). ` +
          'Texto de premissa não carrega valor, nem como exemplo',
      })
      return
    }
  }
}

/**
 * Qualificação de probabilidade na voz do sistema (RF-111, RP-007).
 *
 * Os padrões são estreitos de propósito. Evento pode citar classificação da
 * companhia, tipo "a companhia classifica o risco como possível", que é fato com
 * procedência e não juízo do software. O que se recusa é o sistema afirmando
 * desfecho por conta própria.
 */
const PADROES_DE_PROBABILIDADE = [
  /\bé\s+(?:pouco\s+)?prov[áa]vel\b/i,
  /\b(?:mais|menos)\s+prov[áa]vel\b/i,
  /\bimprov[áa]vel\b/i,
  /\bprobabilidade\s+de\b/i,
  /\bchance[s]?\s+de\b/i,
  /\btende\s+a\b/i,
  /\bdeve\s+(?:reverter|ser\s+revertid)/i,
]

function checarProbabilidade(
  valor: string,
  ctx: RefinementCtx,
  campo: string,
  requisito: string,
): void {
  for (const padrao of PADROES_DE_PROBABILIDADE) {
    const achado = padrao.exec(valor)
    if (achado !== null) {
      ctx.addIssue({
        code: 'custom',
        message:
          `${requisito}, RP-007: ${campo} qualifica probabilidade ("${achado[0]}"). ` +
          'Evento descreve fato e mecanismo, quem pondera desfecho é o usuário',
      })
      return
    }
  }
}

/**
 * Vocabulário valorativo em texto que vira tela (RP-004, RF-117, D-061).
 *
 * Os gatilhos vêm da seção 2 do CLAUDE.md. Dois têm uso metodológico legítimo e
 * carregam exceção, senão a proteção morre na primeira vez que alguém escrever
 * metodologia correta e o CLI reprovar: `descontado`, de fluxo de caixa
 * descontado, e `oportunidade`, de custo de oportunidade do capital.
 *
 * `armadilha` não está na lista literal da seção 2. Entrou porque foi encontrado
 * em conteúdo real, em commodities-b3, e é juízo sobre o ativo com outra roupa.
 *
 * Rede, não prova. Paráfrase passa limpo, e a D-061 registra esse limite.
 */
interface GatilhoValorativo {
  padrao: RegExp
  antecedentesPermitidos?: string[]
}

const GATILHOS_VALORATIVOS: GatilhoValorativo[] = [
  { padrao: /\bbarat[oa]s?\b/i },
  { padrao: /\bcar[oa]s?\b/i },
  { padrao: /\bsaud[áa]ve(?:l|is)\b/i },
  { padrao: /\batrativ[oa]s?\b|\batratividade\b/i },
  { padrao: /\bfavor[áa]ve(?:l|is)\b/i },
  { padrao: /\binjust[oa]s?\b/i },
  { padrao: /\brisco elevado\b/i },
  { padrao: /\bmargem de seguran[çc]a\b/i },
  { padrao: /\barmadilhas?\b/i },
  { padrao: /\bsub(?:avalia|precifica|valoriza)(?:d[oa]s?|ção|cao|ções|coes)\b/i },
  { padrao: /\bsobre(?:avalia|precifica|valoriza)(?:d[oa]s?|ção|cao|ções|coes)\b/i },
  {
    padrao: /\bdescontad[oa]s?\b/i,
    antecedentesPermitidos: ['fluxo', 'caixa', 'valor', 'dividendo', 'proventos'],
  },
  {
    padrao: /\boportunidades?\b/i,
    antecedentesPermitidos: ['custo de', 'custos de'],
  },
]

function antecedenteLibera(texto: string, indice: number, permitidos: string[]): boolean {
  const antes = texto.slice(Math.max(0, indice - 30), indice).toLowerCase()
  return permitidos.some((termo) => antes.includes(termo))
}

function checarValorativo(
  valor: string,
  ctx: RefinementCtx,
  campo: string,
  requisito: string,
): void {
  for (const gatilho of GATILHOS_VALORATIVOS) {
    const achado = gatilho.padrao.exec(valor)
    if (achado === null) continue
    if (
      gatilho.antecedentesPermitidos !== undefined &&
      antecedenteLibera(valor, achado.index, gatilho.antecedentesPermitidos)
    ) {
      continue
    }
    ctx.addIssue({
      code: 'custom',
      message:
        `${requisito}, RP-004, D-061: ${campo} usa vocabulário valorativo ("${achado[0]}"). ` +
        'Este texto é exibido ao usuário. Troque o adjetivo por um número ou por uma ' +
        'origem: se a frase sobrevive, o adjetivo era juízo',
    })
    return
  }
}

/**
 * Texto de conhecimento, o helper padrão (D-062).
 *
 * Filtra vocabulário valorativo. É o padrão de propósito: a marcação anterior
 * listava quem era filtrado, e o modo de falha era esquecer de marcar, que é erro
 * invisível para a revisão. Agora o esquecimento cai do lado seguro, e quem quer
 * ficar de fora precisa dizer isso no diff, com `textoInterno`.
 */
export const texto = (campo: string, requisito: string) =>
  textoBase(campo, requisito).superRefine((valor, ctx) =>
    checarValorativo(valor, ctx, campo, requisito),
  )

/**
 * Exceção declarada: campo que não vira tela em nenhum caminho previsto pelos
 * requisitos, e por isso fica fora do filtro (D-062).
 *
 * O parâmetro `motivo` não é usado em runtime e existe para forçar quem escreve a
 * escrever a justificativa ali, onde o revisor do diff vai ler.
 */
export const textoInterno = (campo: string, requisito: string, motivo: string) => {
  void motivo
  return textoBase(campo, requisito)
}

/** Texto que também não pode carregar valor de premissa (RF-112). */
export const textoSemValorDePremissa = (campo: string, requisito: string) =>
  textoBase(campo, requisito).superRefine((valor, ctx) => {
    checarValorativo(valor, ctx, campo, requisito)
    checarValorDePremissa(valor, ctx, campo, requisito)
  })

/** Texto que também não pode qualificar probabilidade de desfecho (RF-111). */
export const textoSemProbabilidade = (campo: string, requisito: string) =>
  textoBase(campo, requisito).superRefine((valor, ctx) => {
    checarValorativo(valor, ctx, campo, requisito)
    checarProbabilidade(valor, ctx, campo, requisito)
  })

/**
 * Faixa de referência (RF-113).
 *
 * strictObject de propósito: chave desconhecida é recusada, e é isso que barra
 * uma faixa carregar `ativo` e virar faixa por papel, que é o que a RF-113 e a
 * D-024 proíbem. A faixa também só existe dentro de playbook, que é setorial por
 * construção, e nenhum schema de nota ou de evento aceita o campo.
 */
export const FaixaReferencia = z.strictObject(
  {
    minimo: taxaEmTexto('faixa_referencia.minimo', 'RF-113'),
    maximo: taxaEmTexto('faixa_referencia.maximo', 'RF-113'),
    n_observacoes: z
      .number({ error: 'RF-113: n_observacoes é contagem de observações' })
      .int({ error: 'RF-113: n_observacoes precisa ser inteiro' })
      .positive({ error: 'RF-113: n_observacoes precisa ser maior que zero' }),
    base: texto('faixa_referencia.base', 'RF-113'),
    confianca: Confianca,
    atualizado_em: anoMes('faixa_referencia.atualizado_em', 'RF-113'),
    // exibido como contexto de escala, bloco 3 de RF-116
    aviso: texto('faixa_referencia.aviso', 'RF-116').optional(),
  },
  {
    error:
      'RF-113, D-024: faixa de referência é sempre setorial e agregada. ' +
      'Ela declara minimo, maximo, n_observacoes, base, confianca e atualizado_em, e nada ' +
      'mais. Chave a mais, tipo ativo ou ticker, é faixa por papel, que é indistinguível ' +
      'de recomendação de premissa',
  },
)
