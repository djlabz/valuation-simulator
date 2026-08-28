> **Ressalva de leitura, inserida em 25/08/2026.**
>
> Este arquivo é registro histórico da sessão de planejamento de 24/08/2026. Ele não é
> fonte de verdade. A fonte de verdade é `docs/REQUISITOS-valuation-simulator-v2.4.md`, que
> vence este arquivo em qualquer conflito. A tabela abaixo foi verificada contra a v2.2,
> que era a corrente na época; a v2.3 mudou a seção 9 e não mexeu em nada que a tabela cita.
>
> O handoff foi escrito contra uma versão anterior do documento de requisitos. As
> divergências abaixo foram verificadas contra os dois arquivos, uma a uma:
>
> | Onde, neste arquivo | O que o handoff diz | O que a v2.2 diz |
> |---|---|---|
> | Abertura, antes da seção 1 | A fonte de verdade é `REQUISITOS-valuation-simulator-v2.1.md` | A fonte de verdade é a v2.2, e o documento se declara na versão 2.2.0 |
> | Seção 4, Estado atual | 111 requisitos funcionais | 113 requisitos funcionais |
> | Seção 4, Estado atual | 39 decisões numeradas | 41 decisões numeradas, de D-001 a D-041 |
> | Seção 5, Passo 0, e seção 12 | Semear o `DECISOES.md` com D-001 a D-035, 35 decisões | São 41 decisões, e o `DECISOES.md` do repositório já nasceu com as 41 |
> | Seção 5, Passo 2, e seção 8 | RF-110 rejeita evento sem `validade_ate` | RF-110 exige `validade_ate` e `revisar_em`, e rejeita evento sem prazo |
>
> Onde foi verificado e não diverge: a contagem de requisitos não funcionais, 12 nos dois;
> a citação de requisito por ID, os 38 IDs citados aqui existem na v2.2; qualquer afirmação
> sobre playbook, label de modo de granularidade ou versão de playbook, que este arquivo não
> faz; e o texto das oito invariantes RP-001 a RP-008, idêntico nos dois arquivos.
>
> O valor deste arquivo é o porquê das decisões, que o documento de requisitos não conta.
> Nada daqui vale como conteúdo normativo.

# HANDOFF: valuation-simulator

**Para:** agente que assumir este projeto
**De:** sessão de planejamento concluída em 24/08/2026
**Status do projeto:** escopo fechado e aprovado. Zero linha de código escrita.

Leia este documento inteiro antes da primeira resposta. Ele não substitui `REQUISITOS-valuation-simulator-v2.1.md`, que é a fonte de verdade; ele te dá o que o documento de requisitos não diz: por que as decisões são o que são, o que ainda não existe, e onde você provavelmente vai errar.

---

## 1. Com quem você está falando

Daniel Oliveira, desenvolvedor fullstack em Aracaju, Brasil. TypeScript, React, Node, Python. Formado em Ciência da Computação em 2025.

Como trabalhar com ele:

- **Português brasileiro, registro informal.** Ele escreve com humor e abreviações. Responda no mesmo tom, sem formalidade artificial.
- **Discordância direta é bem-vinda e esperada.** Ele prefere ser contrariado com argumento a receber concordância automática. Se uma decisão dele tem problema, diga qual é o problema, não peça licença.
- **Nada de travessão (—) em texto.** Ele considera marca de texto gerado por IA. Use vírgula, ponto ou reescreva a frase. Vale para documentos, mensagens e comentários de código.
- **Governança pesada é o estilo dele, não excesso.** Ele usa `CLAUDE.md` como constituição, `DECISOES.md` como log numerado, `AGENTS.md` para continuidade multi-agente e `PROTOCOLO-ETAPA.md` para ciclo de etapa. Respeite esses arquivos.
- **Exit code é verbatim.** Regra dele, herdada de outro projeto: saída de verificação é colada literalmente, nunca descrita em prosa. Não escreva "os testes passaram", cole a saída.
- **Explicação inferida não vira mecanismo documentado.** Se você deduziu como algo funciona sem verificar, isso não entra em documento como fato.

---

## 2. O que é o projeto

Aplicação desktop Electron que calcula valuation de ações da B3 de forma determinística e auditável. Roda local. Não embute LLM: expõe um servidor MCP ao qual o usuário conecta o agente que já tem (Claude Code, Codex, Antigravity).

Três setores na v1: Transmissão de Energia, Bancos, Commodities.

**A tese central:** o agente de IA classifica, extrai e contextualiza. Nunca calcula e nunca escolhe premissa por julgamento. As engines calculam, os playbooks decidem metodologia, o usuário decide premissas.

Daniel não é certificado pela CVM. A proteção regulatória do produto é arquitetural, não declaratória: metade dos requisitos existe para garantir que o software informe sem recomendar. Isso não é paranoia jurídica adicionada por cima; é o eixo do desenho. Se você tratar como formalidade removível, vai quebrar o produto.

---

## 3. As oito invariantes

Estas são as restrições permanentes do documento (RP-001 a RP-008). Elas valem para código, interface, texto de UI, comentário e conteúdo de conhecimento. Um agente bem intencionado viola várias delas sem perceber.

| ID | Restrição |
|---|---|
| RP-001 | Nenhuma recomendação de compra, venda ou manutenção |
| RP-002 | Nenhum ranking proprietário nem ordenação padrão por atratividade |
| RP-003 | Nenhuma premissa com valor default preenchido pelo sistema |
| RP-004 | Nenhuma linguagem valorativa sobre ativo ou decisão ("barato", "oportunidade", "injusto") |
| RP-005 | Todo número exibido é rastreável a fato com procedência, a escolha do usuário, ou a aritmética sobre ambos |
| RP-006 | Nenhum componente sugere valor de premissa para ativo específico |
| RP-007 | Nenhum cenário é qualificado como mais provável pelo sistema |
| RP-008 | A base de conhecimento não se altera em tempo de execução |

**A linha que importa entender:** a distinção não é entre exibir ou não exibir número. É entre **derivar número de fato e de escolha do usuário** (permitido, e o produto faz bastante disso) e **escolher número por julgamento próprio** (nunca).

Exemplos do lado permitido: buscar a taxa da NTN-B e chamar de fato; calcular beta sobre série histórica; compor Ke por CAPM com o usuário escolhendo o prêmio de risco; mostrar tabela de sensibilidade com dez taxas diferentes; ponderar cenários com pesos que o usuário digitou.

Exemplos do lado proibido: sugerir 12% de taxa de desconto para a Engie; dizer que o cenário de reversão é mais provável; ordenar a lista por upside decrescente **por padrão**.

---

## 4. Estado atual

**Existe:** o documento de requisitos v2.1.0, com 111 requisitos funcionais, 12 não funcionais, 39 decisões numeradas e os três playbooks setoriais em YAML integral.

**Não existe:** nenhum código, nenhum repositório, nenhum arquivo de governança, nenhum playbook validado por schema.

**Aprovado por:** Daniel.

---

## 5. Ordem de trabalho acordada

Os passos abaixo antecedem a Fase 1 do documento de requisitos e existem para viabilizá-la.

### Passo 0: governança

Criar `CLAUDE.md` (com RP-001 a RP-008 traduzidos em regra executável para agente), `AGENTS.md`, `DECISOES.md` (semeado com D-001 a D-035 do documento) e `PROTOCOLO-ETAPA.md`. O documento de requisitos vai para `docs/`.

### Passo 1: esqueleto e tipos de dinheiro

Monorepo com Bun workspaces (não pnpm, ver D-035).

```
valuation-simulator/
├── package.json                 workspaces
├── conhecimento/
│   ├── playbooks/
│   ├── heuristicas/
│   ├── notas/
│   └── eventos/
├── ingest/                      conteúdo bruto, fora do build
├── packages/
│   ├── shared/                  Money, Bps, Decimal, tipos base
│   ├── conhecimento/            schema Zod + loader
│   ├── dominio/                 engines/ + validadores/  (puro, sem I/O)
│   ├── core/                    Elysia, SQLite, MCP, providers, vigia
│   └── desktop/                 Electron + React
└── tools/
    └── validar-conhecimento.ts
```

**Primeiro commit real:** `packages/shared` com `Money`, `Bps` e os helpers `add()`, `sub()`, `mul()`, `applyRate()` sobre `decimal.js`, com teste. Antes de schema, antes de engine. Ver seção 7.

`engines` e `validadores` ficam no mesmo pacote `dominio` de propósito: compartilham os tipos de dinheiro e sempre versionam juntos.

### Passo 2: schema do conhecimento (o portão)

Zod para playbook, heurística, nota de ativo e evento, mais o CLI `tools/validar-conhecimento.ts` que valida a pasta `conhecimento/` e sai com exit code.

Este CLI destrava a trilha de conhecimento sem depender do app rodando. Ele já implementa duas proteções: rejeita evento sem `validade_ate` (RF-110) e rejeita qualquer campo de premissa com valor preenchido (RF-112).

Neste passo também nasce a **skill de inspeção adversarial** em `.claude/skills/inspecao-conformidade/`, conforme RNF-011. Ela precisa existir cedo, porque revisar conformidade depois de cinco fases de código acumulado é muito mais caro que revisar a cada fase.

**Por que este passo vem antes da extração de conteúdo:** se a extração começar antes do schema existir, Daniel escreve dezenas de heurísticas num formato que depois muda e refaz tudo. A ordem é forçada por essa dependência, não por preferência.

### Passo 3: duas trilhas em paralelo

**Trilha A, código.** Engines contra fixtures, nesta ordem: `fcff_por_concessao`, `ddm`, `excess_return`, `fcff_normalizado`, `sotp`, depois auxiliares (`calcular_ke`, `calcular_beta`, `sensibilidade`, `ponderar_cenarios`). Depois validadores, depois snapshot.

**Trilha B, conhecimento.** Em três ondas:

1. Transcrever para YAML os três playbooks que já estão prontos no documento de requisitos (seção 9), validando pelo CLI
2. Ingerir aulas e vídeos: Daniel assiste, anota, joga em `/ingest`, o agente propõe heurísticas, Daniel revisa e comita
3. Notas de ativo dos papéis que ele acompanha, uma por vez

Nesta trilha, construir uma **skill local do projeto** em `.claude/skills/extrair-conhecimento/`, que ensina o schema, o formato de alerta em quatro blocos (RF-116) e a proibição de sugerir valor (RP-006). Sem ela, cada sessão de extração reexplica tudo e o agente escorrega em algum detalhe.

### Passo 4: convergência

Loader lendo `conhecimento/` de verdade, engines rodando contra playbook real. Encerra a Fase 1 do documento. Dali seguem as fases 2 a 8.

---

## 6. Conduta obrigatória do agente

Estas três regras valem em toda interação, não só na implementação.

### 6.1. Justificar toda implementação (RNF-010)

Nenhuma entrega vem sem explicação. Toda vez que você escrever ou alterar código, diga o que fez, qual requisito aquilo atende e o que você descartou no caminho. Daniel quer entender a decisão, não só receber o arquivo.

Entrega sem justificativa é entrega incompleta. Vale para refatoração, para escolha de biblioteca e para estrutura de pasta, não só para feature.

### 6.2. Contestar quando for o caso (RNF-012)

Você tem autoridade para discordar de Daniel, e a discordância é obrigatória, não opcional, quando a instrução dele:

- viola uma das oito invariantes
- cria risco legal
- é má prática de engenharia com consequência real

Contestar significa recusar a implementação e explicar o motivo, não implementar reclamando. Se ele insistir com argumento novo, reavalie de verdade. Se ele insistir sem argumento novo, mantenha a posição.

Ele autorizou linguagem informal e direta nessa situação. Não amenize para soar educado: o risco de você ceder por conforto é maior que o risco de você ser brusco. Ele prefere ouvir "isso te deixa exposto, não vou fazer" a receber o código e descobrir depois.

O inverso também vale: ele vai te confrontar, e às vezes ele estará certo. Contestação não é teimosia. Se ele mostrar que você entendeu errado, corrija sem cerimônia.

### 6.3. Inspeção adversarial de conformidade (RNF-011)

Metade dos requisitos existe para o software informar sem recomendar. Proteção que ninguém tentou furar não foi testada.

Ao fim de cada fase, código e textos de interface passam por revisão hostil: você assume o papel de quem quer encontrar brecha, procurando a interpretação mais desfavorável de cada elemento. Não a leitura generosa, a leitura torta.

Perguntas do tipo que a revisão faz:

- Este texto de UI pode ser lido como sugestão de compra por alguém mal-intencionado?
- Este default técnico se comporta como premissa financeira na prática?
- Este agrupamento de dados produz ranking sem chamar de ranking?
- Este alerta, lido fora de contexto, parece opinião do software?
- Algum caminho na interface exibe número que não seja rastreável a fato ou a escolha do usuário?

A revisão produz relatório de brechas com severidade, e é conduzida por skill dedicada do projeto (ver Passo 2).

---

## 7. Onde você vai errar

Lista de armadilhas reais, cada uma com o motivo.

**Usar `number` para dinheiro.** O erro mais caro do projeto e o mais fácil de cometer. Ponto flutuante acumula em fluxo descontado de dez anos com perpetuidade. Corrigir depois que existem schema, engines e fixtures significa mexer em tudo. `decimal.js` no primeiro commit, sem exceção (D-002, RNF-001).

**Preencher default em formulário.** `defaultValue={0.12}`, `placeholder="12%"` ou `value ?? 0.11` violam RP-003 e RP-006. Campo de premissa nasce vazio e fica vazio. Faixa de referência é elemento visual separado, nunca valor no input.

**Escrever texto de UI valorativo.** "Ação com bom desconto", "margem de segurança saudável", "momento favorável" violam RP-004. Toda string de interface passa por essa revisão.

**Confundir ordenação padrão com ordenação pedida.** A regra proíbe a listagem **abrir** ordenada por atratividade, porque isso é ranking do sistema (RP-002). Coluna clicável que o usuário ordena por upside ou DY é permitida e desejada, é ele decidindo o que quer ver. Não desabilite ordenação por excesso de zelo; garanta apenas que o estado inicial seja alfabético (RF-907, D-036).

**Deixar engine ler cotação ao vivo.** Quebra a reprodutibilidade (RF-801, RF-803). A cotação é congelada no snapshot no instante da execução. Engine não acessa rede, relógio nem cache.

**Deixar verificação web atualizar conhecimento automaticamente.** Parece conveniência. Faz o mesmo valuation dar número diferente amanhã sem premissa alterada, invalidando toda a auditoria (RF-124, D-026). Verificação sinaliza, o curador atualiza, vira commit.

**Criar bypass de regra dura por nota de ativo.** Vai aparecer um caso em que a regra incomoda. Se a nota puder desligar a regra, toda proteção do sistema fica opcional. Se um caso real exige exceção, a regra está mal formulada e se corrige no playbook, com justificativa (RF-109, D-020).

**Aceitar dado sem procedência.** Número extraído de documento sem `{documento, pagina, trecho_original}` é rejeitado pelo core, qualquer que seja a origem (RF-304). Vale também para dado que o agente "sabe".

**Confundir a camada de faixa de referência.** Faixa é sempre setorial e agregada. Faixa para um ativo específico é indistinguível de recomendação de premissa para aquele ativo (RF-113, D-024). E não existe faixa para `preco_normalizado_lp` em commodities, deliberadamente: em topo de ciclo os analistas convergem no mesmo preço superestimado, o que reforçaria a armadilha que o validador R-201 existe para impedir (D-014).

**Tratar a ingestão como automação.** A proposta de conhecimento nunca é aplicada sozinha. Passa por revisão humana e commit (RF-121, D-015). Daniel confirmou que confia na procedência do material dele; isso não altera a exigência de revisão, que existe para preservar reprodutibilidade, não para verificar direitos.

---

## 8. Vocabulário do projeto

| Termo | Significado |
|---|---|
| Playbook | Metodologia de um setor, em YAML. Define modelos habilitados, múltiplos bloqueados, regras duras, inputs |
| Nota de ativo | Característica estrutural e permanente de uma empresa. Pode restringir modelos |
| Evento | Circunstância temporária de uma empresa, com `validade_ate` obrigatório |
| Heurística de leitura | Onde olhar e do que desconfiar num documento. Vira alerta, nunca valor |
| Faixa de referência | Intervalo observado entre analistas, setorial e agregado |
| Regra dura | Restrição metodológica implementada como validador TypeScript executável |
| Cenário | Variação de premissa ou de tratamento de evento. Até cinco por ativo, nomeados |
| Snapshot | Registro imutável e reproduzível de um cálculo |
| Curador | Daniel em papel de revisor de conhecimento ingerido |
| Fato / Premissa | Fato tem procedência e o sistema busca. Premissa é escolha do usuário e o sistema nunca escolhe |

---

## 9. Decisões que parecem excesso e não são

Se Daniel questionar alguma destas, o argumento está aqui.

**D-006, nenhuma premissa com default.** Sugerir premissa é emitir opinião, e a opinião determina o preço teto, que determina a decisão de compra. O campo vazio é resolvido por três mecanismos que não opinam: faixa setorial, composição por CAPM e tabela de sensibilidade.

**D-020, nota não altera regra dura.** Explicado na seção 7.

**D-021, evento exige prazo de validade.** Conhecimento sem expiração apodrece em silêncio. Um alerta correto hoje fica ativamente enganoso em dois anos. Se não é possível dizer quando o fato deixa de valer, provavelmente é característica estrutural, e o lugar é a nota de ativo.

**D-039, o agente tem autoridade para contestar.** Concordância automática é o modo de falha mais provável de um agente neste projeto. Metade das restrições parece excesso quando lida isolada, e um agente que cede à pressão vai desligar proteções uma por uma, cada vez com uma justificativa razoável.

**D-031, ponderação de cenário vem do usuário.** Premissa não contém probabilidade. A chance de uma reversão judicial não está em nenhum dado extraído. O sistema teria que inventar, e aí é juízo sobre desfecho futuro. Com o peso vindo do usuário, a ponderação é aritmética legítima.

---

## 10. Ferramentas externas recomendadas

Skills do skills.sh, instaláveis com `npx skills add <owner/repo>`. Daniel pediu a avaliação; a ressalva de que skill de terceiro é instrução entrando direto no contexto do agente foi feita, e existe uma página de auditorias em `skills.sh/audits`.

Alto valor para os passos 1 a 3:

| Skill | Uso |
|---|---|
| `mattpocock/skills` → `domain-modeling` | Passos 1 e 2: modelar `Money` e o schema como tipos que impedem estado inválido |
| `obra/superpowers` → `test-driven-development` | Engines são funções puras, caso ideal de TDD |
| `obra/superpowers` → `verification-before-completion` | Casa com a regra de exit code verbatim |
| `anthropics/skills` → `pdf` | Extração do guia setorial na trilha B |
| `mattpocock/skills` → `writing-great-skills` | Antes de escrever a skill `extrair-conhecimento` |
| `mattpocock/skills` → `git-guardrails-claude-code` | Evita ação destrutiva de agente no git |

Skills locais do projeto, a escrever:

| Skill | Uso |
|---|---|
| `.claude/skills/extrair-conhecimento/` | Schema de conhecimento, formato de alerta em quatro blocos, proibição de sugerir valor |
| `.claude/skills/inspecao-conformidade/` | Revisão adversarial ao fim de cada fase, conforme RNF-011 |

Para a Fase 7: `anthropics/skills` → `frontend-design`, e `shadcn/ui` → `shadcn` se houver shadcn no Electron.

---

## 11. Questões abertas

Nada bloqueia o Passo 0. Estes itens ficam pendentes para quando chegar a hora:

- **Provider de curva de juros.** A composição CAPM precisa de taxa livre de risco com data. Fonte candidata é o Tesouro ou o BCB, não decidido.
- **Janela de cálculo do beta.** O documento exige janela declarada (RF-408) mas não fixa o valor. Sessenta meses é convenção comum; decidir e registrar.
- **Tolerância dos casos de referência.** A Fase 8 compara resultado com cálculo manual "dentro de tolerância definida". A tolerância não foi definida.
- **Playbook de Commodities.** Marcado como elaboração própria, sem base bibliográfica consolidada, diferente dos outros dois que vêm do guia setorial. Validar na Fase 8 contra VALE3.
- **Beta em ativo de baixa liquidez.** Risco reconhecido na tabela de riscos. A composição CAPM é opcional justamente por isso.

---

## 12. Primeira mensagem sugerida

Se Daniel abrir o projeto sem instrução específica, o próximo passo acordado é o **Passo 0**: escrever `CLAUDE.md` com as oito invariantes traduzidas em regra executável para agente, e `DECISOES.md` semeado com as 35 decisões do documento de requisitos.

Confirme com ele antes de gerar, porque a ordem pode ter mudado.
