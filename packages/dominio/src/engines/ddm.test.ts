import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { Rate } from '@valuation/shared'
import { describe, expect, it } from 'vitest'
import { ErroDeRegraDura } from '../erros'
import { EntradaDdm, ResultadoDdm, VERSAO_ENGINE_DDM, calcularDdm } from './ddm'
import { BANCO_TRES_ANOS, bancoTresAnos } from './ddm.fixtures'

/** Igualdade numérica: o decimal.js não guarda zero à direita, o Python guarda. */
function igual(obtido: string | null | undefined, esperado: string): void {
  expect(obtido, `esperava ${esperado}`).not.toBeNull()
  expect(
    Rate.de(obtido as string, 'obtido').igual(Rate.de(esperado, 'esperado')),
    `obtido ${obtido}, esperado ${esperado}`,
  ).toBe(true)
}

function ano(r: ResultadoDdm, n: number) {
  const achado = r.anos.find((a) => a.ano === n)
  if (achado === undefined) throw new Error(`ano ${n} não está no resultado`)
  return achado
}

describe('RF-504 e D-114, cada ano sai desagregado e cada etapa confere', () => {
  const r = calcularDdm(BANCO_TRES_ANOS)

  it('ano 1: retenção negativa, dividendo maior que o lucro, nenhum aporte', () => {
    const a = ano(r, 1)
    igual(a.pl_inicio, '100')
    igual(a.rwa_fim, '840')
    igual(a.lucro, '15')
    igual(a.capital_exigido, '92.4')
    igual(a.retencao, '-7.6')
    igual(a.dividendo, '22.6')
    igual(a.payout, '1.506666666666666666666666666666667')
    expect(a.aporte_implicito).toBe(false)
    igual(a.pl_fim, '92.4')
    igual(a.fator_desconto, '0.8849557522123893805309734513274336')
    igual(a.dividendo_descontado, '20')
  })

  it('ano 2: a retenção passa do lucro, e o dividendo negativo é mantido como aporte (D-121)', () => {
    const a = ano(r, 2)
    igual(a.pl_inicio, '92.4')
    igual(a.rwa_fim, '907.2')
    igual(a.lucro, '15.708')
    igual(a.capital_exigido, '108.864')
    igual(a.retencao, '16.464')
    igual(a.dividendo, '-0.756')
    expect(a.aporte_implicito).toBe(true)
    // lucro positivo, então o payout existe, e sai negativo
    igual(a.payout, '-0.04812834224598930481283422459893048')
    igual(a.dividendo_descontado, '-0.5920588926305897094525804683217167')
  })

  it('ano 3: payout comum', () => {
    const a = ano(r, 3)
    igual(a.pl_inicio, '108.864')
    igual(a.rwa_fim, '961.632')
    igual(a.lucro, '13.06368')
    igual(a.capital_exigido, '115.39584')
    igual(a.dividendo, '6.53184')
    igual(a.payout, '0.5')
    igual(a.fator_desconto, '0.6930501622776954973224006980401235')
  })

  it('o PL do fim de cada ano é o capital exigido daquele ano, e vira o PL do início do seguinte', () => {
    for (const a of r.anos) igual(a.pl_fim, a.capital_exigido)
    igual(ano(r, 2).pl_inicio, ano(r, 1).pl_fim)
    igual(ano(r, 3).pl_inicio, ano(r, 2).pl_fim)
  })

  it('cada ano devolve as premissas que aplicou, para a conta ser refeita sem o código', () => {
    expect(r.anos.map((a) => a.roe_aplicado)).toEqual(['0.15', '0.17', '0.12'])
    expect(r.anos.map((a) => a.crescimento_rwa_aplicado)).toEqual(['0.05', '0.08', '0.06'])
    expect(r.anos.map((a) => a.basileia_alvo_aplicada)).toEqual(['0.11', '0.12', '0.12'])
  })

  it('perpetuidade: lucro sobre o PL do fim, retenção g vezes esse PL, valor terminal', () => {
    const p = r.perpetuidade
    igual(p.pl_base, '115.39584')
    igual(p.lucro_primeiro_ano, '16.1554176')
    igual(p.retencao_primeiro_ano, '4.6158336')
    igual(p.dividendo_primeiro_ano, '11.539584')
    igual(p.valor_terminal_no_horizonte, '128.2176')
    igual(p.valor_terminal_descontado, '88.86122848685665019748464374102934')
    igual(p.fator_desconto, ano(r, 3).fator_desconto)
  })

  it('totais, por ação e por unit', () => {
    igual(r.valor_presente_dividendos, '23.93483387934135284777776930716468')
    igual(r.valor_do_patrimonio, '112.7960623661980030452624130481940')
    expect(r.acoes_em_circulacao).toBe('960')
    igual(r.valor_por_acao, '0.1174958982981229198388150135918688')
    expect(r.acoes_por_unit).toBe(3)
    igual(r.valor_por_unit, '0.3524876948943687595164450407756064')
  })
})

describe('D-114, o payout da perpetuidade é 1 menos g sobre o ROE da perpetuidade', () => {
  it('sai como consequência, sem ser entrada', () => {
    const r = calcularDdm(BANCO_TRES_ANOS)
    const um = Rate.de('1', 'um')
    const esperado = um.subtrai(Rate.de('0.04', 'g').divididoPor(Rate.de('0.14', 'roe'), 'roe'))
    igual(r.perpetuidade.payout, esperado.paraArmazenamento())
    igual(r.perpetuidade.payout, '0.7142857142857142857142857142857143')
  })

  it('vale com outro par de g e ROE, para não ser coincidência da fixture', () => {
    const entrada = bancoTresAnos()
    entrada['crescimento_perpetuidade'] = '0.05'
    entrada['roe_sustentavel_projetado'] = '0.2'
    igual(calcularDdm(entrada).perpetuidade.payout, '0.75')
  })
})

describe('premissa C2, payout sem lucro positivo sai nulo com o motivo', () => {
  it('lucro zero: payout nulo, dividendo e retenção calculados', () => {
    const entrada = bancoTresAnos()
    entrada['roe_projetado_por_ano'] = ['0', '0.17', '0.12']
    const a = ano(calcularDdm(entrada), 1)
    igual(a.lucro, '0')
    expect(a.payout).toBeNull()
    expect(a.payout_indefinido_porque).toBe('lucro_zero')
    igual(a.dividendo, '7.6')
  })

  it('lucro negativo: payout nulo, e não um número com sinal sem sentido', () => {
    const entrada = bancoTresAnos()
    entrada['roe_projetado_por_ano'] = ['-0.05', '0.17', '0.12']
    const a = ano(calcularDdm(entrada), 1)
    igual(a.lucro, '-5')
    expect(a.payout).toBeNull()
    expect(a.payout_indefinido_porque).toBe('lucro_negativo')
    igual(a.dividendo, '2.6')
  })

  it('com lucro positivo o motivo é nulo', () => {
    for (const a of calcularDdm(BANCO_TRES_ANOS).anos) expect(a.payout_indefinido_porque).toBeNull()
  })

  it('a perpetuidade segue a mesma regra', () => {
    const entrada = bancoTresAnos()
    entrada['roe_sustentavel_projetado'] = '0'
    entrada['crescimento_perpetuidade'] = '-0.01'
    const p = calcularDdm(entrada).perpetuidade
    expect(p.payout).toBeNull()
    expect(p.payout_indefinido_porque).toBe('lucro_zero')
    entrada['roe_sustentavel_projetado'] = '-0.02'
    expect(calcularDdm(entrada).perpetuidade.payout_indefinido_porque).toBe('lucro_negativo')
  })

  it('dividendo negativo na perpetuidade também sai marcado', () => {
    const entrada = bancoTresAnos()
    entrada['roe_sustentavel_projetado'] = '0.03'
    const p = calcularDdm(entrada).perpetuidade
    expect(p.aporte_implicito).toBe(true)
    expect(calcularDdm(BANCO_TRES_ANOS).perpetuidade.aporte_implicito).toBe(false)
  })
})

describe('D-114 e D-116, lista por ano com tamanho do horizonte é estrutura de entrada', () => {
  for (const campo of ['roe_projetado_por_ano', 'crescimento_rwa', 'basileia_alvo']) {
    it(`${campo} curta é recusada, e não completada com o último valor`, () => {
      const entrada = bancoTresAnos()
      entrada[campo] = (entrada[campo] as string[]).slice(0, 2)
      const r = EntradaDdm.safeParse(entrada)
      expect(r.success).toBe(false)
      expect(r.error?.issues[0]?.message).toContain(`D-114, D-116: ${campo} tem 2 valores`)
      expect(r.error?.issues[0]?.path).toEqual([campo])
      expect(() => calcularDdm(entrada)).toThrow()
    })

    it(`${campo} longa é recusada, e não cortada`, () => {
      const entrada = bancoTresAnos()
      entrada[campo] = [...(entrada[campo] as string[]), '0.1']
      expect(EntradaDdm.safeParse(entrada).error?.issues[0]?.message).toContain('tem 4 valores')
    })
  }

  it('não é regra dura: o erro é de estrutura, não ErroDeRegraDura', () => {
    const entrada = bancoTresAnos()
    entrada['basileia_alvo'] = ['0.11']
    expect(() => calcularDdm(entrada)).not.toThrow(ErroDeRegraDura)
  })
})

describe('entrada: campos que a engine não aceita e valores que não fecham', () => {
  it('inputs só de diagnóstico do playbook são recusados, e não aceitos e ignorados (D-084)', () => {
    for (const campo of ['roe_historico_3a', 'indice_basileia_atual', 'npl_90_e_cobertura']) {
      const entrada = { ...bancoTresAnos(), [campo]: '0.1' }
      expect(EntradaDdm.safeParse(entrada).success, campo).toBe(false)
    }
  })

  it('number em campo financeiro é recusado (D-045)', () => {
    const entrada = { ...bancoTresAnos(), custo_capital_proprio_ke: 0.13 }
    expect(EntradaDdm.safeParse(entrada).error?.issues[0]?.message).toContain('D-045')
  })

  it('base fora de nominal e real é recusada, e não há default', () => {
    expect(EntradaDdm.safeParse({ ...bancoTresAnos(), base_nominal_ou_real: 'real_ipca' }).success).toBe(false)
    const { base_nominal_ou_real: _, ...semBase } = bancoTresAnos()
    expect(EntradaDdm.safeParse(semBase).success).toBe(false)
  })

  it('PL e RWA de partida precisam ser positivos, e o erro aponta o campo', () => {
    for (const campo of ['patrimonio_liquido_inicial', 'rwa_atual']) {
      for (const valor of ['0', '-1']) {
        const r = EntradaDdm.safeParse({ ...bancoTresAnos(), [campo]: valor })
        expect(r.error?.issues[0]?.message, `${campo} ${valor}`).toContain(`${campo}: esperava valor maior que zero`)
        expect(r.error?.issues[0]?.path).toEqual([campo])
      }
    }
  })

  it('PL que não é texto decimal não vira erro de valor positivo, e a engine recusa', () => {
    const entrada = { ...bancoTresAnos(), patrimonio_liquido_inicial: 'cem' }
    const r = EntradaDdm.safeParse(entrada)
    expect(r.success).toBe(true)
    expect(() => calcularDdm(entrada)).toThrow(/patrimonio_liquido_inicial/)
    expect(() => calcularDdm(entrada)).not.toThrow(/esperava valor maior que zero/)
  })

  it('tesouraria igual ou maior que o total é recusada', () => {
    for (const tesouraria of ['1000', '1001']) {
      const entrada = bancoTresAnos()
      entrada['acoes_ex_tesouraria'] = { quantidade_total: '1000', quantidade_tesouraria: tesouraria, composicao_unit: null }
      expect(EntradaDdm.safeParse(entrada).error?.issues[0]?.message).toContain('tesouraria precisa ser menor')
    }
  })

  it('quantidade de ações é inteiro em texto, sem decimal nem separador, nos dois campos', () => {
    for (const total of ['1000.5', '1.000', 1000]) {
      const entrada = bancoTresAnos()
      entrada['acoes_ex_tesouraria'] = { quantidade_total: total, quantidade_tesouraria: '0' }
      expect(EntradaDdm.safeParse(entrada).success, String(total)).toBe(false)
    }
    // reprova sem lançar: o refine do objeto roda com o campo quebrado e não pode
    // passar texto não inteiro para BigInt
    for (const tesouraria of ['1.000', 'a10', '10a']) {
      const entrada = bancoTresAnos()
      entrada['acoes_ex_tesouraria'] = { quantidade_total: '2000', quantidade_tesouraria: tesouraria }
      expect(() => EntradaDdm.safeParse(entrada), tesouraria).not.toThrow()
      expect(EntradaDdm.safeParse(entrada).success, tesouraria).toBe(false)
    }
  })

  it('unit vazia é recusada, e sem composição não há valor por unit', () => {
    const vazia = bancoTresAnos()
    vazia['acoes_ex_tesouraria'] = { quantidade_total: '1000', quantidade_tesouraria: '0', composicao_unit: { acoes_on: 0, acoes_pn: 0 } }
    expect(EntradaDdm.safeParse(vazia).success).toBe(false)
    for (const composicao of [null, undefined]) {
      const sem = bancoTresAnos()
      sem['acoes_ex_tesouraria'] = { quantidade_total: '1000', quantidade_tesouraria: '0', composicao_unit: composicao }
      const r = calcularDdm(sem)
      expect(r.acoes_por_unit).toBeNull()
      expect(r.valor_por_unit).toBeNull()
      igual(r.valor_por_acao, Rate.de(r.valor_do_patrimonio, 'v').divididoPor(Rate.de('1000', 'n'), 'n').paraArmazenamento())
    }
  })

  it('horizonte precisa ser inteiro positivo', () => {
    for (const h of [0, -1, 2.5]) {
      expect(EntradaDdm.safeParse({ ...bancoTresAnos(), horizonte_anos: h }).success, String(h)).toBe(false)
    }
  })

  it('a engine sozinha recusa g maior ou igual a Ke por aritmética, sem regra dura', () => {
    // quem bloqueia com regra dura é o R-104, antes da engine (D-121); aqui a guarda
    // é a do denominador, e o tipo do erro é outro, de propósito
    for (const g of ['0.13', '0.2']) {
      const entrada = { ...bancoTresAnos(), crescimento_perpetuidade: g }
      expect(() => calcularDdm(entrada)).toThrow(RangeError)
      expect(() => calcularDdm(entrada)).not.toThrow(ErroDeRegraDura)
    }
  })

  it('Ke que zera ou inverte o fator de desconto é recusado', () => {
    const entrada = { ...bancoTresAnos(), custo_capital_proprio_ke: '-1', crescimento_perpetuidade: '-2' }
    expect(() => calcularDdm(entrada)).toThrow(/um mais custo_capital_proprio_ke/)
  })
})

describe('RF-502 e D-075, a saída sobrevive a virar snapshot', () => {
  const r = calcularDdm(BANCO_TRES_ANOS)

  it('o resultado passa pelo schema de saída e declara engine, versão, base e Ke', () => {
    expect(ResultadoDdm.safeParse(r).success).toBe(true)
    expect(r.engine).toBe('ddm')
    expect(r.versao_engine).toBe(VERSAO_ENGINE_DDM)
    // literal, e não só a constante contra ela mesma: RF-505 pede versão declarada
    expect(r.versao_engine).toBe('0.1.0')
    expect(r.base_nominal_ou_real).toBe('nominal')
    expect(r.custo_capital_proprio_ke).toBe('0.13')
    expect(r.horizonte_anos).toBe(3)
  })

  it('o schema de saída aceita os dois motivos de payout indefinido', () => {
    for (const roe of ['0', '-0.05']) {
      const entrada = bancoTresAnos()
      entrada['roe_projetado_por_ano'] = [roe, '0.17', '0.12']
      expect(ResultadoDdm.safeParse(calcularDdm(entrada)).success, roe).toBe(true)
    }
  })

  it('a base da entrada chega ao resultado nas duas opções', () => {
    expect(calcularDdm({ ...bancoTresAnos(), base_nominal_ou_real: 'real' }).base_nominal_ou_real).toBe('real')
  })

  it('round trip por JSON devolve estrutura idêntica', () => {
    expect(JSON.parse(JSON.stringify(r))).toEqual(r)
  })

  it('nenhum number fora das contagens declaradas', () => {
    const permitidos = new Set(['ano', 'horizonte_anos', 'acoes_por_unit'])
    const achados: string[] = []
    function varrer(no: unknown, caminho: string): void {
      if (typeof no === 'number') {
        const chave = caminho.split('.').pop() ?? ''
        if (!permitidos.has(chave)) achados.push(caminho)
        return
      }
      if (Array.isArray(no)) no.forEach((item, i) => varrer(item, `${caminho}.${i}`))
      else if (typeof no === 'object' && no !== null) {
        for (const [chave, valor] of Object.entries(no)) varrer(valor, `${caminho}.${chave}`)
      }
    }
    varrer(r, 'r')
    expect(achados).toEqual([])
  })

  it('cada ano se acha pelo número, sem depender da posição', () => {
    expect(r.anos.map((a) => a.ano)).toEqual([1, 2, 3])
    const embaralhado = [...r.anos].reverse()
    expect(embaralhado.find((a) => a.ano === 2)?.lucro).toBe(ano(r, 2).lucro)
  })
})

describe('RNF-003, determinismo', () => {
  it('a mesma entrada devolve o mesmo resultado, e a entrada não é alterada', () => {
    const entrada = bancoTresAnos()
    const copia = structuredClone(entrada)
    expect(calcularDdm(entrada)).toEqual(calcularDdm(entrada))
    expect(entrada).toEqual(copia)
  })
})

describe('D-084, a entrada da engine e o playbook bancos-b3 falam dos mesmos campos', () => {
  // leitura por linha de propósito: o dominio não depende do parser de YAML, e o
  // que importa aqui são os nomes de campo, um por linha "- campo: x"
  const texto = readFileSync(
    join(resolve(import.meta.dirname, '../../../..'), 'conhecimento', 'playbooks', 'bancos-b3.yaml'),
    'utf8',
  )
  const campos = [...texto.matchAll(/^ {2}- campo: (\w+)$/gm)].map((m) => m[1] as string)
  const diagnostico = ['roe_historico_3a', 'indice_basileia_atual', 'npl_90_e_cobertura']

  it('toda chave da entrada é campo do playbook', () => {
    for (const chave of Object.keys(EntradaDdm.shape)) expect(campos, chave).toContain(chave)
  })

  it('todo campo do playbook é chave da entrada, menos os três de diagnóstico', () => {
    const doCalculo = campos.filter((c) => !diagnostico.includes(c))
    expect(doCalculo.sort()).toEqual(Object.keys(EntradaDdm.shape).sort())
  })
})
