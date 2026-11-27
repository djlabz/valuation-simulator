import { describe, expect, it } from 'vitest'
import { ErroDePremissa, ErroDeRegraDura } from './erros'
import * as daEngine from './engines/fcff-por-concessao'

describe('D-121 e RF-507, o erro de regra dura é estruturado e carrega o motivo', () => {
  it('guarda id, mensagem e motivo, cada um no seu campo', () => {
    const erro = new ErroDeRegraDura('R-104', 'mensagem sintetica', 'motivo sintetico')
    expect(erro.regra).toBe('R-104')
    expect(erro.message).toBe('R-104: mensagem sintetica')
    expect(erro.motivo).toBe('motivo sintetico')
    expect(erro.name).toBe('ErroDeRegraDura')
    expect(erro).toBeInstanceOf(Error)
  })

  it('recusa motivo vazio ou em branco, porque RF-507 exige o motivo', () => {
    expect(() => new ErroDeRegraDura('R-104', 'mensagem', '')).toThrow(/RF-507/)
    expect(() => new ErroDeRegraDura('R-104', 'mensagem', '   ')).toThrow(/R-104/)
  })

  it('erro de premissa nomeia o campo', () => {
    const erro = new ErroDePremissa('horizonte_anos', 'ausente')
    expect(erro.campo).toBe('horizonte_anos')
    expect(erro.message).toBe('horizonte_anos: ausente')
    expect(erro.name).toBe('ErroDePremissa')
  })

  it('a engine da fcff reexporta as mesmas classes, e não cópias', () => {
    expect(daEngine.ErroDeRegraDura).toBe(ErroDeRegraDura)
    expect(daEngine.ErroDePremissa).toBe(ErroDePremissa)
  })
})
