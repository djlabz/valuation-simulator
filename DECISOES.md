# DECISOES.md

Log numerado de decisões do `valuation-simulator`. Append only: decisão não é editada nem
apagada, é revogada por decisão posterior que a referencia.

**Regra.** Decisão nova tomada em conversa entra aqui antes de virar código, com ID,
decisão e motivo. Decisão que só existe no chat desaparece quando a conversa fecha, e o
mesmo debate volta em três semanas.

**Origem.** D-001 a D-041 vêm da seção 10 do documento de requisitos v2.2.0 e são
transcritas, não recriadas. A partir de D-042 as decisões nascem em sessão de trabalho e
registram a sessão de origem.

**Seções.** Cabeçalho de sessão é por data, aberto quando a data virar, nunca por passo.
Passo rende decisão fora dele, o rótulo apodrece, e o passo já aparece no texto de cada
decisão quando importa. Renomear rótulo de seção não fere o append only: nenhuma decisão é
alterada nem removida.

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

## Sessão de 25/08/2026

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

### D-050. Resíduo de ferramenta fora do versionamento, com exceção para skills

**Decisão.** O `.gitignore` exclui o conteúdo de `.claude` com o padrão `/.claude/*` e
reinclui `.claude/skills` com `!/.claude/skills/`. Também exclui `.stryker-tmp` e `reports`.

**Motivo.** No Passo 1 apareceu um worktree do git em `.claude/worktrees/<nome>`, criado por
ferramenta. Worktree é uma cópia do repositório dentro do repositório, e com apenas o
`settings.local.json` ignorado bastava um `git add -A` distraído para engolir a árvore
inteira duplicada.

**Por que o conteúdo e não a pasta.** Ignorar `.claude` inteira colide com a governança do
próprio projeto: a skill de inspeção adversarial nasce em
`.claude/skills/inspecao-conformidade/`, é exigida por RNF-011 e por D-038, e o
`PROTOCOLO-ETAPA.md` manda a inspeção ser conduzida por ela. Se o padrão excluir o diretório,
o git não desce nele e a negação `!/.claude/skills/` não tem efeito, então a skill seria
commitada e simplesmente não apareceria no clone. Falha silenciosa: nada quebra, o arquivo só
não existe. Excluir o conteúdo preserva a negação, e é a mesma técnica que `/ingest/*` mais
`!/ingest/.gitkeep` já usa desde o Passo 0.

**Consequência aceita.** `git check-ignore -v .claude` devolve exit 1, porque o diretório nu
não casa com o padrão. Isso é esperado e não é falha: o git versiona arquivo, não diretório. A
verificação correta é `git add -A --dry-run`, que simula o acidente e mostra o que de fato
entraria.

**Descartado.** `.claude/` inteira com `git add -f` manual para a skill. Proteção que depende
de alguém lembrar de um `-f` no momento certo não é proteção.

### D-051. Lockfile versionado

**Decisão.** O `bun.lock` entra no repositório e é tratado como parte da fonte, não como
artefato de build.

**Motivo.** Reprodutibilidade é o eixo deste produto, e o RF-801 exige que os mesmos inputs e
as mesmas versões produzam resultado idêntico. Sem lockfile, a faixa `"decimal.js": "^10.6.0"`
deixa outra máquina resolver uma versão diferente, e o mesmo snapshot pode devolver outro
número sem que nenhuma premissa tenha mudado. O lockfile é o que transforma "mesmas versões"
de intenção em fato verificável: ele prende `decimal.js` em 10.6.0 com hash de integridade.

**Alcance.** Vale para toda dependência que influencie cálculo ou verificação, o que neste
projeto é praticamente todas: `decimal.js`, TypeScript, Vitest, Stryker, Prettier e o linter
quando entrar. Vale também para ferramenta que altera arquivo versionado, mesmo quando ela não
toca em cálculo nem em verificação pela letra. O caso é o formatador: versão diferente de
Prettier reformata arquivo inteiro e transforma o diff da etapa seguinte em ruído. Num projeto
onde conformidade é conferida lendo diff, formatador solto destrói a ferramenta de revisão.

### D-052. Integridade da verificação: saída de sucesso precisa carregar prova de execução

**Decisão.** Exit code zero, sozinho, não é prova de execução neste projeto. Toda saída
reportada como sucesso precisa conter algo que não existiria se o comando não tivesse rodado
de verdade: número de versão, hash, contagem, nome de arquivo, número de linha. Ferramenta que
reporta resultado agregado, como score de mutação, não é oráculo, e resultado suspeito é
verificado à mão.

**Primeiro caso, wrapper fabricando sucesso.** O wrapper `rtk` devolve texto de sucesso para o
binário `tsc`, que não existe no PATH desta máquina. Reproduzido nesta sessão, duas vezes
seguidas, com saída literal:

```
$ command -v tsc
$ echo $?
1
$ which -a tsc
$ echo $?
1
$ rtk tsc --version
TypeScript: No errors found
[full output: ~/.local/share/rtk/tee/1787701364_tsc.log]
$ echo $?
1
$ cat ~/.local/share/rtk/tee/1787701364_tsc.log
                This is not the tsc command you are looking for

To get access to the TypeScript compiler, tsc, from the command line either:

- Use npm install typescript to first add TypeScript to your project before using npx
- Use yarn to avoid accidentally running code from un-installed packages
```

O log do próprio wrapper mostra que o comando real falhou, e o que ele imprimiu na tela foi
"No errors found". Duas ressalvas de honestidade: nesta reprodução o exit code veio 1, ou
seja, o que foi fabricado foi o texto, não o código; e a saída literal do caso original,
observado em outra sessão e relatado com exit 0, não foi reconstituída, porque aquele
transcript não está disponível aqui. O que está gravado acima é o que foi executado nesta
sessão.

**Por que isso é grave.** Ataca a RNF-005 na raiz. A regra de exit code verbatim existe para
eliminar a camada interpretativa entre o comando e o leitor, e um wrapper que sintetiza
sucesso reintroduz essa camada, invisível e mais convincente que prosa. Uma afirmação em prosa
desperta desconfiança. Um "No errors found" não.

**Segundo caso, ferramenta reportando falso negativo.** No Passo 1, o Stryker classificou como
sobrevivente um mutante em `toExpNeg` que a suíte de fato mata. A verificação à mão mostrou
que o mutante quebra na carga do módulo, os três arquivos de teste falham e o exit é 1. O
Stryker não contabiliza porque nenhum teste chega a rodar. O sobrevivente era falso, e só
apareceu porque alguém desconfiou do resultado em vez de aceitar o score.

**Consequência.** A regra vira gate no `PROTOCOLO-ETAPA.md`, seções 3 e 6.

**Descartado.** Trocar de wrapper ou de runner. O problema não é de ferramenta específica, é
de confiar em sinal agregado, e trocar a ferramenta só troca o formato da mentira.

### D-053. Linter: oxlint com type-aware, Prettier, `tsc` separado

**Decisão.** oxlint como linter, com type-aware habilitado a partir do Passo 2. Prettier como
formatador. `tsc --noEmit` mantido como passo de verificação separado. A versão do oxlint e do
oxlint-tsgolint fica travada no lockfile (D-051).

**Por que oxlint, e o motivo mudou depois da verificação.** A razão inicial era custo em
monorepo Bun, sem dependência de plugin do ecossistema ESLint que justificasse ESLint. A
verificação achou uma razão mais forte: neste workspace, o pacote npm `typescript` é uma casca
do typescript-go, e `require('typescript')` devolve apenas `version` e `versionMajorMinor`.
`createProgram` não existe. Qualquer linter type-aware que precise da API JS do compilador não
funciona aqui, o que exclui typescript-eslint com type-aware por impossibilidade técnica, não
por preferência. O oxlint-tsgolint embute o próprio typescript-go e não depende dessa API.

**Por que type-aware só no Passo 2.** As regras que importam neste projeto atacam dado externo
entrando como `any` e exaustividade de discriminação, e nenhuma das duas tem onde morder em
`packages/shared`, que não tem async, não tem `any` e não tem `switch`. O lugar onde elas valem
é o loader de conhecimento do Passo 2, que lê YAML antes do Zod, e depois o core com providers
e queries. As regras nomeadas como prioritárias: `no-unsafe-assignment` e `no-unsafe-argument`
primeiro, porque o caminho de contaminação real é dado de provider e de documento extraído
pelo agente; depois `switch-exhaustiveness-check`, porque a v1 tem três setores e o escopo
declarado prevê seis, e setor novo sem branch precisa quebrar em CI e não em runtime; depois
`no-floating-promises`, `no-misused-promises` e `await-thenable`, que só têm objeto quando o
core existir.

**Por que `tsc --noEmit` continua separado.** O oxlint aceita `--type-check` e compartilharia o
programa, mas neste projeto o type-check é garantia estrutural, não conveniência de linter.
Mantendo separado, o gate continua de pé se o linter quebrar ou for trocado. Consolidação só
depois de ver as duas ferramentas concordando por algumas etapas, e com decisão nova.

**Por que travar a versão.** O oxlint-tsgolint versiona junto com o TypeScript que embute, no
formato `<versao-do-typescript>.<patch>`, então travar o pacote trava também a semântica de
tipos aplicada pelo lint. Consequência: atualizar o oxlint passa a ser decisão consciente, com
verificação de que a versão embutida continua batendo com a do compilador do projeto, e nunca
efeito colateral de um update distraído.

**Divergência de versão, risco residual.** Existem duas cópias do typescript-go no projeto, a
do workspace travada pelo lockfile e a embutida no binário do linter. Não são semânticas
diferentes, são a mesma implementação em versões que podem derivar. O risco é detectável
comparando as duas versões, e a comparação entra como verificação quando o linter for
configurado.

**Relação com a aritmética de dinheiro, para ninguém assumir proteção que não existe.** Nenhuma
regra do linter impede somar dois valores monetários. Isso não é problema aqui porque a D-045 e
a D-047 fizeram `Money` ser wrapper de `Decimal` com tipo nominal, e o operador aritmético
nativo entre dois `Money` já não compila: quem barra é o compilador, não o lint. O que o tipo
não fecha é a fronteira de coerção, template string, `Number()`, `parseFloat` e `valueOf`. Se
em algum momento uma regra custom for escrita, é para essas coerções. A regra
`restrict-template-expressions` do type-aware cobre parte disso e é a mais relevante para o
`Money`, mais que as nomeadas acima.

### D-054. TypeScript 7 como versão do projeto, com compatibilidade a verificar

**Decisão.** O projeto fica em TypeScript 7, faixa `^7.0.2`, travada pelo lockfile (D-051).

**Como isso aconteceu.** Não foi escolha deliberada de migração. O Passo 1 declarou
`typescript` sem fixar major, e 7.0.2 era o latest do registry no momento, então o workspace
resolveu para lá e o `tsc --noEmit` do Passo 1 rodou nessa versão. A decisão aqui é manter, com
verificação, e não adotar do zero.

**Por que manter.** É a versão estável publicada, é a que o oxlint-tsgolint acompanha, e todo o
`packages/shared` já compila nela com exit 0. Voltar para 5.x agora custaria reconferir os
testes de tipo do Passo 1, que dependem de `@ts-expect-error` e de tipo nominal, sem ganho
identificado.

**O que ainda não foi verificado, e é a pendência real.** O TypeScript 7 é o port em Go, e o
pacote npm virou casca: `require('typescript')` não entrega API de compilador. Três
dependências centrais da stack ainda não foram testadas nessa versão e nenhuma delas está
instalada hoje:

- Drizzle, que gera tipos a partir de schema. Verificar no Passo 2, quando entrar
- Elysia com Eden, que faz tipagem end to end entre backend e renderer. Verificar na Fase 2
- Electron e o toolchain de build do renderer. Verificar na Fase 7

Se alguma delas não funcionar em TS 7, a decisão volta à mesa e a alternativa é fixar 5.x, com
o custo de perder o type-aware do oxlint pelo mesmo motivo técnico da D-053. Registrar isso
agora existe para que a descoberta não chegue como surpresa no meio de uma fase.

---

## Sessão de 26/08/2026

### D-055. Governança fica acoplada ao Claude Code na v1

**Decisão.** Nenhum adaptador de instrução para outro agente. `CLAUDE.md`, `AGENTS.md`,
`DECISOES.md` e `PROTOCOLO-ETAPA.md` permanecem como estão, e a skill de inspeção continua em
`.claude/skills/`, em formato do Claude Code.

**Motivo.** A separação em arquivo canônico mais adaptadores curtos por ferramenta foi
desenhada e aprovada, e recusada antes de executar. Adaptador sem consumidor envelhece errado,
como o handoff de planejamento envelheceu, e renomear `AGENTS.md` para `ESTADO.md` mexeria em
referência em cinco ou seis arquivos, inclusive na skill recém criada, sem entregar nada a
ninguém.

**O que dispara a reconsideração.** A entrada de um segundo agente de fato. O desenho aprovado
fica registrado aqui para o debate não recomeçar do zero: `CLAUDE.md` permanece canônico,
porque carrega automaticamente em toda sessão e as oito invariantes não podem depender de
alguém abrir outro arquivo; adaptadores curtos apontam para ele sem copiar conteúdo normativo;
`AGENTS.md` cede o nome ao padrão emergente e o estado migra para `ESTADO.md`.

**Pendência independente desta decisão.** O método de inspeção adversarial vive só na skill,
invisível para outro agente. A extração para arquivo neutro acontece depois que ela rodar pelo
menos uma vez, ou seja, a partir do fechamento deste Passo 2.

### D-056. Linter entra junto com o loader, não neste passo

**Decisão.** Nenhum linter é instalado ou configurado no Passo 2. A D-053 fica de pé, e a
entrada do oxlint com type-aware passa para o passo em que o loader de conhecimento existir.

**Motivo.** Os gatilhos que a seção 2 do `CLAUDE.md` manda procurar (`defaultValue`,
`placeholder` com número, `sortBy`, `ORDER BY` por métrica) vivem em código de interface, que só
existe na Fase 7. Rodar o linter agora devolve zero ocorrências e passa verde, o que é pior que
não ter linter, porque cria confiança falsa numa proteção que não teve como atuar. Mesma família
do wrapper que devolve texto de sucesso para binário ausente (D-052): o problema não é o
resultado errado, é o sinal verde sem substrato.

Os padrões de dinheiro que já se aplicam hoje estão cobertos pelos testes de `packages/shared`,
que é onde pertencem: o operador aritmético entre dois `Money` já não compila por causa do tipo
nominal (D-045, D-047), e a fronteira de coerção tem teste próprio. Não há lacuna que o linter
fecharia agora.

### D-057. Drizzle funciona sob TypeScript 7, e a pendência do Drizzle sai da D-054

**Decisão.** O Drizzle fica na stack. A pendência de compatibilidade do Drizzle registrada na
D-054 está resolvida e sai da lista. As de Elysia com Eden e de Electron permanecem abertas,
com os prazos que a D-054 já fixou.

**O que foi testado.** Projeto mínimo e descartável fora do repositório, com Bun 1.2.13,
`typescript@7.0.2` (a mesma versão que o `bun.lock` do projeto trava, conferida no lockfile),
`drizzle-orm@0.45.2`, `drizzle-kit@0.31.10` e `bun:sqlite`. Uma tabela com três colunas,
`integer` de chave, `text` de ticker e `text` de valor, que é o tipo que a D-045 fixa para
valor financeiro.

**Prova 1, compila limpo.**

```
$ npx tsc --version
Version 7.0.2
$ npx tsc --noEmit
$ echo $?
0
```

**Prova 2, o tipo inferido é o tipo certo e não `any`.** Esta era a prova que importava, porque
o risco real não é o Drizzle falhar alto, é a inferência degradar em silêncio. Um
`@ts-expect-error` sobre atribuição errada não basta sozinho, porque diretiva que passa não
distingue tipo correto de tipo ausente. Com a diretiva removida, o compilador diz qual é o tipo:

```
$ npx tsc --noEmit
src/tipos.ts(6,64): error TS2322: Type 'number' is not assignable to type 'string'.
$ echo $?
1
```

Coluna `text` inferida como `string`, com o `number` recusado na compilação. Se tivesse
degradado para `any`, a atribuição passaria e a diretiva restaurada reprovaria por TS2578. Com
a diretiva de volta, o exit volta a ser 0.

**Prova 3, a query roda e devolve o dado.**

```
$ bun run src/consulta.ts
linhas devolvidas: 1
ticker: TAEE11
valor lido do banco: 35.4200000001 | typeof: string
round trip preservou o texto? true
$ echo $?
0
```

O valor com doze dígitos significativos volta do SQLite idêntico e como `string`, que é o
comportamento de que a D-045 depende: dinheiro em coluna TEXT, sem passar por `number` no
caminho.

**O que isso significa para a D-054.** A alternativa cara não precisa ser avaliada. Voltar para
TypeScript 5.x derrubaria a D-053, porque o type-aware do oxlint depende do TS 7, e trocar de
ORM reabriria o RNF-002. Nenhum dos dois está na mesa por causa do Drizzle.

**Limite do que foi provado.** Uma tabela, três colunas, um insert e um select com `where`. Não
foram exercitados relação entre tabelas, migration gerada pelo `drizzle-kit`, tipo customizado
nem query builder complexo, que é onde a inferência do Drizzle costuma ser mais pesada. O spike
responde "a stack não está quebrada", não "tudo do Drizzle funciona". O spike foi apagado ao
fim, como combinado, e nada dele entrou no repositório.

### D-058. Taxa em arquivo de conhecimento é texto entre aspas

**Decisão.** Todo campo de grandeza financeira ou taxa em arquivo YAML de conhecimento se
escreve entre aspas, `minimo: "0.09"`. O schema recusa o valor sem aspas.

**Motivo.** YAML sem aspas entrega `0.09` como número de ponto flutuante, e float em taxa é
exatamente o que a D-045 fecha. Aceitar sem aspas e converter no schema esconderia o float que
já passou pelo parser, ou seja, a conversão daria a impressão de proteção depois de o dano já
ter acontecido. A D-045 diz "inclusive em fixture e em teste" e não abre exceção para arquivo
de dados.

**Achado que originou.** `transmissao-energia-b3` trazia `minimo: 0.09` e `maximo: 0.14` sem
aspas, transcritos fielmente da seção 9 do documento de requisitos. O CLI reprovou na primeira
execução contra o conhecimento real.

**Divergência com a fonte de verdade.** A seção 9 do
`docs/REQUISITOS-valuation-simulator-v2.2.md` ainda não reflete esta decisão: lá os valores
continuam sem aspas. A correção da fonte é tarefa própria, com incremento para 2.3.0 e diff
revisado.

### D-059. Ausência deliberada se escreve com `null` explícito

**Decisão.** Campo opcional cuja ausência é decisão registrada se escreve com `null` explícito,
e o schema aceita `null` como declaração de ausência, distinta de omissão.

**Motivo.** Omitir a chave é indistinguível de esquecer a chave. `null` com comentário ao lado
documenta a decisão dentro do próprio dado, que é o caso de `faixa_referencia` em
`preco_normalizado_lp`, ausente de propósito por D-014. É a mesma lógica da D-021: ausência
silenciosa apodrece, e quem chega depois não tem como saber se faltou ou se foi escolhido.

**Alcance.** Vale onde a ausência é decisão, não em todo campo opcional. Campo simplesmente não
aplicável continua sendo omitido.

### D-060. `modos` é obrigatório, e setor de modo único declara um modo

**Decisão.** `modos` passa a campo obrigatório do playbook. Setor que só tem um jeito de
calcular declara um modo, com `precisao: alta`.

**Motivo.** Com `modos` opcional, RF-105 não tem onde exigir o aviso de precisão reduzida, e um
playbook futuro pode introduzir modo reduzido sem aviso sem que nada reprove. RF-102 lista modos
de granularidade entre o que um playbook define, e requisito que virou sugestão é o começo do
fim das proteções.

**Descartado.** Tornar `modos` opcional para caber nos playbooks existentes, que é afrouxar o
schema para acomodar defeito da fonte.

**Achado que originou.** `bancos-b3` e `commodities-b3` não declaravam `modos`.

**Divergência com a fonte de verdade.** A seção 9 do documento de requisitos ainda não reflete
esta decisão: os dois playbooks continuam sem `modos` lá. Correção da fonte é tarefa própria,
com incremento para 2.3.0.

### D-061. Conteúdo de conhecimento exibido ao usuário passa por filtro de RP-004

**Decisão.** Todo campo de conhecimento cujo conteúdo é exibido ao usuário é declarado como
texto de interface no schema, e passa por filtro de vocabulário valorativo com gatilhos
derivados da seção 2 do `CLAUDE.md`. As três ocorrências de `commodities-b3` são corrigidas na
fonte.

**Motivo.** Metade das proteções do produto existe para o software informar sem recomendar, e
todas elas olham o caminho do cálculo. Texto valorativo não é número e não passa por engine,
então entrou por um caminho que nenhuma proteção inspecionava. A origem é a prova de que a
proteção é necessária: as três ocorrências foram escritas pelo autor do projeto, dentro do
documento que define RP-004.

**O filtro é rede, não prova.** Lista de gatilhos pega o vocabulário conhecido e não pega
paráfrase: "o desenlace favorável ao emissor é o cenário natural" passa limpo em qualquer lista.
A prova continua sendo a revisão do curador (RF-121), e o filtro existe para reduzir o que chega
até ela, não para substituí-la. Nenhuma proteção de RP-004 no conteúdo deve ser assumida como
completa.

**O que o filtro exige para funcionar.** A declaração de quais campos são texto de interface,
que hoje está implícita nos requisitos de exibição e precisa ficar explícita no schema. Campo
que vira tela sem essa marcação fica fora do filtro em silêncio.

**Campos marcados, com o requisito que sustenta cada um.** `motivo` de múltiplo bloqueado
(RF-104); `label` e `aviso_obrigatorio` de modo (RF-105); `mensagem` de regra dura (RF-507);
`onde_olhar`, `o_que_verificar`, `por_que_importa` e `fonte` de heurística (RF-116);
`visoes.fonte` e `visoes.posicao` (RF-108); `justificativa` e `fonte` de nota (preâmbulo de
RF-116); `descricao`, `mecanismo` e `fonte` de evento (RF-116); `aviso` de faixa (RF-116, bloco
de contexto de escala); `justificativa` de horizonte (RF-419, que diz "exibida"); `descricao` e
`onde_encontrar` de input obrigatório (RF-302, o texto acompanha a pendência exibida); `ajuda`
de premissa, que não tem requisito de exibição próprio e entrou porque RF-112 já a trata como
texto que chega ao usuário.

**O campo que ficou de fora, e por quê.** `alertas` do playbook não entrou. Nenhum requisito
define esse campo nem manda exibi-lo, e RF-102 não o lista entre o que um playbook declara. Ele
carrega hoje a frase que a D-061 mandou corrigir, e a correção vale só porque foi feita à mão:
nada impede a próxima. Decidir o que ele é, texto de interface, nota interna do curador ou
campo a remover, é questão aberta registrada no `AGENTS.md`.

**O modo de falha desta decisão apareceu na própria etapa.** A primeira marcação esqueceu três
campos exibidos, `visoes`, `justificativa` de horizonte e `onde_encontrar`, e a segunda rodada
da inspeção adversarial os achou. Marcação manual erra, inclusive de quem escreveu a decisão no
mesmo dia.

**Exceções que o filtro precisa carregar.** Dois gatilhos da seção 2 têm uso metodológico
legítimo e não podem ser recusados sozinhos: `descontado`, que aparece em fluxo de caixa
descontado, e `oportunidade`, que aparece em custo de oportunidade do capital. O filtro recusa
os dois, menos nessas colocações. Sem a exceção, a proteção seria removida na primeira vez que
alguém escrevesse metodologia correta e o CLI reprovasse.

**Divergência com a fonte de verdade.** A seção 9 do documento de requisitos ainda não reflete
esta decisão: as três strings valorativas continuam lá. Correção da fonte é tarefa própria, com
incremento para 2.3.0.
