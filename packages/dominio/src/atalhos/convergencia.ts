import { Rate } from '@valuation/shared'

/**
 * Atalho de preenchimento por convergência (D-114, D-116).
 *
 * Devolve um valor por ano, do ano 1 ao ano N: P + (S − P) × t / N. O valor de
 * partida P é o ano zero e não é aplicado a ano nenhum; o primeiro ano projetado
 * já anda um passo, e o ano N chega em S.
 *
 * Os três argumentos são escolha do usuário, e nada aqui é chamado sozinho: o
 * atalho é aplicado por ação explícita, nenhum vem pré-selecionado, e o valor de
 * partida não vem do histórico do ticker (RP-003, D-114). Função pura.
 */
export function porConvergencia(partida: string, chegada: string, prazo: number): string[] {
  if (!Number.isInteger(prazo) || prazo < 1) {
    throw new RangeError(`prazo da convergência: esperava inteiro maior que zero, recebi ${prazo}`)
  }
  const p = Rate.de(partida, 'valor de partida da convergência')
  const s = Rate.de(chegada, 'valor de chegada da convergência')
  const passo = s.subtrai(p).divididoPor(Rate.de(String(prazo), 'prazo'), 'prazo da convergência')
  const valores: string[] = []
  // o último ano é a chegada, e não o passo multiplicado de volta: com passo que não
  // é decimal exato, tipo 1/3, a conta pararia um dígito abaixo (revisão da PR #18)
  for (let t = 1; t < prazo; t += 1) {
    valores.push(p.soma(passo.multiplicaPor(Rate.de(String(t), 'ano'))).paraArmazenamento())
  }
  valores.push(s.paraArmazenamento())
  return valores
}
