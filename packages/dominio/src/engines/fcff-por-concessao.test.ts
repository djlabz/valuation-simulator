import { describe, expect, it } from 'vitest'
import {
  CARTEIRA_ESCALONADA,
  CARTEIRA_VAZIA,
  CONCESSAO_UNICA,
  CONCESSAO_VENCIDA,
  MAIS_LONGA_PRIMEIRO,
} from './fcff-por-concessao.fixtures'
import {
  ErroDeRegraDura,
  EntradaFcffPorConcessao,
  ResultadoFcffPorConcessao,
  calcularFcffPorConcessao,
} from './fcff-por-concessao'

function porNome(resultado: ReturnType<typeof calcularFcffPorConcessao>, nome: string) {
  const achada = resultado.concessoes.find((c) => c.nome === nome)
  if (achada === undefined) throw new Error(`concessão ${nome} não veio no resultado`)
  return achada
}

describe('RF-504, o resultado vem desagregado por etapa e cada etapa confere', () => {
  it('concessão única: RAP líquida, fluxo, fator de desconto e descontado, período a período', () => {
    const r = calcularFcffPorConcessao(CONCESSAO_UNICA)
    const c = porNome(r, 'CONCESSAO-A')

    expect(c.rap_bruta_ciclo_atual).toBe('1000')
    expect(c.deducoes_aplicadas).toBe('0.1')
    expect(c.rap_liquida_ciclo_atual).toBe('900')
    expect(c.percentual_participacao).toBe('1')
    expect(c.periodos_projetados).toBe(3)

    // inflação zero mantém a RAP, participação 1 mantém o fluxo, e o desconto é 1/1.1^t
    const esperado = [
      { periodo: 1, data_fim: '2027-01-01', fluxo: '900', descontado: '818.1818181818181818181818181818182' },
      { periodo: 2, data_fim: '2028-01-01', fluxo: '900', descontado: '743.8016528925619834710743801652893' },
      { periodo: 3, data_fim: '2029-01-01', fluxo: '900', descontado: '676.1833208114199849737039819684448' },
    ]
    for (const alvo of esperado) {
      const p = c.periodos.find((x) => x.periodo === alvo.periodo)
      expect(p, `período ${alvo.periodo}`).toBeDefined()
      expect(p?.data_fim).toBe(alvo.data_fim)
      expect(p?.rap_liquida_reajustada).toBe('900')
      expect(p?.fator_reducao_contratual).toBe('1')
      expect(p?.rap_apos_reducao).toBe('900')
      expect(p?.fluxo_atribuivel).toBe(alvo.fluxo)
      expect(p?.fluxo_descontado).toBe(alvo.descontado)
    }
    expect(c.valor_presente_da_concessao).toBe('2238.166791885800150262960180315553')
    expect(r.valor_presente_total).toBe('2238.166791885800150262960180315553')
  })
})

describe('RF-417, o horizonte de cada concessão é o vencimento dela', () => {
  it('vencimentos escalonados produzem contagens de período diferentes', () => {
    const r = calcularFcffPorConcessao(CARTEIRA_ESCALONADA)
    expect(porNome(r, 'CONCESSAO-CURTA').periodos_projetados).toBe(2)
    expect(porNome(r, 'CONCESSAO-COM-REDUCAO').periodos_projetados).toBe(4)
    expect(porNome(r, 'CONCESSAO-EM-CONSORCIO').periodos_projetados).toBe(5)
  })

  it('o fluxo agregado cai em degraus conforme as concessões vencem', () => {
    const r = calcularFcffPorConcessao(CARTEIRA_ESCALONADA)
    const quantasContribuem = (periodo: number) =>
      r.concessoes.filter((c) => c.periodos.some((p) => p.periodo === periodo)).length
    expect([1, 2, 3, 4, 5].map(quantasContribuem)).toEqual([3, 3, 2, 2, 1])
  })

  it('nenhum período projetado passa da data de vencimento da concessão', () => {
    const r = calcularFcffPorConcessao(CARTEIRA_ESCALONADA)
    for (const c of r.concessoes) {
      for (const p of c.periodos) {
        expect(p.data_fim <= c.data_vencimento, `${c.nome} período ${p.periodo}`).toBe(true)
      }
    }
  })

  it('vencimento anterior à data base não projeta período nenhum', () => {
    const r = calcularFcffPorConcessao(CONCESSAO_VENCIDA)
    const c = porNome(r, 'CONCESSAO-A')
    expect(c.periodos_projetados).toBe(0)
    expect(c.periodos).toEqual([])
    expect(c.valor_presente_da_concessao).toBe('0')
    expect(r.valor_presente_total).toBe('0')
  })
})

describe('redução contratual entra no período certo e não antes', () => {
  it('fator 1 até o período anterior, fator da redução do período em diante', () => {
    const r = calcularFcffPorConcessao(CARTEIRA_ESCALONADA)
    const c = porNome(r, 'CONCESSAO-COM-REDUCAO')
    // RAP bruta 2000, deduções 0.2, líquida 1600. Redução de metade a partir de 2029-01-01
    const fatores = c.periodos.map((p) => ({ periodo: p.periodo, fator: p.fator_reducao_contratual }))
    expect(fatores).toEqual([
      { periodo: 1, fator: '1' },
      { periodo: 2, fator: '1' },
      { periodo: 3, fator: '0.5' },
      { periodo: 4, fator: '0.5' },
    ])
    const p3 = c.periodos.find((p) => p.periodo === 3)
    expect(p3?.rap_liquida_reajustada).toBe('1600')
    expect(p3?.rap_apos_reducao).toBe('800')
    expect(p3?.fluxo_atribuivel).toBe('800')
  })
})

describe('participação parcial reduz o valor atribuível e não a RAP', () => {
  it('a RAP fica cheia e o fluxo atribuível é a fração informada', () => {
    const r = calcularFcffPorConcessao(CARTEIRA_ESCALONADA)
    const c = porNome(r, 'CONCESSAO-EM-CONSORCIO')
    // RAP bruta 4000, deduções 0.2, líquida 3200, participação 0.25
    expect(c.rap_liquida_ciclo_atual).toBe('3200')
    expect(c.percentual_participacao).toBe('0.25')
    const p1 = c.periodos.find((p) => p.periodo === 1)
    expect(p1?.rap_apos_reducao).toBe('3200')
    expect(p1?.fluxo_atribuivel).toBe('800')
  })
})

describe('R-001 e R-003, perpetuidade zero e residual zero', () => {
  it('a perpetuidade sai explícita como zero, para a regra ficar auditável', () => {
    expect(calcularFcffPorConcessao(CARTEIRA_ESCALONADA).valor_perpetuidade).toBe('0')
  })

  it('o valor residual de toda concessão é zero', () => {
    const r = calcularFcffPorConcessao(CARTEIRA_ESCALONADA)
    expect(r.concessoes.map((c) => c.valor_residual)).toEqual(['0', '0', '0'])
  })

  it('sem indenização informada, o total é a soma dos fluxos e nada mais', () => {
    const r = calcularFcffPorConcessao(CARTEIRA_ESCALONADA)
    expect(r.indenizacao_rab_estimada).toBeNull()
    expect(r.indenizacao_descontada).toBe('0')
    expect(r.valor_presente_total).toBe(r.valor_presente_das_concessoes)
  })

  it('com indenização informada, ela entra descontada e identificada', () => {
    const r = calcularFcffPorConcessao({ ...CONCESSAO_UNICA, indenizacao_rab_estimada: '1331' })
    expect(r.indenizacao_rab_estimada).toBe('1331')
    expect(r.periodo_da_indenizacao).toBe(3)
    // 1331 descontado a 10% por 3 períodos dá exatamente 1000
    expect(r.indenizacao_descontada).toBe('1000')
    expect(r.valor_presente_total).toBe('3238.166791885800150262960180315553')
    expect(r.concessoes.every((c) => c.valor_residual === '0')).toBe(true)
  })
})

describe('RF-420, horizonte informado que excede o fato derivado é bloqueado', () => {
  it('bloqueia com erro de regra dura nomeando a regra e a concessão', () => {
    expect(() =>
      calcularFcffPorConcessao({ ...CONCESSAO_UNICA, horizonte_maximo_anos: 5 }),
    ).toThrow(ErroDeRegraDura)
    try {
      calcularFcffPorConcessao({ ...CONCESSAO_UNICA, horizonte_maximo_anos: 5 })
    } catch (erro) {
      expect((erro as ErroDeRegraDura).regra).toBe('R-002')
      expect((erro as Error).message).toContain('RF-420')
      expect((erro as Error).message).toContain('CONCESSAO-A')
    }
  })

  it('horizonte informado dentro do derivado trunca em vez de bloquear', () => {
    const r = calcularFcffPorConcessao({ ...CONCESSAO_UNICA, horizonte_maximo_anos: 2 })
    expect(porNome(r, 'CONCESSAO-A').periodos_projetados).toBe(2)
  })
})

describe('casos de borda que a estrutura precisa aguentar', () => {
  it('carteira vazia devolve zero sem quebrar', () => {
    const r = calcularFcffPorConcessao(CARTEIRA_VAZIA)
    expect(r.concessoes).toEqual([])
    expect(r.valor_presente_das_concessoes).toBe('0')
    expect(r.valor_presente_total).toBe('0')
  })

  it('nome de concessão duplicado é recusado, senão o resultado não é rastreável por nome', () => {
    const duplicada = {
      ...CONCESSAO_UNICA,
      concessoes: [CONCESSAO_UNICA.concessoes[0]!, CONCESSAO_UNICA.concessoes[0]!],
    }
    expect(() => calcularFcffPorConcessao(duplicada)).toThrow(ErroDeRegraDura)
  })

  it('taxa de desconto que zera o denominador é recusada', () => {
    expect(() =>
      calcularFcffPorConcessao({ ...CONCESSAO_UNICA, taxa_desconto: '-1' }),
    ).toThrow(RangeError)
  })

  it('number em campo financeiro é recusado pelo schema de entrada', () => {
    expect(() =>
      calcularFcffPorConcessao({ ...CONCESSAO_UNICA, taxa_desconto: 0.1 as unknown as string }),
    ).toThrow()
  })
})

describe('RF-502, os dois schemas existem e o resultado se valida contra o de saída', () => {
  it('entrada e saída têm schema, e o resultado passa pelo schema de saída', () => {
    expect(EntradaFcffPorConcessao.safeParse(CARTEIRA_ESCALONADA).success).toBe(true)
    const r = calcularFcffPorConcessao(CARTEIRA_ESCALONADA)
    expect(ResultadoFcffPorConcessao.safeParse(r).success).toBe(true)
  })
})

describe('a saída sobrevive a virar snapshot', () => {
  it('round trip por JSON devolve estrutura idêntica', () => {
    const r = calcularFcffPorConcessao(CARTEIRA_ESCALONADA)
    expect(JSON.parse(JSON.stringify(r))).toEqual(r)
  })

  it('nenhum number na saída fora das contagens de período declaradas', () => {
    const CONTAGENS = new Set(['periodo', 'periodos_projetados', 'periodo_da_indenizacao'])
    const r = calcularFcffPorConcessao({
      ...CARTEIRA_ESCALONADA,
      indenizacao_rab_estimada: '500',
    })
    const numerosIndevidos: string[] = []
    const varrer = (no: unknown, caminho: string): void => {
      if (typeof no === 'number') {
        const chave = caminho.split('.').pop() ?? ''
        if (!CONTAGENS.has(chave)) numerosIndevidos.push(caminho)
        return
      }
      if (Array.isArray(no)) {
        no.forEach((item, i) => varrer(item, `${caminho}.${i}`))
        return
      }
      if (typeof no === 'object' && no !== null) {
        for (const [k, v] of Object.entries(no)) varrer(v, `${caminho}.${k}`)
      }
    }
    varrer(r, 'raiz')
    expect(numerosIndevidos).toEqual([])
  })

  it('cada etapa é identificável por nome, sem depender de posição em array', () => {
    const r = calcularFcffPorConcessao(CARTEIRA_ESCALONADA)
    // embaralhar a ordem não muda o que se consegue ler
    const embaralhado = { ...r, concessoes: [...r.concessoes].reverse() }
    expect(embaralhado.concessoes.find((c) => c.nome === 'CONCESSAO-CURTA')?.periodos_projetados).toBe(2)
    for (const c of r.concessoes) {
      expect(new Set(c.periodos.map((p) => p.periodo)).size).toBe(c.periodos.length)
    }
  })
})

describe('RNF-003, determinismo', () => {
  it('a mesma entrada devolve saída idêntica em execuções repetidas', () => {
    const execucoes = [1, 2, 3].map(() =>
      JSON.stringify(calcularFcffPorConcessao(CARTEIRA_ESCALONADA)),
    )
    expect(new Set(execucoes).size).toBe(1)
  })
})

describe('lacunas que o mutation testing achou, cada uma com o mutante que a expôs', () => {
  it('horizonte igual ao derivado passa, só o maior bloqueia', () => {
    // mutante: trocar > por >= na comparação do horizonte, que bloquearia o caso igual
    const r = calcularFcffPorConcessao({ ...CONCESSAO_UNICA, horizonte_maximo_anos: 3 })
    expect(porNome(r, 'CONCESSAO-A').periodos_projetados).toBe(3)
  })

  it('o período da indenização é o maior prazo, e não o da última concessão da lista', () => {
    // mutante: assinalar maiorPeriodo sem comparar, que daria o prazo da última
    const r = calcularFcffPorConcessao(MAIS_LONGA_PRIMEIRO)
    expect(porNome(r, 'CONCESSAO-LONGA').periodos_projetados).toBe(5)
    expect(porNome(r, 'CONCESSAO-BREVE').periodos_projetados).toBe(2)
    expect(r.periodo_da_indenizacao).toBe(5)
    // 1000 descontado a 10% por 5 períodos
    expect(r.indenizacao_descontada).toBe('620.9213230591551744478457134696463')
  })

  it('reducao_contratual omitida e reducao_contratual null se comportam igual', () => {
    // mutante: descartar a checagem de undefined, que quebraria no campo omitido
    const r = calcularFcffPorConcessao(MAIS_LONGA_PRIMEIRO)
    const breve = porNome(r, 'CONCESSAO-BREVE')
    expect(breve.periodos.every((p) => p.fator_reducao_contratual === '1')).toBe(true)
  })

  it('indenizacao_rab_estimada em null explícito é o mesmo que ausente', () => {
    // mutante: descartar a checagem de null, que tentaria ler o valor ausente
    const r = calcularFcffPorConcessao({ ...CONCESSAO_UNICA, indenizacao_rab_estimada: null })
    expect(r.indenizacao_rab_estimada).toBeNull()
    expect(r.indenizacao_descontada).toBe('0')
    expect(r.periodo_da_indenizacao).toBeNull()
  })

  it('data com lixo depois do dia é recusada, a âncora do fim da expressão importa', () => {
    // mutante: remover o $ do padrão de data, que aceitaria sufixo
    expect(() =>
      calcularFcffPorConcessao({ ...CONCESSAO_UNICA, data_base: '2026-01-01-lixo' }),
    ).toThrow()
  })

  it('nome só com espaço é recusado, o trim importa', () => {
    // mutante: remover o trim, que deixaria "   " passar pelo min(1)
    const comEspaco = {
      ...CONCESSAO_UNICA,
      concessoes: [{ ...CONCESSAO_UNICA.concessoes[0]!, nome: '   ' }],
    }
    expect(() => calcularFcffPorConcessao(comEspaco)).toThrow()
  })
})
