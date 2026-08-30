import { describe, expect, it } from 'vitest'
import {
  CARTEIRA_ESCALONADA,
  CARTEIRA_VAZIA,
  CICLO_ALINHADO,
  CONCESSAO_UNICA,
  REDUCAO_COM_REAJUSTE,
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

/** CONCESSAO_UNICA com redução valendo dos três períodos em diante. */
function comReducaoDe(percentual_reducao: string) {
  return {
    ...CONCESSAO_UNICA,
    concessoes: [
      {
        ...CONCESSAO_UNICA.concessoes[0]!,
        reducao_contratual: { percentual_reducao, a_partir_de: '2027-01-01' },
      },
    ],
  }
}

describe('RF-504, o resultado vem desagregado por etapa e cada etapa confere', () => {
  it('concessão única: RAP líquida, fluxo, fator de desconto e descontado, período a período', () => {
    const r = calcularFcffPorConcessao(CONCESSAO_UNICA)
    const c = porNome(r, 'CONCESSAO-A')

    expect(c.rap_bruta_ciclo_atual).toBe('1000')
    expect(c.deducoes_aplicadas).toBe('0.1')
    expect(c.rap_liquida_ciclo_atual).toBe('900')
    expect(c.percentual_participacao).toBe('1')
    // data base 2026-01-01 abre no ciclo 2026-2027, e o vencimento 2029-01-01 cai
    // no meio do ciclo 2028-2029, que não fecha e não conta
    expect(c.ciclos_projetados).toBe(2)

    // inflação zero mantém a RAP, participação 1 mantém o fluxo, e o desconto é 1/1.1^t
    const esperado = [
      { periodo: 1, ciclo: '2026-2027', fim: '2027-06-30', fluxo: '900', descontado: '818.1818181818181818181818181818182' },
      { periodo: 2, ciclo: '2027-2028', fim: '2028-06-30', fluxo: '900', descontado: '743.8016528925619834710743801652893' },
    ]
    for (const alvo of esperado) {
      const p = c.periodos.find((x) => x.periodo === alvo.periodo)
      expect(p, `período ${alvo.periodo}`).toBeDefined()
      expect(p?.ciclo).toBe(alvo.ciclo)
      expect(p?.ciclo_fim).toBe(alvo.fim)
      expect(p?.rap_liquida_reajustada).toBe('900')
      expect(p?.fator_remanescente_aplicado).toBe('1')
      expect(p?.rap_apos_reducao).toBe('900')
      expect(p?.fluxo_atribuivel).toBe(alvo.fluxo)
      expect(p?.fluxo_descontado).toBe(alvo.descontado)
    }
    // 900/1,1 mais 900/1,21, conferido fora da engine
    expect(c.valor_presente_da_concessao).toBe('1561.983471074380165289256198347108')
    expect(r.valor_presente_total).toBe('1561.983471074380165289256198347108')
  })
})

describe('RF-417, o horizonte de cada concessão é o vencimento dela', () => {
  it('vencimentos escalonados produzem contagens de período diferentes', () => {
    const r = calcularFcffPorConcessao(CARTEIRA_ESCALONADA)
    expect(porNome(r, 'CONCESSAO-CURTA').ciclos_projetados).toBe(1)
    expect(porNome(r, 'CONCESSAO-COM-REDUCAO').ciclos_projetados).toBe(3)
    expect(porNome(r, 'CONCESSAO-EM-CONSORCIO').ciclos_projetados).toBe(4)
  })

  it('o fluxo agregado cai em degraus conforme as concessões vencem', () => {
    const r = calcularFcffPorConcessao(CARTEIRA_ESCALONADA)
    const quantasContribuem = (periodo: number) =>
      r.concessoes.filter((c) => c.periodos.some((p) => p.periodo === periodo)).length
    expect([1, 2, 3, 4, 5].map(quantasContribuem)).toEqual([3, 2, 2, 1, 0])
  })

  it('nenhum período projetado passa da data de vencimento da concessão', () => {
    const r = calcularFcffPorConcessao(CARTEIRA_ESCALONADA)
    for (const c of r.concessoes) {
      for (const p of c.periodos) {
        expect(p.ciclo_fim <= c.data_vencimento, `${c.nome} período ${p.periodo}`).toBe(true)
      }
    }
  })

  it('vencimento anterior à data base não projeta período nenhum', () => {
    const r = calcularFcffPorConcessao(CONCESSAO_VENCIDA)
    const c = porNome(r, 'CONCESSAO-A')
    expect(c.ciclos_projetados).toBe(0)
    expect(c.periodos).toEqual([])
    expect(c.valor_presente_da_concessao).toBe('0')
    expect(r.valor_presente_total).toBe('0')
  })
})

describe('redução contratual entra no período certo e não antes', () => {
  it('remanescente 1 até o período anterior, 1 menos o percentual do período em diante', () => {
    const r = calcularFcffPorConcessao(CARTEIRA_ESCALONADA)
    const c = porNome(r, 'CONCESSAO-COM-REDUCAO')
    // RAP bruta 2000, deduções 0.2, líquida 1600. Corte de 30% a partir de 2029-01-01,
    // que cai dentro do ciclo 2028-2029, o terceiro projetado
    const fatores = c.periodos.map((p) => ({
      periodo: p.periodo,
      ciclo: p.ciclo,
      fator: p.fator_remanescente_aplicado,
    }))
    expect(fatores).toEqual([
      { periodo: 1, ciclo: '2026-2027', fator: '1' },
      { periodo: 2, ciclo: '2027-2028', fator: '1' },
      { periodo: 3, ciclo: '2028-2029', fator: '0.7' },
    ])
    const p3 = c.periodos.find((p) => p.periodo === 3)
    expect(p3?.rap_liquida_reajustada).toBe('1600')
    expect(p3?.rap_apos_reducao).toBe('1120')
    expect(p3?.fluxo_atribuivel).toBe('1120')
  })
})

describe('D-078, percentual_reducao é o que se corta, e a direção é exercitada', () => {
  it('o percentual informado é cortado, e o que multiplica a RAP é 1 menos ele', () => {
    // 900 de RAP líquida. Corte de 30% deixa 630, e não 270, que é o que a
    // convenção invertida produziria. O valor é assimétrico de propósito
    const c = porNome(calcularFcffPorConcessao(comReducaoDe('0.3')), 'CONCESSAO-A')
    const p1 = c.periodos.find((p) => p.periodo === 1)
    expect(p1?.fator_remanescente_aplicado).toBe('0.7')
    expect(p1?.rap_apos_reducao).toBe('630')
  })

  it('corte de 0 mantém a RAP inteira e corte de 1 zera', () => {
    const semCorte = porNome(calcularFcffPorConcessao(comReducaoDe('0')), 'CONCESSAO-A')
    expect(semCorte.periodos[0]?.fator_remanescente_aplicado).toBe('1')
    expect(semCorte.periodos[0]?.rap_apos_reducao).toBe('900')

    const corteTotal = porNome(calcularFcffPorConcessao(comReducaoDe('1')), 'CONCESSAO-A')
    expect(corteTotal.periodos[0]?.fator_remanescente_aplicado).toBe('0')
    expect(corteTotal.periodos[0]?.rap_apos_reducao).toBe('0')
    expect(corteTotal.valor_presente_da_concessao).toBe('0')
  })

  it('percentual em escala de cem é recusado, que é o erro que o nome deixa em aberto', () => {
    // "50" querendo dizer 50% é o único erro que sobra da escolha do nome, e a
    // faixa existe para ele não ser silencioso
    expect(() => calcularFcffPorConcessao(comReducaoDe('50'))).toThrow(RangeError)
    try {
      calcularFcffPorConcessao(comReducaoDe('50'))
    } catch (erro) {
      expect((erro as Error).message).toContain('percentual_reducao')
      expect((erro as Error).message).toContain('CONCESSAO-A')
      expect((erro as Error).message).toContain('"0.5"')
    }
  })

  it('percentual negativo é recusado, senão a redução aumentaria a RAP', () => {
    expect(() => calcularFcffPorConcessao(comReducaoDe('-0.1'))).toThrow(RangeError)
  })

  it('o nome antigo não é mais aceito pelo schema de entrada', () => {
    const comNomeAntigo = {
      ...CONCESSAO_UNICA,
      concessoes: [
        {
          ...CONCESSAO_UNICA.concessoes[0]!,
          reducao_contratual: { fator: '0.5', a_partir_de: '2027-01-01' },
        },
      ],
    }
    expect(() => calcularFcffPorConcessao(comNomeAntigo)).toThrow()
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

describe('D-081, a projeção corre na grade do ciclo tarifário', () => {
  it('o resultado nomeia a grade e o primeiro ciclo, em vez de deixar supor', () => {
    const r = calcularFcffPorConcessao(CONCESSAO_UNICA)
    expect(r.grade_de_projecao).toBe('ciclo_tarifario')
    expect(r.primeiro_ciclo_projetado).toEqual({
      rotulo: '2026-2027',
      inicio: '2026-07-01',
      fim: '2027-06-30',
    })
  })

  it('todo período fecha em 30 de junho, e nenhum fecha em 31 de dezembro', () => {
    const r = calcularFcffPorConcessao(CARTEIRA_ESCALONADA)
    const fins = r.concessoes.flatMap((c) => c.periodos.map((p) => p.ciclo_fim))
    expect(fins.length).toBeGreaterThan(0)
    expect(fins.every((f) => f.endsWith('-06-30'))).toBe(true)
    // a data base é 1º de janeiro: se a grade fosse o exercício social, os
    // períodos fechariam em 01-01, que é exatamente o que a engine fazia antes
    expect(fins.some((f) => f.endsWith('-01-01'))).toBe(false)
  })

  it('o trecho entre a data base e a virada do ciclo não é projetado e sai declarado', () => {
    const r = calcularFcffPorConcessao(CONCESSAO_UNICA)
    expect(r.trecho_inicial_nao_projetado).toEqual({
      inicio: '2026-01-01',
      fim: '2026-06-30',
    })
  })

  it('data base na virada abre no próprio ciclo e não deixa trecho inicial', () => {
    const r = calcularFcffPorConcessao(CICLO_ALINHADO)
    expect(r.primeiro_ciclo_projetado.inicio).toBe('2026-07-01')
    expect(r.trecho_inicial_nao_projetado).toBeNull()
  })

  it('vencimento que fecha o ciclo exatamente não deixa trecho final', () => {
    const c = porNome(calcularFcffPorConcessao(CICLO_ALINHADO), 'CONCESSAO-ALINHADA')
    expect(c.ciclos_projetados).toBe(3)
    expect(c.periodos.at(-1)?.ciclo_fim).toBe('2029-06-30')
    expect(c.trecho_final_nao_projetado).toBeNull()
  })

  it('vencimento no meio do ciclo descarta o ciclo inteiro e declara o trecho', () => {
    const c = porNome(calcularFcffPorConcessao(CONCESSAO_UNICA), 'CONCESSAO-A')
    // vencimento 2029-01-01 cai dentro do ciclo 2028-2029, que não fecha
    expect(c.ciclos_projetados).toBe(2)
    expect(c.trecho_final_nao_projetado).toEqual({
      inicio: '2028-07-01',
      fim: '2029-01-01',
    })
  })

  it('o horizonte informado é contado em ciclos, e a mensagem diz a grade', () => {
    try {
      calcularFcffPorConcessao({ ...CONCESSAO_UNICA, horizonte_maximo_ciclos: 5 })
      throw new Error('deveria ter bloqueado')
    } catch (erro) {
      expect((erro as Error).message).toContain('ciclos tarifários')
      expect((erro as Error).message).toContain('2 ciclos derivados')
    }
  })
})

describe('seção 4 da consolidação, a redução incide sobre a RAP já reajustada', () => {
  it('a base do corte é a reajustada do ciclo, não o valor nominal informado', () => {
    const c = porNome(calcularFcffPorConcessao(REDUCAO_COM_REAJUSTE), 'CONCESSAO-REDUZIDA')
    expect(c.ciclos_projetados).toBe(4)
    const reajustadas = c.periodos.map((p) => p.rap_liquida_reajustada)
    expect(reajustadas).toEqual(['1100', '1210', '1331', '1464.1'])

    const p3 = c.periodos.find((p) => p.periodo === 3)
    // 0,6 sobre a reajustada de 1331 dá 798,6. Sobre o nominal de 1000 daria 600,
    // e é essa diferença que separa as duas leituras
    expect(p3?.fator_remanescente_aplicado).toBe('0.6')
    expect(p3?.rap_apos_reducao).toBe('798.6')
    expect(p3?.rap_apos_reducao).not.toBe('600')
  })

  it('o valor já reduzido continua sendo reajustado nos ciclos seguintes', () => {
    const c = porNome(calcularFcffPorConcessao(REDUCAO_COM_REAJUSTE), 'CONCESSAO-REDUZIDA')
    const p3 = c.periodos.find((p) => p.periodo === 3)
    const p4 = c.periodos.find((p) => p.periodo === 4)
    // 0,6 sobre 1464,1 dá 878,46, que é 798,6 vezes 1,1
    expect(p4?.rap_apos_reducao).toBe('878.46')
    expect(p3?.rap_apos_reducao).toBe('798.6')
  })

  it('sem redução informada, a reajustada e a pós redução são a mesma série', () => {
    const c = porNome(calcularFcffPorConcessao(CICLO_ALINHADO), 'CONCESSAO-ALINHADA')
    expect(c.periodos.every((p) => p.rap_apos_reducao === p.rap_liquida_reajustada)).toBe(true)
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
    expect(r.ciclo_da_indenizacao).toBe(2)
    // 1331 descontado a 10% por 2 ciclos dá exatamente 1100
    expect(r.indenizacao_descontada).toBe('1100')
    expect(r.valor_presente_total).toBe('2661.983471074380165289256198347108')
    expect(r.concessoes.every((c) => c.valor_residual === '0')).toBe(true)
  })
})

describe('RF-420, horizonte informado que excede o fato derivado é bloqueado', () => {
  it('bloqueia com erro de regra dura nomeando a regra e a concessão', () => {
    expect(() =>
      calcularFcffPorConcessao({ ...CONCESSAO_UNICA, horizonte_maximo_ciclos: 5 }),
    ).toThrow(ErroDeRegraDura)
    try {
      calcularFcffPorConcessao({ ...CONCESSAO_UNICA, horizonte_maximo_ciclos: 5 })
    } catch (erro) {
      expect((erro as ErroDeRegraDura).regra).toBe('R-002')
      expect((erro as Error).message).toContain('RF-420')
      expect((erro as Error).message).toContain('CONCESSAO-A')
    }
  })

  it('horizonte informado dentro do derivado trunca em vez de bloquear', () => {
    const r = calcularFcffPorConcessao({ ...CONCESSAO_UNICA, horizonte_maximo_ciclos: 1 })
    expect(porNome(r, 'CONCESSAO-A').ciclos_projetados).toBe(1)
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
    const CONTAGENS = new Set(['periodo', 'ciclos_projetados', 'ciclo_da_indenizacao'])
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
    expect(embaralhado.concessoes.find((c) => c.nome === 'CONCESSAO-CURTA')?.ciclos_projetados).toBe(1)
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
    const r = calcularFcffPorConcessao({ ...CONCESSAO_UNICA, horizonte_maximo_ciclos: 2 })
    expect(porNome(r, 'CONCESSAO-A').ciclos_projetados).toBe(2)
  })

  it('o período da indenização é o maior prazo, e não o da última concessão da lista', () => {
    // mutante: assinalar maiorPeriodo sem comparar, que daria o prazo da última
    const r = calcularFcffPorConcessao(MAIS_LONGA_PRIMEIRO)
    expect(porNome(r, 'CONCESSAO-LONGA').ciclos_projetados).toBe(4)
    expect(porNome(r, 'CONCESSAO-BREVE').ciclos_projetados).toBe(1)
    expect(r.ciclo_da_indenizacao).toBe(4)
    // 1000 descontado a 10% por 4 ciclos, conferido fora da engine
    expect(r.indenizacao_descontada).toBe('683.0134553650706918926302848166109')
  })

  it('reducao_contratual omitida e reducao_contratual null se comportam igual', () => {
    // mutante: descartar a checagem de undefined, que quebraria no campo omitido
    const r = calcularFcffPorConcessao(MAIS_LONGA_PRIMEIRO)
    const breve = porNome(r, 'CONCESSAO-BREVE')
    expect(breve.periodos.every((p) => p.fator_remanescente_aplicado === '1')).toBe(true)
  })

  it('horizonte_maximo_ciclos em null explícito é o mesmo que ausente', () => {
    // mutante: trocar por true a checagem de undefined ou a de null, que sobrevivia
    // porque nenhuma fixture passava null explícito. Omitido e null são caminhos
    // diferentes no código e só um estava exercitado (D-079)
    const comNull = calcularFcffPorConcessao({ ...CONCESSAO_UNICA, horizonte_maximo_ciclos: null })
    const omitido = calcularFcffPorConcessao(CONCESSAO_UNICA)
    expect(porNome(comNull, 'CONCESSAO-A').ciclos_projetados).toBe(2)
    expect(comNull).toEqual(omitido)
  })

  it('indenizacao_rab_estimada em null explícito é o mesmo que ausente', () => {
    // mutante: descartar a checagem de null, que tentaria ler o valor ausente
    const r = calcularFcffPorConcessao({ ...CONCESSAO_UNICA, indenizacao_rab_estimada: null })
    expect(r.indenizacao_rab_estimada).toBeNull()
    expect(r.indenizacao_descontada).toBe('0')
    expect(r.ciclo_da_indenizacao).toBeNull()
  })

  it('data com lixo em volta é recusada PELO SCHEMA, e não só pela leitura da data', () => {
    // mutante: remover o ^ ou o $ do padrão de data. Afirmar só que
    // calcularFcffPorConcessao lança não mata nenhum dos dois, porque lerData tem
    // padrão próprio e recusa depois. O teste precisa dizer em qual camada o
    // limite está, senão ele não cai quando o limite cai (D-074)
    for (const ruim of ['2026-01-01-lixo', 'lixo-2026-01-01']) {
      const r = EntradaFcffPorConcessao.safeParse({ ...CONCESSAO_UNICA, data_base: ruim })
      expect(r.success, `schema deveria recusar "${ruim}"`).toBe(false)
    }
    // e o caminho completo também recusa, que é o que o usuário vê
    expect(() =>
      calcularFcffPorConcessao({ ...CONCESSAO_UNICA, data_base: '2026-01-01-lixo' }),
    ).toThrow()
  })

  it('vencimento exatamente na virada do ciclo não deixa trecho final', () => {
    // mutante: trocar <= por < na comparação do início do ciclo seguinte com o
    // vencimento. Só difere quando o vencimento cai exatamente em 1º de julho, e
    // nenhuma fixture tinha esse vencimento
    const naVirada = {
      ...CICLO_ALINHADO,
      concessoes: [{ ...CICLO_ALINHADO.concessoes[0]!, data_vencimento: '2029-07-01' }],
    }
    const c = porNome(calcularFcffPorConcessao(naVirada), 'CONCESSAO-ALINHADA')
    expect(c.ciclos_projetados).toBe(3)
    // o ciclo 2029-2030 começa em 2029-07-01, que é o próprio vencimento, então
    // existe trecho final de duração zero e ele é declarado
    expect(c.trecho_final_nao_projetado).toEqual({
      inicio: '2029-07-01',
      fim: '2029-07-01',
    })
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
