# CLAUDE.md

Constituição deste repositório. Vale para todo agente que escrever código, texto de
interface, comentário, commit, documento ou conteúdo de conhecimento aqui.

**Fonte de verdade:** `docs/REQUISITOS-valuation-simulator-v2.4.md`. Em qualquer conflito
entre este arquivo e o documento de requisitos, o documento vence e este arquivo é
corrigido. Este arquivo não cria regra nova, ele torna a regra existente decidível na
hora de escrever a linha.

**Divisão de responsabilidade entre os arquivos de governança:**

| Arquivo | Contém |
|---|---|
| `CLAUDE.md` | Regra permanente. Não muda de etapa para etapa |
| `AGENTS.md` | Estado do projeto, mapa de pastas, ordem de trabalho, questões abertas |
| `DECISOES.md` | Log numerado de decisões, com motivo |
| `PROTOCOLO-ETAPA.md` | Ciclo obrigatório de abertura e fechamento de etapa |

---

## 1. A tese central

O agente de IA nunca calcula e nunca escolhe premissa por julgamento.

| Camada | Quem | Faz | Não faz |
|---|---|---|---|
| Classificação | Agente e playbooks | Identifica setor e modelo de negócio | Ignora restrição do playbook |
| Seleção de modelo | Agente, com confirmação | Propõe modelo da lista habilitada, com justificativa | Escolhe fora da lista |
| Extração | Agente | Lê documento, devolve dado com procedência | Produz número sem fonte |
| Orientação | Heurística, nota, evento | Alerta, contextualiza, oferece cenário | Escolhe valor de premissa |
| Composição | Engines auxiliares | Deriva premissa de fatos mais escolhas do usuário | Escolhe as partes pelo usuário |
| Cálculo | Engines | Executa matemática determinística | Interpreta contexto |
| Apresentação | Electron | Exibe resultado, cenário e auditoria | Ordena por atratividade |

**A linha operante.** A distinção não é entre exibir ou não exibir número. É entre
*derivar número de fato e de escolha do usuário*, que é permitido e o produto faz muito
disso, e *escolher número por julgamento próprio*, que não acontece nunca.

Permitido: buscar a taxa da NTN-B e tratar como fato; calcular beta sobre série
histórica; compor Ke por CAPM com o usuário escolhendo o prêmio de risco; exibir
sensibilidade com dez taxas; ponderar cenário com peso que o usuário digitou.

Proibido: sugerir 12% de taxa de desconto para a Engie; afirmar que o cenário de
reversão é mais provável; abrir a listagem ordenada por upside decrescente.

**Por que isso existe.** Dois motivos que se reforçam. Regulatório: o autor não é
certificado pela CVM, e a premissa determina o preço teto, que determina a decisão de
compra, logo sugerir premissa é emitir opinião sobre valor mobiliário. Engenharia: número
escolhido por julgamento do sistema não é reproduzível nem rastreável, e sem isso o
snapshot de auditoria não vale nada. A proteção é arquitetural, não um aviso legal por
cima. Tratar como formalidade removível quebra o produto.

---

## 2. As oito invariantes, em formato decidível

Princípio em prosa não resolve nada na hora de escrever a linha, porque todo agente
concorda com o princípio e viola na prática. Cada invariante abaixo vem com o que
procurar, uma pergunta binária que resolve o caso, e o que fazer em vez de.

### RP-001. Nenhuma recomendação de compra, venda ou manutenção

**Proibido:** qualquer elemento que indique ação sobre o ativo.

**Gatilhos no código:** identificador ou string contendo `recomendacao`, `sugestao`,
`oportunidade`, `comprar`, `vender`, `alvo`, `target`, `score`, `nota` (no sentido de
avaliação), `rating`, `semaforo`, `favorito` associado a métrica.

**Teste de decisão:** se um leitor hostil imprimir apenas este elemento, sem contexto, ele
consegue ler como instrução de ação sobre o ativo? Se sim, reescreva.

**Alternativa conforme:** fato com procedência, mecanismo de efeito no cálculo, escala de
referência setorial, cenário calculado. Nessa ordem, que é a do RF-116.

**Ligado a:** RP-001, RF-115, RF-116, RF-117, RF-715, RF-906.

### RP-002. Nenhum ranking proprietário nem ordenação padrão por atratividade

**Proibido:** o sistema decidir que um ativo aparece antes de outro por mérito.

**Gatilhos no código:** `ORDER BY` com coluna de métrica em query de listagem; `sortBy`
inicializado com algo diferente de nome ou ticker; `.sort(` sobre resultado antes do
render; `.slice(0, N)` sobre lista ordenada por métrica; nome de componente contendo
`top`, `melhores`, `destaques`, `highlights`, `ranking`.

**Teste de decisão:** qual é o estado de ordenação no primeiro render, antes de qualquer
clique do usuário? Se não for alfabético, é violação.

**Alternativa conforme:** estado inicial alfabético, e cabeçalho de coluna clicável em
qualquer coluna, inclusive upside e DY. Ordenação pedida pelo usuário é permitida e
desejada. Não desabilite ordenação por excesso de zelo, isso quebra RF-907 de propósito
oposto.

**Ligado a:** RP-002, RF-903, RF-907, RF-911, D-036, CR-003.

### RP-003. Nenhuma premissa com valor default preenchido pelo sistema

**Proibido:** campo de premissa que chega ao usuário com número dentro.

**Gatilhos no código:** `defaultValue`, `.default(` em schema Zod de premissa, `?? 0`,
`|| 0.1`, `useState(0)` em estado de premissa, `placeholder` com número, `value ??`,
atributo `step` ou `min` funcionando como âncora visual, seed de formulário a partir de
histórico do próprio ticker.

**Teste de decisão:** se eu apagar o conteúdo do campo, ele fica vazio e o cálculo
bloqueia? Se algum valor reaparece sozinho, é default.

**Alternativa conforme:** campo nasce vazio e o cálculo fica bloqueado (RF-401). O vazio
se resolve por três mecanismos que não opinam: faixa setorial exibida como elemento
visual separado do input, composição por CAPM, tabela de sensibilidade.

**Ligado a:** RP-003, RF-401, RF-404, RF-405, RF-413, D-006, D-013, CR-001.

### RP-004. Nenhuma linguagem valorativa sobre ativo ou decisão

**Proibido:** adjetivo que qualifique preço, momento ou qualidade do investimento.

**Gatilhos no código:** as palavras `barato`, `caro`, `saudável`, `atrativo`, `favorável`,
`descontado`, `injusto`, `oportunidade`, `risco elevado` como juízo, `margem de segurança`
como label de UI, e o padrão mais escorregadio, que é mensagem de erro ou de validação
escrita no calor do momento.

**Teste de decisão:** troque o adjetivo por um número ou por uma origem. Se a frase
sobrevive sem perder informação, o adjetivo era juízo e sai. "Fora da faixa saudável" vira
"fora da faixa observada de 9% a 14%, 7 observações, 08/2026".

**Alternativa conforme:** vocabulário factual. `observado`, `reportado`, `declarado`,
`calculado`, `informado por você`.

**Ligado a:** RP-004, RF-115, RF-117, RF-715, CR-004.

### RP-005. Todo número exibido é rastreável

**Proibido:** número na tela que não seja fato com procedência, escolha do usuário, ou
aritmética sobre esses dois.

**Gatilhos no código:** qualquer cálculo dentro de componente React; média, mediana ou
ponto médio derivado de faixa de referência; `toFixed` sobre valor que não veio do
snapshot; agregado de conveniência criado na camada de apresentação; e escape de schema,
que é `z.unknown()`, `z.any()`, `z.custom()` sem validador, `z.looseObject` e `.passthrough()`,
e `.catch()` com valor de reserva. Escape de schema é o `any` do dado: onde o schema diz que
não sabe o que é, ninguém consegue responder o teste abaixo, e nenhum filtro de conteúdo
roda. Apareceu de verdade em `Deteccao.sinais_fortes`, que era `z.unknown()` e deixava passar
qualquer texto sem olhar, contornando o filtro padrão de D-062.

**Teste de decisão:** este número está no snapshot como fato, como premissa do usuário, ou
como resultado desagregado de engine? Se não é nenhum dos três, ele não pode aparecer.

**Alternativa conforme:** engine devolve resultado desagregado por etapa (RF-504), e a
apresentação só formata. Composição exibe a decomposição visível, cada parte rastreável
(RF-410).

**Ligado a:** RP-005, RF-304, RF-410, RF-504, RF-802, RF-906, CR-002.

### RP-006. Nenhum componente sugere valor de premissa para ativo específico

**Proibido:** entregar um número de premissa associado a um ticker, por qualquer caminho.

**Gatilhos no código:** `placeholder="Ex: 11%"`; pré-preencher com o último valor usado
naquele ativo; preset pré-selecionado; faixa de referência por ativo em vez de setorial;
ponto preferencial marcado na grade de sensibilidade; `default` em campo de
`premissas_do_usuario` em YAML.

**Teste de decisão:** este número chegou ao usuário já associado a este ticker, sem ele ter
digitado? Se sim, é sugestão, mesmo que a intenção fosse conveniência.

**Alternativa conforme:** faixa sempre setorial e agregada, com mínimo, máximo, número de
observações, base, confiança e data (RF-113). Preset é nomeado, aplicado por ação
explícita, e preset de terceiro é rotulado como externo e nunca pré-selecionado (RF-403).

**Ligado a:** RP-006, RF-112, RF-113, RF-122, RF-402, RF-414, RF-1003, D-024, CR-001, CR-007.

### RP-007. Nenhum cenário é qualificado como mais provável pelo sistema

**Proibido:** o sistema atribuir probabilidade, ou insinuar hierarquia entre cenários.

**Gatilhos no código:** identificador `cenarioBase`, `principal`, `provavel`, `esperado`;
peso inicializado igual entre cenários; ordem de exibição que privilegie um; destaque
visual em um cartão de cenário; texto de evento que qualifique desfecho.

**Teste de decisão:** removendo os pesos que o usuário digitou, o sistema ainda comunica
que um cenário vale mais que outro? Se sim, tem juízo embutido.

**Alternativa conforme:** cenário nomeado livremente pelo usuário, exibição sem valor
consolidado quando não há pesos (RF-607), e peso identificado como definido pelo usuário
sempre que o valor ponderado aparece (RF-606). Inicializar peso vazio, nunca 50/50, porque
equiprobabilidade também é afirmação sobre desfecho.

**Ligado a:** RP-007, RF-111, RF-603, RF-605, RF-606, RF-607, D-031, CR-009.

### RP-008. A base de conhecimento não se altera em tempo de execução

**Proibido:** qualquer escrita, mutação ou substituição de conhecimento depois do boot.

**Gatilhos no código:** escrita em `conhecimento/` fora da ingestão offline; mutação do
objeto carregado no boot; hot reload de conhecimento fora de ambiente de desenvolvimento;
resultado de `verificar_obsolescencia` gravado na mesma estrutura que alimenta cálculo;
resultado de busca web alterando dado usado em cálculo.

**Teste de decisão:** rodando o mesmo cálculo amanhã, com as mesmas premissas e sem
commit no meio, o número muda? Se pode mudar, a reprodutibilidade já quebrou.

**Alternativa conforme:** carregar e validar no boot (RF-101), manter constante na sessão
(RNF-008), ocultar evento vencido na leitura sem tocar no arquivo (RF-110, RF-910),
verificação web apenas sinaliza (RF-124). Atualização é proposta, revisão do curador e
commit (RF-121).

**Ligado a:** RP-008, RF-101, RF-110, RF-121, RF-124, RF-801, RF-910, RNF-008, D-015, D-026, CR-006, CR-010.

---

## 3. Casos de fronteira já decididos

Pares que parecem iguais e não são. Resolver por princípio geral dá errado toda vez, então
a decisão está fixada aqui.

| Permitido | Proibido | Requisito |
|---|---|---|
| Ordenação por clique do usuário, em qualquer coluna | Estado inicial da listagem ordenado por métrica | RF-907, D-036 |
| Cor por sinal aritmético, uniforme em todo número com sinal, igual à variação do dia | Badge, ícone, realce de linha, card de "maiores upsides", agrupamento por atratividade | RF-911, D-041 |
| Faixa setorial e agregada, com n, base, confiança e data | Faixa para um ativo específico | RF-113, D-024 |
| Verificação web sinalizando obsolescência | Verificação web atualizando conhecimento ou dado de cálculo | RF-124, D-026 |
| Aritmética sobre peso que o usuário digitou | Sistema atribuir probabilidade a cenário | RF-605, RP-007 |
| Agente propor modelo dentro da whitelist, com justificativa | Agente propor modelo fora da lista habilitada | RF-205, RF-206, D-022 |
| Valor opcional vazio, com o efeito derivado da presença do valor | Flag booleana de premissa, inclusive com `default: false` | RF-421, D-040 |
| Recomendação de metodologia, tipo "(maior precisão)" em modo de granularidade | Recomendação sobre ativo ou decisão de investimento | RF-105, RP-001 |
| Mensagem de regra dura, que é redação de validador executável com teste de aprovação e de rejeição, e muda junto com a regra | Afirmação metodológica independente escrita por agente, sem validador que a sustente | RF-506, RF-507, RNF-013, D-069 |
| Mensagem de erro citando o requisito que exige o campo e o que o exibe, os dois | Citar só o requisito de exibição, que é o que está na frente porque o filtro de texto vem primeiro na hora de escrever | RF-103, RF-106, D-074 |
| `number` para contagem sem unidade financeira: casas decimais na formatação, quantidade de períodos, código de modo de arredondamento | `number` para dinheiro, taxa, percentual, razão, fator e peso, inclusive em fixture e em teste | RNF-001, D-002, D-045 |
| Nota de ativo restringindo a lista de modelos habilitados | Nota de ativo ampliando a lista, alterando regra dura ou múltiplo bloqueado | RF-109, D-020 |
| Ausência deliberada de faixa em `preco_normalizado_lp` | Adicionar faixa "porque os outros campos têm" | D-014, R-201 |

Sobre o penúltimo: se um caso real exigir exceção a regra dura, a regra está mal formulada
e se corrige no playbook, com justificativa e incremento de versão. Bypass por nota
tornaria toda proteção opcional, bastando redigir a nota.

---

## 4. Regras duras de engenharia

| Regra | Detalhe | Requisito |
|---|---|---|
| `decimal.js` obrigatório | Valor financeiro é `Decimal` em memória e string no armazenamento. `number` proibido para dinheiro, taxa e percentual. Sem exceção, inclusive em fixture e teste | RNF-001, D-002 |
| Engine é função pura | Sem I/O, sem rede, sem relógio, sem aleatoriedade. `new Date()`, `Math.random()` e `fetch` são proibidos em `packages/dominio` | RF-501, RNF-003 |
| Engine declara Zod de entrada e de saída | Ambos, não só entrada | RF-502 |
| Engine devolve desagregado | Resultado por etapa, não só o valor final | RF-504 |
| Regra dura é validador executável | TypeScript com teste de aprovação e de rejeição, rodando antes da engine | RF-506, RF-507, D-005 |
| Validador não é contornável | Nem por instrução de agente, nem por configuração, nem por nota, nem por evento | RF-508 |
| Renderer não toca SQLite | O core é dono exclusivo do banco | Seção 4 |
| Cotação congelada no snapshot | Engine nunca lê cache ao vivo | RF-803, D-008 |
| Dado sem procedência é rejeitado | `{documento, pagina, trecho_original}` obrigatório, qualquer que seja a origem, inclusive dado que o agente "sabe" | RF-304 |
| Bun workspaces | Não pnpm, não npm workspaces | D-035 |

---

## 5. Conduta obrigatória

### 5.1. Justificar toda implementação (RNF-010)

Toda entrega diz o que foi feito, qual requisito atende e o que foi descartado no caminho.
Vale para refatoração, escolha de biblioteca e estrutura de pasta, não só para feature.
Código sem justificativa é entrega incompleta.

### 5.2. Não escrever conhecimento analítico (RNF-013, D-069)

Conteúdo de conhecimento analítico não é escrito por agente, em nenhuma circunstância, nem
como placeholder, nem para satisfazer campo obrigatório de schema. Se um campo obrigatório
exige conteúdo analítico que não existe, o campo deixa de ser obrigatório ou a etapa para e
pergunta.

**Teste de decisão:** este texto afirma algo sobre o mundo que eu não posso rastrear a um
documento da companhia, a uma norma vigente, ou a uma operação aritmética? Se sim, é
conhecimento analítico e não é meu para escrever.

**Gatilho:** estar preenchendo campo obrigatório de schema com conteúdo que ninguém pediu.
Foi assim que nasceram dois modos de granularidade no Passo 2, e eles saíram no expurgo.

**Exceção única, fixture de teste.** Conteúdo sintético em `conhecimento/fixtures-invalidas/`
é estímulo para exercitar validação, não afirmação sobre o mundo. O critério que separa os
dois: se o texto da fixture fosse lido por um usuário do app, ele afirmaria algo sobre um
setor ou uma empresa? Modo com `precisao: reduzida` e sem aviso é estímulo. Modo com label
"Por concessão (maior precisão)" é afirmação.

### 5.3. Contestar quando for o caso (RNF-012, D-039)

A contestação é obrigatória, não opcional, quando a instrução viola invariante, cria risco
legal ou é má prática com consequência real. Contestar significa recusar a implementação e
explicar o motivo, não implementar reclamando.

Se o autor insistir com argumento novo, reavalie de verdade. Se insistir sem argumento
novo, mantenha a posição. Linguagem direta e informal está autorizada nessa situação: o
risco de ceder por conforto é maior que o risco de soar brusco.

O inverso também vale. Se ele mostrar que o agente entendeu errado, corrija sem cerimônia.
Contestação não é teimosia.

### 5.4. Verificação é literal (RNF-005)

Saída de verificação é colada verbatim, com exit code. Nunca descrita em prosa. "Os testes
passaram" não é verificação, é alegação. Explicação inferida sem execução não entra em
documento como fato.

### 5.5. Escrita

Português brasileiro, registro informal. Nenhum travessão em nenhum texto, incluindo
código, comentário, commit e documento: use vírgula, ponto ou reescreva a frase. Toda
string de interface passa pelo filtro de RP-004 antes de existir.

### 5.6. Pare e pergunte

Não decida sozinho, pergunte:

- criar arquivo que não foi pedido
- avançar para a etapa seguinte sem aprovação explícita
- alterar o documento de requisitos, um playbook ou uma decisão já registrada
- adicionar dependência nova
- resolver ambiguidade da fonte de verdade por conta própria
- qualquer coisa que reduza uma proteção, ainda que a redução pareça pequena

---

## 6. Estado da verificação automática

Honestidade sobre o que existe agora, para ninguém confiar em proteção inexistente.

| Proteção | Estado |
|---|---|
| Invariantes como texto decidível | Existe, este arquivo |
| Inspeção adversarial por skill dedicada | Não existe. Nasce no Passo 2 (RNF-011, D-038) |
| CLI validando `conhecimento/` com exit code | Não existe. Nasce no Passo 2 (RF-101, RF-110, RF-112) |
| Lint dos gatilhos da seção 2 | Não existe. Candidato a regra ESLint quando houver código |
| Mutation testing das engines | Não existe. Nasce na Fase 1 (RF-505) |

Enquanto a linha diz "não existe", a verificação é humana e falível. Não escreva em nenhum
documento que ela é automática.
