/**
 * Erros estruturados do domínio, compartilhados por engines e validadores (D-121).
 *
 * Moravam dentro da engine `fcff_por_concessao`. Saíram quando a segunda engine e
 * os validadores passaram a precisar deles, para nenhum módulo importar erro de
 * dentro de outra engine.
 */

/**
 * Premissa obrigatória ausente, ou informada para algo que o cálculo não usa.
 *
 * Não é regra dura de playbook, é RF-401: o cálculo fica bloqueado enquanto houver
 * premissa obrigatória não preenchida.
 */
export class ErroDePremissa extends Error {
  readonly campo: string
  constructor(campo: string, mensagem: string) {
    super(`${campo}: ${mensagem}`)
    this.campo = campo
    this.name = 'ErroDePremissa'
  }
}

/**
 * Falha de regra dura, de validador de entrada ou de guarda de saída (D-121).
 *
 * RF-507 pede id da regra, mensagem e motivo metodológico. O motivo é obrigatório
 * no construtor, para nenhum ponto de lançamento esquecer dele: erro de regra dura
 * sem motivo diz que parou, e não diz por que a conta não fecha.
 */
export class ErroDeRegraDura extends Error {
  readonly regra: string
  readonly motivo: string
  constructor(regra: string, mensagem: string, motivo: string) {
    super(`${regra}: ${mensagem}`)
    if (motivo.trim() === '') {
      throw new TypeError(`${regra}: erro de regra dura precisa de motivo metodológico (RF-507)`)
    }
    this.regra = regra
    this.motivo = motivo
    this.name = 'ErroDeRegraDura'
  }
}
