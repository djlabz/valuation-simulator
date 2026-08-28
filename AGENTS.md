# AGENTS.md

Continuidade entre sessões e entre agentes. Contém o que muda: estado, ordem de trabalho,
questões abertas. Regra permanente está em `CLAUDE.md` e não se repete aqui.

**Leia nesta ordem:** `CLAUDE.md`, depois `docs/REQUISITOS-valuation-simulator-v2.4.md`,
depois este arquivo, depois `PROTOCOLO-ETAPA.md`.

---

## 1. Estado atual

**Data:** 28/08/2026
**Etapa concluída:** Passo 3, primeiro bloco. Uma engine só, `fcff_por_concessao`, escrita
como sonda deliberada (D-075)
**Etapa seguinte:** aguardando pesquisa do curador, não aguardando código. Ver "o que
bloqueia" abaixo

### O que existe, pacote por pacote

| Pacote | O que tem dentro |
|---|---|
| `packages/shared` | `@valuation/shared`. `decimal-config.ts`, o construtor de `decimal.js` clonado com precision 34 e ROUND_HALF_EVEN (D-046); `money.ts` com `Money<Moeda>`, moeda como tipo fantasma; `rate.ts` com `Rate` para toda grandeza adimensional e as conversões de bps; `index.ts` como porta pública, que não exporta o construtor cru nem, por tabela, o `toNumber` dele |
| `packages/conhecimento` | `@valuation/conhecimento`. Schema Zod dos quatro tipos de item, em `playbook.ts`, `heuristica.ts`, `nota.ts` e `evento.ts`, com as peças compartilhadas e os três filtros de texto em `comum.ts`; `validar.ts` com a validação por pasta e as duas checagens cruzadas, RF-109 entre nota e playbook e RF-107 do `campo_relacionado` |
| `packages/dominio` | `@valuation/dominio`. `engines/fcff-por-concessao.ts`, a única engine; `datas.ts`, aritmética de data em texto sem o objeto `Date`; `validadores/` criado e **vazio**; `pureza.test.ts`, que varre o pacote procurando relógio, rede, I/O e aleatoriedade e falha se achar |
| `tools/` | `validar-conhecimento.ts`, CLI com exit code, varrendo `conhecimento/` por lista branca de pastas |

Fora dos pacotes: `conhecimento/playbooks/` com os três playbooks, só estrutura verificável
depois do expurgo; `conhecimento/fixtures-invalidas/` com dezenove fixtures, cada uma
quebrando exatamente uma regra; e `conhecimento/heuristicas`, `notas` e `eventos` vazias.

### Só existe uma engine, e as outras quatro não foram escritas de propósito

`ddm`, `excess_return`, `fcff_normalizado` e `sotp` **não existem**, e nenhuma auxiliar
(`calcular_ke`, `calcular_beta`, `sensibilidade`, `ponderar_cenarios`) tampouco. Nenhum
validador de regra dura executável existe: `validadores/` está vazio de propósito.

Isso não é trabalho pela metade. A engine foi escrita como sonda deliberada, e **o curador
mandou parar depois dela**, para as perguntas que ela gerasse serem respondidas antes de mais
quatro engines herdarem as mesmas premissas.

### O segundo entregável da sonda, e o que bloqueia

`docs/premissas-de-interpretacao-fcff-por-concessao.md` lista as **dezesseis premissas de
interpretação** que a engine foi obrigada a assumir sobre a natureza dos números: dez
BLOQUEANTES, que se forem falsas mudam a engine, e seis de ROBUSTEZ, que se forem falsas
produzem erro visível e não número errado silencioso. Cada uma diz o que a engine assume, onde
no código isso está materializado, o que acontece se for falsa, e qual fonte primária
responderia.

**Nada ali foi pesquisado.** O arquivo existe para a pesquisa do curador contra fonte primária
ser focada, e resposta inferida por agente é o que a RNF-013 proíbe.

**O estado do projeto agora é: aguardando pesquisa do curador sobre B1, B3 e B8.** Não é
aguardando aprovação de código.

| Premissa | O que a engine assume | Por que trava |
|---|---|---|
| **B1** | o fluxo livre é a RAP líquida atribuível, sem imposto, capex nem capital de giro | **bloqueia `fcff_normalizado`**, que tem a mesma pergunta sobre o que é o fluxo livre. Resolver depois de quatro engines existirem custa quatro engines |
| **B3** | os períodos são anuais ancorados na `data_base`, não no ciclo tarifário | se a RAP é publicada por ciclo de julho a junho, todo alinhamento fica deslocado, e o erro vale para todas as concessões ao mesmo tempo, então não se cancela |
| **B8** | `reducao_contratual.fator` é o que **sobra**, então `0.5` é RAP pela metade | o comentário do playbook diz `# ex: -50% após 15o ano`, com sinal negativo, o que sugere percentual cortado. Se for, a redução inverte |

### O que o expurgo tirou, para ninguém procurar o que não existe mais

Os playbooks ficaram só com estrutura verificável. Saíram as onze heurísticas, a única faixa de
referência, os quatro modos, o horizonte de bancos, as cinco entradas de múltiplo com
`severidade: alerta`, o `sotp` de commodities e a designação de `custo_chave`. Tudo está em
`docs/nao-autorado/EXPURGO-2026-08-27.md`, que não é fonte de verdade e não é carregado por
nada. Copiar item de lá de volta sem autoria viola a RNF-013.

**Itens que sumiram da fila do curador porque deixaram de existir:** H-004, H-044, os dois
modos mínimos, e o verbo "determina" que saiu junto com H-044.

### Documentos

- `docs/REQUISITOS-valuation-simulator-v2.4.md`, fonte de verdade. 113 requisitos funcionais,
  13 não funcionais, e a seção 9 com os três playbooks byte a byte iguais aos de
  `conhecimento/playbooks/`, verificado por teste (D-065)
- `docs/premissas-de-interpretacao-fcff-por-concessao.md`, as dezesseis premissas da sonda
- `docs/nao-autorado/EXPURGO-2026-08-27.md`, o conteúdo expurgado, com ressalva no topo
- `docs/HANDOFF-planejamento-2026-08-24.md`, registro histórico de 24/08/2026, não é fonte de
  verdade, com as divergências no cabeçalho do próprio arquivo

### Verificação

- suíte Vitest com **149 testes**, e `tsc --noEmit` sobre os três pacotes e `tools`
- CLI de conhecimento saindo zero contra `conhecimento/`
- Stryker sobre os **três** pacotes (D-077), sem limiar, com a regra de classificar cada
  sobrevivente. 58 segundos. Scores: `shared` 97,87%, `dominio` 64,57%, `conhecimento` 40,77%
- `.claude/skills/inspecao-conformidade/`, com a varredura de proteção sem exercício como
  passo obrigatório em etapa que mexa em validação (D-074)

### Lacunas de baixo valor registradas, que ficam como estão

Estas foram classificadas e deliberadamente não fechadas. Não são pendência esquecida.

| Lacuna | Por que fica |
|---|---|
| 231 sobreviventes de mutação `StringLiteral` em mensagem de erro, nos três pacotes | são mensagens não afirmadas por teste. Afirmei as que um curador leria; afirmar as 231 é ruído com custo de manutenção |
| 59 sobreviventes `Regex` nos gatilhos de RP-004 em `comum.ts` | cada variante de plural e gênero dos onze gatilhos seria um teste, e a D-061 já declara que o filtro é rede e não prova. Testar exaustivamente a rede não a transforma em prova |
| `conhecimento` em 40,77% de score de mutação | o grosso são as duas classes acima. O número baixo é medida da quantidade de texto no pacote, não da qualidade da proteção |
| RF-117, RF-416, RF-419, RF-503 e RF-902 saem na varredura de requisitos | todos triados como rótulo de âncora ou citação em comentário, nenhum é regra sem exercício |

## 2. Mapa de pastas alvo

Estrutura alvo. Existem hoje `packages/shared`, `packages/conhecimento`, `packages/dominio`,
`tools/`, `conhecimento/` e os arquivos de configuração da raiz. Faltam `packages/core` e
`packages/desktop`, e as pastas `heuristicas`, `notas` e `eventos` de `conhecimento/` existem
vazias. Pacote nasce quando tem conteúdo, e o glob `packages/*` do workspace já aceita os que
vierem.

```
valuation-simulator/
├── package.json                 workspaces Bun (D-035)
├── CLAUDE.md                    constituição
├── AGENTS.md                    este arquivo
├── DECISOES.md                  log numerado
├── PROTOCOLO-ETAPA.md           ciclo de etapa
├── docs/                        documento de requisitos e derivados
├── conhecimento/                YAML versionado, carregado no boot
│   ├── playbooks/
│   ├── heuristicas/
│   ├── notas/
│   └── eventos/
├── ingest/                      conteúdo bruto, fora do build e fora do git
├── packages/
│   ├── shared/                  Money, Rate, construtor Decimal fixado (D-045 a D-047)
│   ├── conhecimento/            schema Zod e loader
│   ├── dominio/                 engines/ e validadores/, puro, sem I/O
│   ├── core/                    Elysia, SQLite, MCP, providers, vigia
│   └── desktop/                 Electron e React
└── tools/
    └── validar-conhecimento.ts  CLI de validação com exit code
```

`engines` e `validadores` moram no mesmo pacote `dominio` de propósito: compartilham os
tipos de dinheiro e sempre versionam juntos.

---

## 3. Ordem de trabalho

Os passos 0 a 4 antecedem a Fase 1 do documento de requisitos e existem para viabilizá-la.

| Passo | Conteúdo | Estado |
|---|---|---|
| 0 | Governança, git, documento em `docs/` | Concluído |
| 1 | Monorepo Bun, e o primeiro commit real sendo `packages/shared` com `Money`, `Rate` e helpers sobre `decimal.js`, com teste. Antes de schema, antes de engine | Concluído |
| 2 | Schema Zod do conhecimento e CLI `validar-conhecimento.ts` com exit code. Nasce também a skill `.claude/skills/inspecao-conformidade/` (RNF-011) | Concluído |
| 3 | Engines contra fixtures, depois auxiliares, depois validadores, depois snapshot | **Em andamento.** Só `fcff_por_concessao` existe, e o passo está parado aguardando a pesquisa sobre B1, B3 e B8 |
| 4 | Loader lendo `conhecimento/` de verdade, engines contra playbook real. Encerra a Fase 1 | Pendente |

Depois seguem as fases 2 a 8 da seção 8 do documento de requisitos, com a **Etapa do
Conhecimento** entre a Fase 7 e a Fase 8, sem número de fase (D-070). É nela que o curador
autora o conteúdo que o expurgo tirou.


**Por que o Passo 2 vem antes de extrair conteúdo:** se a extração começar antes do schema
existir, dezenas de heurísticas nascem num formato que depois muda, e refaz tudo. A ordem é
forçada por dependência, não por preferência.

**Passo 3, ordem das engines.** `fcff_por_concessao` está feita. Faltam `ddm`,
`excess_return`, `fcff_normalizado` e `sotp`, depois as auxiliares `calcular_ke`,
`calcular_beta`, `sensibilidade` e `ponderar_cenarios`, depois os validadores, depois o
snapshot. **`fcff_normalizado` não começa antes de B1 ser respondida**, porque as duas
engines fazem a mesma pergunta sobre o que é o fluxo livre.

**A trilha B de conhecimento não existe mais no Passo 3.** Ela virou a Etapa do
Conhecimento, sem número de fase, entre a Fase 7 e a Fase 8 (D-070). Os três playbooks já
foram transcritos e depois expurgados do conteúdo analítico, e o que restou de conhecimento a
autorar está em `docs/nao-autorado/EXPURGO-2026-08-27.md`. A skill
`.claude/skills/extrair-conhecimento/` nasce lá, não aqui.

---

## 4. Vocabulário do projeto

| Termo | Significado |
|---|---|
| Playbook | Metodologia de um setor, em YAML. Define modelos habilitados, múltiplos bloqueados, regras duras, inputs, horizonte |
| Nota de ativo | Característica estrutural e permanente de uma empresa. Pode restringir modelos, nunca ampliar |
| Evento | Circunstância temporária, com `validade_ate` e `revisar_em` obrigatórios |
| Heurística de leitura | Onde olhar e do que desconfiar num documento. Vira alerta, nunca valor |
| Faixa de referência | Intervalo observado entre analistas, sempre setorial e agregado |
| Regra dura | Restrição metodológica implementada como validador TypeScript executável |
| Cenário | Variação de premissa ou de tratamento de evento. Até cinco por ativo, nomeados |
| Snapshot | Registro imutável e reproduzível de um cálculo |
| Curador | O usuário em papel de revisor de conhecimento ingerido |
| Fato | Tem procedência, o sistema busca |
| Premissa | Escolha do usuário, o sistema nunca escolhe |
| Composição | Premissa derivada de fatos mais escolhas do usuário por engine determinística |

---

## 5. Questões abertas

**A primeira linha bloqueia o resto do Passo 3.** As outras não bloqueiam.

| Questão | Quando resolve |
|---|---|
| **BLOQUEIA.** Pesquisa do curador sobre B1, B3 e B8 das premissas de interpretação, em `docs/premissas-de-interpretacao-fcff-por-concessao.md`. B1 decide o que é o fluxo livre e por isso trava `fcff_normalizado`; B3 decide o alinhamento de período e desloca tudo se estiver errada; B8 pode inverter a redução contratual | Agora, contra fonte primária, antes de qualquer engine nova |
| Todo o conhecimento analítico dos playbooks está em `docs/nao-autorado/EXPURGO-2026-08-27.md` esperando autoria: heurísticas, faixa de referência, modos de granularidade e horizonte de bancos | Etapa do Conhecimento |
| As duas entradas de múltiplo marcadas como conteúdo imutável com severidade a definir, P/VPA em bancos e comparação entre pares em transmissão. O texto se sustenta, falta decidir se voltam como alerta, como bloqueio total ou como heurística (D-068) | Etapa do Conhecimento |
| Como colapsar as vidas úteis de `ativos_produtivos` num horizonte único, e o `aviso_obrigatorio` que o modo agregado de commodities exigiria por RF-105 (D-072) | Etapa do Conhecimento |
| Provider de curva de juros para a taxa livre de risco: Tesouro ou BCB, não decidido | Fase 2, ou Passo 3 se `calcular_ke` precisar antes |
| Janela de cálculo do beta. RF-408 exige janela declarada mas não fixa o valor. Sessenta meses é convenção comum, decidir e registrar em `DECISOES.md` | Antes de `calcular_beta` |
| Tolerância dos casos de referência da Fase 8, não definida | Fase 8 |
| Playbook de Commodities é elaboração própria, sem base bibliográfica consolidada. Validar contra VALE3 | Fase 8 |
| Beta em ativo de baixa liquidez pode produzir Ke sem significado. A composição CAPM é opcional justamente por isso, mas falta decidir se o app sinaliza número de observações insuficiente | Antes de `calcular_beta` |
| RF-2007, citado no handoff de planejamento, não existe no documento v2.2. A proibição de transcrever material de terceiro no repositório distribuído não é requisito hoje. `/ingest` está fora do git de todo jeito, por RF-119 e D-015 | Quando houver decisão de distribuição |

---

## 6. Erros recorrentes neste projeto

Lista curta de armadilhas verificadas em planejamento. O detalhamento e o teste de decisão
de cada uma estão na seção 2 do `CLAUDE.md`.

1. `number` para dinheiro. O erro mais caro e o mais fácil de cometer, porque corrigir
   depois que existem schema, engines e fixtures significa mexer em tudo
2. Default em formulário de premissa, inclusive `placeholder` com número
3. String de interface valorativa, principalmente em mensagem de validação
4. Confundir ordenação padrão com ordenação pedida, e desabilitar a segunda por zelo
5. Engine lendo cotação ao vivo
6. Verificação web atualizando conhecimento automaticamente
7. Bypass de regra dura por nota de ativo
8. Flag booleana de premissa
9. Confundir cor por sinal com hierarquia visual por atratividade
10. Aceitar dado sem procedência, inclusive dado que o agente "sabe"
11. Faixa de referência por ativo em vez de setorial
12. Tratar ingestão como automação
