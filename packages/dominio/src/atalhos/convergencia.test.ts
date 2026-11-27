import { Rate } from '@valuation/shared'
import { describe, expect, it } from 'vitest'
import { porConvergencia } from './convergencia'

function iguais(obtidos: string[], esperados: string[]): void {
  expect(obtidos.length).toBe(esperados.length)
  obtidos.forEach((v, i) =>
    expect(Rate.de(v, 'v').igual(Rate.de(esperados[i] as string, 'e')), `${v} ${esperados[i]}`).toBe(true),
  )
}

describe('D-114, convergência: o ano zero não é aplicado e o ano N chega no alvo', () => {
  it('partida 8%, alvo 16%, prazo 5: 9,6%, 11,2%, 12,8%, 14,4% e 16%', () => {
    iguais(porConvergencia('0.08', '0.16', 5), ['0.096', '0.112', '0.128', '0.144', '0.16'])
  })

  it('o primeiro ano já anda um passo: nenhum ano é igual à partida', () => {
    expect(porConvergencia('0.08', '0.16', 5)).not.toContain('0.08')
  })

  it('converge para baixo também', () => {
    iguais(porConvergencia('0.2', '0.1', 4), ['0.175', '0.15', '0.125', '0.1'])
  })

  it('prazo 1 é o alvo direto', () => {
    iguais(porConvergencia('0.08', '0.16', 1), ['0.16'])
  })

  it('prazo que não é inteiro positivo é recusado', () => {
    for (const prazo of [0, -1, 2.5]) {
      expect(() => porConvergencia('0.08', '0.16', prazo), String(prazo)).toThrow(/prazo da convergência/)
    }
  })

  it('a saída é texto decimal, uma entrada por ano, pronta para a lista da engine', () => {
    for (const v of porConvergencia('0.08', '0.16', 3)) expect(typeof v).toBe('string')
  })
})
