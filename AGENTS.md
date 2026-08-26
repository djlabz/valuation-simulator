# AGENTS.md

Continuidade entre sessões e entre agentes. Contém o que muda: estado, ordem de trabalho,
questões abertas. Regra permanente está em `CLAUDE.md` e não se repete aqui.

**Leia nesta ordem:** `CLAUDE.md`, depois `docs/REQUISITOS-valuation-simulator-v2.2.md`,
depois este arquivo, depois `PROTOCOLO-ETAPA.md`.

---

## 1. Estado atual

**Data:** 26/08/2026
**Etapa concluída:** Passo 2, schema Zod do conhecimento e CLI de validação
**Etapa seguinte:** Passo 3, engines contra fixtures e as duas trilhas em paralelo,
aguardando aprovação explícita

**Atenção, dois lugares com playbook.** A partir do Passo 2 existem duas versões dos três
playbooks: a da seção 9 do `docs/REQUISITOS-valuation-simulator-v2.2.md` e a de
`conhecimento/playbooks/`. **A de `conhecimento/` é a que roda e a que o CLI valida.** A do
documento ficou para trás em três pontos, por D-058, D-060 e D-061, e a correção da fonte é
tarefa própria com incremento para 2.3.0. Ver a primeira linha da seção 5.

**Existe:**

- `docs/REQUISITOS-valuation-simulator-v2.2.md`, escopo fechado e aprovado, cópia byte a
  byte da versão aprovada. 113 requisitos funcionais, 12 não funcionais, 41 decisões, três
  playbooks setoriais em YAML integral
- `docs/HANDOFF-planejamento-2026-08-24.md`, registro histórico da sessão de 24/08/2026,
  não é fonte de verdade. As divergências contra a v2.2 estão no cabeçalho do arquivo
- os quatro arquivos de governança
- repositório git inicializado, `/ingest` fora do versionamento
- monorepo Bun com um workspace, `packages/shared`, mais `package.json` da raiz,
  `tsconfig.base.json`, `vitest.config.ts`, `stryker.config.json` e `.editorconfig`
- `packages/shared`, o pacote `@valuation/shared`, com `decimal-config.ts` (construtor
  clonado de D-046), `money.ts` (`Money<Moeda>`), `rate.ts` (`Rate` e as conversões de bps)
  e `index.ts` como porta pública
- `packages/conhecimento`, o pacote `@valuation/conhecimento`, com o schema Zod dos quatro
  tipos de item, `comum.ts`, `playbook.ts`, `heuristica.ts`, `nota.ts`, `evento.ts`, mais
  `validar.ts`, que inclui a checagem cruzada de RF-109 entre nota e playbook
- `tools/validar-conhecimento.ts`, CLI com exit code, varrendo `conhecimento/` por lista
  branca de pastas
- `conhecimento/playbooks/` com os três playbooks da seção 9 transcritos byte a byte, e
  `conhecimento/fixtures-invalidas/` com nove fixtures, cada uma quebrando uma regra
- suíte Vitest com 84 testes, e `tsc --noEmit` sobre `packages/shared`,
  `packages/conhecimento` e `tools`
- mutation testing rodando por Stryker sobre `packages/shared`, score de 97,87% (D-049).
  O alvo do `stryker.config.json` ainda não inclui `packages/conhecimento`
- `.claude/skills/inspecao-conformidade/`, usada pela primeira vez no fechamento do Passo 2

**Não existe:** os pacotes `dominio`, `core` e `desktop`, nenhuma engine, nenhum validador
de regra dura executável, nenhum loader lendo `conhecimento/` em runtime (é do Passo 4),
nenhuma nota nem evento real em `conhecimento/`, nenhum banco, nenhuma interface, nenhum
linter (D-056).

---

## 2. Mapa de pastas alvo

Estrutura alvo. `package.json`, `packages/shared` e os arquivos de configuração da raiz
existem desde o Passo 1. O resto ainda não foi criado, e está aqui para o agente saber onde
cada coisa vai antes de criar. Pacote nasce quando tem conteúdo, e o glob `packages/*` do
workspace já aceita os que vierem.

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
| 3 | Duas trilhas em paralelo, ver abaixo | Pendente |
| 4 | Loader lendo `conhecimento/` de verdade, engines contra playbook real. Encerra a Fase 1 | Pendente |

Depois seguem as fases 2 a 8 da seção 8 do documento de requisitos.

**Por que o Passo 2 vem antes de extrair conteúdo:** se a extração começar antes do schema
existir, dezenas de heurísticas nascem num formato que depois muda, e refaz tudo. A ordem é
forçada por dependência, não por preferência.

**Passo 3, trilha A, código.** Engines contra fixtures nesta ordem:
`fcff_por_concessao`, `ddm`, `excess_return`, `fcff_normalizado`, `sotp`. Depois auxiliares:
`calcular_ke`, `calcular_beta`, `sensibilidade`, `ponderar_cenarios`. Depois validadores,
depois snapshot.

**Passo 3, trilha B, conhecimento.** Em três ondas: transcrever para YAML os três playbooks
já prontos na seção 9 do documento, validando pelo CLI; ingerir aulas e vídeos, com
proposta do agente e revisão do curador; notas de ativo dos papéis acompanhados, uma por
vez. Nesta trilha nasce a skill `.claude/skills/extrair-conhecimento/`, que ensina o
schema, o formato de alerta em quatro blocos (RF-116) e a proibição de sugerir valor
(RP-006).

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

Nada aqui bloqueia o Passo 3.

| Questão | Quando resolve |
|---|---|
| **Fonte de verdade divergente do YAML que roda.** A seção 9 do documento de requisitos não reflete três decisões do Passo 2: taxa de faixa sem aspas (D-058), `bancos-b3` e `commodities-b3` sem `modos` (D-060), e as três strings valorativas de `commodities-b3` (D-061). Corrigir o documento é tarefa própria, com incremento para 2.3.0 e diff revisado | Tarefa própria, antes de o documento ser citado como fonte de playbook outra vez |
| Campo `alertas` do playbook não tem requisito que defina nem exiba ele. Não entrou no filtro de RP-004 por isso, e a decisão é se ele é texto de interface, nota interna do curador, ou campo a remover | Antes da Fase 7, que é quando alerta vira tela |
| Os `modos` de `bancos-b3` e `commodities-b3` foram criados com um modo único e mínimo, por D-060. A taxonomia real de granularidade dos dois setores é questão de conhecimento, não de schema | Passo 3, trilha B, com o curador |
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
