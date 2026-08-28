# PROTOCOLO-ETAPA.md

Ciclo obrigatório de toda etapa deste projeto. Etapa é um passo (0 a 4) ou uma fase (1 a 8)
do documento de requisitos.

Sem este ciclo, etapa fecha por sensação de pronto, e é assim que proteção desaparece uma
por vez, cada vez com uma justificativa razoável.

---

## 1. Abertura

Antes de escrever qualquer linha, o agente apresenta e espera aprovação explícita:

1. **Escopo.** O que entra e o que fica de fora
2. **Requisitos atendidos.** Lista de RF, RNF e RP, por ID. Etapa que não cita requisito
   está inventando trabalho
3. **Arquivos.** Todos os que serão criados ou alterados. Arquivo não listado não é criado
4. **Verificação.** Como esta etapa vai ser provada. Se não há como provar, o escopo está
   mal definido
5. **Riscos.** Onde esta etapa pode violar invariante, e o que impede

Não avança sem aprovação. Não emenda a etapa seguinte na mesma resposta.

---

## 2. Execução

- Implementar só o que está no escopo aprovado
- Justificar cada decisão de implementação: o que fez, qual requisito atende, o que
  descartou (RNF-010)
- Contestar em vez de implementar, se aparecer conflito com invariante, risco legal ou má
  prática com consequência real (RNF-012). A contestação precede a implementação, não vem
  depois dela
- Decisão nova vai para `DECISOES.md` antes de virar código

---

## 3. Verificação

Saída colada literalmente, com exit code, em bloco de código. Nunca descrita em prosa
(RNF-005).

```
$ <comando>
<saída exata>
$ echo $?
<código>
```

Regras:

- exit code diferente de zero fecha o assunto: a etapa não avança
- suíte que não existe não pode ser citada como verde
- verificação que não foi executada nesta sessão não vale como executada
- explicação inferida sobre comportamento não verificado não entra em documento como fato
- saída reportada como sucesso precisa carregar prova de execução: versão, hash, contagem,
  nome de arquivo ou número de linha. Exit code zero sozinho não basta, porque o wrapper desta
  máquina já devolveu texto de sucesso para binário que não existe (D-052). Afirmação em prosa
  desperta desconfiança, exit 0 não
- resultado agregado de ferramenta, tipo score de mutação, não é oráculo: havendo motivo para
  desconfiar, verifique à mão antes de citar
- etapa que mexer em validação roda a varredura de proteção sem exercício, comparando
  requisito citado no schema com requisito afirmado em teste. A diferença é a lista de
  proteções que nunca reprovaram nada. **Não é gate automático:** a saída exige triagem
  manual, porque rótulo de âncora em campo de texto aparece nela e não é lacuna. Na rodada em
  que ela nasceu, seis dos oito IDs eram rótulo e dois eram lacuna real. O procedimento e os
  comandos estão na skill de inspeção

---

## 4. Inspeção adversarial de conformidade

Obrigatória ao fim de cada etapa (RNF-011, D-038). A partir do Passo 2, conduzida pela
skill `.claude/skills/inspecao-conformidade/`. Antes disso, manual, e essa limitação é
declarada no relatório.

O agente assume o papel de quem quer encontrar brecha. A leitura é a mais desfavorável
possível, não a generosa. Perguntas que a inspeção faz:

- este texto de interface pode ser lido como sugestão de compra por alguém mal-intencionado?
- este default técnico se comporta como premissa financeira na prática?
- este agrupamento de dados produz ranking sem se chamar ranking?
- este alerta, lido fora de contexto, parece opinião do software?
- algum caminho exibe número que não seja rastreável a fato, a escolha do usuário, ou a
  aritmética sobre os dois?
- qual é o estado da tela no primeiro render, antes de qualquer interação?
- o que acontece se o usuário apagar o campo, se o provider cair, se o evento vencer no
  meio da sessão?

### Severidade

| Nível | Critério | Efeito |
|---|---|---|
| Alta | Viola invariante RP-001 a RP-008, ou cria risco legal | Etapa não fecha. Correção antes de qualquer coisa |
| Média | Viola requisito funcional sem violar invariante | Corrige na etapa ou registra com prazo e responsável |
| Baixa | Ambiguidade, texto melhorável, dívida sem consequência imediata | Registra e segue |

### Formato do relatório

Uma linha por brecha:

```
[SEVERIDADE] <arquivo>:<linha ou elemento>
Brecha: <a leitura hostil, escrita como um leitor hostil escreveria>
Invariante ou requisito: <ID>
Correção: <o que foi feito, ou o prazo>
```

Relatório sem nenhuma brecha encontrada exige justificativa do escopo inspecionado. Zero
brechas em etapa com interface é sinal de inspeção fraca, não de código limpo.

---

## 5. Fechamento

Nesta ordem:

1. `DECISOES.md` atualizado com as decisões novas da etapa
2. `AGENTS.md` atualizado: estado atual, etapa concluída, etapa seguinte, questões abertas
3. `CLAUDE.md` atualizado, só se surgiu caso de fronteira novo ou gatilho novo
4. Relatório de inspeção adversarial anexado à etapa
5. Commit com referência aos requisitos atendidos
6. Parar. A etapa seguinte precisa de pedido explícito

---

## 6. Gates

Uma etapa não fecha se qualquer um destes for verdadeiro:

- exit code de verificação diferente de zero
- brecha de severidade alta em aberto
- decisão da etapa fora do `DECISOES.md`
- `AGENTS.md` descrevendo estado que não é o real
- entrega de código sem justificativa (RNF-010)
- arquivo criado que não estava no escopo aprovado
- verificação reportada como sucesso sem prova de execução, ou resultado agregado de
  ferramenta aceito sem verificação quando havia motivo para desconfiar dele (D-052)
