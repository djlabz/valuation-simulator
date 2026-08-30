import { describe, expect, it } from 'vitest'
import { lerData } from './datas'
import {
  COMPETENCIAS_POR_CICLO,
  cicloNaPosicao,
  cicloTarifarioQueContem,
  ciclosInteirosAte,
  competenciasDoCiclo,
  exercicioSocialQueContem,
  primeiroCicloQueComecaEmOuApos,
  proximoCiclo,
  type CicloTarifario,
} from './grades'

const d = (texto: string) => lerData(texto, 'teste')

describe('o ciclo tarifário vai de 1º de julho a 30 de junho, e não é o ano civil', () => {
  it('data em janeiro pertence ao ciclo que abriu em julho do ano anterior', () => {
    const c = cicloTarifarioQueContem(d('2026-01-01'))
    expect(c.rotulo).toBe('2025-2026')
    expect(c.inicio).toEqual({ ano: 2025, mes: 7, dia: 1 })
    expect(c.fim).toEqual({ ano: 2026, mes: 6, dia: 30 })
  })

  it('1º de julho já pertence ao ciclo novo, e 30 de junho ainda ao antigo', () => {
    expect(cicloTarifarioQueContem(d('2026-07-01')).rotulo).toBe('2026-2027')
    expect(cicloTarifarioQueContem(d('2026-06-30')).rotulo).toBe('2025-2026')
  })

  it('o ciclo seguinte abre exatamente no dia seguinte ao fim do anterior', () => {
    const c = cicloTarifarioQueContem(d('2026-01-01'))
    const seguinte = proximoCiclo(c)
    expect(c.fim).toEqual({ ano: 2026, mes: 6, dia: 30 })
    expect(seguinte.inicio).toEqual({ ano: 2026, mes: 7, dia: 1 })
  })
})

describe('as três grades são distintas, e é isso que o tipo protege', () => {
  it('ciclo e exercício social que contêm a mesma data têm limites diferentes', () => {
    const data = d('2026-03-15')
    const ciclo = cicloTarifarioQueContem(data)
    const exercicio = exercicioSocialQueContem(data)
    expect(ciclo.grade).toBe('ciclo_tarifario')
    expect(exercicio.grade).toBe('exercicio_social')
    // se as duas grades fossem conversíveis por constante, os limites bateriam
    expect(ciclo.fim).not.toEqual(exercicio.fim)
    expect(ciclo.inicio).not.toEqual(exercicio.inicio)
    expect(exercicio.inicio).toEqual({ ano: 2026, mes: 1, dia: 1 })
    expect(exercicio.fim).toEqual({ ano: 2026, mes: 12, dia: 31 })
  })

  it('as competências de um ciclo vão de julho a junho, não de janeiro a dezembro', () => {
    const competencias = competenciasDoCiclo(cicloTarifarioQueContem(d('2026-08-01')))
    expect(competencias).toHaveLength(COMPETENCIAS_POR_CICLO)
    expect(competencias[0]?.rotulo).toBe('2026-07')
    expect(competencias[11]?.rotulo).toBe('2027-06')
    expect(competencias.every((c) => c.grade === 'competencia_mensal')).toBe(true)
    // a competência vira o ano no meio do ciclo, que é o que um mês de ano civil não faz
    expect(competencias[5]?.ano).toBe(2026)
    expect(competencias[6]?.ano).toBe(2027)
  })

  it('o compilador recusa trocar uma grade pela outra', () => {
    const receberCiclo = (c: CicloTarifario) => c.rotulo
    const exercicio = exercicioSocialQueContem(d('2026-03-15'))
    // @ts-expect-error exercício social não é ciclo tarifário, e a troca era o bug
    expect(() => receberCiclo(exercicio)).not.toThrow()
    const competencia = competenciasDoCiclo(cicloTarifarioQueContem(d('2026-08-01')))[0]!
    // @ts-expect-error competência mensal também não é ciclo tarifário
    expect(() => receberCiclo(competencia)).not.toThrow()
  })
})

describe('abertura da projeção e contagem de ciclos inteiros', () => {
  it('data base fora da virada abre no ciclo seguinte', () => {
    expect(primeiroCicloQueComecaEmOuApos(d('2026-01-01')).rotulo).toBe('2026-2027')
  })

  it('data base exatamente em 1º de julho abre no próprio ciclo', () => {
    expect(primeiroCicloQueComecaEmOuApos(d('2026-07-01')).rotulo).toBe('2026-2027')
  })

  it('só conta ciclo que termina em ou antes do limite', () => {
    const primeiro = primeiroCicloQueComecaEmOuApos(d('2026-07-01'))
    // 2029-06-30 é exatamente o fim do terceiro ciclo
    expect(ciclosInteirosAte(primeiro, d('2029-06-30'))).toBe(3)
    // um dia antes, o terceiro ciclo não fecha e não conta
    expect(ciclosInteirosAte(primeiro, d('2029-06-29'))).toBe(2)
    // um dia depois não cria ciclo novo, porque o quarto só fecha em 2030-06-30
    expect(ciclosInteirosAte(primeiro, d('2029-07-01'))).toBe(3)
  })

  it('limite anterior ao primeiro ciclo devolve zero', () => {
    expect(ciclosInteirosAte(primeiroCicloQueComecaEmOuApos(d('2026-07-01')), d('2026-08-01'))).toBe(0)
  })

  it('a posição n devolve o n-ésimo ciclo, com n começando em 1', () => {
    const primeiro = primeiroCicloQueComecaEmOuApos(d('2026-07-01'))
    expect(cicloNaPosicao(primeiro, 1).rotulo).toBe('2026-2027')
    expect(cicloNaPosicao(primeiro, 3).rotulo).toBe('2028-2029')
  })
})
