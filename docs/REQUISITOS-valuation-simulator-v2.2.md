# valuation-simulator
## Documento de Requisitos Funcionais

**Versão:** 2.2.0
**Data:** 25 de agosto de 2026
**Status:** Escopo fechado para v1.

**Alterações desde 2.1.0:** eliminação de flags booleanas de premissa, substituídas por derivação a partir da presença do valor (RF-421, D-040); coloração por sinal aritmético permitida, hierarquia visual por atratividade proibida (RF-911, D-041); ajuste de label em `modos` do playbook de Transmissão.

**Alterações desde 2.0.0:** esclarecimento de que ordenação solicitada pelo usuário é permitida (RF-907); obrigação de justificativa em toda implementação (RNF-010); inspeção adversarial de conformidade (RNF-011); autoridade de contestação do agente (RNF-012).

**Alterações desde 1.3.0:** composição de premissas por engine (CAPM) e tabela de sensibilidade; cenários nomeados até cinco, com ponderação de probabilidade definida pelo usuário; horizonte de projeção derivado de fato por setor; alertas de preço configuráveis; ingestão de conhecimento confirmada na v1 com área de anexo; correção da stack (Bun workspaces, sem pnpm); consolidação e renumeração dos requisitos.

> **Nota de renumeração:** os requisitos foram reagrupados e renumerados nesta versão. Referências a numeração anterior devem ser reconferidas. A partir daqui a numeração é estável.

---

## 1. Visão do Produto

O `valuation-simulator` é uma aplicação desktop que executa cálculos de valuation de ações de forma determinística e auditável, aplicando a metodologia correta para cada setor, empresa e circunstância, sob premissas escolhidas integralmente pelo usuário.

O sistema não recomenda investimentos. Ele faz o levantamento: identifica o que existe nos documentos, explica por que aquilo afeta o cálculo, mostra escala de referência, decompõe premissas em partes observáveis e calcula cenários alternativos. A escolha das premissas e a leitura do resultado permanecem com o usuário.

### 1.1. A tese central da arquitetura

O agente de IA nunca calcula e nunca escolhe premissa por julgamento.

| Camada | Responsável | Faz | Não faz |
|---|---|---|---|
| Classificação | Agente e playbooks | Identifica setor e modelo de negócio | Ignora restrições do playbook |
| Seleção de modelo | Agente, com confirmação | Propõe modelo da lista habilitada, com justificativa | Escolhe fora da lista |
| Extração | Agente | Lê documentos, devolve dado com procedência | Produz número sem fonte |
| Orientação | Heurísticas, notas, eventos | Alerta, contextualiza, oferece cenário | Escolhe valor de premissa |
| Composição | Engines auxiliares | Deriva premissa de fatos mais escolhas do usuário | Escolhe as partes pelo usuário |
| Cálculo | Engines | Executa matemática determinística | Interpreta contexto |
| Apresentação | Electron | Exibe resultado, cenários e auditoria | Ordena por atratividade |

### 1.2. A linha que define o produto

O sistema faz o levantamento completo e para antes da conclusão.

| Ação | Permitido |
|---|---|
| "Existe provisão de R$ X registrada nas notas, item 24" | Sim. Fato com procedência |
| "Provisão reduz o fluxo projetado; se revertida, o efeito não se materializa" | Sim. Explicação de mecanismo |
| "Faixa observada entre analistas do setor: 9% a 14%" | Sim. Observação agregada |
| "A NTN-B 2035 paga 10,8% ao ano nesta data" | Sim. Fato de mercado |
| "Com taxa de 11% o preço teto é R$ 41,80; com 13%, R$ 37,50" | Sim. Aritmética repetida |
| "Você atribuiu 70% de chance ao cenário B; valor ponderado R$ 41,69" | Sim. Peso definido pelo usuário |
| "Considere adotar 5% em vez de 12%" | Não. Análise de valor mobiliário |
| "O cenário mais provável é o B" | Não. Juízo sobre desfecho futuro |

A distinção operante não é entre exibir ou não exibir número. É entre **derivar número de fato e de escolha do usuário** e **escolher número por julgamento próprio**. A primeira o sistema faz o quanto for útil. A segunda não faz nunca.

### 1.3. A tríade do conhecimento

| Bloco | O que é | Origem | Auto-preenche |
|---|---|---|---|
| Fatos | Números da companhia e do mercado | Documentos, providers | Sim, sempre com procedência |
| Contexto | Onde olhar, o que existe, o que mudou | Material ingerido, análise própria | Sim, vira alerta ou cenário |
| Premissas | Escolhas de projeção e de risco | Exclusivamente o usuário | Nunca por julgamento do sistema |

### 1.4. Camadas de conhecimento

Do geral ao específico, com precedência crescente:

```
Playbook setorial     ->  metodologia do setor         (transmissao-energia-b3)
  └─ Nota de ativo    ->  característica estrutural     (KLBN11 é verticalizada)
       └─ Evento      ->  circunstância temporária      (EGIE3 tem passivo em discussão)
```

Camada mais específica restringe a mais geral. Nenhuma contraria regras duras.

### 1.5. Modelo de distribuição

Aplicação Electron rodando localmente. Não embute LLM e não solicita chave de API. Expõe um servidor MCP ao qual o usuário conecta o agente que já possui (Claude Code, Codex, Antigravity ou equivalente). Público da v1: desenvolvedor. Endpoint de LLM configurável fica para v2, com core idêntico.

---

## 2. Escopo

### 2.1. Dentro do escopo da v1

Mercado B3, moeda BRL, setores de Transmissão, Bancos e Commodities. Busca automática com fallback manual guiado. Cotação viva durante o pregão, com variação do dia e DY. Servidor MCP. Base de conhecimento em quatro níveis (playbook, heurística, nota de ativo, evento) com pipeline de ingestão e área de anexo. Composição de premissas por CAPM e tabela de sensibilidade. Até cinco cenários nomeados, com ponderação opcional. Alertas de preço configuráveis. Snapshot de auditoria imutável. Persistência em SQLite.

### 2.2. Fora do escopo da v1

Mercados internacionais. Multimoeda na interface. Hospedagem web e multiusuário. Chat embutido e endpoint de LLM configurável (v2). Criação de playbooks e heurísticas pela interface (permanece via ingestão e commit). Mais de cinco cenários por ativo. Demais setores do guia: Saneamento, Imobiliário e REITs, Varejo, Saúde, Logística.

### 2.3. Restrições permanentes

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

Estas restrições são referenciadas ao longo do documento em vez de repetidas. Um requisito que cite RP-006, por exemplo, herda a proibição integral.

---

## 3. Atores

| Ator | Papel |
|---|---|
| Usuário | Opera o app e fornece todas as premissas |
| Agente externo | LLM do usuário via MCP. Classifica, propõe modelo, extrai, contextualiza |
| Curador | O usuário em papel distinto: revisa e aprova conhecimento ingerido |
| Core | Processo Bun, dono exclusivo do SQLite. Executa engines e valida regras |
| Providers | brapi (cotação, proventos, série histórica), BCB (PTAX), Tesouro (curva de juros), CVM/RAD (documentos) |

---

## 4. Arquitetura

```
Bun core (processo único, dono exclusivo do SQLite)
├── Elysia HTTP  --Eden-->  Electron renderer (React + TanStack Query)
├── MCP server    <-------  Agente do usuário
├── Engines        (funções puras, decimal.js, sem I/O)
│   ├── Valuation  (fcff_por_concessao, ddm, excess_return, fcff_normalizado, sotp)
│   └── Auxiliares (calcular_ke, calcular_beta, sensibilidade, ponderar_cenarios)
├── Validadores    (regras duras executáveis)
├── Conhecimento   (YAML no repo, carregado no boot)
│   ├── Playbooks setoriais
│   ├── Heurísticas de leitura e faixas de referência
│   ├── Notas de ativo
│   └── Registro de eventos
├── Cache externo  (SQLite com TTL)
├── Vigia          (alertas de preço configurados pelo usuário)
└── Providers      (atrás de interface, substituíveis)

/ingest  ---- pipeline offline, fora do runtime ----> proposta > revisão > commit
```

**Invariantes.** O renderer nunca acessa o SQLite diretamente. A ingestão nunca escreve conhecimento automaticamente. Verificação web sinaliza obsolescência e nunca altera dado usado em cálculo.

### 4.1. Stack

| Camada | Tecnologia |
|---|---|
| Monorepo | Bun workspaces (via `package.json`) |
| Frontend | React, TypeScript, Vite, TanStack Query |
| Backend | Elysia sobre Bun, Eden para tipagem end-to-end |
| Desktop | Electron |
| Banco | SQLite (`bun:sqlite`) via Drizzle, schema portável para Postgres |
| Precisão numérica | `decimal.js`, obrigatório (RNF-001) |
| Validação | Zod, para engines e arquivos de conhecimento |
| Testes | Vitest com mutation testing |

---

## 5. Requisitos Funcionais

### 5.1. Base de Conhecimento

O conhecimento vive em YAML versionado no repositório e é carregado no boot. Os schemas completos estão nos exemplos desta seção e na seção 9; os requisitos abaixo tratam de comportamento, não de campos.

| ID | Requisito |
|---|---|
| RF-101 | Todo conhecimento é carregado e validado no boot. Arquivo malformado impede a inicialização com erro explícito |
| RF-102 | Playbook setorial define detecção, múltiplos bloqueados, modelos habilitados, regras duras, modos de granularidade, horizonte de projeção, inputs obrigatórios, premissas e heurísticas |
| RF-103 | Todo input obrigatório declara `onde_encontrar`, com instrução de localização na documentação da companhia |
| RF-104 | Múltiplo bloqueado declara severidade (`bloqueio_total` ou `alerta`) e motivo exibível. Múltiplo bloqueado não é exibido; em seu lugar aparece o motivo |
| RF-105 | Modo de granularidade reduzida exige aviso obrigatório exibido antes da seleção |
| RF-106 | Heurística de leitura declara onde olhar, o que verificar, por que importa, severidade (`informativo` ou `bloqueia_ate_ciente`), confiança (`alta`, `media`, `baixa`) e fonte |
| RF-107 | Heurística pode vincular-se a uma premissa por `campo_relacionado`, e então o alerta aparece junto ao campo no momento do preenchimento |
| RF-108 | Heurísticas com `divergencia: true` apresentam as visões conflitantes lado a lado, sem que o sistema escolha uma |
| RF-109 | Nota de ativo registra característica estrutural de uma empresa. Pode restringir modelos habilitados e adicionar heurísticas. Não pode ampliar a lista de modelos, alterar regras duras ou múltiplos bloqueados |
| RF-110 | Evento registra circunstância temporária e exige `validade_ate` e `revisar_em`. Evento sem prazo é rejeitado na ingestão. Evento vencido é ocultado automaticamente |
| RF-111 | Evento descreve fato e mecanismo. Não qualifica probabilidade de desfecho (RP-007) |
| RF-112 | Nenhum item de conhecimento contém valor de premissa (RP-006) |
| RF-113 | Faixa de referência declara mínimo, máximo, número de observações, base, confiança e data. É sempre setorial e agregada, nunca por ativo individual |
| RF-114 | Faixa com data superior a 12 meses é exibida marcada como desatualizada |
| RF-115 | Valor digitado fora da faixa gera indicação informativa e não impede o prosseguimento |

> **Por que RF-113 proíbe faixa por ativo.** Faixa para um ativo específico é indistinguível de recomendação de premissa para aquele ativo. A agregação setorial preserva o caráter de observação.

> **Por que RF-109 proíbe bypass de regra dura.** Se uma nota puder desligar uma regra dura, toda proteção do sistema torna-se opcional, bastando redigir a nota. Caso um caso real exija exceção, a regra dura está mal formulada e deve ser corrigida no playbook.

> **Por que RF-110 exige prazo.** Conhecimento sem data de expiração apodrece em silêncio. Se não é possível dizer quando o fato deixa de valer, provavelmente não é evento e sim característica estrutural, cujo lugar é a nota de ativo.

#### Formato do alerta contextual

Todo alerta gerado por heurística, nota ou evento segue quatro blocos. A estrutura existe para que o alerta informe sem concluir.

| ID | Requisito |
|---|---|
| RF-116 | O alerta contém, nesta ordem: o que foi identificado (com procedência completa, obrigatório); por que afeta o cálculo (mecanismo, obrigatório); contexto de escala (faixa, quando existir); ação disponível (oferta de cenário, quando aplicável) |
| RF-117 | Nenhum bloco contém valor numérico sugerido de premissa (RP-006) nem adjetivo valorativo (RP-004) |

**Exemplo conforme:**

> **Passivo contingente identificado.** Provisão de R$ X registrada no 3T26 (Notas Explicativas, item 24, pág. 47). A companhia classifica o risco de perda como *possível*; o processo está em discussão administrativa.
>
> **Por que afeta o cálculo.** A provisão reduz o fluxo de caixa projetado. Caso a discussão seja revertida, o efeito não se materializa.
>
> **Faixa observada no setor.** Taxa de desconto entre 9% e 14% (7 observações, atualizado 08/2026).
>
> Calcular nos dois cenários: com provisão mantida e com reversão.

#### Ingestão e obsolescência

| ID | Requisito |
|---|---|
| RF-118 | A interface oferece área de anexo para ingestão, aceitando PDF, texto, markdown e imagem |
| RF-119 | Conteúdo anexado é depositado em `/ingest`, fora do runtime, e tratado como de procedência confiável |
| RF-120 | O agente produz proposta estruturada de heurísticas, notas, eventos, conflitos e lacunas |
| RF-121 | A proposta nunca é aplicada automaticamente. Exige revisão do curador, incremento de versão e commit (RP-008) |
| RF-122 | Proposta que contenha valor sugerido de premissa é rejeitada automaticamente na validação (RP-006) |
| RF-123 | Conflito entre fontes é resolvido pelo curador: uma prevalece, ou ambas coexistem com `divergencia: true` |
| RF-124 | O agente pode consultar a web para verificar se nota ou evento permanece válido, quando `revisar_em` está vencido. A verificação sinaliza e nunca altera conhecimento ou dado de cálculo |

> **Por que a verificação não atualiza.** Se resultado de busca alterasse o cálculo automaticamente, o mesmo valuation produziria números distintos em dias distintos sem alteração de premissa, invalidando a reprodutibilidade (RF-801).

### 5.2. Classificação e Seleção de Modelo

| ID | Requisito |
|---|---|
| RF-201 | O agente classifica o ativo pelos critérios de detecção dos playbooks e retorna sugestão com justificativa |
| RF-202 | O usuário confirma ou sobrescreve a classificação antes de qualquer cálculo |
| RF-203 | Ativo sem playbook correspondente é rejeitado, com indicação dos setores suportados |
| RF-204 | Playbooks declaram `nao_confundir_com`, exibido na confirmação |
| RF-205 | O agente propõe qual modelo utilizar dentro da lista habilitada, com justificativa escrita, sujeita a confirmação do usuário |
| RF-206 | O agente não propõe modelo fora da lista habilitada pelo playbook ou restringida por nota de ativo |

### 5.3. Dados e Procedência

| ID | Requisito |
|---|---|
| RF-301 | O sistema tenta busca automática dos inputs obrigatórios nas fontes configuradas |
| RF-302 | Dado não localizado gera pendência acompanhada do texto `onde_encontrar` |
| RF-303 | O usuário resolve pendência por upload de documento ou digitação direta |
| RF-304 | Todo dado extraído carrega procedência (`documento`, `pagina`, `trecho_original`). Dado sem procedência é rejeitado pelo core, qualquer que seja a origem |
| RF-305 | O usuário revisa e confirma os dados extraídos antes da execução |
| RF-306 | Dado pode carregar ressalva vinculada a heurística, exibida na conferência |
| RF-307 | Quando heurística identifica valor ajustado além do reportado, ambos são gravados e o usuário escolhe qual usar |
| RF-308 | Documentos enviados são armazenados localmente e reutilizados em cálculos futuros |

### 5.4. Premissas

| ID | Requisito |
|---|---|
| RF-401 | Toda premissa inicia vazia (RP-003). O cálculo é bloqueado enquanto houver premissa obrigatória não preenchida |
| RF-402 | Nenhum componente do sistema propõe valor de premissa para ativo específico (RP-006) |
| RF-403 | Premissas podem ser salvas como preset nomeado e reaplicadas. Presets de terceiros são rotulados como externos, editáveis e nunca pré-selecionados |
| RF-404 | O sistema exibe, como contexto: série histórica quando disponível, faixa setorial quando existir, e tabela de sensibilidade |

#### Composição de premissa

Premissa composta é derivada de fatos e de escolhas do usuário por engine determinística. O número resultante não é julgamento do sistema, e sim aritmética sobre partes identificadas.

| ID | Requisito |
|---|---|
| RF-405 | Premissa pode declarar `composicao_disponivel`, oferecendo ao usuário montá-la por partes em vez de digitar o valor final |
| RF-406 | A composição de custo de capital próprio segue CAPM: `Ke = Rf + (beta × ERP) + premio_adicional` |
| RF-407 | `Rf` é fato: taxa de título público de prazo compatível, buscada com data e fonte |
| RF-408 | `beta` é fato: calculado pela engine `calcular_beta` sobre série histórica de preços, com janela declarada |
| RF-409 | `ERP` e `premio_adicional` são escolhas do usuário, exibidas com faixa histórica quando disponível |
| RF-410 | O valor composto é exibido com a decomposição visível, e cada parte é rastreável (RP-005) |
| RF-411 | A composição é opcional. O usuário pode digitar o valor final diretamente |
| RF-412 | Engines de composição obedecem às mesmas regras das engines de valuation (RF-501) |

**Exemplo de decomposição exibida:**

```
Taxa de desconto (Ke)
├── Taxa livre de risco        10,8%   fato: NTN-B 2035, 24/08/2026
├── Beta (janela 60 meses)      0,72   fato: calculado
├── Prêmio de risco de mercado     ?   escolha sua (faixa histórica: 4% a 7%)
└── Prêmio adicional               ?   escolha sua
                                ─────
Ke resultante                       ?
```

#### Sensibilidade

| ID | Requisito |
|---|---|
| RF-413 | O sistema oferece tabela de sensibilidade antes da definição da premissa, repetindo o cálculo em pontos de uma grade |
| RF-414 | A grade é aritmética sobre a premissa variada, sem indicação de ponto preferencial (RP-006) |
| RF-415 | Sensibilidade é ferramenta de exploração e não gera snapshot |

#### Horizonte de projeção

| ID | Requisito |
|---|---|
| RF-416 | O horizonte é derivado de fato sempre que o setor permitir, e não constitui premissa do usuário nesses casos |
| RF-417 | Transmissão: horizonte de cada concessão é a respectiva data de vencimento contratual |
| RF-418 | Commodities: horizonte é limitado pela vida útil de reserva declarada pela companhia |
| RF-419 | Bancos: horizonte segue convenção setorial declarada no playbook, ajustável pelo usuário, com justificativa exibida |
| RF-420 | Horizonte que exceda o fato derivado é bloqueado por regra dura do playbook correspondente |
| RF-421 | Flag booleana de premissa é proibida. A inclusão ou exclusão de um efeito é derivada da presença do valor correspondente informado pelo usuário |

### 5.5. Engines e Regras Duras

| ID | Requisito |
|---|---|
| RF-501 | Engines são funções puras: sem I/O, sem rede, sem relógio, sem aleatoriedade |
| RF-502 | Cada engine declara schema Zod de entrada e de saída |
| RF-503 | Toda aritmética monetária usa `decimal.js`. `number` é proibido para valores financeiros (RNF-001) |
| RF-504 | Engine retorna resultado desagregado por etapa, não apenas o valor final |
| RF-505 | Toda engine tem cobertura validada por mutation testing. Alteração exige incremento de versão |
| RF-506 | Cada regra dura de playbook referencia um validador TypeScript executável, com teste próprio cobrindo aprovação e rejeição |
| RF-507 | Validadores executam antes da engine. Falha aborta o cálculo com erro estruturado contendo id da regra, mensagem e motivo metodológico |
| RF-508 | Regra dura não é contornável por instrução do agente, configuração do usuário, nota de ativo ou evento |

**Engines de valuation:** `fcff_por_concessao`, `ddm`, `excess_return`, `fcff_normalizado`, `sotp`.
**Engines auxiliares:** `calcular_ke`, `calcular_beta`, `sensibilidade`, `ponderar_cenarios`.

**Validadores da v1:**

| ID | Validador | Playbook |
|---|---|---|
| R-001 | `validarPerpetuidadeZero` | Transmissão |
| R-002 | `validarFimDeFluxoNaConcessao` | Transmissão |
| R-003 | `validarValorResidual` | Transmissão |
| R-101 | `validarSemEnterpriseValue` | Bancos |
| R-102 | `validarRetencaoRegulatoria` | Bancos |
| R-103 | `validarSpreadROEKe` | Bancos |
| R-201 | `validarPrecoNormalizadoInformado` | Commodities |
| R-202 | `validarCambioNormalizado` | Commodities |
| R-203 | `validarBreakeven` | Commodities |
| R-204 | `validarHorizonteVsReserva` | Commodities |

### 5.6. Cenários

Cenário é o mecanismo que substitui sugestão de premissa. Onde caberia uma dica de valor, há resultados calculados lado a lado.

| ID | Requisito |
|---|---|
| RF-601 | Um ativo comporta até cinco cenários salvos, nomeados livremente pelo usuário |
| RF-602 | Cenário difere de outro por premissa ou por tratamento de evento. Todos compartilham os mesmos fatos extraídos |
| RF-603 | O sistema não indica qual cenário é mais provável nem atribui probabilidade por conta própria (RP-007) |
| RF-604 | A interface exibe diferença absoluta e percentual entre cenários, atribuída à premissa ou evento que a originou |
| RF-605 | O usuário pode atribuir peso de probabilidade a cada cenário; a engine `ponderar_cenarios` calcula o valor ponderado |
| RF-606 | Os pesos são identificados como definidos pelo usuário sempre que o valor ponderado é exibido |
| RF-607 | Ponderação é opcional. Sem pesos, os cenários são exibidos sem valor consolidado |
| RF-608 | Evento com `apresenta_cenarios` oferece automaticamente cenário adicional |
| RF-609 | Todos os cenários de um cálculo integram um único snapshot |

**Exemplo de ponderação:**

```
Cenário A (provisão mantida)    R$ 38,40    peso 30%   definido por você
Cenário B (reversão)            R$ 43,10    peso 70%   definido por você
                                ─────────
Valor ponderado                 R$ 41,69
```

### 5.7. Mercado, Proventos e Vigia

| ID | Requisito |
|---|---|
| RF-701 | Toda leitura externa passa pelo cache com TTL. Nenhum consumidor chama provider diretamente |
| RF-702 | TTL por classe: cotação 60s, proventos 24h, curva de juros 24h, documentos permanente |
| RF-703 | Atualização automática ocorre apenas durante pregão e apenas para ativos em watchlist ou visíveis em tela |
| RF-704 | O sistema mantém calendário de feriados B3, distinto do calendário nacional |
| RF-705 | Fora do pregão, exibe o último fechamento com indicação de mercado fechado. Nunca exibe variação zero |
| RF-706 | Falha de provider aplica backoff. Três falhas consecutivas suspendem a chave por cinco minutos |
| RF-707 | Falha de rede nunca produz tela de erro: exibe o último valor conhecido com a idade do dado |
| RF-708 | Providers ficam atrás de interface e são substituíveis sem alteração do restante |
| RF-709 | Providers da v1 cobrem cotação, proventos, série histórica de preços, PTAX e curva de juros |
| RF-710 | DY padrão: proventos com data-com nos últimos 365 dias divididos pela cotação atual. Definições alternativas selecionáveis em configurações |
| RF-711 | A definição de DY vigente é exibida junto ao número, sempre |
| RF-712 | O sistema calcula e armazena DY bruto e líquido para pessoa física, alternáveis na exibição. JCP e dividendo são armazenados segregadamente |
| RF-713 | DY é bloqueado como métrica decisória no playbook de Commodities |

#### Alertas de preço

| ID | Requisito |
|---|---|
| RF-714 | O usuário configura alertas por preço absoluto, por upside percentual sobre o preço teto que ele calculou, ou por DY acima de um patamar |
| RF-715 | O texto do alerta é factual e informa o gatilho e a data em que foi definido pelo usuário. Não contém linguagem valorativa (RP-004) |
| RF-716 | Alertas disparam com o app aberto e como catch-up no boot. A interface informa essa limitação ao configurar |
| RF-717 | Alerta vinculado a preço teto referencia o snapshot que o originou |

### 5.8. Auditoria

| ID | Requisito |
|---|---|
| RF-801 | Todo cálculo gera snapshot imutável e reprodutível: mesmos inputs e versões produzem resultado idêntico |
| RF-802 | O snapshot registra: fatos com procedência; premissas do usuário e sua composição, quando houver; versões de playbook, engine e base de conhecimento; modelo selecionado com justificativa; modo de granularidade; horizonte e sua origem; heurísticas, notas e eventos acionados; faixas exibidas; cenários e pesos; verificações de obsolescência realizadas; cotação congelada com timestamp e fonte; resultado desagregado |
| RF-803 | Engines nunca leem cache ao vivo. A cotação é congelada no instante da execução |
| RF-804 | Reexecução gera novo snapshot e nunca sobrescreve o anterior |
| RF-805 | O snapshot é exportável em formato legível |

> **Por que RF-802 é extenso.** Reprodutibilidade exige que tudo que influenciou o número esteja no registro, inclusive o contexto que o usuário viu ao decidir. Um snapshot que registre só os inputs não permite reconstruir por que aquela premissa foi escolhida.

### 5.9. Interface

| ID | Requisito |
|---|---|
| RF-901 | **Home e Busca.** Pesquisa de ativos B3, marcação de acompanhamento, atalho para cálculo |
| RF-902 | **Fundamentos.** Confirmação do modelo proposto, seleção de modo, conferência de dados com procedência, alertas contextuais, composição de premissas, faixas, sensibilidade e pendências |
| RF-903 | **Resultados.** Listagem com preço, variação do dia, DY, preço teto e upside. Ativos com múltiplos cenários exibem todos, com valor ponderado quando houver pesos |
| RF-904 | **Conhecimento.** Área de anexo para ingestão, lista de propostas pendentes de revisão e fila de itens com `revisar_em` vencido |
| RF-905 | **Configurações.** Definição de DY, bruto ou líquido, fontes de dados, alertas de preço e conexão MCP |
| RF-906 | Upside é exibido como resultado aritmético e descrito como aritmética |
| RF-907 | Ordenação padrão da listagem é alfabética (RP-002). Ordenação solicitada pelo usuário, por clique em cabeçalho de coluna, é permitida em qualquer coluna, inclusive upside e DY |
| RF-908 | Cada linha dá acesso ao snapshot correspondente |
| RF-909 | Alerta de severidade `bloqueia_ate_ciente` exige confirmação de leitura antes do cálculo |
| RF-910 | Nota ou evento vencido é ocultado e não aparece como vigente |
| RF-911 | Coloração por sinal aritmético é permitida e aplicada uniformemente a todo número com sinal. Hierarquia visual por atratividade é proibida: nenhum badge, ícone, realce de linha ou agrupamento destaca ativo por upside, DY ou métrica equivalente (RP-002) |

### 5.10. Servidor MCP

| Ferramenta | Função |
|---|---|
| `buscar_ativo` | Localiza ativo por ticker ou razão social |
| `classificar_setor` | Retorna playbook sugerido com justificativa |
| `obter_playbook` | Devolve o playbook completo |
| `obter_heuristicas` | Retorna heurísticas aplicáveis ao documento em análise |
| `obter_contexto_ativo` | Retorna notas e eventos vigentes para o ticker |
| `propor_modelo` | Registra proposta de modelo com justificativa, para confirmação |
| `listar_inputs_faltantes` | Retorna pendências com `onde_encontrar` |
| `registrar_dado_extraido` | Grava fato com procedência obrigatória |
| `registrar_ressalva` | Vincula heurística acionada a um dado extraído |
| `listar_premissas_pendentes` | Retorna premissas não preenchidas, com faixa e composição disponível |
| `calcular_sensibilidade` | Executa a grade de sensibilidade sobre uma premissa |
| `verificar_obsolescencia` | Sinaliza notas e eventos vencidos ou com indício de mudança |
| `executar_valuation` | Dispara validadores e engine, retorna snapshot |
| `obter_snapshot` | Recupera snapshot por id |
| `listar_resultados` | Lista cálculos realizados |

| ID | Requisito |
|---|---|
| RF-1001 | Ferramentas MCP são o único canal de escrita disponível ao agente |
| RF-1002 | Nenhuma ferramenta aceita valor calculado pelo agente. Apenas fatos com procedência |
| RF-1003 | Nenhuma ferramenta permite gravar premissa em nome do usuário (RP-006), nem criar ou alterar playbook, heurística, nota, evento ou faixa (RP-008) |
| RF-1004 | Alterações de estado via MCP refletem no Electron sem recarga manual |

---

## 6. Requisitos Não Funcionais

| ID | Requisito |
|---|---|
| RNF-001 | **Precisão numérica.** Valores financeiros usam `decimal.js` em memória e string no armazenamento. `number` é proibido. Decisão irreversível na prática |
| RNF-002 | **Portabilidade de banco.** Schema Drizzle migra para Postgres sem reescrita de queries |
| RNF-003 | **Determinismo.** Nenhuma engine acessa relógio, rede ou aleatoriedade |
| RNF-004 | **Instalação.** Empacotamento Electron sem dependência de serviço externo |
| RNF-005 | **Verificação.** Suíte de testes executada com exit code verbatim, sem interpretação de saída |
| RNF-006 | **Rate limiting.** Consumo de providers respeita limites publicados e não dispara requisição por ativo fora de interesse |
| RNF-007 | **Governança.** `CLAUDE.md` e `AGENTS.md` como constituição do agente de desenvolvimento, `DECISOES.md` como log numerado |
| RNF-008 | **Imutabilidade em runtime.** Conhecimento carregado no boot permanece constante durante a sessão |
| RNF-009 | **Manutenção do conhecimento.** Notas e eventos crescem com a carteira acompanhada. A v1 limita cobertura aos ativos monitorados, e `revisar_em` funciona como fila de trabalho |
| RNF-010 | **Justificativa obrigatória.** Toda implementação é acompanhada de explicação do que foi feito, do requisito que atende e das alternativas descartadas. Código entregue sem justificativa é entrega incompleta |
| RNF-011 | **Inspeção adversarial de conformidade.** Ao fim de cada fase, código e textos de interface passam por revisão que simula leitura hostil, buscando ativamente a interpretação mais desfavorável de cada elemento. A revisão é conduzida por skill dedicada e produz relatório de brechas com severidade |
| RNF-012 | **Autoridade de contestação.** O agente contesta instrução que viole invariante, lei aplicável ou boa prática de engenharia, em vez de executá-la. A contestação é obrigatória, não opcional, e precede qualquer implementação |

---

## 7. Princípios de Conformidade

O usuário não é certificado pela CVM. A proteção é arquitetural, não declaratória. A tabela abaixo mapeia cada princípio ao requisito que o implementa, e existe para que a origem de cada restrição permaneça compreensível.

| ID | Princípio | Implementação |
|---|---|---|
| CR-001 | Nenhuma premissa preenchida por julgamento do sistema | RP-003, RP-006, RF-401, RF-402 |
| CR-002 | Número derivado é sempre decomponível em fato e escolha | RP-005, RF-410 |
| CR-003 | Ausência de ranking ou ordenação por atratividade | RF-907 |
| CR-004 | Ausência de linguagem valorativa | RP-004, RF-117, RF-715 |
| CR-005 | Autoria das premissas rastreável | RF-802 |
| CR-006 | Reprodutibilidade do resultado | RF-801, RF-803, RP-008 |
| CR-007 | Faixa é observação agregada, nunca por ativo | RF-113 |
| CR-008 | Alerta informa sem concluir | RF-116, RF-117 |
| CR-009 | Cenário sem ponderação atribuída pelo sistema | RP-007, RF-603, RF-606 |
| CR-010 | Verificação externa não altera cálculo | RF-124 |
| CR-011 | Preset de terceiro rotulado e editável | RF-403 |
| CR-012 | Verificação adversarial das próprias proteções | RNF-011 |

---

## 8. Fases de Entrega

| Fase | Conteúdo | Aceite |
|---|---|---|
| 1. Núcleo determinístico | Playbooks carregando, engines de valuation, validadores, snapshot | Três playbooks carregam; cinco engines calculam sobre fixtures; dez validadores rejeitam o caso inválido; snapshot reproduzível |
| 2. Dados externos | Cache com TTL, providers, calendário B3, loop, backoff | Cotação atualiza no pregão e congela fora dele; falha de provider não derruba consumidor; DY nas duas bases |
| 3. Conhecimento | Heurísticas, faixas, notas, eventos, formato de alerta, ingestão com área de anexo | Alerta vinculado a campo aparece no momento certo e segue os quatro blocos; nenhum componente escreve premissa; evento sem prazo é rejeitado; nota não altera regra dura; proposta com valor sugerido é rejeitada |
| 4. Premissas compostas | `calcular_ke`, `calcular_beta`, sensibilidade, horizonte derivado | Ke decomposto e rastreável; beta calculado sobre série real; horizonte derivado de contrato e de reserva; R-204 bloqueia excesso |
| 5. Cenários | Até cinco cenários nomeados, ponderação, atribuição de diferença | Evento gera cenário adicional; diferença atribuída à origem correta; nenhum cenário marcado como provável; ponderação identificada como do usuário |
| 6. MCP | Servidor com as quinze ferramentas | Agente classifica, propõe modelo, consulta contexto, registra fato e dispara cálculo; RF-1003 verificado |
| 7. Electron | Cinco telas, conferência, composição, alertas, cenários, vigia | Fluxo completo pela interface; nenhuma premissa com default; alerta bloqueante impede prosseguimento |
| 8. Validação metodológica | Execução contra companhias reais e casos de referência | Resultados batem com cálculo manual independente dentro de tolerância |

**Casos de referência.** Caso construído a partir de cálculo público de terceiro só é admitido quando as premissas do autor são conhecidas e declaradas. O teste executa a engine com essas premissas e compara o resultado. Divergência indica defeito na engine ou no playbook, e nunca motiva alteração de premissa. Resultado sem premissas declaradas não constitui caso válido, porque o mesmo valor pode ser alcançado por caminhos metodologicamente incorretos.

---

## 9. Playbooks da v1

Conteúdo integral. Ao migrar para repositório, cada bloco torna-se um arquivo YAML em `conhecimento/playbooks/`.

### 9.1. `transmissao-energia-b3`

```yaml
id: transmissao-energia-b3
versao: 0.5.0
mercado: B3
nome_exibicao: "Transmissão de Energia Elétrica"

deteccao:
  sinais_fortes:
    - receita_predominante: RAP
    - regulador: ANEEL
    - modalidade: contrato_de_concessao_transmissao
  sinais_fracos: [CNAE 3512-3/00, "termo 'RAP' no release de resultados"]
  exemplos: [TAEE11, TRPL4, ALUP11]
  nao_confundir_com:
    - id: geracao-energia-b3
      criterio: "receita atrelada a PLD/GSF e volume gerado, não a disponibilidade"

multiplos_bloqueados:
  - metrica: "EV/EBITDA (contábil)"
    severidade: bloqueio_total
    motivo: "EBITDA IFRS inclui margem de construção sem contrapartida em caixa"
  - metrica: "P/L"
    severidade: bloqueio_total
    motivo: "lucro contábil carrega atualização financeira do ativo de concessão"
  - metrica: "P/VPA"
    severidade: alerta
    motivo: "PL não representa capacidade de geração de caixa em ativo concedido"

modelos_habilitados: [fcff_por_concessao, ddm]

horizonte_projecao:
  tipo: derivado_de_fato
  origem: "data_vencimento de cada concessão"
  ajustavel_pelo_usuario: false

regras_duras:
  - id: R-001
    validador: validarPerpetuidadeZero
    mensagem: "Concessão tem vencimento definido: g na perpetuidade deve ser 0"
  - id: R-002
    validador: validarFimDeFluxoNaConcessao
    mensagem: "O fluxo de cada concessão termina na sua data de vencimento"
  - id: R-003
    validador: validarValorResidual
    mensagem: "Valor residual deve ser 0, salvo indenização de RAB não amortizada informada"

modos:
  - id: detalhado
    label: "Por concessão (maior precisão)"
    precisao: alta
    inputs: [concessoes]
  - id: consolidado
    label: "RAP consolidada e prazo médio"
    precisao: reduzida
    aviso_obrigatorio: >
      Prazo médio ponderado mascara concessões vencendo antes; o resultado
      tende a superestimar o fluxo final.
    inputs: [rap_total, prazo_medio_ponderado, indice_predominante]

inputs_obrigatorios:
  - campo: concessoes
    tipo: lista
    subcampos:
      - nome
      - rap_bruta_ciclo_atual
      - indice_reajuste          # IPCA | IGPM
      - data_vencimento
      - percentual_participacao
      - reducao_contratual       # ex: -50% após 15o ano
    onde_encontrar: |
      1. Resolução Homologatória anual da ANEEL (ciclo RAP)
      2. Formulário de Referência, seção de contratos relevantes
      3. Release de resultados, anexo de portfólio de concessões
    fallback_manual: true
  - campo: deducoes_sobre_rap
    descricao: "PIS/COFINS, P&D, TFSEE e encargos que separam RAP bruta de líquida"
    onde_encontrar: "Release de resultados, conciliação de receita regulatória"

premissas_do_usuario:
  - campo: taxa_desconto
    obrigatorio: true
    default: null
    composicao_disponivel: capm
    faixa_referencia:
      minimo: 0.09
      maximo: 0.14
      n_observacoes: 7
      base: "premissas declaradas publicamente por analistas, setor transmissão"
      confianca: media
      atualizado_em: 2026-08
      aviso: "Faixa observada, não recomendação. Sua escolha define o resultado."
  - campo: inflacao_projetada_longo_prazo
    obrigatorio: true
    default: null
  # Não existem flags booleanas de premissa. A inclusão de indenização ou de
  # renovação é derivada da presença dos valores abaixo (RF-421, D-040).
  - campo: indenizacao_rab_estimada
    obrigatorio: false
    default: null
    ajuda: >
      Valor estimado de indenização de RAB não amortizada. Deixar vazio mantém
      o valor residual em zero, conforme a regra dura R-003.
  - campo: termos_de_renovacao
    obrigatorio: false
    default: null
    subcampos: [nova_data_vencimento, nova_rap, investimento_exigido]
    ajuda: >
      Preencher apenas se você projeta renovação. Sem termos informados, o fluxo
      encerra no vencimento contratual, que é fato do contrato.

heuristicas_de_leitura:
  - id: H-001
    aplica_em: [release_resultados]
    onde_olhar: "Conciliação entre RAP bruta e receita regulatória líquida"
    o_que_verificar: "Deduções de PIS/COFINS, P&D e TFSEE não abatidas"
    por_que_importa: "Projetar RAP bruta superestima o fluxo em cerca de 10%"
    acao_do_agente: sinalizar_ao_usuario
    severidade: bloqueia_ate_ciente
    confianca: alta
    fonte: "Guia de Valuation Setorial, seção 2.2"
  - id: H-002
    aplica_em: [release_resultados, formulario_referencia]
    onde_olhar: "Quadro de concessões e respectivos prazos"
    o_que_verificar: "Concessões sujeitas a redução contratual de RAP após o 15o ano"
    por_que_importa: "Ignorar a redução superestima o fluxo da segunda metade do contrato"
    acao_do_agente: sinalizar_ao_usuario
    campo_relacionado: concessoes
    severidade: bloqueia_ate_ciente
    confianca: alta
    fonte: "Guia de Valuation Setorial, seção 2.5"
  - id: H-003
    aplica_em: [dre]
    onde_olhar: "Receita de construção segregada da receita de operação"
    o_que_verificar: "Margem de construção IFRS inflando o resultado do período"
    por_que_importa: "Receita de construção não corresponde a caixa disponível"
    acao_do_agente: sinalizar_ao_usuario
    severidade: informativo
    confianca: alta
    fonte: "Guia de Valuation Setorial, seção 2.3"

alertas:
  - "Concessões próximas do vencimento aparentam subavaliação em múltiplos tradicionais"
  - "Ciclo RAP vigora de julho a junho; RAP do ciclo anterior subestima receita"

fonte: "Guia de Valuation Setorial, seção 2"
```

### 9.2. `bancos-b3`

```yaml
id: bancos-b3
versao: 0.4.0
mercado: B3
nome_exibicao: "Bancos e Serviços Financeiros"

deteccao:
  sinais_fortes:
    - regulador: BACEN
    - demonstracao: "balanço em formato COSIF / IFRS bancário"
    - possui_indice_basileia: true
  sinais_fracos: [CNAE 6422, "termos 'PDD', 'NIM', 'carteira de crédito'"]
  exemplos: [ITUB4, BBAS3, BBDC4, SANB11]
  nao_confundir_com:
    - id: seguradoras-b3
      criterio: "receita de prêmios/corretagem, não de intermediação de crédito"

multiplos_bloqueados:
  - metrica: "EV/EBITDA"
    severidade: bloqueio_total
    motivo: "impossível segregar dívida líquida da matéria-prima operacional"
  - metrica: "EV/qualquer"
    severidade: bloqueio_total
    motivo: "conceito de Enterprise Value não se aplica a instituições financeiras"
  - metrica: "P/L"
    severidade: alerta
    motivo: "lucro distorcido por discricionariedade em PDD e marcação a mercado"

modelos_habilitados: [excess_return, ddm]

horizonte_projecao:
  tipo: convencao_setorial
  anos: 10
  ajustavel_pelo_usuario: true
  justificativa: >
    Período típico de convergência do ROE ao custo de capital próprio.
    Ajuste exige justificativa registrada no snapshot.

regras_duras:
  - id: R-101
    validador: validarSemEnterpriseValue
    mensagem: "EV não é aplicável a instituições financeiras"
  - id: R-102
    validador: validarRetencaoRegulatoria
    mensagem: >
      Dividendo projetado não pode exceder o lucro menos a retenção exigida
      para sustentar o crescimento dos RWA
  - id: R-103
    validador: validarSpreadROEKe
    mensagem: "Excess Return exige ROE e Ke na mesma base (nominal ou real)"

inputs_obrigatorios:
  - campo: patrimonio_liquido_inicial
    onde_encontrar: "Balanço Patrimonial, patrimônio líquido consolidado"
  - campo: roe_historico_3a
    onde_encontrar: "Release de resultados, série histórica de rentabilidade"
  - campo: indice_basileia_atual
    onde_encontrar: "Release de resultados, seção de capital regulatório"
  - campo: rwa_atual
    onde_encontrar: "Notas explicativas, gestão de capital"
  - campo: npl_90_e_cobertura
    onde_encontrar: "Release, qualidade da carteira de crédito"
    uso: "diagnóstico e alerta, não entra no cálculo"

premissas_do_usuario:
  - campo: roe_sustentavel_projetado
    obrigatorio: true
    default: null
  - campo: custo_capital_proprio_ke
    obrigatorio: true
    default: null
    composicao_disponivel: capm
  - campo: crescimento_rwa
    obrigatorio: true
    default: null
    ajuda: "Define quanto lucro fica retido para capital regulatório"
  - campo: basileia_alvo
    obrigatorio: true
    default: null

heuristicas_de_leitura:
  - id: H-022
    aplica_em: [release_resultados]
    onde_olhar: "Composição do resultado de PDD"
    o_que_verificar: "Reversão de provisão elevando o lucro do trimestre"
    por_que_importa: "ROE recente deixa de representar ROE sustentável"
    acao_do_agente: sinalizar_ao_usuario
    campo_relacionado: roe_sustentavel_projetado
    severidade: bloqueia_ate_ciente
    confianca: alta
    fonte: "Guia de Valuation Setorial, seção 1.3"
  - id: H-023
    aplica_em: [dre, notas_explicativas]
    onde_olhar: "Resultado com marcação a mercado da carteira de títulos"
    o_que_verificar: "Ganho não recorrente de tesouraria dentro do lucro líquido"
    por_que_importa: "Distorce tanto o P/L quanto o ROE do período"
    acao_do_agente: sinalizar_ao_usuario
    severidade: informativo
    confianca: alta
    fonte: "Guia de Valuation Setorial, seção 1.3"
  - id: H-024
    aplica_em: [release_resultados]
    onde_olhar: "Índice de Basileia frente ao mínimo regulatório"
    o_que_verificar: "Folga de capital reduzida limitando distribuição de dividendos"
    por_que_importa: "Payout projetado acima da capacidade real infla o DDM"
    acao_do_agente: sinalizar_ao_usuario
    campo_relacionado: basileia_alvo
    severidade: bloqueia_ate_ciente
    confianca: alta
    fonte: "Guia de Valuation Setorial, seção 1.4"

alertas:
  - "ROE recente inflado por reversão de PDD não é ROE sustentável"
  - "P/VPA só faz sentido lido junto com o spread ROE menos Ke"

fonte: "Guia de Valuation Setorial, seção 1"
```

### 9.3. `commodities-b3`

```yaml
id: commodities-b3
versao: 0.4.0
mercado: B3
nome_exibicao: "Produtoras de Commodities (price takers)"

deteccao:
  sinais_fortes:
    - receita_atrelada_a: cotacao_internacional
    - poder_de_precificacao: nenhum
  sinais_fracos: ["menção a Brent/Platts/curva de referência no release"]
  exemplos: [PETR4, VALE3, CSNA3, SUZB3]
  subtipos:
    - petroleo_e_gas: {referencia: Brent, custo_chave: custo_extracao_boe}
    - minerio_de_ferro: {referencia: "índice 62% Fe", custo_chave: custo_caixa_c1}
    - celulose: {referencia: BHKP, custo_chave: custo_caixa_tonelada}

multiplos_bloqueados:
  - metrica: "P/L (spot)"
    severidade: bloqueio_total
    motivo: "no topo de ciclo, P/L baixo é armadilha de valor, não desconto"
  - metrica: "DY (trailing)"
    severidade: bloqueio_total
    motivo: "DY elevado em topo de ciclo não é recorrente"
  - metrica: "EV/EBITDA (spot)"
    severidade: alerta
    motivo: "só admissível sobre EBITDA normalizado"

modelos_habilitados: [fcff_normalizado, sotp]

horizonte_projecao:
  tipo: derivado_de_fato
  origem: "vida_util_reserva declarada pela companhia"
  ajustavel_pelo_usuario: false

regras_duras:
  - id: R-201
    validador: validarPrecoNormalizadoInformado
    mensagem: >
      Preço spot não pode ser projetado para a perpetuidade.
      Informe um preço normalizado de longo prazo.
  - id: R-202
    validador: validarCambioNormalizado
    mensagem: "Receita em USD exige premissa de câmbio de longo prazo, não a PTAX do dia"
  - id: R-203
    validador: validarBreakeven
    mensagem: "Preço normalizado abaixo do custo caixa da companhia invalida a projeção"
  - id: R-204
    validador: validarHorizonteVsReserva
    mensagem: "Horizonte de projeção não pode exceder a vida útil declarada da reserva"

inputs_obrigatorios:
  - campo: volume_producao_anual
    onde_encontrar: "Relatório de produção e vendas (trimestral)"
  - campo: custo_caixa_unitario
    onde_encontrar: "Release, seção de custos (C1 na Vale, lifting cost na Petrobras)"
  - campo: capex_manutencao
    onde_encontrar: "DFC, investimentos; segregar manutenção de expansão"
  - campo: divida_liquida
    onde_encontrar: "Balanço e notas de endividamento"
  - campo: vida_util_reserva
    onde_encontrar: "Formulário de Referência, reservas provadas e vida útil estimada"

premissas_do_usuario:
  - campo: preco_normalizado_lp
    obrigatorio: true
    default: null
    faixa_referencia: null   # deliberadamente ausente, ver justificativa
    ajuda: |
      Preço médio de longo prazo da commodity, na moeda de referência.
      O app exibe a série histórica de 10 anos para contexto, mas
      a escolha do patamar é inteiramente sua.
  - campo: cambio_normalizado_lp
    obrigatorio: true
    default: null
  - campo: taxa_desconto
    obrigatorio: true
    default: null
    composicao_disponivel: capm
  - campo: crescimento_perpetuidade
    obrigatorio: true
    default: null
    ajuda: "Reserva finita pode justificar g igual ou abaixo de zero"

heuristicas_de_leitura:
  - id: H-041
    aplica_em: [release_resultados, dfc]
    onde_olhar: "Segregação entre capex de manutenção e de expansão"
    o_que_verificar: "Capex total sendo tratado como manutenção"
    por_que_importa: "Superestima a necessidade de reinvestimento e deprime o fluxo livre"
    acao_do_agente: sinalizar_ao_usuario
    campo_relacionado: capex_manutencao
    severidade: bloqueia_ate_ciente
    confianca: alta
    fonte: "Elaboração própria"
  - id: H-042
    aplica_em: [release_resultados]
    onde_olhar: "Custo caixa unitário nos últimos quatro trimestres"
    o_que_verificar: "Trajetória de alta sustentada no custo de extração"
    por_que_importa: "Reduz a margem de segurança no fundo do ciclo da commodity"
    acao_do_agente: sinalizar_ao_usuario
    severidade: informativo
    confianca: alta
    fonte: "Elaboração própria"
  - id: H-043
    aplica_em: [formulario_referencia]
    onde_olhar: "Reservas provadas e vida útil estimada da mina ou campo"
    o_que_verificar: "Vida útil inferior ao horizonte de perpetuidade projetado"
    por_que_importa: "Reserva finita contradiz crescimento perpétuo positivo"
    acao_do_agente: sinalizar_ao_usuario
    campo_relacionado: crescimento_perpetuidade
    severidade: bloqueia_ate_ciente
    confianca: alta
    fonte: "Elaboração própria"

alertas:
  - "Margem de segurança real vem do custo de extração frente à curva global, não do P/L"
  - "Reservas provadas finitas contradizem perpetuidade com crescimento positivo"

fonte: "Elaboração própria a partir dos exemplos PETR4/VALE3"
```

> **Por que `preco_normalizado_lp` não tem faixa.** Em topo de ciclo, analistas convergem simultaneamente no mesmo preço superestimado. Exibir consenso nessa premissa reforçaria exatamente a armadilha que o validador R-201 existe para impedir.

### 9.4. Exemplos de nota de ativo e de evento

```yaml
# conhecimento/notas/KLBN11.yaml
id: NA-007
ativo: KLBN11
tipo: caracteristica_estrutural
sobreescreve:
  modelos_habilitados: [sotp]
justificativa: >
  Modelo verticalizado com receita relevante fora de celulose
  (papel e embalagem). Avaliação por segmento captura a diferença
  de margem entre as divisões.
heuristicas_extras: [H-051]
confianca: alta
fonte: "Análise própria a partir do release 4T25"
```

```yaml
# conhecimento/eventos/EGIE3-023.yaml
id: EV-023
ativo: EGIE3
tipo: passivo_contingente
descricao: "Provisão registrada referente a processo em discussão administrativa"
acao: sinalizar_ao_usuario
campo_relacionado: taxa_desconto
apresenta_cenarios: [com_provisao_mantida, com_reversao]
validade_ate: 2027-06-30
revisar_em: 2026-12-31
confianca: media
fonte: "Notas Explicativas 3T26, item 24"
```

---

## 10. Log de Decisões

| ID | Decisão | Motivo |
|---|---|---|
| D-001 | SQLite na fase local, schema portável | Instalação sem serviço externo |
| D-002 | `decimal.js` obrigatório | Erro de ponto flutuante acumula em DCF longo |
| D-003 | Sem LLM embutido, MCP na v1 | Público é dev; prompt de extração não vira responsabilidade do projeto |
| D-004 | Conhecimento em YAML no repositório | Versionamento em Git, revisão por commit |
| D-005 | Regras duras como validadores executáveis | Instrução em prosa é ignorável, código não é |
| D-006 | Nenhuma premissa com default | Escolher premissa por julgamento é emitir opinião |
| D-007 | Snapshot imutável por cálculo | Reprodutibilidade sustenta a arquitetura inteira |
| D-008 | Engine nunca lê cache ao vivo | Cotação congelada garante reprodutibilidade |
| D-009 | DY em 12 meses móveis, alternável | Definição ambígua precisa ser explícita |
| D-010 | Dois modos de granularidade por playbook | Rigor contra usabilidade, marcado no snapshot |
| D-011 | Ordem: Transmissão, Bancos, Commodities | Do mais determinístico ao mais dependente de premissa |
| D-012 | Conhecimento ingerido alimenta contexto, nunca premissa | Preserva a autoria da decisão no usuário |
| D-013 | Faixa de referência substitui default | Contexto sem opinião |
| D-014 | Faixa ausente em `preco_normalizado_lp` | Consenso em topo de ciclo reforça a armadilha do R-201 |
| D-015 | Ingestão offline com aprovação do curador | Base mutável em runtime destruiria reprodutibilidade |
| D-016 | Caso de referência exige premissas declaradas | Mesmo resultado pode vir de caminho incorreto |
| D-017 | Divergência entre fontes coexiste | Escolher lado seria emitir opinião |
| D-018 | Endpoint de LLM configurável postergado para v2 | Core é idêntico, adição é aditiva |
| D-019 | Três camadas: playbook, nota de ativo, evento | Empresas do mesmo setor têm dinâmicas distintas |
| D-020 | Nota restringe modelo, não altera regra dura | Bypass por ativo tornaria toda proteção opcional |
| D-021 | Evento exige `validade_ate` | Conhecimento sem expiração apodrece em silêncio |
| D-022 | Agente propõe modelo dentro da whitelist | Julgamento sobre estrutura de negócio é onde o agente agrega |
| D-023 | Cenário substitui sugestão de premissa | Informa mais que uma dica, sem escolher pelo usuário |
| D-024 | Faixa sempre setorial, nunca por ativo | Faixa por ativo é indistinguível de recomendação |
| D-025 | Formato fixo de alerta em quatro blocos | Estrutura garante que o alerta informe sem concluir |
| D-026 | Verificação web sinaliza, não atualiza | Atualização automática quebraria a reprodutibilidade |
| D-027 | Composição de premissa por CAPM | Resolve o campo vazio sem que o sistema escolha o número |
| D-028 | `Rf` e `beta` tratados como fato, `ERP` como escolha | A fronteira é o que é observável, não o que é numérico |
| D-029 | Tabela de sensibilidade antes da decisão | Mostra o peso da escolha sem indicar ponto preferencial |
| D-030 | Limite de cinco cenários nomeados | Legibilidade de tabela, não restrição de arquitetura |
| D-031 | Ponderação de probabilidade definida pelo usuário | Premissa não contém probabilidade; o usuário a fornece |
| D-032 | Horizonte derivado de fato onde o setor permite | Contrato e reserva definem prazo; não é premissa |
| D-033 | Alerta de preço configurado pelo usuário é admissível | O gatilho é dele; o sistema compara número com número |
| D-034 | Ingestão na v1, sem fase separada | É a essência do projeto, não um complemento |
| D-035 | Bun workspaces, sem pnpm | Bun já resolve workspaces; um gerenciador a menos |
| D-036 | Ordenação por clique do usuário é permitida | O usuário decidindo o que ver não é ranking do sistema |
| D-037 | Justificativa obrigatória em toda implementação | Decisão sem registro vira mecanismo inexplicável meses depois |
| D-038 | Inspeção adversarial por skill dedicada | Proteção que ninguém tenta furar não foi testada |
| D-039 | Agente tem autoridade para contestar o usuário | Concordância automática é o modo de falha mais provável de um agente |
| D-040 | Sem flag booleana de premissa; efeito derivado da presença do valor | `false` não é neutro, e a flag sozinha é incalculável: a premissa sempre foi o valor |
| D-041 | Cor por sinal aritmético sim, hierarquia visual por atratividade não | Sinal é convenção universal; destaque por upside é ranking codificado em CSS |

---

## 11. Riscos Conhecidos

| Risco | Impacto | Mitigação |
|---|---|---|
| Proventos inconsistentes entre fontes | DY incorreto | Segregar JCP e dividendo, exibir fonte, permitir correção |
| Rate limit ou fim de provider gratuito | Perda de cotação | Interface substituível, cache degrada com aviso |
| Erro de extração em DRE ou BP | Cálculo errado com aparência de correto | Procedência obrigatória, heurísticas, conferência do usuário |
| Beta instável em ativo de baixa liquidez | Ke composto sem significado | Janela declarada, número de observações exibido, composição opcional |
| Playbook de Commodities sem base bibliográfica | Metodologia questionável | Marcado como elaboração própria, validado na Fase 8 |
| Acúmulo de heurísticas de baixa qualidade | Ruído de alerta, usuário ignora tudo | Campo `confianca`, revisão do curador, poda periódica |
| Faixa envelhecendo em silêncio | Contexto enganoso | Data visível, marcação automática acima de 12 meses |
| Convergência de analistas por eco | Faixa reforça erro coletivo | Confiança explícita, ausência de faixa em commodity |
| Nota ou evento desatualizado orientando decisão | Alerta ativamente enganoso | Prazo obrigatório, ocultação automática, verificação de obsolescência |
| Manutenção de notas cresce com a carteira | Conhecimento desatualizado por falta de tempo | Cobertura limitada aos ativos monitorados, `revisar_em` como fila |
| Valor sugerido escapando na ingestão | Violação de RP-006 | Validação automática da proposta (RF-122) e revisão do curador |
| Cenários proliferando sem critério | Tela ilegível, análise diluída | Limite de cinco, nomeação obrigatória |
| Escopo expandindo antes da v1 fechar | Projeto não entrega | Restrição explícita na seção 2.2 |

---

*Fim do documento. Alterações de escopo exigem incremento de versão e registro em `DECISOES.md`.*
