import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parse as parseYaml } from 'yaml'
import { describe, expect, it } from 'vitest'
import { Playbook, PremissaDoUsuario } from './playbook'
import { texto, textoInterno } from './comum'
import {
  PASTAS_VALIDAS,
  tipoPeloCaminho,
  validarArquivo,
  validarNotasContraPlaybooks,
  validarPasta,
} from './validar'

const RAIZ = resolve(import.meta.dirname, '../../..')
const CONHECIMENTO = join(RAIZ, 'conhecimento')
const FIXTURES = join(CONHECIMENTO, 'fixtures-invalidas')

function mensagens(caminho: string, tipo: 'playbooks' | 'eventos' | 'notas' | 'heuristicas') {
  return validarArquivo(caminho, tipo).map((problema) => problema.mensagem)
}

function carregar(caminho: string): unknown {
  return parseYaml(readFileSync(caminho, 'utf8'))
}

describe('a varredura normal não enxerga a pasta de fixtures inválidas', () => {
  it('só percorre as quatro pastas da lista branca', () => {
    expect([...PASTAS_VALIDAS]).toEqual(['playbooks', 'heuristicas', 'notas', 'eventos'])
  })

  it('nenhum arquivo de fixtures-invalidas aparece na varredura de conhecimento/', () => {
    const { arquivosLidos } = validarPasta(CONHECIMENTO)
    expect(arquivosLidos.length).toBeGreaterThan(0)
    expect(arquivosLidos.filter((a) => a.includes('fixtures-invalidas'))).toEqual([])
  })

  it('a fixture continua validável quando apontada de propósito', () => {
    const alvo = join(FIXTURES, 'eventos', 'sem-validade-ate.yaml')
    expect(tipoPeloCaminho(alvo)).toBe('eventos')
    expect(validarArquivo(alvo, 'eventos').length).toBeGreaterThan(0)
  })
})

describe('RF-110, evento exige os dois prazos', () => {
  it('recusa evento sem validade_ate', () => {
    const erros = mensagens(join(FIXTURES, 'eventos', 'sem-validade-ate.yaml'), 'eventos')
    expect(erros.length).toBe(1)
    expect(erros[0]).toContain('RF-110')
    expect(erros[0]).toContain('validade_ate')
  })

  it('recusa evento sem revisar_em, que é o segundo prazo que o handoff omite', () => {
    const erros = mensagens(join(FIXTURES, 'eventos', 'sem-revisar-em.yaml'), 'eventos')
    expect(erros.length).toBe(1)
    expect(erros[0]).toContain('RF-110')
    expect(erros[0]).toContain('revisar_em')
  })
})

describe('RF-112 e RP-006, nenhum item de conhecimento contém valor de premissa', () => {
  it('recusa premissa com default preenchido', () => {
    const erros = mensagens(join(FIXTURES, 'playbooks', 'premissa-com-valor.yaml'), 'playbooks')
    expect(erros.length).toBeGreaterThan(0)
    expect(erros.join(' ')).toContain('RF-112')
    expect(erros.join(' ')).toMatch(/RP-003|RP-006/)
  })

  it('recusa chave nova que carregue valor, que é por onde a premissa escaparia', () => {
    // a lista de chaves é fechada, então valor_sugerido nem chega a ser lido como número
    const erros = validarArquivo(
      join(FIXTURES, 'playbooks', 'premissa-chave-nova.yaml'),
      'playbooks',
    ).map((p) => p.mensagem)
    expect(erros.length).toBe(1)
    expect(erros[0]).toContain('RF-112')
    expect(erros[0]).toContain('RP-006')
  })
})

describe('RF-421 e D-040, flag booleana de premissa é proibida', () => {
  it('recusa premissa declarada como booleano', () => {
    const erros = mensagens(join(FIXTURES, 'playbooks', 'premissa-booleana.yaml'), 'playbooks')
    expect(erros.length).toBe(1)
    expect(erros[0]).toContain('RF-421')
    expect(erros[0]).toContain('D-040')
  })
})

describe('RF-105, modo de granularidade reduzida exige aviso', () => {
  it('recusa modo de precisão reduzida sem aviso_obrigatorio', () => {
    const erros = mensagens(
      join(FIXTURES, 'playbooks', 'modo-reduzido-sem-aviso.yaml'),
      'playbooks',
    )
    expect(erros.length).toBe(1)
    expect(erros[0]).toContain('RF-105')
    expect(erros[0]).toContain('aviso_obrigatorio')
  })
})

describe('RF-113 e D-024, faixa de referência é sempre setorial', () => {
  it('recusa faixa que carrega ativo', () => {
    const erros = mensagens(join(FIXTURES, 'playbooks', 'faixa-por-ativo.yaml'), 'playbooks')
    expect(erros.length).toBe(1)
    expect(erros[0]).toContain('RF-113')
    expect(erros[0]).toContain('D-024')
  })
})

describe('D-058, taxa em arquivo de conhecimento é texto entre aspas', () => {
  it('recusa taxa de faixa escrita sem aspas, que o YAML entrega como float', () => {
    const erros = mensagens(join(FIXTURES, 'playbooks', 'taxa-sem-aspas.yaml'), 'playbooks')
    expect(erros.length).toBe(1)
    expect(erros[0]).toContain('D-045')
    expect(erros[0]).toContain('D-058')
    expect(erros[0]).toContain('minimo')
  })
})

describe('D-059, null explícito declara ausência deliberada', () => {
  it('aceita faixa_referencia: null, que é o caso de preco_normalizado_lp por D-014', () => {
    const comNull = {
      campo: 'preco_normalizado_lp',
      obrigatorio: true,
      default: null,
      faixa_referencia: null,
    }
    expect(PremissaDoUsuario.safeParse(comNull).success).toBe(true)
  })

  it('aceita também a omissão da chave, que é ausência sem declaração', () => {
    const semChave = { campo: 'taxa_desconto', obrigatorio: true, default: null }
    expect(PremissaDoUsuario.safeParse(semChave).success).toBe(true)
  })
})

describe('D-060, modos é obrigatório no playbook', () => {
  it('recusa playbook sem modos, porque RF-105 não teria onde exigir o aviso', () => {
    const erros = mensagens(join(FIXTURES, 'playbooks', 'sem-modos.yaml'), 'playbooks')
    expect(erros.length).toBe(1)
    expect(erros[0]).toContain('RF-102')
    expect(erros[0]).toContain('RF-105')
  })
})

describe('D-061, texto exibido ao usuário passa por filtro de RP-004', () => {
  it('recusa vocabulário valorativo em campo de interface', () => {
    const erros = mensagens(join(FIXTURES, 'playbooks', 'texto-valorativo.yaml'), 'playbooks')
    expect(erros.length).toBe(1)
    expect(erros[0]).toContain('RP-004')
    expect(erros[0]).toContain('D-061')
    expect(erros[0]).toContain('barata')
  })

  it('deixa passar metodologia legítima que usa as mesmas palavras', () => {
    const legitimos = [
      'O fluxo de caixa descontado usa a taxa que você informou',
      'O custo de oportunidade do capital vem da composição por CAPM',
    ]
    for (const frase of legitimos) {
      expect(texto('motivo', 'RF-104').safeParse(frase).success).toBe(true)
    }
  })

  it('pega o valorativo quando a palavra não vem na colocação metodológica', () => {
    const r = texto('motivo', 'RF-104').safeParse('Ativo descontado frente aos pares')
    expect(r.success).toBe(false)
  })

  it('o filtro não substitui revisão: paráfrase passa limpo, e isso é declarado na D-061', () => {
    const parafrase = 'o desenlace positivo para o emissor é o cenário natural'
    expect(texto('motivo', 'RF-104').safeParse(parafrase).success).toBe(true)
  })
})

describe('D-062, o filtro é o padrão e não a exceção', () => {
  // valores de enum: mutar estes reprova por enum inválido, não por RP-004, então
  // ficam de fora para o teste medir o que promete medir
  const CAMINHOS_DE_ENUM = [
    'multiplos_bloqueados.0.severidade',
    'horizonte_projecao.tipo',
    'modos.0.precisao',
    'premissas_do_usuario.0.composicao_disponivel',
    'heuristicas_de_leitura.0.severidade',
    'heuristicas_de_leitura.0.confianca',
  ]

  function folhasDeTexto(no: unknown, prefixo = ''): string[] {
    if (typeof no === 'string') return [prefixo]
    if (Array.isArray(no)) {
      return no.flatMap((item, i) => folhasDeTexto(item, `${prefixo}${prefixo ? '.' : ''}${i}`))
    }
    if (typeof no === 'object' && no !== null) {
      return Object.entries(no).flatMap(([chave, valor]) =>
        folhasDeTexto(valor, `${prefixo}${prefixo ? '.' : ''}${chave}`),
      )
    }
    return []
  }

  function comValorativo(base: unknown, caminho: string): unknown {
    const copia = structuredClone(base) as Record<string, unknown>
    const partes = caminho.split('.')
    let no: Record<string, unknown> = copia
    for (const parte of partes.slice(0, -1)) {
      no = no[parte] as Record<string, unknown>
    }
    const ultima = partes[partes.length - 1]
    if (ultima !== undefined) no[ultima] = 'papel barato frente aos pares'
    return copia
  }

  it('todo campo de texto livre do playbook recusa vocabulário valorativo', () => {
    const base = carregar(join(FIXTURES, 'playbooks', 'premissa-com-valor.yaml')) as Record<
      string,
      unknown
    >
    base['premissas_do_usuario'] = [{ campo: 'taxa_desconto', obrigatorio: true, default: null }]
    expect(Playbook.safeParse(base).success).toBe(true)

    const caminhos = folhasDeTexto(base).filter((c) => !CAMINHOS_DE_ENUM.includes(c))
    expect(caminhos.length).toBeGreaterThan(15)

    const passaram: string[] = []
    for (const caminho of caminhos) {
      const resultado = Playbook.safeParse(comValorativo(base, caminho))
      const pegouRp004 =
        !resultado.success &&
        resultado.error.issues.some((i) => i.message.includes('RP-004'))
      if (!pegouRp004) passaram.push(caminho)
    }
    // lista de exceções internas declaradas hoje: vazia
    expect(passaram).toEqual([])
  })

  it('textoInterno é a porta de saída declarada, e não filtra', () => {
    const interno = textoInterno('validador', 'RF-102', 'nome de função, nunca vira tela')
    expect(interno.safeParse('papel barato frente aos pares').success).toBe(true)
  })

  it('os gatilhos novos da D-062 pegam subavaliação e a família', () => {
    for (const frase of [
      'Concessões próximas do vencimento aparentam subavaliação',
      'ativo sobreavaliado frente aos pares',
      'papel subprecificado no setor',
      'ação sobrevalorizada',
    ]) {
      expect(texto('motivo', 'RF-104').safeParse(frase).success).toBe(false)
    }
  })
})

describe('RF-109 e D-020, nota restringe mas não amplia nem altera regra dura', () => {
  it('recusa nota que altera regra dura, direto no schema', () => {
    const erros = mensagens(join(FIXTURES, 'notas', 'altera-regra-dura.yaml'), 'notas')
    expect(erros.length).toBe(1)
    expect(erros[0]).toContain('RF-109')
    expect(erros[0]).toContain('D-020')
  })

  it('recusa nota que amplia a lista de modelos, na validação cruzada com o playbook', () => {
    const nota = join(FIXTURES, 'notas', 'amplia-modelos.yaml')
    const playbook = join(CONHECIMENTO, 'playbooks', 'commodities-b3.yaml')
    const problemas = validarNotasContraPlaybooks(
      [{ caminho: nota, documento: carregar(nota) }],
      [{ caminho: playbook, documento: carregar(playbook) }],
    )
    expect(problemas.length).toBe(1)
    expect(problemas[0]?.mensagem).toContain('RF-109')
    expect(problemas[0]?.mensagem).toContain('ddm')
  })

  it('deixa passar nota que apenas restringe', () => {
    const playbook = join(CONHECIMENTO, 'playbooks', 'commodities-b3.yaml')
    const restritiva = {
      id: 'NA-007',
      ativo: 'KLBN11',
      tipo: 'caracteristica_estrutural',
      playbook: 'commodities-b3',
      sobreescreve: { modelos_habilitados: ['sotp'] },
      justificativa: 'Modelo verticalizado com receita relevante fora de celulose',
      confianca: 'alta',
      fonte: 'Analise propria',
    }
    const problemas = validarNotasContraPlaybooks(
      [{ caminho: 'memoria', documento: restritiva }],
      [{ caminho: playbook, documento: carregar(playbook) }],
    )
    expect(problemas).toEqual([])
  })
})
