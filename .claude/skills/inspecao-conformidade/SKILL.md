---
name: inspecao-conformidade
description: Conduz a inspeção adversarial de conformidade obrigatória no fim de cada etapa do valuation-simulator (RNF-011, D-038). Use ao fechar qualquer etapa, passo ou fase, antes do commit de fechamento, e sempre que alguém pedir revisão de conformidade, revisão hostil ou relatório de brechas. Ensina método, mapa de onde olhar por tipo de etapa e armadilhas da própria inspeção. Não é checklist.
user-invocable: true
---

# Inspeção adversarial de conformidade

Você vai procurar brecha no trabalho da etapa que acabou de fechar. Não vai revisar
código, não vai elogiar, não vai explicar por que está tudo bem.

## Antes de começar, leia

1. `PROTOCOLO-ETAPA.md`, seção 4. Ela é a autoridade sobre severidade e sobre o formato
   do relatório. Leia na hora, não de memória. Esta skill não copia a tabela de
   severidade nem o bloco de formato de propósito: duas cópias divergem e ninguém sabe
   qual vale.
2. `CLAUDE.md`, seções 2 e 3. As oito invariantes com gatilho e teste de decisão, e os
   casos de fronteira já resolvidos. Esta skill também não repete nenhuma das duas.

Se você achar que uma brecha exige exceção a caso de fronteira já decidido, o problema é
da regra, não do caso: reporte, não decida.

## Postura

Você é o leitor hostil. Não o revisor cuidadoso, não quem implementou.

- procure a interpretação mais desfavorável de cada elemento, não a razoável
- escreva a brecha na voz de quem quer usar a brecha, não na sua
- relatório que explica por que está tudo bem não é inspeção, é defesa
- se você implementou a etapa, essa é a hora de esquecer a intenção. A intenção não vai
  junto com o código para a mão do usuário

Escreva a linha `Brecha:` como uma frase que um leitor mal intencionado diria em voz
alta. Se ela sair no formato "poderia eventualmente ser interpretada como", você
amaciou, reescreva.

## Regra de evidência

Toda afirmação do relatório vem de comando executado nesta inspeção.

- afirmação de ausência precisa do comando colado que a sustenta. "Nenhum caminho de
  number para dentro do domínio" sem o grep é opinião com aparência de verificação
- exit code zero sozinho não prova execução, é D-052: a saída precisa carregar versão,
  hash, contagem, nome de arquivo ou número de linha
- resultado agregado de ferramenta não é oráculo. Score de mutação, cobertura e
  contagem de lint são pistas. Desconfiou, verifique à mão e cole a verificação
- nada de memória de etapa anterior. O código mudou desde então

Número de linha envelhece rápido. Ancore também pelo símbolo, tipo `money.ts:82,
chamada de exigirRate`, para a referência sobreviver ao próximo refactor.

## Onde olhar, por tipo de etapa

Ponto de partida, não limite. **Procure o que não está nesta lista.** Se você só achou
itens da lista, você rodou um checklist, não uma inspeção. Termine perguntando: o que
esta etapa introduziu que nenhuma linha abaixo previu?

**Aritmética e tipos**

- caminho de `number` entrando ou saindo, incluindo JSON, serialização e tipo de retorno
  público
- arredondamento sem o chamador declarar casas e modo
- default numérico em construtor, em parâmetro opcional ou em fallback
- relógio, rede e aleatoriedade
- superfície pública maior do que a pretendida, incluindo import relativo profundo que o
  `exports` map do `package.json` não alcança

**Conhecimento e schema**

- valor de premissa escapando para dentro de item de conhecimento
- evento sem prazo passando pela validação
- faixa por ativo em vez de setorial
- nota alterando regra dura ou ampliando lista de modelos

**Engine e validador**

- validador contornável por configuração, por nota ou por instrução de agente
- resultado agregado sem desagregação por etapa
- regra dura sem teste de rejeição

**Interface e texto**

- estado da tela no primeiro render, antes de qualquer interação
- string que possa ser lida como sugestão de compra por alguém mal intencionado
- agrupamento que produza ranking sem se chamar ranking
- hierarquia visual por atratividade
- número exibido que não seja rastreável a fato, a escolha do usuário ou a aritmética
  sobre os dois
- alerta que, lido fora de contexto, pareça opinião do software

**Qualquer etapa**

- o que acontece quando o usuário apaga o campo
- o que acontece quando o provider cai
- o que acontece quando o evento vence no meio da sessão

## Armadilhas da própria inspeção

Estas são o modo de falha real, mais provável que deixar passar uma linha de código.

- **Aceitar a leitura generosa porque foi você que implementou.** Você conhece a
  intenção, e a intenção não é o que vai para a tela do usuário
- **Classificar como baixa uma brecha que é média para não travar o fechamento.** Se você
  pensou "isso é baixa porque senão a etapa não fecha", é média. Severidade sai do
  critério do PROTOCOLO, não da vontade de terminar
- **Relatório de zero brechas.** Em etapa com interface é sinal de inspeção fraca, não de
  código limpo. Zero brechas exige justificativa do escopo inspecionado
- **Confundir default técnico com premissa financeira.** É o par mais escorregadio deste
  projeto. Pergunte o que o valor faz no cálculo, não de que tipo ele é
- **Inspecionar só o que a etapa mudou.** A brecha costuma estar na interação entre o
  novo e o que já existia, e essa interação não aparece no diff

## Exemplo trabalhado, inspeção do Passo 1

Três brechas reais e uma afirmação de ausência. Repare no que separa baixa de média.

**Baixa, com a justificativa de por que não é média.**

```
[BAIXA] packages/shared/src/decimal-config.ts:91, e paraTexto em money.ts e rate.ts
Brecha: "eles juraram que number é proibido e tem number na assinatura pública, quatro vezes"
Invariante ou requisito: RNF-001, RF-503, D-045
Correção: é contagem de casas decimais, não grandeza financeira. Validada como inteiro
maior ou igual a zero. Registrado como caso de fronteira no CLAUDE.md seção 3
```

Por que baixa e não média: o critério é o que o valor representa, não o tipo dele. Um
`number` que carrega dinheiro é média ou alta na hora. Um `number` que conta posições
decimais não tem como virar valor monetário errado, porque não multiplica nem soma com
nada do domínio. Se a defesa fosse "é só uma casa decimal, relaxa", seria amaciar. A
defesa aqui é estrutural e virou linha no `CLAUDE.md`, que é o que separa as duas coisas.

**Média achada durante a etapa e corrigida na etapa.**

```
[MÉDIA, corrigida] packages/shared/src/money.ts:82, chamada de exigirRate em multiplicaPor
Brecha: "o tipo proíbe Money vezes Money, mas em runtime passava liso, porque a ponte
interna é o mesmo símbolo nas duas classes"
Invariante ou requisito: D-047, RP-005
Correção: guarda exigirRate em multiplicaPor e em converter, com sete casos de entrada
testados, incluindo null e objeto sem protótipo
```

Como apareceu: um teste que deveria falhar passou. A proteção existia no tipo e não no
runtime, e ninguém teria percebido lendo o código, porque o código está certo do ponto de
vista de quem sabe a intenção. Inspeção que só lê não acha isso, inspeção que executa acha.

**Média deixada em aberto, com prazo e motivo.**

```
[MÉDIA, em aberto] packages/shared/src/rate.ts:113, exigirPositivo
Brecha: "denominador negativo em (Ke - g) não levanta erro na aritmética, só se o chamador
lembrar de pedir a guarda, e chamador esquece"
Invariante ou requisito: RF-506, RF-507
Correção: regra dura executável e não contornável é do pacote dominio, nasce no Passo 3.
Até lá a proteção depende do chamador, e isso fica dito em vez de escondido
```

Deixar em aberto é permitido pelo PROTOCOLO para média, desde que com prazo e responsável.
O que não é permitido é rebaixar para baixa para não precisar do prazo.

**Afirmação de ausência, com o comando que a sustenta.**

Errado, porque é opinião: "não existe helper que arredonde por conta própria".

Certo:

```
$ grep -rn -E 'toFixed|toDecimalPlaces|toDP|toSignificantDigits|toSD|\.round\(|Math\.round|toPrecision|toNearest' --include='*.ts' packages/shared/src | grep -v '\.test\.ts'
rate.ts:84:    return this.#valor.toFixed(exigirCasasDecimais(casas, 'casas'), codigoDoModo(modo))
money.ts:122:    return this.#valor.toFixed(exigirCasasDecimais(casas, 'casas'), codigoDoModo(modo))
```

Duas chamadas de arredondamento no pacote inteiro, as duas exigindo casas e modo do
chamador. A ausência agora é verificável por quem lê o relatório, que é o ponto.

## O que esta skill ainda não sabe fazer

Declare este limite no relatório enquanto ele valer.

Nenhuma inspeção deste projeto examinou interface até hoje. As etapas fechadas foram
governança e aritmética. O mapa de interface acima foi derivado dos requisitos e das
invariantes, não de prática: ninguém ainda tentou furar uma tela deste produto.

Isso importa porque as brechas mais graves do projeto são de interface. RP-001, RP-002,
RP-004 e RP-007 se materializam em string, em ordenação e em destaque visual, não em
função pura. Uma skill que finge competência que não tem produz relatório de zero brechas
na Fase 7, que é exatamente o cenário que o `PROTOCOLO-ETAPA.md` classifica como inspeção
fraca.

Revise o mapa de interface depois da primeira etapa com tela, com o que a prática mostrar,
e troque item derivado de requisito por item derivado de brecha real encontrada.
