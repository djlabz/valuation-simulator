# DECISOES.md

Log numerado de decisões do `valuation-simulator`. Append only: decisão não é editada nem
apagada, é revogada por decisão posterior que a referencia.

**Regra.** Decisão nova tomada em conversa entra aqui antes de virar código, com ID,
decisão e motivo. Decisão que só existe no chat desaparece quando a conversa fecha, e o
mesmo debate volta em três semanas.

**Origem.** D-001 a D-041 vêm da seção 10 do documento de requisitos v2.2.0 e são
transcritas, não recriadas. A partir de D-042 as decisões nascem em sessão de trabalho e
registram a sessão de origem.

---

## Transcritas do documento de requisitos v2.2.0

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

## Sessão de 25/08/2026, Passo 0

### D-042. `/ingest` fora do versionamento, com `.gitkeep`

**Decisão.** A pasta `ingest/` entra no `.gitignore`, com um `.gitkeep` rastreado para a
pasta existir no clone. Nada do conteúdo bruto de ingestão é versionado.

**Motivo.** RF-119 define `/ingest` como depósito fora do runtime, e D-015 define a
ingestão como pipeline offline cujo produto versionado é a proposta revisada, não a
matéria-prima. Versionar a matéria-prima colocaria material bruto de terceiro no
repositório distribuído e inflaria o histórico com PDF e imagem que nada no build consome.

**Ressalva registrada.** O handoff de planejamento justificava esta decisão por "RF-2007",
que não existe no documento v2.2. A decisão se sustenta por RF-119 e D-015. Se a proibição
de transcrição literal de material de terceiro deve ser requisito, ela precisa nascer
numerada no documento de requisitos.

### D-043. Invariante documentada em cinco campos, não em prosa

**Decisão.** No `CLAUDE.md`, cada uma das oito invariantes é registrada com proibido,
gatilhos de código, teste de decisão binário, alternativa conforme e requisitos ligados.

**Motivo.** Princípio em prosa não é decidível na hora de escrever a linha, e o modo de
falha observado é o agente concordar com o princípio e violar na prática. O campo
"alternativa conforme" existe para um segundo modo de falha, oposto: o agente resolver a
proibição desabilitando funcionalidade legítima, como tirar a ordenação clicável que
RF-907 e D-036 permitem de propósito.

**Descartado.** Lista simples de proibições, que é o formato do documento de requisitos e
funciona lá porque o documento explica o porquê em prosa ao redor. Numa constituição de
agente, o que falta não é o porquê, é o gatilho.

### D-044. Nome de arquivo do documento de requisitos com ponto na versão

**Decisão.** O documento vive em `docs/REQUISITOS-valuation-simulator-v2.2.md`, com ponto,
e não com underscore. Cópia byte a byte, sem edição de conteúdo.

**Motivo.** As referências cruzadas do handoff e dos documentos de governança usam o ponto.
Duas grafias circulando quebram toda referência futura, e a divergência não é detectável a
olho em revisão de diff.

### D-048. Handoff de planejamento no repositório como registro histórico, com ressalva

**Decisão.** O handoff da sessão de planejamento entra em
`docs/HANDOFF-planejamento-2026-08-24.md` como registro histórico, não como fonte de
verdade. O arquivo recebe cabeçalho de ressalva no topo, com as divergências verificadas
contra a v2.2, e o `AGENTS.md` registra a existência do arquivo na seção de estado.

**Motivo.** O handoff foi escrito contra uma versão anterior do documento de requisitos e
diverge da v2.2 em pontos verificados: declara a v2.1 como fonte de verdade, conta 111
requisitos funcionais e 39 decisões onde a v2.2 tem 113 e 41, manda semear o `DECISOES.md`
com 35 decisões, e descreve a exigência de RF-110 só com `validade_ate`, quando a v2.2
exige `validade_ate` e `revisar_em`. Sem ressalva, um agente futuro encontra dois
documentos com aparência equivalente de autoridade em `docs/` e reproduz o erro. O valor do
arquivo é o porquê das decisões, que o documento de requisitos não conta, e isso justifica
preservar em vez de descartar.

**Nota de método.** A versão anterior desta tarefa ditava as divergências como fato, e duas
delas não estavam no arquivo: tinham sido inferidas a partir da v2.2, não verificadas
contra o handoff. A tarefa foi interrompida e reescrita para que o levantamento fosse feito
sobre o arquivo, com evidência. Regra 5 da governança: explicação inferida sem verificação
não entra em documento como fato. Vale para prompt de tarefa também, não só para relatório.

**Nota de numeração.** O ID é posterior a D-045 a D-047 porque aqueles foram reservados em
conversa. `DECISOES.md` é append only por ordem de registro, não por ordem de execução.

### D-045. Valor financeiro é `Decimal` com guardrails, string no armazenamento

**Decisão.** Toda grandeza numérica do domínio é representada por uma instância de `Decimal`
(`decimal.js`) em memória e por string decimal em texto plano no armazenamento e na
serialização. `number` é proibido para dinheiro, taxa, percentual, razão, fator e peso,
inclusive em fixture e em teste. Confirma e detalha RNF-001 e D-002, sem emendá-los.

**Motivo.** O produto é uma calculadora com um banco anexo, não o contrário: dinheiro aqui é
resultado de projeção descontada, não saldo transacional. Metade do domínio não é dinheiro
(taxa de desconto, Rf, beta, ERP, g, ROE, Basileia, DY, peso de cenário), e boa parte dessas
grandezas se multiplica com dinheiro ou entre si, o que uma representação inteira de dinheiro
não cobre sem uma segunda e uma terceira representação e conversões entre elas. Na precisão,
DCF é feito de divisão, e divisão é onde o inteiro obriga a arredondar: arredondar por período
acumula erro ao longo de trinta períodos e esse erro entra no denominador pequeno de (Ke - g)
no valor terminal.

**Descartado, centavo inteiro em `number`.** Aceita qualquer operação sem reclamar. `valor * 1.1`
compila e roda, somar centavo com real devolve resultado plausível. Erro de unidade difuso por
todo lugar onde dinheiro é tocado.

**Descartado, centavo inteiro em `bigint`.** Divisão de `bigint` trunca em vez de arredondar.
Truncamento tem sinal, então o erro não se cancela ao longo de trinta períodos, acumula numa
direção e depois entra no denominador pequeno do valor terminal. Este foi o argumento decisivo.

**Descartado, ponto fixo artesanal em `bigint` com escala 1e-8.** Ganha nada sobre a opção
adotada, custa uma biblioteca própria que ninguém mais saberá manter, e reintroduz o problema de
arredondamento na divisão.

**Custo aceito.** Coluna TEXT no SQLite, sem `SUM()` nem `ORDER BY` numérico de dinheiro no banco.
Toda agregação e ordenação sobem para o core, que já é dono exclusivo do SQLite e opera sobre
volume de watchlist. A perda é de conveniência de diagnóstico, não de arquitetura. Na migração
para Postgres (RNF-002), a coluna permanece TEXT: trocar para NUMERIC criaria duas semânticas
diferentes entre ambientes, com ordenação no core num lado e no SQL no outro, o que é pior que a
limitação original.

**Contrapartida reconhecida.** Esta opção também erra em silêncio, em três pontos:
`new Decimal(0.1)` importa erro de float sem avisar, `d1 === d2` compila e é sempre falso entre
instâncias distintas, e `toString()` de valor pequeno vira notação exponencial. A diferença é que
são três pontos nomeáveis e fecháveis na construção, tratados em D-046 e D-047, e não um erro
difuso de unidade.

### D-046. Configuração do `decimal.js` fixada em construtor clonado

**Decisão.** O projeto não importa `decimal.js` diretamente em nenhum lugar.
`packages/shared` exporta um construtor clonado com `Decimal.clone()` e configuração fixa, e todo
o resto do código usa apenas esse construtor. A configuração é: `precision` 34, `rounding`
`ROUND_HALF_EVEN`, `toExpNeg` -9e15, `toExpPos` 9e15.

**Motivo de cada valor.** `precision` 34 é o número de dígitos significativos do decimal128 do
IEEE 754, valor de referência em vez de arbitrário, e dá folga de mais de vinte dígitos sobre os
cerca de doze necessários para reais na casa dos bilhões, o que absorve a amplificação de erro do
denominador pequeno em (Ke - g). `ROUND_HALF_EVEN` não tem viés sistemático, enquanto
`ROUND_HALF_UP` empurra sempre para cima e num fluxo com centenas de arredondamentos o viés é
direcional. `toExpNeg` e `toExpPos` nos extremos desligam a notação exponencial na serialização,
fechando o buraco de 1e-9 chegar ao banco como "1e-9" e quebrar leitura e ordenação lexicográfica.

**Motivo do clone em vez de `Decimal.set`.** `Decimal.set` altera o construtor global do módulo.
Qualquer dependência transitiva que também use `decimal.js` e chame `set` sobrescreve a
configuração do projeto em silêncio, e o efeito aparece como resultado numérico levemente
diferente, sem erro. Com `clone`, a configuração pertence ao projeto e é imune.

**Verificação.** Um teste afirma os quatro valores no construtor exportado, e outro prova o round
trip de string em valor pequeno e grande sem notação exponencial. Configuração sem teste é
configuração que alguém remove por engano.

**Aberto e datado.** O valor 34 será reavaliado na Fase 8, comparando resultado das engines contra
cálculo manual independente. Se a tolerância exigir mais, sobe com decisão nova.

### D-047. `Money<Moeda>` e `Rate`, com Bps apenas como formato de borda

**Decisão.** Dois tipos nominais sobre o construtor de D-046. `Money<C>`, com C sendo a moeda como
parâmetro de tipo fantasma, sem custo em runtime, e a v1 usando `'BRL'` e `'USD'`. `Rate`, para
toda grandeza adimensional: taxa, percentual, razão, fator de desconto, beta, multiplicador e peso
de cenário. Bps não é tipo de armazenamento, é formato de entrada e de exibição, ou seja, funções
de conversão de e para `Rate`.

**Álgebra permitida, imposta pelo tipo.** `Money<C>` mais ou menos `Money<C>` devolve `Money<C>`,
com mesma moeda obrigatória. `Money<C>` vezes `Rate` devolve `Money<C>`. `Money<C>` dividido por
`Money<C>` devolve `Rate`. `Rate` com `Rate` em soma, subtração, multiplicação ou divisão devolve
`Rate`. `Money<C>` vezes `Money<C>` é proibido no tipo, porque real vezes real não tem
significado. `Money<'BRL'>` mais `Money<'USD'>` é proibido no tipo. Conversão de moeda é função
dedicada que exige um `Rate` de câmbio informado, nunca implícita.

**Motivo do Bps não ser tipo.** O handoff previa Bps como inteiro de basis points, carryover de
outro projeto. Não serve aqui: beta 0,72 não é taxa e não tem representação em bps, e o fator de
desconto 1/(1+r)^n é um número de muitas casas, não uma taxa. Manter Bps como tipo obrigaria
conversão de escala e arredondamento intermediário dentro do CAPM, e arredondar o Ke antes de
descontar trinta anos contamina o resultado inteiro.

**Motivo da moeda no tipo.** A interface da v1 é BRL, mas o playbook de Commodities tem
`preco_normalizado_lp` na moeda de referência da commodity, `cambio_normalizado_lp` como premissa
obrigatória e R-202 exigindo câmbio de longo prazo. Existe um caminho real onde USD e BRL se
encontram. Somar os dois compila e devolve número plausível, que é a categoria "cálculo errado com
aparência de correto" da tabela de riscos. Custo agora é uma linha de tipo e um teste; custo
depois é toda engine, toda fixture e o schema do snapshot.

**Descartado, separar `Rate` de `Ratio`.** Distinguir taxa de razão adimensional pura foi
considerado. Álgebra idêntica, ganho semântico pequeno, e a conversão constante entre os dois
seria fricção sem proteção nova. Um tipo só, documentado como grandeza adimensional.

**Descartado, `Money` sem moeda com verificação em runtime.** Erro que aparece em runtime só
aparece se aquele caminho for executado, e o caminho de commodities só existe a partir da Fase 8.
Verificação no tipo aparece na compilação.

### D-049. Stryker com runner de Vitest, ligado desde o Passo 1

**Decisão.** O mutation testing (RF-505) fica ligado desde já, com Stryker 10.0.0 e
`@stryker-mutator/vitest-runner`, configurado em `stryker.config.json` na raiz e rodando
sobre `packages/shared`. A configuração que funcionou:

```json
{
  "packageManager": "npm",
  "testRunner": "vitest",
  "reporters": ["progress", "clear-text"],
  "coverageAnalysis": "all",
  "mutate": ["packages/shared/src/**/*.ts", "!packages/shared/src/**/*.test.ts"],
  "vitest": { "configFile": "vitest.config.ts" }
}
```

Fechou na primeira tentativa, dentro do timebox, sem workaround. `packageManager` fica em
`npm` porque o Stryker roda em Node e usa esse campo só para instalar plugin quando falta,
o que não acontece aqui: as dependências já vêm do `bun install`, e o Bun continua sendo o
gerenciador do projeto (D-035).

**Score.** Três rodadas na mesma sessão, com a suíte crescendo entre elas: 63,96% na
primeira, 95,43% depois dos testes que os sobreviventes pediram, 97,87% na terceira, com
`money.ts` em 100%. Sobraram quatro mutantes vivos, todos classificados abaixo.

**O que os sobreviventes acharam, e que teste nenhum tinha achado.** Três coisas reais.
Os predicados de sinal (`ehZero`, `ehPositivo`, `ehNegativo`) não tinham teste nenhum, e
`return true` passava batido nos dois tipos. A guarda de overflow existia e nenhum teste
chegava nela, então o rótulo da operação em `garantirFinito` podia sumir sem quebrar nada.
E dois trechos eram código morto: o ramo `if (valor === undefined)` em `descrever` e em
`nomeDoTipo`, redundante porque `typeof undefined` já devolve `'undefined'`, mais o
`Money[INTERNO]()`, que não tinha um único chamador porque `Money.converter` lê o campo
privado direto. Os dois foram removidos, não testados.

**Os quatro sobreviventes restantes.** Três são rótulo de campo em caminho de erro
inalcançável: em `rateDeBps` e `bpsDeRate` o operando é a constante `'10000'`, que nunca
falha na leitura e nunca é zero na divisão, então a mensagem que nomeia o campo não tem
como ser exercitada. São equivalentes, não lacuna. O quarto é falso positivo verificado na
mão: trocar `toExpNeg: -9e15` por `+9e15` faz o `Decimal.clone` estourar na carga do
módulo, os três arquivos de teste falham e a suíte sai com exit code 1, ou seja, o mutante
morre. O Stryker não contabiliza isso porque a falha acontece no import e nenhum teste
chega a rodar.

**Mudança de `coverageAnalysis`.** Começou em `perTest` e passou para `all`. Com `perTest`,
mutante em código de módulo, que roda uma vez na carga, aparece como sobrevivente sem ser.
Com `all` a diferença foi de 95,43% para 97,87% sem uma linha de teste nova, o que mede o
erro de medição, não o código. Custo de 12 segundos numa base deste tamanho, irrelevante.

**Aberto e datado.** Não existe limiar de score configurado, de propósito: limiar antes de
existir engine vira número escolhido no escuro. O limiar nasce no Passo 3, junto com a
primeira engine, que é onde RF-505 realmente morde.
