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

### D-062. O filtro de RP-004 inverte: filtrado por padrão, exceção declarada

**Decisão.** A lista de campos do filtro de RP-004 inverte de significado. Hoje ela declara
quais campos são filtrados; passa a declarar quais campos de texto livre são internos e ficam
FORA do filtro. Todo campo de texto livre não listado é filtrado por padrão.

**Motivo.** O modo de falha da decisão anterior era esquecer de marcar, e ele aconteceu em três
campos horas depois de a decisão ser escrita: `visoes`, `justificativa` de horizonte e
`onde_encontrar` de input. Lista de inclusão falha por omissão silenciosa, que não deixa rastro.
Lista de exclusão falha por comissão visível, que aparece no diff, e o diff é onde a
conformidade deste projeto é conferida. Um erro é invisível para a revisão, o outro passa por
ela. Quando o desenho pede o erro, muda o desenho.

**Custo aceito.** O filtro pode reprovar texto interno legítimo, e aí o campo precisa ser
listado como exceção, com justificativa. Exceção marcada aparece no diff; esquecimento não.

**Ampliação dos gatilhos.** Entram `subavaliação`, `sobreavaliação` e as variantes de mesma
família, `subavaliado`, `sobreavaliado`, `subprecificado`, `sobreprecificado`, `subvalorizado` e
`sobrevalorizado`. Ampliar a lista caso a caso é o modo de operação normal do filtro, não
conserto de defeito: a D-061 já declara que ele é rede e não prova, e rede se remenda quando um
peixe passa. O que seria defeito é assumir a lista como completa.

### D-063. O campo `alertas` sai do playbook, com o conteúdo redistribuído

**Decisão.** O campo `alertas` sai do schema de playbook e sai dos três arquivos YAML. O
conteúdo é redistribuído em três destinos, conforme o que cada item é de fato.

**Motivo.** O campo não é definido por nenhum requisito e RF-102 não o lista entre o que um
playbook declara. Ele é anterior ao bloco `heuristicas_de_leitura` e ficou pendurado desde a
v1.0. Sem requisito que o defina, ele não tem como ser exibido de forma conforme, não tem
estrutura obrigatória, e ficou fora do filtro de RP-004 justamente por não ter requisito de
exibição. Eliminar resolve os três de uma vez.

**Por que redistribuir em três destinos e não migrar tudo para heurística.** Dos seis itens,
dois são heurística de leitura de fato, dois são duplicata de heurística já existente, e dois
são regra de interpretação de múltiplo, que não tem `onde_olhar` em documento e pertence a
`multiplos_bloqueados`. Migrar duplicata ativaria um risco declarado na seção 11 do documento de
requisitos: acúmulo de heurística de baixa qualidade produz ruído de alerta e o usuário passa a
ignorar tudo.

**Os seis itens, conferidos um a um contra o conteúdo real das heurísticas.**

| Item | Destino | Conferência |
|---|---|---|
| Transmissão, ciclo RAP de julho a junho | heurística nova, H-004, informativo | H-001 trata de deduções de RAP bruta para líquida, assunto diferente |
| Commodities, posição na curva global de custos | heurística nova, H-044, informativo | H-042 trata de trajetória do custo em quatro trimestres, leitura diferente |
| Bancos, ROE inflado por reversão de PDD | deletado | H-022 já diz exatamente isso, com `por_que_importa` "ROE recente deixa de representar ROE sustentável" |
| Commodities, reservas finitas contra perpetuidade | deletado | H-043 já diz exatamente isso, com `por_que_importa` "Reserva finita contradiz crescimento perpétuo positivo" |
| Bancos, P/VPA junto com o spread ROE menos Ke | `multiplos_bloqueados`, alerta | P/VPA não estava na lista de bancos, é item novo |
| Transmissão, concessões próximas do vencimento | `multiplos_bloqueados`, alerta, reescrito | continha juízo de preço, ver abaixo |

**Achado adicional, a quarta ocorrência valorativa.** O alerta de Transmissão dizia que
concessões próximas do vencimento "aparentam subavaliação em múltiplos tradicionais". Isso é
juízo sobre preço e é a quarta ocorrência de RP-004 nos playbooks, não a terceira. E
`subavaliação` não estava nos gatilhos da seção 2 do `CLAUDE.md`, então passaria limpa mesmo com
o filtro invertido, o que é evidência empírica da linha "o filtro é rede, não prova" da D-061,
encontrada no mesmo dia em que a linha foi escrita. O gatilho entra pela D-062 e o texto é
reescrito pelo mecanismo: múltiplo tradicional não carrega a data de vencimento da concessão,
então não informa nada sobre o ativo.

**As duas heurísticas novas são proposta, não conhecimento autorado.** Elas exigem `aplica_em`,
`confianca` e `fonte`, campos que o alerta não tinha. A `fonte` registra a origem real, que é o
campo `alertas` da v1.0, e a `confianca` fica em `media`, porque o conteúdo é afirmação factual
específica sem referência bibliográfica. O curador revisa e sobe para `alta` se confirmar contra
a fonte primária, do mesmo jeito que os modos mínimos criados no Passo 2 esperam revisão.

### D-064. Documento de requisitos em 2.3.0, e a divergência com `conhecimento/` está encerrada

**Decisão.** O documento de requisitos vai para 2.3.0 e passa a viver em
`docs/REQUISITOS-valuation-simulator-v2.3.md`. A seção 9 passa a ser byte a byte igual aos
arquivos de `conhecimento/playbooks/`, e a equivalência é verificada por comparação
programática, não por leitura.

**O que isso encerra.** As linhas de divergência de D-058, D-060 e D-061, que diziam "a fonte
de verdade ainda não reflete esta decisão", estão vencidas. Elas continuam no arquivo porque o
`DECISOES.md` é append only, e é esta decisão que as supera. Mesma coisa para a menção a
`v2.2.md` na D-044, cujo assunto era o ponto na versão do nome do arquivo, e isso não mudou.

**O que mudou no documento.** Cabeçalho com versão, data e bloco de alterações desde 2.2.0
citando D-058 a D-063. Seção 9 substituída pelo conteúdo real dos três arquivos. Seção 10 com
nota dizendo que ela é registro de origem, D-001 a D-041, e que o `DECISOES.md` é canônico a
partir de D-042, sem replicar decisão nova ali, pelo mesmo motivo que mantém as invariantes só
no `CLAUDE.md`. Seção 11 com o risco de valor sugerido na ingestão ganhando a proteção de
schema, e uma linha nova para linguagem valorativa dentro do conteúdo, que é risco
materializado quatro vezes e não estava na tabela.

**RF-102 não mudou.** A remoção do campo `alertas` não exigiu ajuste, porque RF-102 nunca o
listou entre o que um playbook declara. Foi essa ausência que sustentou a D-063.

**Como a equivalência é conferida.** Extraindo os três blocos ```yaml da seção 9 e comparando
com os arquivos, e depois rodando o CLI sobre os blocos extraídos do próprio documento. Os dois
resultados estão no relatório da etapa. Quem duvidar refaz em dois comandos, que é o ponto de
usar comparação e não leitura.

**Aberto.** Nada impede a seção 9 e `conhecimento/` divergirem de novo amanhã. Um teste que
falhe quando divergirem é candidato natural, e não entrou nesta tarefa porque exige decidir se
o documento passa a ser lido por código, o que é decisão de arquitetura e não de conveniência.

### D-065. A equivalência entre o documento e `conhecimento/` vira teste da suíte

**Decisão.** O documento de requisitos passa a ser lido por código. Um teste da suíte compara
a seção 9 de `docs/REQUISITOS-valuation-simulator-v2.3.md` com os arquivos de
`conhecimento/playbooks/` e falha quando divergirem.

**Motivo.** A D-064 provou os dois lados iguais num dia e declarou que nada os mantinha iguais
no dia seguinte. A divergência anterior nasceu exatamente assim e levou dois passos para
alguém notar, o que é longo demais para um arquivo que serve de fonte de metodologia.

**Como o teste acha os blocos, que é a parte que importa.** Por conteúdo, não por posição nem
por título. Cada bloco de cerca ```yaml do documento é parseado, e vale como playbook o que
tiver `id` e `modelos_habilitados` no topo. O casamento com o arquivo é pelo `id`, e a
comparação é byte a byte.

**Descartado, extração por posição de linha ou por título de seção.** Quebraria quando alguém
inserisse seção antes da 9 ou renomeasse o título, e quebraria pelo motivo errado, que é pior
que não ter teste, porque ensina a ignorar o vermelho.

**Descartado, acrescentar marcador ao documento.** Chegou a ser considerado e não foi preciso:
o `id` dentro do próprio bloco já é marcador estável, e ele não pode mudar sem que isso seja
uma divergência de verdade. O documento não foi editado por causa deste teste, então não houve
incremento de versão.

**O que ele sobrevive, medido.** Inserir seção antes da 9, renumerar o título da seção,
renomear o título da subseção e acrescentar outros blocos YAML, como os exemplos de nota e de
evento da 9.4. Os três primeiros foram exercitados na mão e o teste seguiu verde.

**O que ele não sobrevive, de propósito.** Trocar a cerca ```yaml por outra coisa, tirar o
bloco do documento, e mudar o `id` dentro do bloco. Os três são divergência real.

**Custo aceito, e é comportamento pretendido.** Mexer na estrutura da seção 9 passa a quebrar
o teste. Quem editar o documento vai ter que editar `conhecimento/` junto, ou vice versa, e é
exatamente isso que se quer: os dois andam juntos ou o CI reclama.

**Detalhe de resistência.** O caminho do documento é achado por glob de
`REQUISITOS-valuation-simulator-v*.md`, com exigência de haver exatamente um. Assim o próximo
incremento de versão não quebra o teste por causa do nome do arquivo, que seria outra quebra
pelo motivo errado.

### D-066. A chave do `z.record` em `ValorDeSinal` fica fora do filtro, com medição

**Decisão.** A chave dos registros de sinal de detecção não passa pelo filtro de RP-004. Não é
pendência, é decisão de não fazer.

**Motivo, medido e não estimado.** Filtrar a chave funciona tecnicamente, o Zod aceita schema
de chave em `z.record`. Só que a chave é `snake_case` por convenção do formato, e os gatilhos
do filtro exigem fronteira de palavra, então `parece_barato` não casa de jeito nenhum, porque
`_` é caractere de palavra e não abre fronteira. O que casaria é chave com espaço, tipo
`papel barato`, e nesse caso a mensagem que o Zod devolve é "Invalid key in record", sem o
requisito citado. Cobertura real ganha zero, diagnóstico piora.

**Por que registrar em vez de deixar na lista de brechas abertas.** Brecha aberta é convite
para alguém refazer a mesma medição daqui a três meses e chegar na mesma conclusão. Decisão
com a medição dentro fecha o assunto e deixa o caminho de volta aberto: se um dia a mensagem
de chave do Zod passar a ser customizável, ou se a convenção de chave deixar de ser
`snake_case`, a medição muda e a decisão se revisita.

---

## Sessão de 27/08/2026

### D-067. Expurgo do conhecimento analítico, e a fronteira que separa o que fica

**Decisão.** Todo conhecimento de análise de ativos sai dos playbooks e do documento de
requisitos, e vai para uma fase dedicada, a Etapa do Conhecimento. O que permanece é estrutura
verificável.

**Critério da fronteira, único.** Um item é imutável quando é verdadeiro por força de contrato,
de norma contábil, de regulação vigente ou de aritmética, independentemente de cenário
macroeconômico, de desempenho da companhia e de opinião de analista. Se a resposta muda conforme
o ano, o ciclo, a taxa de juros ou quem analisa, é mutável. **Critério subordinado:** se o item
exige conhecimento setorial que não está em nenhum documento da companhia, é mutável, mesmo que
pareça consensual.

**Motivo.** Os playbooks foram populados com conhecimento que nunca foi autorado: as heurísticas
saíram de um PDF numa conversa de planejamento, a faixa de 9% a 14% foi inventada e o
`n_observacoes: 7` afirma sete observações que não existem, e nas últimas três etapas agente
escreveu dois modos, duas heurísticas e três reescritas de metodologia. A causa não é
indisciplina de execução: duas fases foram misturadas, estrutura verificável e conhecimento
analítico entrando no mesmo lugar ao mesmo tempo.

**O que o expurgo não faz.** Não remove capacidade de schema e não remove requisito. Os campos
continuam existindo e viram opcionais, o conteúdo vira `null` explícito com comentário (D-059),
e as fixtures que testam RF-113 e RF-105 continuam valendo porque testam proteção, não dado.
Requisito sem dado é requisito à espera.

**Nota que sustenta a viabilidade.** A D-006 nomeia três mecanismos que resolvem o campo vazio
de premissa sem opinar: faixa de referência, composição por CAPM e tabela de sensibilidade. Dois
sobrevivem intactos, porque a composição depende da NTN-B, que é fato de mercado, e a
sensibilidade é aritmética repetida. Só a faixa depende de conhecimento autorado, e era o mais
frágil dos três.

### D-068. Severidade `alerta` sai inteira, inclusive o conteúdo que passa no critério

**Decisão.** Toda entrada de `multiplos_bloqueados` com `severidade: alerta` sai, inclusive as
duas cujo conteúdo passa no critério de imutabilidade. Vão para `docs/nao-autorado/` marcadas
como conteúdo imutável com severidade a definir.

**Motivo, e não é a origem do texto.** As duas entradas em questão têm conteúdo imutável de
fato: o motivo do P/VPA de bancos é identidade aritmética entre preço sobre patrimônio e retorno
versus custo de capital, e o da comparação entre pares em transmissão segue do contrato, porque
múltiplo sobre resultado corrente não contém prazo contratual. Se fosse só o texto, ficariam.

**O que decide é a classificação.** `severidade: alerta` significa "distorce mas ainda é
utilizável com cuidado", e isso é calibragem. `bloqueio_total` significa "esta operação é
inválida", que é binário e verificável. Entre os dois existe uma escala, e escolher onde na
escala o item cai é juízo sobre quanta distorção importa. Não é o texto que é mutável, é a
classificação, e ela não se separa do item.

**Descartado, promover as duas a `bloqueio_total`.** Decidir que P/VPA é inutilizável em banco,
e não apenas exige leitura conjunta com o spread, é decisão metodológica de peso, e o lugar dela
é a Etapa. Na Etapa o curador decide se voltam como alerta, como bloqueio, ou como heurística.

### D-069. RNF-013, conteúdo analítico não é escrito por agente

**Decisão.** Nova exigência não funcional: conteúdo de conhecimento analítico não é escrito por
agente, em nenhuma circunstância, nem como placeholder, nem para satisfazer campo obrigatório de
schema. Se um campo obrigatório exige conteúdo analítico que não existe, o campo deixa de ser
obrigatório ou a etapa para e pergunta ao curador.

**Teste de decisão.** Este texto afirma algo sobre o mundo que eu não posso rastrear a um
documento da companhia, a uma norma vigente, ou a uma operação aritmética? Se sim, é
conhecimento analítico e não é meu para escrever.

**Gatilho.** Estar preenchendo campo obrigatório de schema com conteúdo que ninguém pediu. Foi
exatamente assim que os dois modos mínimos nasceram no Passo 2.

**Exceção única, fixture de teste.** Conteúdo sintético em `conhecimento/fixtures-invalidas/`
não é afirmação sobre o mundo, é estímulo para exercitar validação. Não sai da pasta, não é
referenciado por playbook, e existe para provar que a proteção reprova. **Critério de teste para
separar sintético de afirmação:** se o texto da fixture fosse lido por um usuário do app, ele
afirmaria algo sobre um setor ou uma empresa? Se sim, não é sintético. Um modo com `precisao`
reduzida e sem aviso é estímulo. Um modo com label "Por concessão (maior precisão)" já é
afirmação.

**Por que RNF e não RP.** As restrições permanentes RP-001 a RP-008 são sobre o que o produto
faz quando roda. Esta é sobre como o projeto é desenvolvido, que é a família de RNF-010, RNF-011
e RNF-012, todas conduta de agente. E classificar como RP-009 obrigaria a trocar "oito
invariantes" em cinco arquivos, incluindo a skill de inspeção, e uma skill dizendo oito num
projeto de nove restrições é proteção que não cobre a última.

**Onde ela vive.** A RNF-013 entra na tabela de requisitos não funcionais do documento e ganha
entrada na seção 5 do `CLAUDE.md`, que é onde a conduta vive. A contagem de invariantes da seção
2 continua sendo oito.

### D-070. A Etapa do Conhecimento entra sem número de fase

**Decisão.** A Etapa do Conhecimento entra no roteiro entre a Fase 7 e a Fase 8, com nome e sem
número. As fases 1 a 8 mantêm a numeração.

**Motivo.** Renumerar corromperia citações em arquivo append only. A D-046 manda reavaliar o
valor 34 de `precision` na Fase 8, comparando engines contra cálculo manual independente; se a
Etapa fosse a nova Fase 8, aquele texto passaria a mandar reavaliar precisão numérica na etapa
errada, e o `DECISOES.md` não pode ser editado. O levantamento confirmou sete citações de Fase 8
no repositório, duas delas em `DECISOES.md`.

**Custo aceito.** A tabela de fases passa a ter uma linha sem número. Esquisito de ler e correto
ganha de elegante e errado.

**Posição no roteiro, e o motivo dela.** A Etapa vem depois do app funcional, porque autorar
conhecimento exige o app para exercitá-lo, e antes da validação metodológica, porque não se
valida metodologia que ainda não foi autorada.

### D-071. Emenda da D-060: `modos` e `heuristicas_de_leitura` voltam a opcionais

**Decisão.** `modos` volta a ser campo opcional do playbook, e `heuristicas_de_leitura` também.
A D-060, que tornou `modos` obrigatório, é superada nesta parte e permanece no log.

**Motivo, e a premissa da D-060 estava errada.** Ela justificava a obrigatoriedade dizendo que
com `modos` opcional, RF-105 não teria onde exigir o aviso de precisão reduzida. Isso não se
sustenta: a proteção de RF-105 é condicional à presença de um modo com `precisao: reduzida`, não
à existência do campo `modos`, e a fixture `modo-reduzido-sem-aviso.yaml` testa exatamente essa
condicional. Com `modos` ausente não existe modo reduzido, logo não existe aviso a exigir, e a
proteção continua de pé para o dia em que um modo reduzido for declarado.

**Consequência.** A fixture `sem-modos.yaml` e o teste que a acompanha saem, porque a regra que
eles testam deixa de existir. Fixture que testa regra inexistente falha, e alguém conserta
reintroduzindo a regra.

**Terceiro campo, achado no levantamento e não previsto.** `horizonte_projecao` também vira
opcional, porque bancos perde o bloco por D-067 e por RF-419 emendado.

### D-072. `ativos_produtivos` como lista em commodities

**Decisão.** `vida_util_reserva` deixa de ser escalar e passa a ser subcampo de uma lista
`ativos_produtivos` em commodities, no formato de `concessoes` em transmissão. R-204 passa a
validar o horizonte de cada ativo contra a vida útil daquele ativo, e a mensagem de erro nomeia
o ativo que estourou.

**Motivo.** Que uma mineradora tenha várias minas com vidas úteis diferentes é fato do mundo, e
estrutura que não comporta fato do mundo é defeito de arquitetura, não pendência de metodologia.
Hoje o usuário é obrigado a colapsar em um número, nenhum lugar do repositório diz como
colapsar, e as três formas plausíveis, menor, maior e média ponderada por reserva, dão
horizontes diferentes e portanto valores diferentes. Com `ajustavel_pelo_usuario: false`, esse
agregado sem regra alimenta o horizonte inteiro do cálculo, e R-204 valida contra ele sem saber
que é agregado. Isso é RP-005: o número não é fato, porque a companhia declara vidas por ativo,
e não é premissa, porque o campo é declarado não ajustável.

**Por que agora e não na Etapa.** Se a lista esperar, o Passo 3 escreve fixtures de fluxo
descontado com escalar e as engines consomem escalar, e refazer fixture de DCF mais assinatura
de engine é caro.

**Consequência aceita.** Commodities fica só com o modo detalhado até a Etapa, exigindo ativo
por ativo. É mais restritivo e mais correto: quem quiser calcular uma mineradora informa mina
por mina, que é o que o rigor manda de qualquer forma. O modo agregado é conveniência, e
conveniência que afirma direção de viés precisa de conhecimento setorial, porque o
`aviso_obrigatorio` de RF-105 teria que dizer que uma vida útil única mascara ativos se
exaurindo antes, e a direção do viés nos três subtipos não é dedutível do arquivo. Como colapsar
em horizonte único vai para a Etapa, junto com os modos.

### D-073. Quatro proteções nunca exercitadas, e a prova B como exigência de fixture nova

**Decisão.** RF-106, RF-107, RF-108 e RF-111 ganham fixture e teste. Toda fixture inválida nova
passa a exigir duas provas, não uma: a reprovação específica e a prova de que corrigir a única
violação faz a fixture passar.

**A lacuna era pré-existente e não foi causada pelo expurgo.** As pastas
`conhecimento/heuristicas`, `conhecimento/notas` e `conhecimento/eventos` sempre estiveram
vazias, e nenhuma das doze fixtures criadas no Passo 2 cobria os quatro requisitos. O expurgo
tirou heurística de dentro dos playbooks, e heurística dentro de playbook nunca exercitou
`divergencia` nem `campo_relacionado` porque nenhuma das onze tinha esses campos. É o argumento
da D-038 encontrado dentro do projeto que criou a D-038: proteção que ninguém tenta furar não
foi testada.

**Por que a prova B.** Fixture inválida boa não é a que fica vermelha, é a que fica vermelha
pelo motivo certo. A prova A mostra que o CLI reprovou citando o requisito; ela não mostra que a
reprovação veio daquela regra e não de outro defeito na mesma fixture. A prova B corrige a única
violação numa cópia temporária e mostra que a fixture passa, o que prova que nada mais nela era
inválido. As quatro novas têm as duas provas. As onze antigas têm só a A, e isso fica declarado.

**O modo de falha da prova A não é teórico, foi medido.** Em `Heuristica`, o `superRefine` de
RF-108 roda depois do parse do objeto, então **ele não roda quando outro campo está quebrado**.
Uma heurística com `divergencia: true`, sem `visoes` e sem `confianca` é reprovada só por
`confianca`, e a mensagem de RF-108 não aparece. Um teste que afirmasse apenas "reprovou" ficaria
verde com a proteção de RF-108 ainda sem exercício. Há teste dedicado a esse comportamento.

**O que a etapa 1 achou em cada proteção.**

RF-106: dispara na ausência de qualquer um dos seis campos, mas quatro deles, `onde_olhar`,
`o_que_verificar`, `por_que_importa` e `fonte`, citavam apenas RF-116 na mensagem, porque a
âncora tinha sido escolhida pelo filtro de RP-004. Teste que afirmasse "reprovou por RF-106" não
tinha como passar. As quatro mensagens passaram a citar `RF-106, RF-116`, que é o que elas são:
exigidas por RF-106 e exibidas por RF-116.

RF-107: **a proteção não checa nada além de tipo e não vazio.** `campo_relacionado` apontando
para premissa que não existe em playbook nenhum passa limpo, medido em runtime. A fixture testa
o que existe, que é a recusa do vazio, e há teste afirmando o limite, para a lacuna não sumir de
vista. Fechar de verdade exige checagem cruzada contra `premissas_do_usuario` do playbook, no
mesmo formato da que já existe para RF-109 entre nota e playbook, e isso é decisão de escopo, não
conserto de mensagem.

RF-108: dispara nos três casos, `divergencia: true` sem `visoes`, com uma visão só, e `visoes`
sem `divergencia`, que é a condição invertida. O que a faz não disparar está acima.

RF-111: dispara em `descricao` e em `mecanismo`, que são os dois campos que o filtro inspeciona.
**Não dispara em `tipo`**, medido: um evento com `tipo: "processo com chance de reversao"` passa,
porque `tipo` usa o helper padrão, que filtra vocabulário valorativo e não probabilidade. Há
teste afirmando esse limite.

**Duas outras proteções sem exercício, achadas na varredura e não fechadas aqui.** RF-103, input
obrigatório sem `onde_encontrar`, e RF-507, regra dura sem `mensagem`. As duas disparam, medido
em runtime, e nenhuma tem fixture. Ficam registradas em vez de corrigidas porque esta etapa tinha
escopo de quatro, e emendar escopo no meio é como as quatro viraram lacuna. A varredura que as
achou compara requisito citado no schema com requisito afirmado em teste, e vale repetir a cada
etapa que mexer no schema.

**Detalhe de mensagem que a varredura expôs.** O `onde_encontrar` do input obrigatório é exigido
por RF-103 e a mensagem cita RF-302, que é onde o texto aparece na tela. Mesmo caso das quatro de
RF-106, e não corrigido aqui pelo mesmo motivo de escopo.

---

## Sessão de 28/08/2026

### D-074. A varredura vira procedimento, e a categoria de proteção sem exercício fecha

**Decisão.** A varredura de proteção sem exercício passa a ser passo obrigatório da inspeção
em toda etapa que mexer em validação, registrada na skill `.claude/skills/inspecao-conformidade/`
com os comandos, e citada na seção 3 do `PROTOCOLO-ETAPA.md` junto da prova de execução.

**O que ela faz.** Compara o conjunto de requisitos citados no schema com o conjunto afirmado
em teste. A diferença é a lista de proteções que existem no código e nunca reprovaram nada.
Dois comandos.

**Por que virou procedimento.** Até esta rodada a D-038, proteção que ninguém tenta furar não
foi testada, dependia de alguém lembrar dela durante a inspeção: era princípio, não
procedimento. A varredura achou quatro lacunas numa rodada e mais duas na seguinte, o que
nenhuma leitura atenta tinha achado em duas etapas.

**Ressalva que precisa sobreviver a qualquer refatoração do texto: não é gate automático.** A
saída exige triagem manual, uma linha por vez, com a pergunta "este ID é regra de verdade ou
rótulo de âncora num campo de texto?", respondida em runtime. Na rodada em que ela nasceu, oito
IDs apareceram e **seis eram rótulo de âncora**. Automatizar como gate faria a etapa reprovar
por rótulo, a varredura viraria ruído e seria desligada, que é como proteção morre.

**A varredura pegou o próprio autor nesta rodada.** Criei as fixtures de RF-103 e RF-507, rodei
as duas provas em cada uma, e esqueci de escrever os testes. A suíte ficou verde e a varredura
final continuou listando os dois IDs. Sem ela, a etapa fecharia com duas fixtures que nada
afirma.

**Padrão de citação de requisito em mensagem de erro.** Campo exigido por um requisito e exibido
por outro cita os dois. A tentação é citar só o de exibição, porque o filtro de texto é o que
está na frente na hora de escrever, e num projeto onde o teste afirma o requisito isso quebra o
teste antes de ele existir. Os dois casos reais foram RF-106 citando só RF-116 e RF-103 citando
só RF-302, os dois corrigidos. A varredura das 57 âncoras não achou um terceiro. Virou caso de
fronteira na seção 3 do `CLAUDE.md`.

**Checagem cruzada de RF-107, e o que ela passou a validar.** `campo_relacionado` deixou de ser
checado só por tipo e não vazio. Agora se verifica que ele aponta para uma premissa que existe,
porque o requisito diz que o alerta aparece junto ao campo, e vínculo com campo inexistente não
tem onde aparecer. Vale para heurística e para evento: só RF-107 declara a semântica e ele fala
de heurística, mas o campo existe nos dois e o modo de falha é idêntico. Heurística embutida em
playbook é conferida contra as premissas daquele playbook; item em arquivo próprio não declara a
que playbook pertence, então sobra a checagem fraca contra a união das premissas de todos, que é
a mesma gradação da checagem de RF-109. Valor vazio é ignorado pela checagem cruzada de
propósito, porque o schema já o recusa e reportar duas vezes faria a fixture deixar de apontar
uma regra só.

**O teste de limite não falhou, e isso é informação.** O teste que afirmava "apontar para
premissa inexistente passa" continuou verde depois da checagem entrar, porque ele afirma o
**schema**, e a checagem cruzada é outra camada. Foi reescrito para afirmar as duas coisas:
que o schema sozinho deixa passar, e que a checagem recusa. Teste de limite precisa dizer em
qual camada o limite está, senão ele não cai quando o limite cai.

**O que a varredura final mostra, e é a evidência de fechamento.** Sobram cinco IDs citados no
schema e não afirmados em teste, todos triados: RF-117, RF-416 e RF-902 aparecem só em
comentário; RF-419 é âncora de um campo opcional, cuja única regra é não ser vazio se presente;
RF-116 é âncora de dois campos, e um deles, `fonte` de evento, é obrigatório. **Este último é
lacuna pequena e real**, do mesmo formato da fixture de RF-106, e fica registrado em vez de
corrigido, porque o escopo desta tarefa eram três e emendar escopo no meio foi como as quatro
anteriores viraram lacuna. Fora ele, a categoria está fechada.

### D-075. Formato de saída da engine, pensado para virar snapshot sem conhecer o snapshot

**Decisão.** O resultado da engine é um objeto onde toda grandeza financeira é texto decimal,
cada etapa do cálculo tem nome próprio, e cada item de lista carrega o identificador que o
distingue. `number` aparece só em contagem de período e em componente de data.

**Motivo.** RF-501 proíbe a engine conhecer o snapshot, e RF-504 exige resultado desagregado
por etapa. O snapshot é passo próprio e vem depois. Se o formato não servir para gravação, é o
passo do snapshot que descobre, e aí as engines são refeitas. Então a saída foi modelada para
sobreviver a serialização e a leitura anos depois, sem a engine saber nada sobre gravação.

**O que isso significa em concreto.** Round trip por JSON devolve estrutura idêntica, com
teste. Nenhum `number` fora das contagens declaradas, com teste que varre a saída inteira.
Cada concessão se acha por `nome` e cada período por `periodo`, então embaralhar a ordem dos
arrays não perde informação, com teste. E a perpetuidade sai como `'0'` explícito, para R-001
ficar auditável no snapshot em vez de auditável por ausência.

**Descartado, devolver `Money` e `Rate` na saída.** Seria mais bonito no tipo e impossível de
serializar sem a engine saber como. `Money` tem campo privado e `toString` que levanta erro de
propósito, então JSON.stringify dele depende do `toJSON`, e amarrar o formato do snapshot ao
formato interno de um tipo do `shared` é acoplamento que ninguém pediu.

**Descartado, desagregar por índice de array.** Etapa identificada por posição quebra em
silêncio quando alguém insere um passo no meio, e o snapshot é lido anos depois por quem não
viu o código.

**Descartado, versionar o formato do snapshot aqui.** É decisão do passo do snapshot. A engine
declara `versao_engine`, que RF-505 exige, e não declara versão de formato.

### D-076. Fixture de engine é sintética, e dado real fica para o caso de referência

**Decisão.** Fixture de engine não contém dado de companhia real, nem número observado, nem
procedência de documento. Números são inventados e redondos, e o arquivo se declara sintético
no topo.

**Motivo.** Dado real com procedência é caso de referência da Fase 8, que a D-016 governa e que
exige premissas declaradas do autor original. Fixture com dado real seria indistinguível de nota
de ativo, num projeto que acabou de expurgar conteúdo não autorado por não ter procedência
(D-067, RNF-013). E número redondo tem uma vantagem que o número real não tem: o valor esperado
de cada etapa é conferível na mão por quem lê o teste.

**Sintético não é trivial.** A carteira principal tem a forma da estrutura real: três concessões
com vencimentos escalonados, uma com redução contratual e uma com participação parcial. Isso
exercita a estrutura sem afirmar fato sobre empresa.

### D-077. Stryker cobre os três pacotes, e a regra é classificação e não limiar

**Decisão.** O alvo do `stryker.config.json` passa a incluir `packages/conhecimento` e
`packages/dominio`, além de `packages/shared`. Arquivos de teste e de fixture ficam de fora da
mutação. Nenhum limiar numérico é configurado.

**Motivo do alcance.** O schema inteiro e as dezenove fixtures nunca tinham passado por mutação,
que é lacuna do mesmo tipo que a varredura de requisitos acabou de fechar: proteção que ninguém
tentou furar.

**Motivo de não ter limiar.** O valor do mutation testing neste projeto veio inteiramente da
classificação e não do número. O falso sobrevivente do `toExpNeg` no Passo 1 só apareceu porque
alguém desconfiou do relatório, e um limiar de 90 estaria satisfeito com ele lá. A regra é
classificar cada sobrevivente em equivalente, inalcançável, falso sobrevivente ou lacuna real.
Lacuna real vira teste, os outros três viram registro com motivo.

**Custo medido.** 58 segundos para os três pacotes, contra 9 do alcance anterior. Fica como
está: acelerar mexendo em `coverageAnalysis` foi justamente o que produziu falso sobrevivente
no Passo 1.

**Efeito da primeira rodada.** Seis lacunas reais na engine viraram teste, e o score de
`packages/dominio` foi de 62,33% para 64,57%. O ganho pequeno no número esconde o que importa:
duas das seis eram erro de comportamento que nenhum teste pegaria, o período da indenização
usando a última concessão em vez da mais longa, e a redução contratual quebrando quando o campo
é omitido em vez de nulo.

### D-078. `reducao_contratual.fator` vira `percentual_reducao`, e o erro que sobra é o detectável

**Decisão.** O subcampo `fator` de `reducao_contratual`, na engine `fcff_por_concessao` e no
playbook `transmissao-energia-b3`, passa a se chamar `percentual_reducao`, e carrega o que se
CORTA. A engine multiplica a RAP por `1 - percentual_reducao`, e recusa valor fora da faixa de
0 a 1. O campo correspondente da saída passa a `fator_remanescente_aplicado`.

**Motivo, e é escolha entre dois erros e não entre dois nomes.** `fator: "0.5"` não dizia se
0,5 era o que sobra ou o que se corta, e o comentário do playbook dizia `-50%`, com sinal
negativo, sugerindo o contrário do que o código fazia. Os dois nomes candidatos matam a
ambiguidade de direção. O que os separa é o erro que sobra depois:

| Nome | Erro residual | Detectável |
|---|---|---|
| `fator_remanescente` | escrever o corte onde se pede o remanescente | não. `0.5` é válido nas duas leituras |
| `percentual_reducao` | escrever `50` em vez de `0.5` | sim, faixa de 0 a 1 no código, com mensagem |

É a D-062 aplicada de novo: entre um erro invisível e um erro visível, o desenho escolhe o
visível. A faixa não é conveniência, é o que sustenta a escolha do nome, e por isso entrou
junto e não depois.

**Motivo secundário, transcrição sem inversão.** O contrato diz "redução de 50%". Com
`percentual_reducao` o valor do campo é o valor do documento. Com `fator_remanescente` alguém
calcula `1 - 0.5` entre a fonte e o dado, e essa conta não aparece em lugar nenhum. Num projeto
onde RF-304 exige `trecho_original`, campo cujo valor não bate com o próprio trecho é
procedência que não confere. Soma-se a isso `percentual_participacao`, que já é fração no mesmo
bloco `concessoes`: duas convenções de escala lado a lado seria pior que uma.

**Por que a saída tem nome diferente da entrada.** A entrada fala a língua do contrato, que é
percentual cortado. A saída fala a língua da aritmética, e o número que importa lá é o que
multiplica a linha, para `rap_apos_reducao = rap_liquida_reajustada × fator_remanescente_aplicado`
ser conferível com uma calculadora por quem lê o snapshot anos depois, sem o código na frente
(D-075). Manter `fator_reducao_contratual` na saída deixaria na tela do auditor exatamente a
ambiguidade que se removeu do campo do curador.

**Descartado, gravar os dois números na saída.** Redundância que diverge na primeira vez que
alguém mexer num dos dois.

**Achado no caminho, e é o mais importante desta decisão.** A fixture usava `0.5`, que é o
próprio complemento: `1 - 0.5 = 0.5`. Ou seja, o teste da redução contratual ficava verde nas
duas convenções e nunca exercitou a direção. A fixture passou a `0.3`, com remanescente `0.7`,
e agora inverter a convenção quebra o teste. É a categoria da D-073 outra vez, proteção que
ninguém tentou furar, achada dentro do próprio commit que arruma o nome.

**O que esta decisão NÃO resolve, e precisa continuar visível.** A B8 segue em aberto. O nome
fecha a direção do número; continua sem resposta se a redução incide sobre a RAP original ou
sobre a já reajustada, que hoje é a reajustada, e se existe mais de um degrau, que hoje a
estrutura não comporta. As duas perguntas estão no arquivo de premissas e esperam o contrato.

**Versões.** `VERSAO_ENGINE` de `fcff_por_concessao` vai a 0.2.0, porque o contrato de entrada
e o de saída mudaram (RF-505). O playbook `transmissao-energia-b3` vai a 0.6.0. O documento de
requisitos vai a 2.4.1, com o nome do arquivo mantido em `v2.4`, porque o nome acompanha a
linha minor e esta é correção de campo dentro da seção 9, não alteração de escopo. Tudo no
mesmo commit por causa do teste de equivalência da D-065.

**Registrado e não feito.** `percentual_participacao` e `deducoes_sobre_rap` também são frações
sem checagem de faixa, e o mesmo erro de escala cabe nos dois. Fica fora daqui de propósito:
emendar escopo no meio foi como as quatro lacunas da D-073 nasceram.

## Sessão de 30/08/2026

### D-079. Valor de fixture não pode ser invariante sob a ambiguidade que ele exercita

**Decisão.** Duas regras de método, irmãs, entram no repositório. A primeira, na seção 2 do
`PROTOCOLO-ETAPA.md`: correção que invalida expectativa de teste refaz fixture e teste no mesmo
commit, porque corrigir código e deixar teste antigo verde é pior que não corrigir, já que o
verde passa a afirmar o comportamento errado. A segunda, na skill de inspeção: se duas
interpretações plausíveis de um campo produzem o mesmo resultado com o valor escolhido para a
fixture, o valor não testa nada, e o teste de decisão é perguntar se existe outra leitura
plausível e exigir que o valor produza resultado diferente nas duas.

**Motivo, e é a mesma causa nas três vezes.** A fixture foi escrita pela cabeça que escreveu o
código e herdou o ponto cego dela. O teste veio da mesma cabeça, então ficou verde. Não é
descuido de execução, é limite estrutural de quem escreve os dois lados.

**Os três casos, todos deste repositório.** `fator: "0.5"` na redução contratual, onde
`1 - 0,5 = 0,5` fazia o valor ser o próprio complemento e o teste ficar verde nas duas
convenções (D-078). `maiorPeriodo` com todas as concessões em ordem crescente, onde devolver o
último dá o mesmo que devolver o maior. E `reducao_contratual` sempre com `null` explícito,
deixando o caminho do campo omitido sem exercício. Os dois últimos foram achados pelo Stryker
(D-077).

**Por que a varredura de proteção sem exercício não pega esta classe, e por isso ela é regra
nova e não emenda da D-074.** A varredura compara requisito citado no schema com requisito
afirmado em teste. Nos três casos o requisito ESTÁ afirmado em teste, então o ID aparece dos
dois lados e some da saída. O que falha não é a existência do teste, é o poder discriminatório
dele. Uma mede cobertura de requisito, a outra mede se o teste separa duas hipóteses.

**O que o Stryker cobre e o que não cobre.** Ele achou dois dos três, e é a ferramenta certa
para a classe, porque troca o comportamento e pergunta se alguém reclama. Não achou o `0.5`:
inverter uma convenção de leitura não é mutação de operador, é outro significado do mesmo
número, e nenhum mutante o produz. Esse apareceu porque alguém foi conferir a direção à mão.
Stryker reduz a classe e não a fecha, e a pergunta do teste de decisão continua manual.

**Descartado, virar gate automático.** Não existe jeito mecânico de enumerar "as leituras
plausíveis de um campo", que é justamente o julgamento que a regra pede. É a mesma razão pela
qual a D-074 deixou a varredura como procedimento com triagem manual, e não como gate.

### D-080. Material de pesquisa entra versionado, e o arquivo antigo sai sem histórico

**Decisão.** A consolidação das quatro pesquisas entra em `docs/pesquisa/consolidacao-valuation-b3.md`,
com cabeçalho de ressalva no topo. O arquivo anterior, `pesquisa-metodologia/pesquisa_valuation_setores.md`,
de 93 linhas, foi removido pelo curador, e a pasta vazia sai junto. **Regra que decorre:
material de pesquisa entra versionado desde o primeiro dia.**

**O que este registro NÃO afirma.** O arquivo removido nunca esteve versionado, então o
repositório **não tem como provar o que ele dizia**, e esta decisão não afirma o conteúdo dele.
Não há histórico e não há recuperação.

**O que tem lastro.** Uma observação feita e citada literalmente enquanto o arquivo existia, na
sessão de 30/08/2026: ele afirmava que "a participação societária da holding (ex: proporção de
25%) incide economicamente sobre a RAP (e o fluxo de caixa) na proporção da sua fatia na SPE".
Isso é o oposto do veredito da seção 5 da consolidação nova, que é classe A e diz que
formalmente a participação não incide sobre a RAP.

**Por que a remoção é correta.** Dois documentos de pesquisa no repositório com vereditos opostos
sobre o mesmo ponto, um deles sem atribuição de fonte e sem classificação, é a doença do handoff
de planejamento em outra forma: dois arquivos com aparência equivalente de autoridade, e quem
chega depois escolhe o errado. A D-048 resolveu aquele caso com cabeçalho de ressalva porque o
handoff tinha valor histórico próprio. Aqui não tem: o arquivo era rodada anterior da mesma
pergunta, superada por uma consolidação que classifica fonte.

**O custo aceito, e é ele que gera a regra.** Remoção sem histórico é perda definitiva. Se o
arquivo estivesse versionado, ele seria **superado** por commit, com o diff mostrando o que
mudou de entendimento, em vez de **apagado**. Documento não versionado não pode ser superado, só
apagado. Por isso material de pesquisa entra versionado desde o primeiro dia, mesmo bruto, mesmo
provisório, mesmo sabendo que vai ser descartado.

**Nota de método, e ela não é sobre este arquivo.** A tarefa anterior descreveu o conteúdo de um
arquivo que não estava no disco, e a etapa parou. Três regras saíram disso, e valem daqui em
diante: item zero de tarefa que dependa de arquivo é **verificação e não instrução**, com parada
se o conteúdo não bater; prompt que descreve conteúdo de arquivo diz **de onde a descrição veio**;
e arquivo que aparece em upload de conversa **não está no disco por padrão**.

### D-081. Período vira conceito de primeira classe, com as três grades temporais separadas

**Decisão.** Nasce `packages/dominio/src/grades.ts`, com `CicloTarifario`, `CompetenciaMensal` e
`ExercicioSocial` como tipos distintos, discriminados pelo campo `grade`. A projeção de
`fcff_por_concessao` passa a correr na grade do **ciclo tarifário**, de 1º de julho a 30 de
junho. `somarAnos` e `periodosAnuaisInteiros` saem de `datas.ts`. `horizonte_maximo_anos` vira
`horizonte_maximo_ciclos`, e o resultado passa a declarar `grade_de_projecao`,
`primeiro_ciclo_projetado`, `trecho_inicial_nao_projetado` e `trecho_final_nao_projetado`.
`VERSAO_ENGINE` vai a 0.3.0 (RF-505).

**Motivo.** A seção 2 da consolidação é classe A: o ciclo tarifário não é o ano civil. A engine
projetava ano civil ancorado na `data_base` e chamava aquilo de período da RAP, o que é a
premissa B3 e ela era falsa.

**Por que não bastou trocar o parâmetro, que era a saída barata.** Existem **três** grades no
mesmo módulo e elas não são conversíveis por constante: ciclo tarifário, base da RAP homologada;
competência mensal, porque a RAP é faturada em duodécimos e confundir anual com mensal é erro de
12x; e exercício social civil, base de imposto e de demonstração contábil. Com um parâmetro só,
a grade fica implícita, e grade implícita é o que deixou a B3 passar despercebida por uma etapa
inteira. O campo `grade` existe para o compilador recusar a troca, e há teste com
`@ts-expect-error` provando que ele recusa.

**Dois relógios, e só um é modelado.** Reajuste anual, que cai na virada do ciclo em 1º de julho,
está implementado. Revisão tarifária periódica, a cada quatro ou cinco anos conforme contrato,
**não está**, e `grades.ts` declara a ausência em vez de deixá-la implícita. Um parâmetro só para
os dois é o bug de modelagem que a consolidação aponta.

**Descartado, ratear o ciclo parcial por duodécimos.** Seria a saída elegante para a data base
que não cai na virada. Exigiria a convenção de harmonização temporal que a consolidação
classifica como plausível e **sem fonte** (seção 7), e escrever convenção sem fonte é RNF-013.
Em vez disso, o trecho não projetado sai declarado no resultado, e virou a premissa N1.

**Descartado, ancorar a projeção no ciclo que contém a data base.** Traria caixa já passado para
dentro de uma projeção que olha para frente.

**Descartado, descontar por tempo decorrido de verdade.** Exige convenção de contagem de dias,
que também não tem fonte. O desconto continua usando a posição do ciclo, e a defasagem virou a
premissa N3.

**O que NÃO encostou na B1, e por isso a etapa não parou.** A grade mensal existe como tipo e
nenhuma aritmética de dinheiro passa por ela. Nada na engine consome valor mensal, porque
imposto e OPEX dependem da B1, que segue aberta. Se algum dia a engine somar ou subtrair em base
mensal, aí a B1 entra antes.

**Efeito colateral que fecha uma premissa de graça.** A R3, sobre 29 de fevereiro em `somarAnos`,
dissolveu: todo limite de período agora é 1º de julho ou 30 de junho, datas fixas.

### D-082. `percentual_participacao` é reclassificada de aritmética para convenção declarada

**Decisão.** A premissa B7 deixa de ser assunção sobre aritmética e passa a **CONVENÇÃO DECLARADA
QUE CONTRARIA A REGRA FORMAL**, citando CPC 18/R2. **O código não muda.**

**Motivo.** A seção 5 da consolidação é classe A para a regra contábil e diz que formalmente a
participação **não incide sobre a RAP**: a RAP é receita integral da SPE, a participação da
holding incide sobre patrimônio e resultado da SPE por equivalência patrimonial quando não há
consolidação integral, e o caixa que chega à investidora é o dividendo efetivamente pago, sujeito
a covenants e índices de cobertura dos contratos de financiamento da própria SPE.

**Por que não mudar o código.** A própria consolidação registra que ponderar a RAP pelo percentual
é defensável **como convenção declarada**, e a alternativa exigiria modelar dívida da SPE,
covenants e política de distribuição, que não têm campo no playbook. Trocar uma convenção
declarada por uma modelagem que o playbook não sustenta seria inventar estrutura.

**A consequência, registrada em vez de escondida.** `%` × RAP e `%` × dividendo distribuível não
são a mesma grandeza e podem divergir muito. Uma holding com participação minoritária em SPEs
alavancadas pode ter `%` × RAP muito acima do que recebe de fato.

**Interação com a D-078, e a ordem entre os dois problemas.** A D-078 registrou que
`percentual_participacao` não tem checagem de faixa, na mesma família do erro de escala que ela
fechou. **O problema desta decisão é anterior.** Faixa garante que o número está entre 0 e 1; não
garante que ele mede a coisa certa. Faixa correta em campo que mede a grandeza errada valida um
número que responde à pergunta errada, e ainda dá a sensação de que o campo foi endurecido.

**Consequência para quando houver interface.** Este número precisa chegar ao usuário identificado
como convenção e não como regra. Enquanto não há interface, o registro vive no arquivo de
premissas.

### D-083. Premissa tem quatro estados, e o estado CONFERIDA nasce vazio

**Decisão.** O arquivo de premissas passa a registrar estado por premissa, em quatro valores:
**CONFERIDA**, alguém abriu o documento primário e leu; **CITADA E NÃO ABERTA**, existe
identificação suficiente para abrir e ninguém abriu; **CONVENÇÃO**, convergência de prática sem
norma que a defina; e **ABERTA**, sem resposta. O arquivo declara em texto que **nenhuma das
dezesseis está em CONFERIDA**.

**Motivo, e são quatro e não três de propósito.** A consolidação define a própria classe A como
"existe fonte primária citada com identificação suficiente para você abrir", e diz explicitamente
que isso não significa que alguém abriu. Sem um estado separado para leitura de fato, "classe A"
e "conferido" viram sinônimos, e a regra deste projeto é que explicação inferida sem verificação
não entra em documento como fato. Fonte citada e fonte lida são coisas diferentes.

**Por que declarar o vazio em texto, e não só deixar a coluna sem marca.** Ausência silenciosa
apodrece, que é o argumento da D-021 e da D-059. Um leitor daqui a três meses que veja dez
premissas classe A e nenhuma marca de conferência conclui que a conferência é implícita. A frase
"nenhuma das dezesseis está em CONFERIDA" não deixa essa leitura de pé.

**Descartado, três estados com CONFERIDA e CITADA juntos.** Era a proposta natural e é
exatamente o colapso que a decisão existe para impedir.

### D-084. A engine passa a ler `indice_reajuste`, e a inflação vira um valor por índice

**Decisão.** A premissa `inflacao_projetada_longo_prazo` de Transmissão vira
`inflacao_projetada_por_indice`, um mapa de índice para valor. A engine reajusta cada concessão
pelo índice declarado nela. O conjunto de chaves do mapa tem que ser **exatamente** o conjunto de
índices presentes nas concessões: chave faltando bloqueia o cálculo (RF-401), chave sobrando é
recusada. O campo `indice_reajuste` **não sai** do playbook. `VERSAO_ENGINE` vai a 0.4.0,
`transmissao-energia-b3` a 0.7.0, e o documento de requisitos a 2.4.2.

**O defeito, e ele não era premissa em aberto.** `indice_reajuste` era declarado por concessão,
validado como enum e **nunca lido no cálculo**. A projeção aplicava um `inflacao_projetada_longo_prazo`
único para a carteira inteira. Uma carteira com concessões em IGP-M e em IPCA era projetada como
se todas seguissem o mesmo índice. Campo declarado e ignorado é pior que campo ausente: quem
preenche acha que informou algo que muda o resultado, e não muda.

**Por quanto tempo esteve assim, determinado pelo git.** O campo entrou no playbook em
`207b20c`, de 26/08/2026, no Passo 2. A engine passou a declará-lo sem ler em `2de5a85`, de
28/08/2026, o primeiro bloco do Passo 3. Ficou declarado e não lido por dois dias de trabalho,
atravessando duas etapas fechadas com inspeção adversarial. Nenhuma das duas pegou, e o que
pegou foi a conferência de uma instrução da consolidação contra o código, na sessão de
30/08/2026.

**Saída escolhida, o mapa.** O conjunto de campos que o usuário vê é **derivado de um fato**, o
índice de cada concessão. Todo campo exibido afeta o resultado, e valor para índice que ninguém
usa é erro em vez de campo inerte.

**Descartado, uma premissa por índice suportado com obrigatoriedade condicional.** Duas razões.
Primeira, e é a que decide: uma carteira só de IPCA passaria a exibir uma premissa de IGP-M que
não muda o resultado, o que é **a mesma doença que esta decisão cura**, em forma mais fraca.
Segunda, obrigatoriedade condicional exige vocabulário novo no schema de playbook, onde
`obrigatorio` é booleano hoje, e é máquina nova em `conhecimento` para um caso só.

**Descartado, a engine recusar carteira com índices misturados.** Trocaria número errado por
recusa de funcionalidade que a estrutura prevê: o playbook declara `indice_reajuste` como enum de
dois valores por concessão justamente porque carteira mista é o caso normal.

**Descartado, inflação por concessão em vez de por índice.** IPCA é IPCA. Permitir valores
diferentes para o mesmo índice em concessões diferentes seria incoerente e multiplicaria campos.

**O que a proteção do schema de conhecimento ensinou no meio do caminho.** A primeira tentativa
acrescentou `tipo: mapa` e `chaves:` à premissa no playbook, e o CLI reprovou: a lista de chaves
de premissa é fechada por RF-112, RP-006 e D-006, porque chave a mais é onde um valor de premissa
entraria com nome novo. A proteção estava certa e o schema **não foi afrouxado**. A estrutura foi
expressa com `subcampos`, que já existe e já é usado por `termos_de_renovacao`, listando os
índices possíveis. Nenhum valor, só nomes de chave.

**O que continua aberto.** Qual valor de inflação cada índice recebe é pesquisa, e é a premissa
B4. Esta decisão não a responde: nenhum índice ganha default, nenhum ganha valor sugerido, e a
engine não deriva o valor de um índice a partir do outro (RP-003, RP-006). O mapa nasce vazio e o
cálculo bloqueia.

**Rastreabilidade no resultado.** Cada concessão passa a sair com `indice_reajuste` e
`inflacao_aplicada`, porque duas concessões com números diferentes precisam dizer por quê
(RF-504, RP-005).

**Achado da inspeção, corrigido dentro da etapa.** `termos_de_renovacao` é o outro campo do
playbook que a engine não consome, e a premissa R5 afirmava que `strictObject` o recusa. Nenhum
teste afirmava isso. É a mesma família invertida: o `indice_reajuste` era aceito e ignorado, a
recusa de `termos_de_renovacao` era alegada e não exercitada. Provado em runtime nesta sessão,
`unrecognized_keys`, e agora tem teste.

## Sessão de 31/08/2026

### D-085. A primeira conferência documental entra, e os `onde_encontrar` passam a apontar a DCR

**Decisão.** O relatório da conferência da TAESA entra em
`docs/pesquisa/CONFERENCIA-taesa-2026-08.md`, com cabeçalho de ressalva. Os `onde_encontrar` de
`concessoes` e de `deducoes_sobre_rap`, no playbook de Transmissão, passam a apontar as
**Demonstrações Contábeis Regulatórias**. `transmissao-energia-b3` vai a 0.8.0 e o documento de
requisitos a 2.4.3. **Nenhuma estrutura de input muda**, e nenhum schema é tocado.

**Por que a DCR e não o release.** O `onde_encontrar` mandava procurar no release de resultados,
e o release não tem a estrutura que o input `concessoes` pede. A DCR tem: a tabela "Linhas de
Transmissão em Operação, Características Financeiras" traz por concessão o nome, a Propriedade
que corresponde a `percentual_participacao`, a RAP, o Ano de degrau da RAP com mês e ano, o Mês
Base Reajuste e o Índice de Correção. O input exige juntar **duas** tabelas do mesmo documento,
porque `data_vencimento` e a data de início de operação comercial estão na de características
físicas.

**A fonte não é peculiaridade da companhia.** A DCR foi instituída pela Resolução Normativa ANEEL
nº 396/2010, é de adoção obrigatória por concessionárias e permissionárias de transmissão e
distribuição, integra a Prestação Anual de Contas e vai para o site da concessionária até 30 de
abril do ano subsequente.

**A ressalva que entrou junto, e ela é parte da decisão.** O mesmo documento tem uma tabela de
projeção de RAP que a conferência **não conseguiu ler**, por desalinhamento de colunas na
extração. Indicar fonte sem indicar o que nela não foi lido vende confiança que não existe, e a
ressalva está no próprio `onde_encontrar`, não só aqui. A tabela que o input usa não é essa.

**O que este registro NÃO autoriza.** Alcance de uma companhia e um trimestre. O que a conferência
confirma vale para a TAESA e é indício forte para o setor, não prova setorial. Dois pontos
chegaram ao estado CONFERIDA da D-083, a escala da RAP e o mês base de reajuste, e o segundo vem
com a marca explícita de não generalizar.

**Efeito colateral de método, e ele importa mais que os campos.** A conferência achou nove coisas
que nenhuma das quatro pesquisas tinha visto, entre elas ISS, ICMS, CDE, PROINFA, o teto da
Parcela Variável e o cronograma de faixas da SIT. Abrir um documento de uma companhia rendeu mais
que quatro agentes pesquisando o setor. Isso não desqualifica a pesquisa, que serviu para saber o
que procurar, mas fixa a ordem: pesquisa orienta, documento decide.

### D-086. `concessoes` vira lista de parcelas de RAP, aceita e não implementada

**Decisão.** `concessoes` passa a ser lista de **parcelas de RAP**, cada uma com data de entrada,
perfil temporal próprio e vencimento próprio. **Aceita e NÃO implementada nesta etapa.**

**Motivo, e são dois achados que são o mesmo problema.** A concessão SIT tem cronograma de
**faixas** e não degrau: 72,24% do 1º ao 5º ano, 100% do 6º ao 15º, 53,61% do 16º ao 30º, com a
primeira faixa **abaixo** de 100% (N22). E o degrau é propriedade do **ativo**, não da concessão:
reforços posteriores a 2008 em linhas antigas não têm decréscimo no 16º ano, então uma concessão
antiga com reforço tem duas parcelas com comportamentos diferentes (N23). `percentual_reducao`
com um ano de corte não expressa nenhum dos dois.

**Como a estrutura resolve os dois de uma vez.** A SIT vira uma parcela com três faixas. O reforço
pós-2008 vira uma parcela com faixa única de 100%. O degrau clássico vira uma parcela com duas
faixas, 100% e 50%. O caso de hoje passa a ser o caso particular.

**Custo aceito, declarado.** A granularidade da entrada sobe e **"por concessão" deixa de ser a
unidade**. E a companhia publica na unidade concessão: a própria projeção de RAP do DCR é por
linha de transmissão, não por parcela (N31). Quem preencher parcela vai ter que **decompor à
mão**, e isso precisa estar no `onde_encontrar` quando a mudança for feita.

**Por que não agora.** Depende do PRORET, que segue aberto quanto à dupla contagem de
reinvestimento, e de decisões do curador sobre a B1. Mudar a estrutura de input antes disso é
refazer duas vezes.

**Registrado como aceito e não implementado, de propósito.** Decisão aceita que fica só no chat
desaparece, e decisão implementada antes da hora custa retrabalho. Esta fica no log com o custo
declarado, esperando o PRORET.

### D-087. Divergência entre fontes primárias de dado extraído é lacuna de requisito

**Decisão.** Registrar como **lacuna do documento de requisitos**, não como premissa de engine e
não como defeito de código. Nada é implementado.

**O caso.** Dois documentos primários da mesma companhia dizem coisas diferentes sobre o mesmo
campo. O Excel do release traz "Concessão de Categoria II com ajuste pelo IPCA"; o DCR marca as
concessões de IPCA como "Categoria III" e informa reajustes de 7,0% para Categoria II e 5,3% para
Categoria III. Como 7,03% é IGP-M e 5,32% é IPCA, o DCR é internamente consistente e o Excel não.
Um dos dois está errado, e os dois são primários.

**Por que RF-123 não cobre.** RF-123 diz que conflito entre fontes é resolvido pelo curador, com
uma prevalecendo ou as duas coexistindo com `divergencia: true`. Ele está na seção de **ingestão
de conhecimento**, e trata de heurística, nota e evento. **Dado extraído não tem equivalente.**
RF-304 exige procedência de todo dado, e RF-305 exige confirmação do usuário, mas nenhum dos dois
diz o que acontece quando duas procedências válidas se contradizem.

**Por que não resolver aqui.** Criar requisito novo é alteração da fonte de verdade, e o
`CLAUDE.md` manda parar e perguntar. Além disso a forma da solução não é óbvia: pode ser estender
`divergencia` para dado extraído, pode ser um campo de fonte preferida por playbook, pode ser
recusa com pendência para o usuário. Escolher sem o curador seria decidir arquitetura por
conveniência de fechamento de etapa.

**Proposta de texto, para quem aprovar escolher o número.** Requisito novo na seção 5.3: dado
extraído de duas fontes com procedência válida e valores conflitantes é apresentado ao usuário
com as duas procedências, sem que o sistema escolha uma, e o cálculo fica bloqueado até a escolha.
Justificativa: escolher a fonte por conta própria é a mesma família de RP-005, porque o número
exibido deixa de ser rastreável a um documento e passa a ser rastreável a uma preferência do
sistema que ninguém declarou.

### D-088. Leitura feita depois do documento volta para o documento

**Decisão.** O relatório de conferência é substituído pela versão com a seção 9, que registra a
leitura da página renderizada. A contagem da não reconciliação é corrigida para o que a tabela
nominal da seção 9.2 mostra. E fica a regra: **leitura feita depois de o documento ser escrito
volta para o documento, em commit, antes de virar insumo de qualquer tarefa.**

**O que aconteceu, na ordem.** O relatório foi commitado em `72eb2cf` dizendo que a tabela de
projeção não tinha sido conferida, por suspeita de desalinhamento na extração. O curador leu a
página renderizada depois, escreveu a seção 9 e **não commitou**. A tarefa seguinte descreveu a
seção 9 como se ela estivesse no repositório. O agente leu o arquivo commitado, não achou os
números, e recusou registrá-los.

**A recusa estava certa por dois motivos, e o segundo é o que importa.** O primeiro é óbvio: não
dava para ver o que não estava no disco. O segundo apareceu depois: **a contagem agregada que o
prompt trazia estava errada**. Ele dizia oito linhas reconciliando e seis divergindo; a tabela da
seção 9.2 tem catorze linhas, **sete batendo e sete divergindo**, contadas sobre a tabela nesta
sessão. Se o agente tivesse aceitado a descrição, o repositório teria registrado contagem
incorreta **como fato conferido**, que é a pior categoria de erro deste projeto: número errado com
carimbo de verificado.

**A regra, e por que ela é a mesma família da regra de decisão em chat.** O `DECISOES.md` abre
dizendo que decisão que só existe no chat desaparece quando a conversa fecha. Esta é a versão da
mesma doença para leitura: **documento desatualizado que convive com informação mais nova em
conversa produz duas versões da mesma conferência**, e quem escreve prompt junta as duas sem
perceber. Foi exatamente isso que aconteceu.

**Efeito colateral que também foi corrigido.** A sobrescrita do arquivo com a versão local do
curador removeu, sem intenção, o cabeçalho de ressalva escrito na etapa anterior. Ele foi
restaurado **a partir do commit `72eb2cf`**, e não reescrito de memória, com dois parágrafos
ajustados: o que dizia que a tabela não tinha sido conferida virou o registro das duas rodadas e
de qual vale, e o de documentos abertos passou a citar a leitura da página renderizada.

**O que mudou de estado por causa disso.** A N30 sai de "não foi lida" para **CONFERIDA**, com o
veredito de que as duas tabelas do mesmo documento não fecham. A suspeita de desalinhamento fica
registrada **como descartada**, porque suspeita descartada apagada do registro reaparece como
suspeita nova daqui a três meses. E a N28 passa a ter os dois casos no mesmo patamar: a segunda
metade, que estava como suspeita sem evidência, virou divergência estabelecida, o que reforça a
lacuna de requisito da D-087 sem resolvê-la.

**O `onde_encontrar` ficou falso e foi corrigido.** Ele dizia que a tabela de projeção não tinha
sido lida. A ressalva continua existindo, porque indicar a DCR como fonte sem dizer que duas
tabelas dela não fecham vende confiança que não existe. **O que mudou é o motivo**, de "não lida"
para "lida e divergente". Playbook a 0.9.0 e documento de requisitos a 2.4.4.

**Descartado, apagar a menção à suspeita de desalinhamento.** Seria mais limpo de ler e apagaria
a informação de que alguém já olhou e descartou. Registro de suspeita descartada é o que impede a
mesma suspeita de custar uma segunda rodada.

## Sessão de 04/09/2026

### D-089. Transcrição vem de legenda ou de reconhecimento de fala local, nunca de LLM

**Decisão.** Transcrição de vídeo para ingestão vem da **legenda que a plataforma publica**, ou de
**reconhecimento de fala local** quando não houver legenda em idioma útil. **Nunca de provedor de
LLM.**

**Leia a frase inteira antes de aplicar, porque a versão curta dela está errada.** "Nunca de IA"
proibiria o `--transcrever` que a própria ferramenta implementa, e alguém desligaria a
funcionalidade por conformidade. **Reconhecimento de fala local é explicitamente permitido**, e o
motivo é a distinção abaixo, não uma exceção de conveniência.

**A distinção que decide, e ela é sobre o que a ferramenta faz quando não sabe.** Um modelo de
reconhecimento de fala **mapeia áudio para texto**: ele não consulta conhecimento próprio, não
resume, e não completa lacuna com plausibilidade. O erro dele é **fonético e visível**, do mesmo
tipo que a legenda automática comete, e por isso conferível contra o áudio. Um LLM **completa**:
onde falta sinal, ele produz o texto mais provável, e o erro sai indistinguível do acerto.

**A medição que originou.** Três provedores receberam o mesmo pedido de transcrição do mesmo
vídeo. **Nenhum devolveu transcrição:** dois devolveram resumo e um recusou explicitamente, o que
foi o comportamento certo. Um deles, rodando sem acesso à fonte, produziu **quatro afirmações que
não existem no vídeo**, tiradas de conhecimento próprio e apresentadas como conteúdo da fonte.
Isso não se corrige com instrução melhor: instrução melhor não corrige ausência de acesso à fonte.

**Dependência declarada, e ela é o que sustenta a permissão.** Esta decisão **se apoia na D-090**.
Reconhecimento de fala é aceitável porque não inventa, e ele não inventa porque o filtro de
atividade de voz está ligado. **Se alguém desligar o filtro, esta decisão deixa de se sustentar**,
e a permissão ao `--transcrever` cai junto.

### D-090. Filtro de atividade de voz é obrigatório e não configurável

**Decisão.** O `vad_filter` do reconhecimento de fala fica **sempre ligado**, e o script **não o
expõe como opção**.

**Medido, não suposto.** Um arquivo com tom puro de 440 Hz, ou seja, som sem fala alguma, foi
transcrito nas duas configurações:

| Configuração | Resultado |
|---|---|
| Com detecção de atividade de voz | **zero segmentos** |
| Sem detecção de atividade de voz | uma frase curta e genérica, **inventada** |

Sem o filtro, vinheta de abertura, música de fundo e pausa longa produzem texto que ninguém
falou, dentro de um arquivo que se apresenta como transcrição.

**Por que decisão numerada e não comentário no código.** Comentário não protege, porque **quem
desliga o filtro mexe no código, e o comentário sai junto na mesma edição**. A proteção precisa
morar onde a edição não alcança.

**Ela reduz e não elimina.** O cabeçalho do arquivo gerado registra que frase curta e genérica
isolada, perto de vinheta ou de música, é suspeita.

**Candidato a teste executável, e NÃO implementado agora.** O caso do tom puro é controle
negativo no mesmo padrão que o projeto já usa: gerar o tom, transcrever nas duas configurações,
afirmar zero segmentos na primeira. Fica registrado como candidato porque a ferramenta é Python e
está fora da suíte por D-092, então o teste precisa decidir onde mora antes de existir.

### D-091. Glossário de termo de domínio: o mecanismo é ferramenta, a lista é conhecimento

**Decisão.** A normalização de termo de domínio se divide em duas metades com classificações
diferentes. **O mecanismo é ferramenta.** **A lista é conhecimento**, mora em `conhecimento/`, com
schema próprio, e passa pelo CLI de validação como os outros tipos.

**O problema.** Reconhecimento de fala e legenda automática erram exatamente o termo de domínio, e
sempre a mesma classe: sigla de indicador, nome de agência, nome de norma, nome de companhia.
Observado: WACC virou "WK", Basileia virou "basiled", Cemig virou "Semig", WEG virou "Veg", Bazin
virou "Bazinha". Sem lista de correção, a extração transcreve o erro para dentro do repositório.

**A fronteira, e ela é a da RNF-013.** Aplicar um mapa de erro fonético para termo correto é
código. Mas **o conteúdo da lista é vocabulário setorial**: decidir que "Veg" significa WEG exige
saber que WEG existe. Quem não conhece o setor não monta a lista. Então **a lista nasce vazia e é
preenchida pelo curador, uma entrada por vez**, conforme os erros aparecem, e **agente não escreve
entrada**.

**Por que em `conhecimento/` e não em `tools/`.** Ela **influencia dado extraído**, e dado extraído
alimenta cálculo. Entrada errada propaga até o número. O que influencia cálculo passa por
validação.

**A ressalva que vai junto, e é a parte mais importante desta decisão.** Correção automática de
termo é **a única operação desta ferramenta que altera o texto da fonte**; todo o resto preserva.
Então o texto normalizado **tem que marcar onde houve correção**. Sem a marca, a procedência
aponta para um timestamp cujo áudio diz outra coisa, e o RP-005 quebra num lugar onde ninguém
está olhando.

**DECIDIDO E NÃO IMPLEMENTADO, e isto contraria o relatório.** A seção 4.3 diz que o mecanismo
"nasce agora". O escopo foi revisto e **o mecanismo não nasce nesta tarefa**.

A razão que decide: **a marcação de correção faz parte da procedência, e a procedência está sendo
redefinida** na emenda proposta ao RF-304. Implementar antes é implementar contra um formato que
vai mudar. Duas razões secundárias: a lista nasce vazia, então o mecanismo entraria sem uma única
entrada exercitando; e sendo a única operação que altera a fonte, ela é a mais delicada das que a
ferramenta faz, e nasceria sem caso real para testar.

**Dois gatilhos para implementar:** a procedência definida no documento de requisitos, e a
primeira entrada real na lista.

### D-092. Python como segundo runtime, exceção justificada e não precedente

**Decisão.** `tools/baixar-legenda.py` roda em Python, com ambiente virtual próprio em
`tools/.venv-ingest`, que entra no `.gitignore`. **É exceção justificada, e ferramenta futura não
herda a permissão.**

**O que se perde, declarado.** O projeto é TypeScript sobre Bun, e `tools/validar-conhecimento.ts`
roda com bun. Esta ferramenta **nunca passa por `tsc --noEmit` nem pela suíte Vitest**. Não é
esquecimento nem pendência: é consequência direta da escolha, e precisa ser dita em toda
verificação de etapa que a envolva, para ninguém supor cobertura que não existe.

**Por que mesmo assim.** As duas ferramentas que fazem o trabalho, a de download e a de
reconhecimento de fala, **não têm equivalente em JavaScript**. Reimplementar qualquer uma das duas
seria trabalho de outra ordem de grandeza, para uma ferramenta de apoio que não entra no produto.

**O que a exceção NÃO autoriza.** Ferramenta nova em Python porque já existe um venv. A
justificativa é a ausência de equivalente, e ela se argumenta caso a caso. Segunda ferramenta
Python exige decisão nova.

**Fronteira do runtime, e ela é o que mantém a exceção contida.** O Python fica em `tools/`, não
produz artefato que entre em `packages/`, e o que ele grava vai para `ingest/`, fora do
versionamento. Nada do produto depende dele para rodar.

## Sessão de 05/09/2026

### D-093. Rebase and merge mata a branch local, e commit feito depois do PR precisa ser transplantado

**Decisão.** O `rebase and merge` continua sendo a estratégia de merge deste projeto, pelos
motivos já registrados: o `DECISOES.md` referencia commits, e squash quebraria essas referências
em bloco, enquanto merge commit registraria bifurcação num histórico que não divergiu. **O que se
acrescenta é a consequência operacional, que ninguém antecipou.**

**O que acontece depois do merge.** O rebase reescreve todos os commits do PR, com hashes novos.
A partir daí, **a branch local está morta**: ela deixa de ser ancestral da main e passa a ser uma
linha paralela com o mesmo conteúdo e identidades diferentes. Três efeitos observados no PR #1:

1. `git push` da branch **não é no-op**. Ele subiu 323 objetos e criou branch nova no remote,
   porque para o git aqueles commits não existiam lá.
2. `git log origin/main..branch` conta **todos** os commits do PR, e não zero. Quem ler essa
   contagem conclui que o merge não aconteceu. O comando que responde de verdade é
   `git cherry -v`, que compara por patch-id e mostra `-` para o que já está na main sob outro
   hash.
3. Commit feito na branch **depois** de abrir o PR não entra no merge e precisa ser transplantado
   por cherry-pick.

**A regra que sai disso.** Depois de abrir o PR, **não commitar na branch**. Se houver trabalho
novo, ele espera o merge e nasce em cima da main nova. Quem escolher commitar assim mesmo
**aceita o transplante como custo conhecido**, e o transplante tem uma conferência obrigatória
antes de qualquer limpeza: a árvore da ponta da branch tem que ser idêntica à da main depois do
cherry-pick. Sem essa conferência, um cherry-pick sobre main incompleta esconde a perda: o commit
novo entra, tudo parece certo, e o que o rebase deixou para trás some sem rastro.

**A segunda regra, sobre citação de hash.** **Citar hash em decisão só é estável para commit que
já está na main.** Commit que ainda vai passar por rebase muda de identidade, e a citação passa a
apontar para objeto que só existe numa branch que vai ser apagada. Duas citações da D-088 caíram
nesse caso, apontando para `72eb2cf`, cujo equivalente na main é `1760a55`. **Elas não são
corrigidas**, porque o `DECISOES.md` é append only, e porque as duas identificam o commit também
pelo assunto, o que as mantém legíveis. Fica esta decisão como o registro que explica por que
aquele hash não resolve.

**Uma terceira consequência, que o levantamento expôs e que não é sobre git.** A previsão de que
o rebase quebraria a citação da D-088 foi feita **antes** do merge e o merge seguiu assim mesmo,
o que foi decisão consciente. O que faltou não foi a previsão, foi **agir sobre ela**: bastaria,
antes do merge, trocar as duas citações por referência ao assunto do commit, e o problema não
existiria. A regra prática: **previsão registrada e não endereçada vira dano registrado**, e o
momento de agir sobre ela é enquanto o objeto ainda tem a identidade citada.

**Por que não se agiu, e o argumento que produziu a recusa estava errado.** A oferta de um commit
pequeno na branch, trocando as duas citações de hash por referência ao assunto, foi feita antes
do merge e **recusada**, com o argumento de que o commit do conserto também passaria pelo rebase
e portanto participaria do problema que resolve.

O argumento não se sustenta, e o motivo é o que torna a regra utilizável: o **hash** do commit de
conserto seria reescrito, sim, mas o **conteúdo** dele era remover a dependência de hash. Depois
do rebase as citações estariam por assunto, e não haveria hash morto. **O conserto funcionaria
justamente por não depender de identidade de commit.**

A generalização, e ela vale além do git: **conserto que remove uma dependência não é invalidado
por ser aplicado no mesmo meio de que a dependência depende.** Confundir as duas coisas é o que
produziu a recusa. O teste para não repetir: pergunte se o conserto **precisa** da propriedade
que vai ser destruída, ou se ele **elimina** a necessidade dela. No segundo caso, aplicar antes é
exatamente o certo.

**Descartado, mudar de estratégia de merge.** Squash resolveria o problema da branch morta,
porque não haveria o que transplantar, e criaria um pior: quebraria todas as citações de hash de
uma vez e fundiria assuntos distintos num commit só. Merge commit preservaria os hashes e
registraria bifurcação inexistente. O custo do rebase é conhecido e contornável; o das
alternativas, não.

## Sessão de 09/09/2026

### D-094. O conhecimento tem dois eixos, e o eixo da natureza tem três valores

**Decisão.** O conhecimento do projeto se classifica em **dois eixos independentes**.

**ALCANCE:** setorial ou por empresa. É a divisão que a seção 1.4 do documento de requisitos já
implementa, com playbook para o setor, nota de ativo para característica de empresa, e evento
para circunstância temporária.

**NATUREZA:** norma, aritmética, ou julgamento.

**O eixo da natureza tem três valores e não dois.** O critério da D-067 nomeia quatro origens
para o que é imutável: contrato, norma contábil, regulação vigente **e aritmética**. Aritmética
não é norma nem julgamento, e existem dois casos no repositório que provam isso. A R-103, que
exige ROE e Ke na mesma base, não sai de resolução nenhuma: comparar nominal com real é **erro de
unidade**. A R-203, que invalida projeção com preço normalizado abaixo do custo caixa, é
**contradição** e não regra: nenhum órgão precisa proibir, o modelo já não fecha.

**Motivo de registrar isto agora.** O expurgo da D-067 foi executado corretamente e a razão dele
não estava explícita: **ele cortou pelo eixo da NATUREZA, mantendo norma e aritmética e removendo
julgamento, e não pelo eixo do ALCANCE.** Sem esse registro, quem ler que conteúdo setorial saiu
conclui que a divisão é por alcance, e a conclusão é falsa.

**A evidência de que os dois eixos são independentes.** Basileia ficou e "ROE inflado por
reversão de PDD não é sustentável" saiu. As duas afirmações são **setoriais**, ou seja, têm o
mesmo alcance. O que as separa é a natureza: a primeira é norma, a segunda é julgamento de
analista. Um eixo só não explica esse par.

**Consequência.** Toda decisão sobre onde um item de conhecimento mora precisa responder as duas
perguntas, e não uma. Responder só o alcance coloca julgamento setorial dentro do playbook, que é
exatamente o que o expurgo removeu.

### D-095. Regra de consistência aritmética não é ingerível

**Decisão.** Regra de consistência aritmética é **o único tipo de conhecimento do projeto que não
pode ser proposto por nenhum caminho de ingestão**. A via de descoberta dela é escrever a engine.

**Motivo.** Os outros tipos têm fonte. Norma vem de documento normativo, fato sobre empresa vem
de documento da companhia, heurística vem de material de terceiro. **Aritmética não vem de lugar
nenhum:** ela é derivada de o modelo fazer sentido, e quem a percebe é quem está modelando e vê a
contradição aparecer.

**Evidência retroativa, e ela é forte.** A sonda do `fcff_por_concessao` produziu **dezesseis
premissas de interpretação, e nenhuma delas veio de documento**. Todas nasceram de escrever o
loop e ver o que o loop era obrigado a assumir. A R-103 e a R-203 nasceram do mesmo jeito.

**Consequência para a ordem de trabalho, e ela é uma justificativa retroativa.** Isto sustenta,
por um motivo melhor, a decisão de escrever a engine antes de pesquisar. Na hora ela foi tomada
porque pesquisa sem foco não sabe quais perguntas importam. O motivo mais forte é este: **parte do
conhecimento necessário só existe depois de a engine existir, e nenhuma quantidade de pesquisa a
produz.**

**Consequência para a D-096.** Regra aritmética não tem tipo de fonte para declarar, então ela
fica fora do roteamento **por construção, e não por lacuna**. Quem for implementar o roteamento
não precisa abrir exceção para ela: ela nunca chega lá.

### D-096. Proposta de ingestão é roteada por TIPO DE FONTE, não por conteúdo

**Decisão.** Proposta de ingestão é roteada pelo **tipo da fonte que a sustenta**, e não por
classificação automática do conteúdo. O destino candidato por tipo:

| Tipo de fonte | Destino candidato |
|---|---|
| norma, resolução ou contrato | candidato a playbook |
| documento da companhia sobre ela mesma | candidato a nota de ativo ou evento |
| material de analista, sobre onde olhar | candidato a heurística de leitura |
| material de analista, juízo de preço | **nunca entra** |

**Motivo de rotear por fonte e não por conteúdo.** Classificar conteúdo automaticamente não
funciona: o código não tem como saber que "todo banco precisa ver Basileia" é norma e não
preferência de analista. **Quem sabe isso sabe que a Res. CMN 4.958/2021 existe**, e isso é
conhecimento de domínio, não propriedade do texto.

**A proibição cruzada, e ela NÃO é simétrica.** A primeira metade é direta: **material de
analista nunca propõe entrada em playbook**, porque isso é julgamento entrando como norma.

A recíproca, na forma "norma nunca propõe entrada em heurística", **está errada e proíbe coisa
legítima**. O contraexemplo já está no repositório: a Res. CMN 4.958/2021, art. 9º §4º, sustenta
a R-102 como regra dura, e ao mesmo tempo a consolidação de pesquisa registra que **a norma define
pisos e travas enquanto o teto de payout é derivado e não normativo**. "Confira se o payout
projetado cabe na folga de capital" é heurística de leitura cuja origem é norma, e é legítima.

**A formulação que resiste:** norma nunca propõe entrada em heurística **cujo conteúdo a norma não
afirma**. A restrição é sobre o que a fonte sustenta, não sobre o tipo dela.

**Dependência declarada.** O discriminador do roteamento é o **tipo de fonte da procedência**, que
está sendo formalizado na emenda do RF-304 e no RF-309, e que **ainda é proposta não gravada**:
conferido nesta sessão, `RF-309` não existe no documento e a versão segue 2.4.4. Metade do
mecanismo foi construída sem este uso em vista: a procedência passou a declarar o tipo por causa
de vídeo e planilha, e **o tipo agora vira o discriminador do roteamento de ingestão**.

**Lacuna de requisito, registrada e não resolvida.** O RF-120 enumera o que o agente propõe:
heurísticas, notas, eventos, conflitos e lacunas. **Playbook não está na lista.** A primeira rota
desta decisão cria um destino que o documento não enumera. Não é contradição, porque o RF-120 não
diz "e nada mais", e porque o RF-121 continua exigindo revisão do curador, incremento de versão e
commit para qualquer proposta. Mas é lacuna, e ela toca o artefato mais protegido do projeto, que
é o que carrega regra dura e `modelos_habilitados`. **Fica registrada aqui em vez de virar
requisito por conta própria**, no mesmo formato da D-087.

**DECIDIDA E NÃO IMPLEMENTADA.** O gatilho é a emenda de procedência estar gravada.

### D-097. Metodologia de terceiro pode virar quatro coisas, e nunca modelo novo

**Decisão.** Método de valuation de terceiro pode virar **preset de premissas**, **heurística de
leitura**, **variante de modelo que já existe**, ou **caso de referência da Fase 8**. **Nunca
modelo novo.**

**Motivo do limite.** O `modelos_habilitados` do playbook referencia engines que existem em
código, com teste e mutation testing. Proposta que escreva método novo ali faz o playbook
**referenciar modelo que não existe**, e a checagem cruzada do CLI não pega isso hoje: ela confere
nota contra playbook, e **não playbook contra engines disponíveis**. Reforça o RF-206, que já
proíbe o agente de propor modelo fora da lista habilitada.

**A quarta saída, e ela é a mais valiosa quando existe.** Caso de referência da Fase 8 é
exatamente o que a D-016 admite, e é o **único** uso que ela admite: caso construído a partir de
cálculo público de terceiro só é válido quando **as premissas do autor são conhecidas e
declaradas**. Ela é a mais fácil de confundir com "adotar a metodologia", e a diferença é que
**caso de referência testa a engine contra número de terceiro, e adotar metodologia mudaria a
engine**.

**Constatação do caso concreto, que mostra por que a quarta saída é rara.** O material que motivou
esta decisão diz que usa lucro líquido regulatório e que ajustou a taxa de desconto **sem dizer
para quanto**, e fala de taxas de crescimento **sem declarar quais**. Dá heurística boa e **não dá
método nem caso de referência**, porque premissa não declarada não permite reproduzir o número.

### D-098. O app não exibe preço teto calculado por terceiro

**Decisão.** O app **não exibe, não compara e não ordena** preço teto calculado por terceiro. O
que existe é **campo de anotação livre**, onde o usuário digita o que quiser.

**Isto é recuo de uma posição anterior**, e o registro existe para o debate não recomeçar.

**Quatro razões, e a quarta é a que não depende de intenção nem de credenciamento.**

**Primeira.** O disclaimer do autor terceiro se apoia em credenciamento que o autor deste projeto
não tem. O mesmo texto neste app **não faz o mesmo trabalho**.

**Segunda.** O que importa não é a legalidade do ato do terceiro, é **o que este app faz**. Exibir
preço teto de terceiro ao lado do resultado do usuário é fornecer preço-alvo para ativo
específico, o que é **pior que fornecer premissa, porque é o resultado**.

**Terceira.** O número **não é reproduzível**, porque as premissas não foram declaradas, o que
contradiz a D-016.

**Quarta, e é a que fecha.** Preço teto de terceiro ao lado do resultado do usuário **cria
comparação, e comparação de dois elementos é ranking**. O RP-002 proíbe ranking proprietário e
ordenação por atratividade. Exibir dois preços lado a lado é o sistema informando que existe uma
diferença, e **a diferença é a única informação que aquele par produz**.

**O cuidado que vai na decisão, e não só no entendimento.** O campo de anotação livre **não pode
ser indexado, comparado, ordenado, nem exibido junto ao resultado na listagem**. Se a anotação
aparecer ao lado do preço teto, **a comparação voltou por outro caminho**. Usuário digita, pode;
app fornece, exibe, compara ou ordena, não pode.

**Precedente que sustenta a fronteira.** É a mesma lógica da D-033, onde o alerta de preço
configurado pelo usuário é admissível porque o gatilho é dele e o sistema só compara número com
número. E não colide com o RF-403: aquele requisito governa **preset de premissa**, que é entrada,
enquanto isto é **resultado**.

### D-099. Nenhuma decisão da v1 assume curador único de forma que impeça camada pessoal depois

**Decisão.** Esta **não** é o requisito de N curadores. É a **restrição que o precede**: nenhuma
decisão da v1 pode assumir curador único de forma que impeça uma camada pessoal de conhecimento
depois.

**Motivo.** O pipeline de ingestão foi desenhado assumindo **um** curador, com revisão e commit.
Se o produto ganhar usuário final que também ingere e aprova, passam a existir **N curadores**, a
base diverge entre eles, e **não há commit**, porque usuário de aplicação não faz commit. A forma
que resolve tem precedente: base curada versionada, mais camada pessoal que **nunca escreve na
base**, com contribuição voltando por **submissão revisada** em vez de escrita direta.

**Por que restrição e não requisito agora.** O requisito depende de uma decisão que não foi
tomada, que é **se o produto vai ter usuário final além do autor**. A v1 é local e single-user, e N
curadores só existe se houver versão hospedada. **Migrar dado de usuário que não existe é grátis**,
e hoje não existe usuário. A restrição custa nada, é verificável quando alguma decisão a violar, e
não obriga a desenhar produto que não foi decidido.

**O que o requisito exigiria, quando for a hora, registrado para não recomeçar do zero:** emenda
em RF-101 e RP-008, porque a base passa a ter duas camadas; emenda em RF-802, porque o snapshot
precisa registrar a versão da camada pessoal; e requisito novo para a contribuição por submissão
revisada.

**Por que isto não colide com RP-008 e RF-101 hoje.** A restrição não cria camada nenhuma. E na
forma prevista ela continua compatível: a camada pessoal também seria **carregada e validada no
boot** e **constante durante a sessão**, então o teste de decisão do RP-008, rodar o mesmo cálculo
amanhã sem commit no meio e obter o mesmo número, continua valendo.

**Precedente que já existe e que ajuda.** A arquitetura de duas camadas já está prevista para
**preset**, não para conhecimento: o RF-403 diz que presets podem ser salvos e reaplicados, e que
preset de terceiro é rotulado como externo, editável e nunca pré-selecionado. **Ele já resolveu a
parte difícil**, que é rótulo de origem e proibição de pré-seleção. Conhecimento pessoal segue o
mesmo desenho.

**Consequência aceita, e não problema resolvido.** A camada pessoal cria um efeito que o preset
não cria. Preset é premissa, e premissa entra no snapshot **como valor**. Conhecimento pessoal é
heurística e nota, que aparecem **como alerta acionado** e vão para o snapshot por RF-802. Então
dois usuários com camadas pessoais diferentes, mesmas premissas e mesmos fatos, **produzem
snapshots diferentes**: o número é o mesmo, o registro do que foi visto ao decidir não é.

**E o efeito mais forte.** A versão da camada pessoal é a **única entrada do snapshot que não é
reproduzível por terceiro**. Todas as outras versões são de artefato versionado em git, então quem
tem o repositório reconstrói. Camada pessoal mora na máquina do usuário, e **um snapshot que a
referencia é auditável por ele e por mais ninguém**.

Isso **tensiona o CR-006 sem quebrá-lo**: o número continua reproduzível, o contexto de decisão
não. Fica registrado como consequência declarada, e fica registrado que **o snapshot precisa dizer
isso na cara** em vez de referenciar a camada pessoal em silêncio. Não é motivo para não fazer.

## Sessão de 10/09/2026

### D-100. Prompt declara o estado do trabalho descrito, e verificação descrita não é verificação executada

**Decisão.** Duas regras, uma de cada lado da conversa. Elas **estendem a nota de método da
D-080**, que cobre de onde a descrição veio, e não a revogam: são perguntas diferentes.

**PRIMEIRA METADE, do lado de quem especifica.** Prompt que descreve trabalho já feito declara o
**estado** desse trabalho, em três valores:

| Valor | Significa |
|---|---|
| existe no disco do repositório | o agente confere e usa |
| existe fora do disco e vai ser posto lá antes da tarefa rodar | o agente confere e para se não estiver |
| **não existe**, e precisa ser implementado a partir desta especificação | o agente implementa |

**SEGUNDA METADE, do lado de quem implementa, e é a que importa mais.**

> **Verificação descrita em prompt não é verificação executada.**

Quem implementa **escreve a própria bateria**, independente do que a especificação afirme ter
sido testado, e **declara no relatório que a verificação é sua**. Sem essa declaração o leitor não
tem como distinguir bateria própria de bateria herdada, e as duas se parecem no relatório.

**Por que a D-080 não bastava.** A regra dela cobre a **origem** da descrição. Esta cobre se o que
está descrito **existe**. No caso que motivou, a origem era "quem escreveu o prompt escreveu", o
que era verdade, **e mesmo assim o trabalho não existia**. Origem correta e existência falsa.

**A assimetria, e ela é o motivo de a segunda metade ser a que segura.** A primeira depende de
quem escreve o prompt **lembrar**. A segunda **não depende de ninguém lembrar nada**, porque é
comportamento de quem executa. Regra que depende de memória de terceiro protege enquanto a
memória funciona; regra que é comportamento próprio protege sempre.

**O caso que originou, e por que a natureza dele é outra.** Um prompt descreveu mudança na
ferramenta de legenda como já desenvolvida e testada, com cinco casos de limpeza de nome e três
cenários de colisão passando. O arquivo estava **idêntico ao commit**: não havia mudança nenhuma.
O agente conferiu antes de agir, implementou do zero a partir da especificação, declarou que
**não herdava a verificação descrita**, e escreveu a própria bateria, com cinco casos e cinco
cenários.

**É a quarta ocorrência de descrição que não bate com o disco, e a única desta natureza.** As três
anteriores foram **conteúdo descrito de outra versão**: existia arquivo em algum lugar, só não o
que o agente tinha. Esta foi **trabalho descrito como entregue sem entrega**: não existia arquivo
nenhum.

**E o modo de falha é pior, que é o que justifica regra própria.** Nas três anteriores o pior caso
era registrar conteúdo errado, que é recuperável: o texto fica no repositório e alguém corrige
depois, como a D-088 corrigiu. Aqui o pior caso é **a verificação não acontecer e o relatório
dizer que aconteceu**. Isso não se corrige depois porque não deixa rastro: um relatório que herda
bateria alheia é indistinguível de um que executou a própria.

**Onde a regra operante mora.** A segunda metade entra na seção 3 do `PROTOCOLO-ETAPA.md`, ao lado
da linha que já diz que verificação não executada nesta sessão não vale como executada. É o mesmo
padrão da D-052, cuja regra virou gate no protocolo em vez de ficar só aqui: decisão explica o
porquê, protocolo diz o que fazer, e é o protocolo que alguém lê na hora de fechar etapa.

### D-101. Relatório de fechamento declara versão e caminho do documento de requisitos

**Decisão.** Sempre que uma tarefa alterar o documento de requisitos, o relatório de fechamento
diz a **versão corrente** e o **caminho exato** do arquivo depois da alteração.

**Motivo.** Quem escreve os prompts trabalha com uma cópia do documento que fica defasada, e a
divergência já produziu efeito duas vezes: emenda montada a partir de uma versão e conferida
contra outra, e levantamento mostrando que o estado real divergia do descrito. **Hoje a
divergência só é descoberta por acidente.** Com o reporte, ela vira rotina.

**O caso concreto como evidência.** Numa tarefa recente o agente conferiu que **o RF-309 não
existia e que a versão seguia 2.4.4**, quando o prompt tratava a emenda de procedência como se ela
pudesse já estar gravada. Foi **conferência do agente, não reporte de rotina**: se ele não tivesse
conferido por conta própria, a decisão que depende da emenda teria sido gravada com dependência
falsa.

**Por que o caminho e não só a versão.** Porque os dois se movem juntos e por regra diferente. A
D-078 fixou que o nome do arquivo acompanha a **linha minor**: patch mantém o nome, minor
renomeia. Então "2.5.0" e `v2.4.md` é um estado inconsistente que só aparece se as duas
informações forem ditas juntas.

**Onde a regra operante mora.** Seção 5 do `PROTOCOLO-ETAPA.md`, que é o fechamento de etapa, e
não aqui. Quem fecha etapa lê o protocolo; ninguém abre o log de decisões para descobrir o que o
relatório precisa dizer. Mesmo padrão da D-052 e da D-079.

## Sessão de 07/10/2026

### D-102. A ingestão de vídeo passa a usar a biblioteca transcript-normalizer, e `tools/baixar-legenda.py` sai

**Decisão.** `tools/baixar-legenda.py` e o ambiente `tools/.venv-ingest` saem. A ingestão de
vídeo passa a usar a biblioteca transcript-normalizer, licença MIT, mantida pelo autor deste
projeto, fixada em `v0.4.5` por `tools/ingest/pyproject.toml` e `tools/ingest/uv.lock`, com o
extra `[ingest]`. A saída continua sendo **material bruto de ingestão** em `ingest/`, fora do
versionamento (D-042), e **nunca conhecimento autorado** (RNF-013). Os arquivos que a biblioteca
grava, inclusive `normalized.txt` e `annotations.json` se alguém rodar `normalize`, têm o mesmo
estatuto do `.srt` de antes: matéria-prima, não item de conhecimento.

**Caminho A, e só ele.** A biblioteca entra **só para obter o texto bruto**, pelo subcomando
`fetch`. A ingestão não roda `normalize`, não há camada aprendida, e o `trecho_original` de
qualquer afirmação extraída de vídeo sai **sempre do `legenda.txt`**, nunca do `normalized.txt`.
A D-091 fica como está, esperando os gatilhos dela.

**O caminho B exige decisão própria que revise a D-091, dizendo isso.** O caminho B é a
normalização de termo alimentando a extração, com o pacote externo e a camada pessoal tratados
como lista de ferramenta aplicada a material bruto. Ele não se abre por uso, por conveniência ou
por esta decisão. Os gatilhos que a decisão de revisão precisa ter cumprido:

- **A procedência no documento de requisitos.** A emenda que define procedência de fonte em
  vídeo, prevista como RF-309, tem que estar gravada. Conferido hoje: o RF-309 não existe e o
  documento segue em 2.4.4.
- **A autoria do pacote de termos.** O pacote `financas-ptbr` não nasceu vazio, e parte das
  entradas foi escrita ou editada por agente, sob instrução do autor, na sessão da biblioteca. A
  D-091 exige lista preenchida pelo curador. Então o pacote só vale como lista deste projeto
  depois que o curador o **assumir após revisão entrada a entrada**. Gabarito conferido à mão não
  é a mesma coisa: ele confere o resultado da normalização, não a autoria de cada entrada.

O motivo de fundo: o `normalized.txt` não marca no próprio texto o que foi corrigido. Quem extrair
dele cita um trecho que o áudio não diz, que é exatamente o caso que a D-091 quer impedir. O
stand-off da biblioteca resolve o medo de alterar a fonte sem marca dentro dela, não fora.

**Motivo, fonte única.** O script e a biblioteca faziam a mesma coisa em dois lugares, e a
biblioteca já corrigiu coisas que o script não tem. Escolher a faixa original quando a `pt` é
tradução automática (D-045 do transcript-normalizer). Rodar o yt-dlp no mesmo processo.
Recomeçar do zero o download interrompido (D-059 de lá). Manter os dois é copiar cada correção à
mão, e a cópia esquecida é a que vira procedência errada.

**Motivo, a biblioteca é testada e o script não era.** A D-092 registrou que a ferramenta Python
nunca passa por suíte. A biblioteca tem suíte própria, rodando em três sistemas operacionais a
cada push, e um teste de regressão contra **quatro vídeos com gabarito conferido à mão**, mais um
teste de silêncio fora do domínio. O alcance declarado: os quatro vídeos são de finanças, em
pt-BR, de dois canais. A ferramenta continua fora do `tsc` e do Vitest deste repositório; a
cobertura dela mora no repositório dela.

**O que continua valendo.** D-089, sem LLM em ponto nenhum, e a biblioteca não tem nenhum. D-090,
o `vad_filter` fixo no código da biblioteca, sem opção, com teste dela afirmando o valor, e
reconferido aqui pelo controle negativo abaixo. A fronteira da D-092: o Python fica em `tools/`,
não produz artefato em `packages/`, e grava em `ingest/`. A exceção da D-092 passa a cobrir a
biblioteca no lugar do script, e **segue não abrindo precedente**.

**A pasta por vídeo é `ingest/runs/<id-do-vídeo>/`.** Desfaz o nome por título do commit
`bf68908`; o título volta pelo `transcript-normalizer list`. O autor aprovou `ingest/<id>/` na
proposta, e a implementação mediu que a biblioteca não faz isso: o `--out DIR` grava **direto em
`DIR`**, sem subpasta do id, e o `list` só lê `runs/` do diretório corrente, sem opção de outra
raiz. Com `--out ingest`, o `legenda.txt` cairia solto em `ingest/` e o vídeo seguinte
sobrescreveria. Foi levado de volta ao autor, que escolheu rodar de dentro de `ingest/` sem
`--out`. O atalho é `bun run ingest:video <url>`, que roda
`cd ingest && uv run --locked --project ../tools/ingest transcript-normalizer fetch --keep-raw <url>`.

**O que muda de comportamento, declarado.**

- A faixa `pt-orig` passa à frente da manual, e a manual à automática. O script preferia manual.
- Sem legenda na plataforma, o `fetch` **cai sozinho** no reconhecimento de fala local. O script
  exigia `--transcrever`. `--caption-only` impede a queda.
- Fala e legenda gravam o mesmo `legenda.txt`, com a origem no cabeçalho.
- A legenda bruta só fica com `--keep-raw`, que o atalho sempre passa, porque ela é parte da
  procedência.
- O `--locked` no atalho mantém a política do script, que não se atualizava sozinho para a mesma
  url não passar por versões diferentes. Subir de versão é deliberado, por
  `uv lock --upgrade-package transcript-normalizer` e commit.

**O que a ferramenta cria, declarado junto com a regra de ignore** (questão aberta do
`AGENTS.md`): `tools/ingest/.venv/`; e `runs/` e `packs/` no diretório corrente se alguém rodar
fora de `ingest/`. As três entram no `.gitignore` nesta mesma troca. Rodando pelo atalho, tudo
cai em `ingest/`, que já estava fora.

**O validador passa a reprovar o que não é item de conhecimento.** Até aqui ele ignorava em
silêncio: qualquer entrada da raiz de `conhecimento/` fora da lista branca, e qualquer arquivo
não YAML dentro das pastas de tipo. Então `conhecimento/ingest/legenda.txt`, ou um
`normalized.txt` copiado para `notas/`, passava com exit 0. Agora as duas coisas reprovam com
RF-101, apontando que material bruto fica em `ingest/` (D-042, RNF-013). A exceção é declarada,
uma só: `fixtures-invalidas`. É aumento de proteção, com teste de aprovação e de rejeição.

**Descartado.** Manter o script e portar as correções: são dois lugares para a mesma regra.
Copiar o código da biblioteca para dentro de `tools/`: é a mesma duplicação, sem a suíte.
Instalar sem lock: é o que pareou versões incompatíveis no build da própria biblioteca (D-058 de
lá). Um wrapper que extrai o id da url e passa `--out ingest/<id>`: código novo para manter uma
convenção, e o `list` nativo não enxergaria essas pastas. `--out ingest/<id>` digitado à mão:
id errado sobrescreve outro vídeo, e o `list` também não funciona.

**Verificação, executada em 07/10/2026, saída literal no relatório da sessão.**

- **Equivalência, só na contagem.** No vídeo de referência `FR9RRXVpg9I`, 810 linhas de conteúdo
  no `legenda.txt`, zero textos repetidos, e 810 linhas de texto distintas no `.vtt` bruto. É o
  mesmo 810 do script na seção 3.7 da INGESTAO. O texto linha a linha **não** foi comparado,
  porque a saída do script não existe mais em disco, e a faixa agora é `pt-orig`. Continua no
  bloco de pendências da INGESTAO.
- **Controle negativo da D-090.** Tom puro de 440 Hz, 10 s, modelo `medium`: zero segmentos.
  Só a metade com detecção de voz foi rodada; a metade sem ela não é exercitável pela CLI, que
  não tem opção para desligar.
- **Nada entra no git.** `git add -A --dry-run` depois da ingestão real não lista nada de
  `ingest/`, `runs/` nem `packs/`, e `git check-ignore` confirma as quatro regras.
- **Suíte, typecheck e validação** verdes no estado atual, e o CLI de validação reprovando com
  exit 1 uma `conhecimento/ingest/` colocada de propósito e removida depois.

## Sessão de 06/11/2026

### D-103. A ingestão de vídeo sobe para transcript-normalizer v0.8.1, com o áudio guardado

**Decisão.** A biblioteca transcript-normalizer fica fixada em `v0.8.1` por
`tools/ingest/pyproject.toml` e `tools/ingest/uv.lock`, com o extra `[ingest]`. O atalho
`ingest:video` passa a levar `--keep-audio`. A subida segue o caminho que a D-102 prevê:
`uv lock --upgrade-package transcript-normalizer` e commit.

**Registro de fato, sem reescrever a D-102.** A D-102 fixou `v0.4.5`. A subida para `v0.6.4`,
no commit `1248182` (assunto "Ingestao de video sobe para transcript-normalizer v0.6.4 (D-102)"),
não teve decisão própria: o motivo ficou só na linha de `tools/` do `AGENTS.md`. Esta decisão é
a primeira subida de versão registrada aqui.

**O que muda de comportamento entre 0.6.5 e 0.8.1, conferido no CHANGELOG da biblioteca na tag
`v0.8.1`, e o efeito em cada caso sobre a ingestão deste projeto:**

- **Ordem das faixas, 0.6.5 (D-081 de lá, provisória, emendando a D-045 de lá).** No idioma
  original do vídeo, a legenda escrita pelo canal passa à frente da automática do áudio original.
  A ordem fica: a do canal no idioma original, a automática do áudio original, as do canal em
  outros idiomas, e por último dublagens e traduções automáticas. **A D-102 descreve a ordem da
  0.4.5 a 0.6.4, `pt-orig` antes da manual, e essa descrição deixa de valer a partir daqui.** Para
  a procedência isso importa porque a linha "Origem da legenda" do cabeçalho do `legenda.txt` pode
  mudar para o mesmo vídeo, e o `trecho_original` tem que citar a faixa que de fato foi baixada.
  Vídeo sem faixa manual não muda.
- **Idioma, 0.6.5 (D-080 de lá).** Sem `--lang`, o `fetch` pega o idioma do vídeo como o site
  informa, e não mais sempre `pt`. O atalho não passa `--lang`. Efeito: vídeo em português segue
  igual; vídeo em outro idioma passa a vir no idioma original em vez de cair numa tradução
  automática para `pt`. Isso aproxima o texto da fonte, e por isso o atalho continua sem `--lang`.
- **Áudio, 0.6.5.** O áudio baixado para reconhecimento de fala passa a ser apagado depois que a
  transcrição é gravada, a menos que se passe `--keep-audio`, que o guarda na pasta do vídeo como
  `<id-do-vídeo>.<ext>`. Até a 0.6.4 ele ficava como `audio.<ext>`. Só afeta vídeo sem legenda,
  que cai no reconhecimento de fala.
- **Login, 0.6.5 (D-078 de lá).** Site que pede login sai com código 3 e mensagem dizendo qual
  site pediu. O atalho repassa o código. Efeito pequeno: muda a mensagem e o código de saída
  quando a ingestão falha por login, não muda o que é gravado quando dá certo.
- **0.7.0 e 0.8.0.** Mexem em pacote de termos, contexto de variante, `min_engine`, `match: exact`
  e no `TRANSCRIPT_NORMALIZER_HOME` levando o `config.toml`. Nada disso é exercido pelo `fetch` do
  atalho, que não usa pacote nem a variável.
- **0.8.1.** Entra o `--version`. As correções de segurança de filelock e certifi valem, pelo
  próprio CHANGELOG, para os executáveis que a biblioteca publica: "`pip install` resolves its own
  versions". Então elas não chegam a este projeto pela troca de tag, e o que este lock resolveu
  para os dois pacotes está na verificação abaixo.

**Por que `--keep-audio` no atalho.** Para vídeo transcrito por reconhecimento de fala, o áudio é
a única coisa contra a qual a transcrição pode ser conferida, e a D-089 se sustenta exatamente no
erro de fala ser "conferível contra o áudio". A partir da 0.6.5 ele seria apagado antes de qualquer
conferência. A INGESTAO, seção 3.7, diz que o áudio "pode ser apagado" **depois** da conferência
da transcrição, então guardar por padrão é o que deixa essa ordem possível; apagar continua sendo
gesto de quem conferiu. O áudio fica em `ingest/runs/<id-do-vídeo>/`, fora do versionamento
(D-042), como o resto.

**O que continua valendo.** Caminho A da D-102, e só ele: o atalho roda só `fetch`, sem
`normalize`, sem `--pack`, sem camada aprendida, e o `trecho_original` sai do `legenda.txt`. A
D-091 não é revista. D-089, D-090 e D-092 seguem intactas, e a exceção de runtime da D-092 segue
sem abrir precedente.

**Descartado.** Fixar `--lang pt` no atalho para manter o comportamento antigo: traria tradução
automática para vídeo em outro idioma, que é texto que ninguém falou. Deixar o áudio ser apagado
e baixar de novo quando precisar conferir: o vídeo pode sair do ar, e o áudio baixado de novo não
é garantidamente o mesmo que gerou a transcrição.

**Verificação, executada em 06/11/2026, saída literal no relatório da sessão.**

- **Versão.** `uv run --locked --project tools/ingest transcript-normalizer --version` imprime
  `0.8.1`, exit 0.
- **O lock trocou um pacote só.** Comparando nome e versão de todos os pacotes do `uv.lock` antes
  e depois, a única diferença é `transcript-normalizer: 0.6.4 → 0.8.1`, commit
  `4e88cf67f4a5d970358ef9b76e5716b0f624192d`. `faster-whisper` 1.2.1 e `ctranslate2` 4.8.2 não
  mudaram, então o controle negativo da D-090 não foi rodado de novo. O `--upgrade-package` da
  biblioteca deixou `certifi` em `2026.7.22` e `filelock` em `4.0.12`, as versões que os alertas
  apontam, e por isso entra o item seguinte.
- **certifi e filelock sobem no lock da ingestão**, por `uv lock --upgrade-package certifi
  --upgrade-package filelock`, porque são dependências só desta ferramenta e as versões fixadas
  eram as dos alertas que motivaram a 0.8.1: `certifi: 2026.7.22 → 2026.10.23` e
  `filelock: 4.0.12 → 4.2.9`, sem nenhum outro pacote mudando.
- **Mesmo texto no vídeo de referência.** `fetch --keep-raw --keep-audio` de `FR9RRXVpg9I` numa
  pasta temporária fora do repositório: faixa `pt-orig (automatica original)` nas duas versões,
  810 linhas de conteúdo nas duas, `diff` do corpo sem diferença; no cabeçalho só muda a data de
  download. O vídeo não tem faixa escrita pelo canal, então a ordem nova de faixas não foi
  exercida por ele. O `fetch` não gravou `normalized.txt` nem nada além de `legenda.txt`,
  `legenda.vtt` e `meta.yaml`. O `--keep-audio` também não foi exercido, porque o vídeo tem
  legenda e não houve áudio baixado.
- **Nada entra no git.** `git add -A --dry-run` não lista nada de `ingest/`, `runs/` nem `packs/`.
- **Suíte, typecheck e validação** verdes, com 191 testes.

## Sessão de 07/11/2026

### D-104. O Stryker ignora o venv da ingestão e `ingest/`, com padrão ancorado na raiz

**Decisão.** O `stryker.config.json` ganha `"ignorePatterns": ["/tools/ingest/.venv", "/ingest"]`,
os dois ancorados na raiz do repositório.

**Motivo.** Antes de rodar, o Stryker copia o repositório para uma pasta temporária. O venv da
ingestão (D-102) tem o atalho `lib64 -> lib`, e a cópia quebra nele com `EISDIR`, o que derruba a
rodada inteira antes do primeiro mutante. `ingest/` é material bruto fora do git (D-042) e não tem
código a mutar. A barra inicial ancora o padrão na raiz: sem ela, `ingest` casaria também
`tools/ingest/` inteiro, inclusive o `pyproject.toml` e o `uv.lock`.

**Verificação, executada em 07/11/2026, saída literal no relatório da sessão.** Os arquivos lidos
pelo Stryker caem de 4996 para 81, os mutados continuam os mesmos 15, e a rodada vai até o fim com
exit 0.

**Onde a decisão foi tomada.** Na sessão do transcript-normalizer, e entrou aqui antes do merge da
branch que a aplicou.

**Relação com a questão aberta "ferramenta que cria pasta dentro do repositório declara o que
cria".** A D-102 declarou o venv e a regra de ignore do git, mas não o efeito sobre ferramentas que
copiam o repositório. É a mesma família, com um efeito novo, e esta decisão não resolve a questão:
só registra que declarar para o git não basta.

**Por que a configuração no disco difere da gravada na D-049.** O `DECISOES.md` é append only, e a
D-049 não é editada. Esta decisão é o que explica a diferença.

## Sessão de 17/11/2026

### D-105. A parada dura sai para bancos, e o critério de pesquisa fica fixado antes de cada engine

**Decisão.** A parada dura do Passo 3, registrada no `AGENTS.md` depois da sonda
`fcff_por_concessao` (D-075), deixa de valer para as engines de bancos. O Passo 3 segue com
`ddm` e depois `excess_return`. A pesquisa das premissas de transmissão fica encerrada por ora:
B5, B8, B9 e N29 continuam ABERTAS e registradas, e o resultado da `fcff_por_concessao`
continua não confiável enquanto estiverem.

**Duas propriedades distintas, com nome próprio cada.** BLOQUEANTE mantém o sentido que já tem
no arquivo de premissas: premissa que, se for falsa, muda a engine, e por isso deixa o
resultado não confiável enquanto estiver aberta. IMPEDE A ENGINE SEGUINTE é outra propriedade:
premissa cuja resposta a próxima engine teria que fixar para poder ser escrita. Uma premissa
pode ser BLOQUEANTE sem impedir a engine seguinte. B5, B8 e B9 são BLOQUEANTES e não impedem a
engine seguinte. A B1 é BLOQUEANTE e impede a `fcff_normalizado`.

**O critério, válido para toda engine daqui em diante.** Engine nova entra com as premissas de
interpretação declaradas no arquivo de premissas dela, e com o resultado marcado como não
confiável enquanto houver premissa BLOQUEANTE aberta. A pesquisa contra documento primário
acontece só para a premissa que impede a engine seguinte.

**Teste de decisão do critério.** Uma premissa aberta impede a engine seguinte quando essa
engine teria que fixar uma resposta para ela na estrutura de input ou na fórmula, e a resposta
errada obriga a reescrever a engine. Quando a resposta errada só muda o valor, com a mesma
estrutura, a premissa fica aberta e registrada, e a engine seguinte anda. Quando a dúvida de
estrutura se resolve aceitando a forma mais geral na entrada, como uma premissa por período em
vez de um valor único, ela se resolve pelo desenho e não pela pesquisa.

**Motivo.** A parada existia por duas razões, e nenhuma vale para bancos. A primeira era
evitar que mais engines herdassem as premissas da sonda antes de respondidas: `ddm` e
`excess_return` não consomem RAP, concessão, ciclo tarifário nem deduções sobre a RAP. A
segunda era não dividir o curador entre pesquisa e revisão de código: com a pesquisa de
transmissão encerrada, sobra uma frente só. E sem critério fixado de antemão, a `ddm`
produziria premissas abertas e uma parada igual à de transmissão, e o projeto andaria uma
engine por vez com pesquisa no meio, sem chegar ao app funcionando.

**O que continua travado.** `fcff_normalizado` não começa antes da B1, porque a B1 impede a
engine seguinte: as duas engines respondem o que é fluxo livre, e a resposta fixa estrutura de
input. A pesquisa da B1, no PRORET Submódulo 9.8, acontece quando a `fcff_normalizado` for a
próxima engine.

**Premissas transversais.** Nenhuma premissa é declarada transversal nesta decisão. Só o
curador declara uma premissa como transversal, no arquivo de premissas da engine nova, citando
a premissa de origem. Quem escreve a engine pode propor, e a proposta não vale até o curador
declarar. A premissa herdada mantém o estado e o alcance que tem na origem: herdar não promove
convenção a CONFERIDA, e CONFERIDA com alcance TAESA continua com alcance TAESA na engine nova.

**Onde fica a marca de não confiável.** Hoje, no arquivo de premissas de cada engine. Quando o
snapshot for escrito, ele carrega a lista de premissas abertas da engine que produziu o
número, porque o RF-802 exige registrar tudo que influenciou o resultado. Isso é exigência para
o passo do snapshot, não código agora.

**Ordem da emenda de procedência.** A emenda do RF-304, com o RF-309, entra depois dos
validadores e antes do snapshot. O RF-802 grava fatos com procedência no snapshot, e o RF-304
manda o core rejeitar dado sem procedência; os dois fixam o formato. Os validadores de regra
dura (RF-506, RF-507) operam sobre premissas e inputs e não carregam procedência. A emenda
precisa cobrir, além de vídeo: arquivo dentro de pacote, como o anexo da REH dentro do zip da
ANEEL; hash do arquivo, como o registrado para a Carta TAESA nº 179/2020; e localizador por
tipo de fonte, porque o Anexo IX da REH 3.348/2024 só existe em planilha e não tem página.

**Casos escolhidos para a conferência documental de bancos.** Banco do Brasil e Bradesco, no
papel que a TAESA teve em transmissão. A conferência vem depois da `ddm` escrita como sonda,
não antes, e segue o critério desta decisão: confere só as premissas declaradas pela sonda que impedem a engine seguinte, a `excess_return`. Se nenhuma impedir, a conferência não acontece agora, e as premissas ficam abertas e registradas. As duas hipóteses abaixo seguem a mesma regra. Dois pontos levantados pelo autor sem conferência em documento entram como
hipóteses no arquivo de premissas da `ddm`, se a sonda tocar neles: o controle da União sobre
a política de dividendos do Banco do Brasil, e a operação de seguros dentro do grupo Bradesco.
Nenhum dos dois é fato.

**Fora do escopo de bancos.** Itaúsa fica fora de bancos por ter participações em setores fora
da v1. A avaliação de holdings tem desenho fora do repositório, a ser trazido e registrado em
decisão própria.

**Descartado, manter a parada até fechar as premissas de transmissão.** Custo alto sem ganho
para bancos: nenhuma premissa aberta de transmissão muda uma linha da `ddm`.

**Descartado, levantar a parada sem critério.** É a sonda de transmissão de novo, com a mesma
parada na engine seguinte.

## Sessão de 19/11/2026

### D-106. A ingestão passa a normalizar, e a lista de termos é ferramenta, não conhecimento

**Decisão.** Revoga a parte da D-102 que diz que a ingestão não roda `normalize`. Fica
permitido rodar `normalize`, com revisão (`--review` e `--confirm`), sobre o material de
`ingest/`. A lista de termos é o pacote `financas-ptbr` do repositório de pacotes, tratado
como ferramenta, e não mora em `conhecimento/`: isto revoga a parte da D-091 que mandava a
lista para `conhecimento/` com schema próprio.

**Motivo.** Legenda automática e reconhecimento de fala erram termo de domínio, e ler o texto
cru para estudar ou separar candidatos a heurística é lento e induz a erro. A revisão grava o
que foi decidido na camada aprendida, e cada transcrição seguinte sai melhor. E o pacote
evolui no repositório de pacotes, onde pode ser publicado e receber contribuição de terceiros;
em `conhecimento/`, ele ficaria preso a este projeto.

**A regra que não muda, e por que.** O `trecho_original` de qualquer anotação, heurística ou
dado extraído de vídeo sai sempre do `legenda.txt`, nunca do `normalized.txt`. O texto
normalizado contém palavras que ninguém falou, e citá-lo aponta para um instante cujo áudio diz
outra coisa (RP-005, RF-304). O `normalized.txt` é para leitura; a citação se confere no
original, que a normalização sobre o `legenda.txt` não altera.

**Onde fica cada coisa.** A biblioteca roda com `TRANSCRIPT_NORMALIZER_HOME` apontando para
`ingest/`, para que tudo o que ela cria fique ali, fora do git (D-042): `runs/`, `packs/`, a
camada aprendida e o `config.toml`. Sem a variável, o `config.toml` iria para a pasta de
configurações do usuário e se misturaria com o uso pessoal da ferramenta. Sem `--pack`, a
normalização usa `ingest/packs/financas-ptbr.yaml` quando ele existe (criado ao escolher o
pacote no menu, por `pack install` ou `pack copy`, e substituído por `pack update`), e só sem
ele usa o incluído na engine travada pela D-103. O resultado, portanto, não é fixo: depende
desse arquivo e da camada aprendida. Cada anotação grava `pack_version`, que vem do campo
`version` do pacote: ele identifica um pacote publicado, mas não um rascunho local editado sem
mudar a versão, e o estado da camada aprendida não fica registrado. O `legenda.txt` que vem do
`fetch` não muda com a normalização. Quando o `normalize` recebe um `.srt` ou `.vtt`, ele
regrava o `legenda.txt` daquele id; por isso a normalização roda sobre o `legenda.txt` do
`fetch`. Os atalhos não barram `.srt` nem `.vtt`, e o risco de regravar um `legenda.txt`
existente fica aceito: só acontece quando o arquivo tem o mesmo nome do id de um vídeo já
baixado, e a legenda bruta guardada pelo `--keep-raw` continua na pasta. A proteção certa é a
ferramenta recusar a regravação, e ela fica pedida no repositório do transcript-normalizer. A
edição local em `ingest/packs/` é rascunho do autor; a publicação acontece no repositório de
pacotes, pelo processo de lá.

**A camada aprendida tem backup.** `ingest/packs/financas-ptbr.learned.yaml` é o trabalho
acumulado das revisões e não está no git. Ela entra no backup de `ingest/` feito por fora. De
tempos em tempos, o autor propõe o que ela ensinou ao repositório de pacotes, por
`pack propose --pack financas-ptbr`; a proposta é contribuição pública e não substitui o
backup.

**Depois da revisão.** As respostas da revisão vão para a camada aprendida e não regravam o
`normalized.txt` daquela execução. Para ele refletir o que foi decidido, roda-se o `normalize`
de novo sobre o mesmo `legenda.txt`.

**O que continua esperando.** O caminho B da D-102, em que a normalização alimenta
automaticamente a extração para o app, segue dependendo da emenda de procedência. Esta decisão
libera a normalização para o trabalho do autor, não para o app consumir texto normalizado.

**Questões abertas que esta decisão responde.** "Onde a lista de termos mora": no repositório
de pacotes, como ferramenta. "A camada aprendida": fica em `ingest/`, local, fora do git e com
backup por fora. A questão "o tamanho da revisão do `financas-ptbr`" continua aberta, como
gatilho do caminho B.

### D-107. Correção da D-106: três caminhos regravam o `legenda.txt`, e o uso tem três regras até a engine recusar

**Decisão.** Corrige a frase da D-106, seção "Onde fica cada coisa", que diz que a regravação
do `legenda.txt` "só acontece quando o arquivo tem o mesmo nome do id de um vídeo já baixado"
e que "a legenda bruta guardada pelo `--keep-raw` continua na pasta". Pela conferência feita
na sessão do transcript-normalizer em 19/11/2026, na v0.8.1 travada pela D-103 três caminhos
substituem um `legenda.txt` existente sem aviso: o `normalize` sobre `.srt` ou `.vtt`
(`cli.py:472-486`); o `fetch` repetido da mesma url (`fetch.py:1257`), que desde a 0.6.5 pode
trazer outra faixa; e o `fetch` de arquivo local (`fetch.py:893`). O `.vtt` guardado pelo
`--keep-raw`, se normalizado, vai para `runs/legenda/`, e não para a pasta do vídeo. E a
substituição deixa o `annotations.json` e o `normalized.txt` apontando para um texto que não
existe mais.

**Regras de uso até a engine recusar a regravação.** Não rodar `ingest:video` duas vezes na
mesma url; para conferir um vídeo antes de baixar, usar `ingest:info`, que não grava nada. Não
normalizar `.srt` nem `.vtt` pelo projeto. Manter o backup de `ingest/`.

**A proteção.** A sessão do transcript-normalizer propôs, em 19/11/2026, que a 0.8.2 não
substitua um `legenda.txt` existente sem pedido explícito: mesma origem e mesmo conteúdo,
reaproveita; origem diferente, recusa com código de saída diferente de zero e oferece `--out`
ou `--replace-caption`, que guarda o antigo e o que deriva dele numa subpasta datada. A frase
da D-106 que diz que a proteção "fica pedida no repositório do transcript-normalizer" se refere
a esse pedido, feito à sessão e não por issue. A subida para a versão que trouxer a proteção é
decisão própria, como a D-103, e só ela encerra as regras acima.

**Motivo.** A frase da D-106 foi escrita antes da resposta da sessão do transcript-normalizer
e subestima o risco: o caso mais provável, o `fetch` repetido, não aparece nela. O
`legenda.txt` é a fonte de procedência do projeto (RF-304, D-106), e regravá-lo em silêncio
rompe a ligação entre a citação e o que foi dito. Como o `DECISOES.md` só recebe acréscimos, a
correção vem como decisão nova.

## Sessão de 22/11/2026

### D-108. Conhecimento que vem de transcrição não carrega registro de origem

**Decisão.** Conhecimento extraído de transcrição de vídeo, áudio ou aula escolhidos pelo curador
entra na base sem registro de origem: sem url, instante, `trecho_original`, autor ou canal. A
confiabilidade da fonte é julgamento do curador, feito na escolha do material. O campo `fonte` da
heurística de leitura (RF-106) passa a opcional, e é preenchido quando a heurística se apoia em
documento da companhia ou em norma.

**O que muda em decisões anteriores.** Na D-105, a emenda de procedência deixa de cobrir vídeo. Na
D-106, deixa de valer a regra de que o `trecho_original` sai do `legenda.txt`; o `legenda.txt`
continua sendo o texto de trabalho da ingestão. Na D-096, o tipo de fonte deixa de ser critério de
roteamento para material de transcrição.

**O que não muda.** RF-304: dado da companhia (demonstrações, notas explicativas, releases,
documentos regulatórios) continua carregando `documento`, `pagina` e `trecho_original`, e o
snapshot continua registrando fatos com procedência (RF-802). RP-006 e RF-403: número de premissa
que o usuário não digitou continua aparecendo como preset, aplicado por ação explícita e nunca
pré-selecionado. A revisão do curador antes do commit (RF-121) continua.

**Motivo.** O registro de origem de um item de conhecimento não diz se a fonte é confiável; isso é
decidido pelo curador ao escolher o material. Manter url, instante e trecho em cada item exigia uma
emenda de requisito e um tipo de procedência só para vídeo, sem proteger nada que a escolha do
curador já não proteja. O registro continua onde ele protege o cálculo: no número da companhia que
entra na engine.

**Requisitos.** Versão 2.4.5: RF-106 com `fonte` opcional, RF-116 dizendo que a procedência do
primeiro bloco do alerta é a do fato no documento da companhia, e aceite da Etapa do Conhecimento
ajustado.

### D-109. A ingestão segue a última tag publicada do transcript-normalizer, sempre fixada no lock

**Decisão.** `tools/ingest/pyproject.toml` aponta para a última tag publicada do
transcript-normalizer, com o extra `[ingest]`, e o `tools/ingest/uv.lock` fixa o commit exato
dessa tag. O atalho `ingest:video` continua com `--locked`. Seguir a última tag é política, e não
dependência solta: entre uma subida e outra, a versão usada é sempre a do lock.

**Como se sobe.** `uv run --project tools/ingest tn update` mostra a versão instalada, a última
publicada e o trecho do CHANGELOG entre as duas, sem alterar nada. `uv run --project tools/ingest
tn upgrade` roda `uv add` com a tag nova, o que move o pin do `pyproject.toml` e o `uv.lock` de uma
vez e mantém o `[ingest]`. Os atalhos `bun run ingest:update` e `bun run ingest:upgrade` fazem o
mesmo, no molde dos outros atalhos de ingestão. Depois vem o commit. Subida de versão deixa de
exigir decisão própria a cada tag; isto revisa o que a D-103 e a D-107 diziam sobre subida ser
decisão própria.

**A primeira subida é à mão.** A v0.8.1 fixada pela D-103 não tem o comando `tn`. A subida para a
v0.8.7 é feita com `uv add --project tools/ingest "transcript-normalizer[ingest] @
git+https://github.com/Tatiwel/transcript-normalizer@v0.8.7"`. As seguintes saem pelo
`tn upgrade`. Até esta primeira subida, `bun run ingest:video` não roda nas aulas já transcritas,
porque a v0.8.1 não tem a trava e regravaria o `legenda.txt`. Depois dela, o atalho roda uma vez
sobre o arquivo de vídeo de uma das aulas, e o exit code colado tem que ser 0.

**Verificação a cada subida, com exit code colado.** A versão impressa por `tn --version` é a tag
nova. O vídeo de referência `FR9RRXVpg9I` é baixado numa pasta temporária fora do repositório e
comparado com o texto da versão anterior: se o texto mudou, a mudança tem que estar explicada no
CHANGELOG que o `tn update` mostrou, e diferença sem explicação no CHANGELOG para a subida. Suíte,
typecheck e validação verdes.

**A trava de regravação.** Antes de baixar ou transcrever, a biblioteca compara com o `legenda.txt`
que já existe na pasta da run. Mesma origem, reaproveita e sai com 0; outra origem, para e sai com
4. Mesma origem quer dizer: para link, mesmo vídeo, idioma e modo, com o mesmo modelo na transcrição
local ou a mesma faixa na legenda da plataforma; para `.srt` ou `.vtt` convertido pelo `normalize`,
as mesmas linhas; para arquivo local, mesmo nome de arquivo, mesmo sha256 e tamanho, gravados na
linha "# Impressao digital" do cabeçalho, mais modelo e idioma. `--keep-raw` e `--keep-audio` não
entram na comparação. Transcrição de arquivo local e link do mesmo vídeo são origens diferentes,
porque o texto de arquivo local não tem URL. O código 4 quer dizer que já existe outro texto na
pasta, e o atalho o repassa sem tratamento próprio. `--replace-caption` substitui e guarda o
anterior em `replaced-<data e hora>/`; `--out` grava em outra pasta e mantém os dois.

**O que encerra da D-107.** A trava cobre os três caminhos que a D-107 mapeou. Deixam de valer
"não rodar `ingest:video` duas vezes na mesma url" e "não normalizar `.srt` nem `.vtt` pelo
projeto", a partir da primeira subida. O backup de `ingest/` continua, porque protege contra perda
da máquina.

**Convenção do instante.** Na legenda da plataforma e no `.srt` ou `.vtt` convertido, o instante é
o fim da fala; na transcrição local, é o início. Antes de 1 hora o formato é `m:ss` (44:29); de 1
hora em diante, `h:mm:ss` (1:14:14), como o player mostra. Os leitores da biblioteca aceitam as
duas formas. `tn restamp` reescreve só os instantes e a linha do cabeçalho que descreve o formato;
nenhuma palavra da fala muda.

**Aviso de trecho repetido.** Depois de uma transcrição local, a biblioteca marca trecho de 15
palavras ou mais que repete o que foi dito até um minuto antes, e transcreve de novo o trecho em
volta para `needs-review/repeats/`. O recorte é ajuda para ouvir, não substitui o texto, e perda
que não gera repetição não é detectada.

**As runs das aulas 1, 2 e 3 do Projeto Yield.** Transcritas na v0.8.4, a partir dos arquivos de
vídeo locais, com modelo `medium` e idioma `pt`, registradas no `ingest/runs/run-all.log`, com os
instantes reescritos pelo `restamp` da v0.8.6 e o texto anterior em `replaced-<data e hora>/`. As
linhas de cabeçalho vindas de versões antigas são texto inerte. Os trechos marcados ou suspeitos
foram ouvidos pelo curador: aula 1 em 44:55 e 44:58, aula 1 de 1:14:14 a 1:14:40 e aula 3 em 35:11,
todos conferindo com o áudio. Sem `--out`, a pasta da run é `runs/<nome do arquivo sem extensão>`,
então `aula1.mp4` cai em `runs/aula1`. O atalho reaproveita o texto com código 0 quando recebe o
mesmo arquivo de vídeo, com o mesmo nome; sem `--lang` e sem `--model`, ele roda com `pt` e
`medium`, iguais aos das runs. Com o arquivo renomeado ou com o link do vídeo, a pasta da run é
outra (`runs/<nome novo>/` ou `runs/<id do vídeo>/`), a trava não encontra texto para comparar e a
transcrição começa do zero. O código 4 só aparece quando uma origem diferente tenta gravar na mesma
pasta.

**O pacote de termos é separado da biblioteca.** Subir a biblioteca não atualiza
`ingest/packs/financas-ptbr.yaml`. A versão se confere com `tn pack list`, e `tn pack update`
atualiza pacote instalado e não editado; cópia editada se junta pelo `pack merge`, sempre a pedido.

**Motivo.** A biblioteca é mantida pelo autor deste projeto e corrige defeitos que afetam
diretamente a ingestão, como a regravação silenciosa da D-107 e a fala perdida em arquivo longo
medida na aula 1. Uma decisão por versão custava uma rodada de conversa a cada tag sem proteger
mais do que a verificação acima protege. O lock com `--locked` mantém a garantia da D-051: o mesmo
comando usa a mesma versão até alguém subir de propósito.

**Descartado.** Dependência sem tag, que instalaria o que estivesse publicado no dia e quebraria a
D-051 e a D-103. Verificação de diferença zero no vídeo de referência, porque há versões que mudam
o texto de propósito, como a v0.8.6 com o formato dos instantes. Script em volta do atalho para
tratar o código 4, porque o bun já repassa o código e a mensagem.

### D-110. Correções da D-109 e da RF-116, achadas na revisão da PR #11

**Decisão.** Corrige três pontos da D-109 e a redação da RF-116, e registra a remoção do manual da
PR #10. A D-109 continua valendo no resto.

**1. O que a trava compara em arquivo local.** A D-109 diz que mesma origem, para arquivo local,
é "mesmo nome de arquivo, mesmo sha256 e tamanho". Lido no código da v0.8.7
(`caption_guard.py:206-211`): quando o `legenda.txt` existente e o arquivo novo têm impressão
digital, decide o conteúdo (sha256 e tamanho), mais modelo e idioma, e o nome do arquivo não entra.
O nome só é comparado quando o `legenda.txt` existente não tem a linha "# Impressao digital", o
que acontece em texto gravado antes da v0.8.3. Consequência: uma cópia renomeada do mesmo vídeo,
gravando na mesma pasta por `--out`, é a mesma origem e sai com 0. Este cenário foi lido no
código e não executado. Sem `--out` nada muda no que a D-109 descreve: a pasta da run vem do nome
do arquivo, então o arquivo renomeado cai em outra pasta e a transcrição começa do zero.

**2. `--locked` nos comandos de subida.** Onde a D-109 escreve `uv run --project tools/ingest tn
update` e `tn upgrade`, o comando é `uv run --locked --project tools/ingest tn update` e
`tn upgrade`, como nos atalhos `ingest:update` e `ingest:upgrade`.

**3. Ordem da verificação a cada subida.** A comparação do vídeo de referência precisa do texto
gerado pela versão anterior, e depois do `upgrade` essa versão já foi trocada. A ordem é:
`ingest:update` para ler o CHANGELOG; baixar o vídeo de referência numa pasta temporária fora do
repositório, ainda na versão instalada; `ingest:upgrade`; baixar o vídeo de referência de novo
em outra pasta temporária; comparar os dois textos contra o CHANGELOG; suíte, typecheck e
validação; commit.

**4. RF-116.** A redação da 2.4.5 exige a procedência do primeiro bloco do alerta só "quando é
fato de documento da companhia". A RF-106 manda preencher a `fonte` da heurística também quando
ela se apoia em norma, e a RF-116 não cobria esse caso. A redação passa a: "o que foi identificado
(obrigatório; quando é fato de documento da companhia ou disposição de norma, com a procedência
completa, RF-304)". O `fonte` de nota e de evento continua obrigatório no schema, e esta redação
não autoriza afrouxá-lo. Requisitos vão a 2.4.6.

**5. Manual de comandos.** A PR #10, com o manual dos comandos da ingestão escrito para a v0.8.1,
entrou na main por engano em 22/11/2026, no commit `a8efba4`, e o arquivo
`docs/ingestao-comandos.md` é removido junto com esta decisão. O projeto não mantém manual que
traduz o `--help` de uma versão da biblioteca: a D-109 manda seguir a última tag, e um manual
assim envelhece a cada subida. A referência dos comandos é `tn --help` e o README da biblioteca.
O que é específico do projeto (atalhos, flags usadas e as regras da D-108 e da D-109) fica no
`AGENTS.md` e no `INGESTAO-video-transcricao.md`.

**Motivo.** A D-109 foi escrita a partir de descrições do comportamento da biblioteca, e uma
revisão independente da PR #11, feita na main, leu o código e achou as diferenças. O ponto 3 é
falha de procedimento: quem seguisse a D-109 ao pé da letra não teria o texto da versão anterior
para comparar.

**Descartado.** Editar a D-109, porque ela já está na main e o arquivo só recebe acréscimo.

### D-111. Número em texto de heurística só entra com fonte

**Decisão.** Nos campos `o_que_verificar` e `por_que_importa` da heurística de leitura,
percentual, número decimal e valor em reais só são aceitos quando a heurística tem `fonte`
preenchida. Sem `fonte`, o texto com esses números é reprovado citando RF-112. No campo
`onde_olhar`, percentual e valor em reais são reprovados sempre, e número decimal é aceito, porque
referência de seção de documento é o que o campo existe para carregar. Nota e evento não mudam:
descrevem fato da companhia, têm `fonte` obrigatória, e o número faz parte do fato.

**Motivo.** O RF-112 diz que nenhum item de conhecimento contém valor de premissa (RP-006). A
revisão da PR #11 mediu, na main, que uma heurística com "Use taxa de desconto de 12%" passava no
schema e no validador completo. A lacuna é anterior à PR #11 e não vazou, porque `conhecimento/`
ainda não tem heurística. O filtro de valor de premissa que já existe não serve aqui como está:
medido em 22/11/2026, ele barra "Nota 24.1 do ITR", "Basileia mínimo regulatório de 10,5%
(Resolução CMN 4.958)" e "multa de R$ 2,3 bilhões reportada no ITR", que são texto legítimo. A
regra separa pelo que a D-108 já separa: número com origem em documento da companhia ou em norma
é fato; número sem origem é valor solto, e é esse que chegaria à tela como orientação do app.

**O filtro é rede, não prova.** `fonte` preenchida não prova que o número veio dela, e o filtro
não pega número inteiro nem número por extenso, como "5 anos" ou "doze por cento". A prova
continua sendo a revisão do curador (RF-121), como na D-061.

**Descartado.** Aplicar o filtro existente aos três campos: barra texto legítimo. Estender a
regra a nota e evento: reprovaria fato da companhia com número. Filtro por vocabulário, como
"use" ou "adote" seguido de nome de premissa: não pega paráfrase e exige manter lista.

**Requisitos.** Versão 2.4.6: a RF-106 passa a registrar esta regra.

## Sessão de 23/11/2026

### D-112. Recomeço do conhecimento a partir de material de autor, e os quatro conflitos que ele abria

**Decisão.** O conhecimento é refeito do zero a partir de material de autores escolhidos pelo
curador, sem esperar o app ficar pronto. O agente estuda cada material, classifica a forma de
saída de cada item e propõe a redação a partir da fala do autor. O curador aprova, edita ou recusa
item por item, e o texto aprovado entra por commit, nunca direto (RF-121, RP-008). Os quatro
conflitos que o handoff de 22/11/2026 registrou se resolvem assim.

**Conflito 1, inventário contra seleção.** O inventário completo, em ordem, nos termos do autor e
com instante, vale dentro do trecho que o curador indicar como de interesse, ou da transcrição
inteira quando ele não indicar. Fora desse trecho, uma lista curta do que havia ali. O agente
classifica cada item pela forma de saída e não seleciona o que entra.

**Conflito 2, RNF-013 contra o agente propor redação.** O agente propõe a redação de cada item a
partir da fala do autor, como exceção declarada da RNF-013, com cinco condições:

1. a proposta traz, ao lado do texto, o trecho da fala de origem com a aula e o instante, para o
   curador ouvir;
2. o texto proposto de heurística, de `onde_encontrar` e de `ajuda` não leva número de premissa
   nem forma imperativa;
3. o agente não propõe item sem fala de origem, nem completa com o que sabe do assunto;
4. só entra o que o curador aprovar ou editar, item por item, e o que ele recusar não entra;
5. aula e instante ficam na proposta e não entram na base (D-108).

Formato da proposta, um bloco por item: item; forma de saída; texto proposto; fala de origem, com
aula e instante; o que ficou de fora da fala e por quê. A proposta não é conhecimento, não entra em
`conhecimento/` e nada a carrega.

**Conflito 3, D-070 contra não esperar o app.** A Etapa do Conhecimento passa a ter duas metades.
Estudo e autoria começam agora, em YAML de `conhecimento/`, validados pelo CLI que já existe. O
exercício do conhecimento no app continua depois da Fase 7, e a validação metodológica continua na
Fase 8. A linha da Etapa na seção 8 dos requisitos ganha essa divisão, sem número de fase, como a
D-070 manda. Heurística entra pelo filtro de número da D-111, que já está no schema. Faixa de
referência só entra depois que o schema cobrir a RF-113 da 2.4.7.

**Conflito 4, destino do material de autor.** Material que vem de transcrição roteia pela natureza
de cada item (D-094), e não pelo tipo de fonte, que a D-108 já tirou desse material:

- mecanismo vira heurística de leitura sem número;
- instrução de localização vira `onde_encontrar` de input, só depois de o curador conferir no
  documento da companhia;
- explicação de campo vira `ajuda` de premissa, sem número, pelo filtro de texto que já existe;
- coerência aritmética vira validador, que nasce ao escrever a engine (D-095), e o material só
  aponta a pergunta;
- valor de premissa que não depende do método do autor vira observação para faixa de referência
  setorial (RF-113, RF-114, RF-115), pelo critério da D-115;
- valor de premissa calibrado dentro do método do autor, preço teto e recomendação não entram.
  Premissa calibrada vai, no máximo, para o caderno de estudo em `docs/pesquisa/` (D-115).

**Observação para faixa.** A faixa aparece ao lado do campo com mínimo, máximo, número de fontes,
base, termos nominais ou reais quando a premissa é taxa ou crescimento, confiança e data. O campo
continua vazio. O mecanismo que explica o que empurra o valor para cada ponta entra como heurística
sem número, ao lado, descrevendo o efeito no cálculo. O app não escolhe a ponta para a empresa:
nenhuma heurística liga característica de empresa a uma ponta, e nenhum elemento marca ponto dentro
da faixa. Continua proibido: número em texto de heurística, forma imperativa, faixa por ativo e
valor pré-preenchido. A observação conta uma vez por fonte independente, e a atribuição que a fonte
faz a terceiro não é fonte. Com menos de duas fontes, a faixa não entra em `conhecimento/`, e a
observação espera no caderno de estudo (D-115).

**Horizonte.** O horizonte de bancos continua escolha do usuário, obrigatória e sem default
(RF-419). Ao lado do campo fica a faixa dos horizontes observados nos autores estudados, pelo
critério acima, com o número de fontes à vista e nenhum pré-selecionado. Na aula 3 do Projeto
Yield, 3 e 5 anos são observação do autor. Os 10 anos são atribuição que ele faz a Buffett: não
contam como fonte, não entram na faixa e vão para o caderno de estudo como atribuição a conferir.
Com uma fonte hoje, a faixa de horizonte ainda não entra.

**Motivo.** O handoff de 22/11/2026 registrou o recomeço como direção do curador, sem decisão
gravada e com quatro conflitos contra decisões e instruções em vigor. Enquanto eles ficarem
abertos, cada sessão resolve do seu jeito, e o mesmo debate volta. A exceção da RNF-013 se sustenta
porque o risco que ela cobre é texto de agente entrando como conhecimento sem origem e sem autor. A
fala ao lado de cada proposta dá a origem, e a aprovação item por item, com commit, dá o autor. A
proposta sem fala de origem continua proibida, porque é exatamente o agente escrevendo do que sabe.

**Descartado.** Só classificar, sem propor redação (rascunho de 22/11/2026): deixa o curador
escrevendo cada item do zero e não protege mais, porque a fala ao lado já fecha o risco que a
RNF-013 cobre. Inventário completo de tudo, sempre: gasta a leitura do curador com trecho que ele
já disse não interessar. Manter a D-070 e acumular o estudo só em `docs/pesquisa/`: adia a autoria
sem ganho, porque o CLI já valida o YAML. Roteamento por tipo de fonte, com proibição total de
entrada em playbook vinda de autor: barraria `onde_encontrar`, `ajuda` e faixa, e a faixa de
referência é, desde a v2.2, observação de analista (seção 1.2 dos requisitos).

**O que muda em decisões anteriores.** D-069 e RNF-013: ganham a exceção do conflito 2; o teste de
decisão continua, e o agente continua sem escrever conteúdo analítico próprio. D-070: passa a ter
as duas metades acima. D-096: deixa de rotear material de transcrição por tipo de fonte, o que a
D-108 já tinha começado, e a proibição de material de analista propor entrada em playbook passa a
ter três exceções: `onde_encontrar` conferido no documento da companhia, `ajuda` de premissa e
`faixa_referencia`. Regra dura, modelo habilitado, múltiplo bloqueado, detecção e input continuam
fora. D-097 e D-108: não mudam; a origem fica na proposta e no caderno. CLAUDE.md, seção 5.2: ganha
a mesma exceção, com as mesmas cinco condições.

**Requisitos.** Versão 2.4.7: RNF-013, linha da Etapa do Conhecimento na seção 8, RF-113 e RF-419.

### D-113. O app ensina o raciocínio do autor, e não reproduz o método nem o preço teto de terceiro

**Decisão.** Quando um material de autor ensina um método de valuation, o app absorve o
raciocínio: onde achar o dado, como anualizar, de onde sai o crescimento, horizonte curto mais
perpetuidade, e quais escolhas mandam no resultado. Absorve dentro das engines que já existem ou
estão previstas. O app não reproduz o método do autor, não o oferece como modo, variante ou engine,
e não exibe nem compara o preço teto calculado por ele. A D-097 fica como está.

Ficam fora junto:

- **A premissa implícita na cotação.** O app não calcula nem exibe o valor de premissa (por
  exemplo, o ROE sustentável) que iguala o resultado à cotação. Esse número chega ao usuário já
  associado a um ticker sem que ele o tenha digitado, que é o RP-006, e é o ponto preferencial que
  o RF-414 proíbe marcar. A grade de sensibilidade sobre a mesma premissa continua permitida
  (RF-413, RF-414).
- **Número de terceiro como teste ou fixture.** Resultado calculado por autor não vira valor
  esperado em teste nem fixture enquanto nenhuma engine do app implementar o mesmo método. Sem
  isso, ele não é caso de referência no sentido da seção 8, porque não testa engine nenhuma. E
  guardaria preço-alvo de terceiro por ticker no repositório distribuído, que é a segunda razão da
  D-098.

**Motivo.** A aula 3 do Projeto Yield, conferida no centavo contra a tela da ferramenta do autor,
desconta o lucro inteiro como fluxo, enquanto o crescimento sai da parte retida desse mesmo lucro.
Isso conta duas vezes o lucro retido. E a aula traz a perpetuidade a valor presente a 10% fixos,
independentemente da taxa de desconto. São duas inflações. Corrigidas, os mesmos números caem
22,8% na BR Partners e no Itaú, e 50,1% no BB a 14%. Em bancos, o método nem roda, porque o R-102
bloqueia descontar o lucro sem a retenção exigida. Reproduzi-lo exigiria afrouxar regra dura
(seção 5.6 do CLAUDE.md) e faria o app imprimir o preço teto do terceiro por outro caminho (D-098).
Fica registrada uma hipótese, que não é fato: a base, nominal ou real, do crescimento de 3% que o
autor usa na perpetuidade não foi declarada por ele nem conferida. Se for real, a conta dele
mistura crescimento real com taxas nominais, o que é uma terceira inconsistência, de sinal
contrário às duas medidas, e os percentuais acima não a corrigem.

**Descartado.** Um modo da `ddm` que reproduz o método: exigiria revisar o R-102 ou o R-001, e a
D-097. Uma engine nova de lucro descontado: mesmo alcance, mais uma engine para manter, sem setor
onde rodar. Usar os números da tela como caso de referência fora do app: não testa engine nenhuma,
e a prova de que o método foi entendido já existe na sessão de 22/11/2026, com exit 0.

**O que muda em decisões anteriores.** Nenhuma é revogada. Esta decisão aplica a D-097 e a D-098 ao
caso de método de autor. Fica como questão aberta, e não como decisão, o teste de propriedade em
que `ddm` e `excess_return` dão o mesmo valor com premissas coerentes, para quando as duas
existirem.

### D-114. Modelo de retenção em bancos: payout derivado, ROE, RWA e Basileia por ano, base única, validadores de coerência e ações por unit

**Decisão.** As engines de bancos (`ddm` e `excess_return`) passam a trabalhar com o modelo de
retenção abaixo.

**1. Payout derivado, sem campo livre.** A cada ano do horizonte:

- lucro = ROE do ano × PL do início do ano;
- capital exigido = Basileia alvo do ano × RWA do fim do ano;
- retenção = capital exigido − PL do início do ano;
- dividendo = lucro − retenção;
- o payout é a consequência, dividendo / lucro, e sai na decomposição.

Na perpetuidade, o lucro do primeiro ano depois do horizonte é o ROE da perpetuidade × PL do fim
do horizonte. A retenção é o crescimento da perpetuidade × esse PL, e o dividendo cresce à taxa da
perpetuidade. Com a Basileia no alvo, o payout que sai é 1 − crescimento / ROE, conferido em
22/11/2026 em caso sintético com exit 0.

**2. ROE por ano, a forma mais geral na entrada (D-105, D-116).** A engine recebe um ROE para cada
ano do horizonte mais um ROE para a perpetuidade. ROE único, duas fases e convergência são formas
de preencher essa lista. Os atalhos de preenchimento ficam para a tela, na Fase 7, e nenhum vem
pré-selecionado. O ROE de partida da convergência é digitado pelo usuário, com o ROE histórico só
exibido ao lado (RF-404). Nada do histórico entra no campo nem no caminho.

Convenção do ano zero da convergência: o ROE de partida é o ano zero e não é aplicado a ano nenhum.
Com partida P, ROE sustentável S e prazo N, o ROE do ano t, de 1 a N, é P + (S − P) × t / N. O
primeiro ano projetado já anda um passo, e o ano N chega em S. No exemplo de 22/11/2026, com P de
8%, S de 16% e N de 5, os anos ficam em 9,6%, 11,2%, 12,8%, 14,4% e 16%.

**3. Crescimento dos RWA e Basileia alvo por ano.** `crescimento_rwa` e `basileia_alvo` viram
listas, um valor por ano do horizonte, pelo critério da D-116. O atalho "um valor para todos os
anos" fica na tela. Com a Basileia por ano, a forma como um banco fora do alvo chega a ele, de uma
vez no ano 1 ou aos poucos, é escolha do usuário na entrada, e não convenção da engine.

**4. Base única por cálculo.** O usuário escolhe uma vez, no começo, se o cálculo é em termos
nominais ou reais, sem default. Todas as premissas de taxa e de crescimento seguem essa escolha, e
nenhuma premissa declara base própria. Os fatos exibidos ao lado dos campos aparecem rotulados com
a base de cada um, e o app não os converte, porque converter exige uma inflação, que é premissa. A
escolha não é flag de inclusão de efeito (RF-421): é a unidade do cálculo, com dois valores e sem
default. O alcance é o das engines de bancos; estender a base única às outras engines fica como
questão aberta.

**5. Validadores de coerência.**

- R-104, novo, nas duas engines: o crescimento da perpetuidade tem que ser menor que o custo de
  capital próprio. Se não for, bloqueia, porque a fórmula da perpetuidade não fecha.
- R-103 passa a valer para as duas engines, e não só para a `excess_return`. Com a base única, ele
  vale por construção e fica como guarda contra defeito da engine.
- O R-102 continua, também como guarda: com o dividendo derivado, ele vale por construção.
- Lista de ROE, de crescimento dos RWA ou de Basileia alvo com tamanho diferente do horizonte é
  erro de estrutura de entrada, recusado pela engine. Não é regra dura.

**6. Ações ex-tesouraria e composição da unit.** Input novo, sem o qual não existe valor por ação.
Subcampos: quantidade total, quantidade em tesouraria e composição da unit (quantas ações de cada
classe). O `onde_encontrar` é escrito pelo curador, depois de conferir em documento da companhia.

**O que muda na seção 9, playbook `bancos-b3`:**

- `inputs_obrigatorios`: entra `acoes_ex_tesouraria`, com os subcampos acima.
- `premissas_do_usuario`: entram `base_nominal_ou_real` (obrigatória, sem default, nominal ou
  real), `roe_projetado_por_ano` (lista, um valor por ano de `horizonte_anos`, obrigatória, sem
  default) e `crescimento_perpetuidade` (obrigatória, sem default); `roe_sustentavel_projetado`
  continua e passa a ser o ROE da perpetuidade; `crescimento_rwa` e `basileia_alvo` viram lista por
  ano; `custo_capital_proprio_ke` e `horizonte_anos` continuam iguais.
- `regras_duras`: entra o R-104, e o R-103 muda de alcance e de mensagem.
- Na seção 5.5, a tabela de validadores ganha o R-104.
- O RF-115 passa a gerar a indicação de fora da faixa só quando a faixa está nos mesmos termos,
  nominais ou reais, do cálculo.
- O schema de premissa em `packages/conhecimento` passa a aceitar premissa em forma de lista por
  ano e premissa de escolha entre valores nomeados. É vocabulário novo, e a lista fechada de chaves
  do RF-112 continua valendo.

**Quando entra.** A decisão é gravada agora. A mudança de playbook, de requisitos e de schema entra
junto com a sonda da `ddm`, como na D-086, tudo no mesmo commit, por causa do teste de equivalência
da D-065. `bancos-b3` vai de 0.4.0 para 0.5.0. O documento de requisitos vai para o patch seguinte
ao que estiver em vigor nesse momento, com o nome do arquivo mantido em v2.4 pela regra da D-078,
porque é mudança de input, de premissa e de regra dura dentro do escopo, como na D-084. Se o
curador entender que validador novo é alteração de escopo, a versão é 2.5.0 e o arquivo muda de
nome.

**Motivo.** O método da aula 3 calcula o crescimento por (1 − payout) × ROE com um payout escolhido
à mão, e é aí que o leigo erra de forma incoerente. Em banco, quem determina quanto fica retido é o
capital exigido para os RWA crescerem, e o playbook já tem `crescimento_rwa` e `basileia_alvo` como
premissas. Derivar o payout desses dois tira do usuário a premissa que ele mais erra e faz o R-102
valer por construção. A lista de ROE por ano resolve o caso de banco com resultado fraco hoje. No
exemplo sintético, um ROE único obriga a escolher entre 39,22 e 120,26, e separar o ROE da
perpetuidade explica a maior parte dessa distância. A base única faz a mistura de nominal com real
ser impossível na entrada, em vez de ser pega depois pelo R-103.

**Descartado.** Payout como campo livre: é a premissa incoerente que esta decisão tira. ROE único:
o dilema "ruim para sempre ou bom desde já". Convergência com o ROE histórico como partida
automática: o caminho nasceria de histórico do próprio ticker, o gatilho do RP-003. Uma engine
auxiliar para a derivação: a derivação vive dentro da engine e sai desagregada (RF-504). Base
declarada por premissa (rascunho de 22/11/2026): multiplica a escolha e deixa a mistura possível.
`crescimento_rwa` e `basileia_alvo` escalares: se depois precisarem variar, a estrutura de entrada
da engine muda, e a Basileia escalar obrigaria a engine a fixar como o banco fora do alvo chega a
ele.

**O que muda em decisões anteriores.** D-105: a ordem não muda; a `ddm` vem primeiro, já escrita com
este modelo, e a `excess_return` é a mesma conta reescrita. RF-419: o horizonte continua premissa do
usuário, sem default. R-103: muda de alcance, de uma engine para duas.

### D-115. Premissa calibrada no método do autor não entra no app, o que fica ao lado do campo da taxa, e o caderno de estudo em docs/pesquisa/

**Decisão.** Uma premissa que um autor usou entra no app como observação de faixa (D-112) só
quando não depende do método dele. Não depende quando o valor tem o mesmo significado numa engine
coerente, porque o autor o justifica por algo de fora do próprio cálculo: uma grandeza observável,
como o crescimento do PIB, ou o limite do que dá para prever, no horizonte. É calibrada no método
quando o significado do valor depende do que o método faz: a taxa que desconta o lucro inteiro, com
o crescimento tirado da parte retida e a perpetuidade trazida a 10% fixos, acompanha essas escolhas
e não se transporta. Premissa calibrada não entra como número: nem como observação datada, nem como
faixa, nem como preset distribuído. Entra o mecanismo, como heurística sem número. Na aula 3, a
taxa de desconto é calibrada e fica fora; horizonte e crescimento da perpetuidade não dependem do
método e podem virar observação, pelo critério de fontes da RF-113.

**Teste de decisão.** Levando este número para a engine do app, com o fluxo e a perpetuidade
coerentes, ele quer dizer o mesmo que dizia na conta do autor? Se sim, pode ser observação. Se não,
ou se não dá para saber, vai para o caderno.

**O que fica ao lado do campo de taxa de desconto** (`custo_capital_proprio_ke` em bancos,
`taxa_desconto` nos outros setores):

1. o juro do dia como fato, com data, fonte e termos (nominal ou real), pelo instrumento que a
   RF-407 define, enquanto a questão aberta sobre a Selic não for decidida;
2. os fatos da companhia que respondem à pergunta que o autor faz sobre segurança (em banco, por
   exemplo, retorno histórico e inadimplência), com procedência (RF-304), em lista fixa por setor,
   definida no playbook pelo curador, igual para toda companhia do setor e sempre na mesma ordem.
   Fato não localizado aparece como não localizado;
3. o mecanismo, sem número, como heurística ligada ao campo: o juro do país como custo de
   oportunidade mínimo; risco maior pede taxa maior; a taxa acompanha os juros do país. O texto é
   do curador, pelo fluxo da D-112, e não cita os fatos do item 2;
4. quando houver observações de autores com método coerente, a faixa do que eles cobraram acima do
   juro, com o número de fontes, pela RF-113.

O app nunca calcula nem exibe a taxa para a empresa, e não combina os fatos com o juro em número
nenhum (spread, prêmio implícito, média). Esse passo é do usuário, direto ou pela composição por
CAPM (RF-405 a RF-411). O usuário continua podendo digitar a taxa que quiser e salvá-la como preset
dele (RF-403).

**Caderno de estudo.** As premissas calibradas vão para um caderno de estudo em `docs/pesquisa/`,
versionado desde o primeiro dia (D-080), que nada no app carrega. Cada linha tem: empresa, taxa,
data, Selic da data, método usado, motivo dado pelo autor, aula e instante. Em seções próprias, o
caderno guarda também as observações que não dependem do método e esperam a segunda fonte da
RF-113, e as atribuições que um autor faz a terceiro, a conferir em texto do próprio terceiro, como
os 10 anos de horizonte que a aula 3 atribui a Buffett. Observação que chega a duas fontes vira
faixa pelo fluxo da D-112, a partir da fala de origem, e não por cópia do caderno.

Cinco regras para o caderno:

1. Não registra preço teto nem resultado de terceiro.
2. A Selic da data vem da série do Banco Central, com a fonte, e não da fala do autor.
3. Empresa, taxa, data e motivo são registro do que o autor disse.
4. A linha "método usado" é análise e é confirmada pelo curador.
5. O caderno mantém aula e instante. A D-108 tira a origem do conhecimento carregado pelo app. No
   caderno, a origem só serve para ouvir de novo e não toca cálculo nenhum.

Texto da ressalva de topo do caderno:

> Ressalva de leitura. Este caderno registra, para estudo, premissas que autores usaram em aulas e
> vídeos e que dependem do método de cada um, como a taxa de desconto, com a data, a Selic da data
> tirada da série do Banco Central, o método que o autor usou e o motivo que ele deu. Registra
> também, em seções próprias, observações que não dependem do método e esperam uma segunda fonte
> para virar faixa de referência (RF-113), e atribuições que autores fazem a terceiros, ainda não
> conferidas. Nada do que está aqui é carregado pelo app: o caderno não alimenta campo de premissa,
> faixa de referência, heurística nem teste. Observação que chega a duas fontes vira faixa pelo
> fluxo de proposta e aprovação (D-112), a partir da fala de origem, e não por cópia deste arquivo.
> Cada taxa foi escolhida dentro do método do autor. Quando esse método é diferente das engines do
> app, o mesmo número leva a outro resultado e não se transporta. Exemplo registrado: na aula 3 do
> Projeto Yield, o fluxo descontado é o lucro inteiro e a perpetuidade é trazida a valor presente a
> 10% fixos, e por isso a taxa de 20% usada para o Banco do Brasil não tem o mesmo efeito numa
> engine coerente. Este caderno não guarda preço teto nem resultado de terceiro (D-098). Não é fonte
> de verdade: a fonte é o documento de requisitos.

**Motivo.** A taxa ensina como olhar, e é isso que o curador quer preservar. Mas o número foi
calibrado num método com duas inflações e não se transporta. O mesmo 20% leva a 18,66 no modelo do
autor e a 7,96 ou 8,11 numa engine coerente. Guardar o prêmio sobre a Selic em vez da taxa tem o
mesmo defeito, porque o prêmio foi calibrado no mesmo método. Exibir a taxa ao lado do campo, mesmo
datada e com o método declarado, é valor de premissa associado a um ticker (RP-006), e o rótulo de
método não impede que o usuário leve o número para a engine coerente. O defeito de transporte é da
premissa calibrada, e não da origem em autor; por isso horizonte e crescimento da perpetuidade, que
não dependem do método, podem virar observação. O caderno guarda o resto num lugar que nenhuma
proteção precisa vigiar, porque nada o lê.

**Descartado.** Proibir toda faixa vinda de autor (rascunho de 22/11/2026): barra observação que
não depende do método sem proteger nada a mais. Observação datada com método declarado ao lado do
campo: requisito novo contra a RF-112 e a RF-113, com risco de RP-006 e benefício baixo. Série de
prêmios sobre a Selic: mesmo defeito de transporte; só sobrevive para material com método coerente,
que é o item 4 acima. Preset de terceiro distribuído pelo app: a premissa de um ticker vinda de
terceiro, sem lugar fora de `conhecimento/`, e com o rótulo "externo" sem autor por causa da D-108.

**O que muda em decisões anteriores.** D-080: passa a cobrir também o caderno. D-108: não muda para
o conhecimento; esta decisão registra que a origem pode ficar no caderno, que não é conhecimento.
D-097: a saída "preset de premissas" não se aplica a premissa calibrada no método do autor. Ideias
1 e 2 da seção 3 do handoff de 22/11/2026: ficam superadas para material de método incoerente; a
ideia 3 (o motivo entra como mecanismo, sem número) é esta decisão. AGENTS.md: o caderno entra na
lista de documentos, com a nota de que não tem cabeçalho dispensável e nenhum filtro roda sobre
ele.

### D-116. Premissa de projeção entra por ano do horizonte, em toda engine

**Decisão.** Toda premissa de projeção entra por período, um valor por ano do horizonte, e não como
valor único. É a generalização do critério da D-105. Premissa de projeção é a que descreve um ano
do caminho explícito: ROE, crescimento dos RWA, Basileia alvo, inflação por índice, e as que as
engines seguintes declararem. Ficam escalares as que não descrevem um ano: horizonte, termos
nominais ou reais, custo de capital próprio (a composição da RF-406 produz um número só, com Rf de
prazo compatível), crescimento e ROE da perpetuidade. Valor único, duas fases e convergência são
formas de preencher a lista, oferecidas como atalho na tela, aplicadas por ação explícita e nenhuma
pré-selecionada.

**Tela, na Fase 7.** Os anos passados aparecem como fato, com procedência, e os anos futuros como
campos vazios. Editar um ano recalcula as linhas derivadas dos anos seguintes (PL, lucro, capital
exigido, retenção, dividendo e payout), que são resultado da engine (RF-504), e nunca muda o valor
de outro campo de premissa. O snapshot registra o atalho usado, quando houver.

**Alcance.** Engines novas, a partir da `ddm`, já nascem assim. Na `fcff_por_concessao`,
`inflacao_projetada_por_indice` passa a ser por índice e por ano quando a engine for tocada de
novo: aceita e não implementada nela, como a D-086. Commodities decide a forma quando a
`fcff_normalizado` for escrita, depois da B1.

**Motivo.** Mudar a estrutura de entrada de uma engine custa mais que mudar um valor. A lista por
ano contém o valor único como caso particular e cobre o que ele não cobre: empresa em recuperação,
ano de investimento pesado, crescimento que muda no caminho. Na Basileia alvo, ela resolve pelo
desenho a pergunta de como o banco fora do alvo chega a ele, que é o caso que a D-105 manda
resolver pela forma mais geral.

**Descartado.** Valor único com atalho de duas fases dentro da engine: fixa na engine uma forma que
é escolha do usuário. Tudo por ano, inclusive custo de capital e perpetuidade: a perpetuidade é um
valor por definição, e o custo de capital por ano exigiria Rf por ano, sem pedido nem caso que o
justifique.

**O que muda em decisões anteriores.** D-105: o critério da forma mais geral passa de teste a regra
para premissa de projeção. D-114: ROE, crescimento dos RWA e Basileia alvo são os primeiros casos.
D-084: a inflação por índice ganha a dimensão de ano, aceita e não implementada.

**Requisitos.** O texto entra junto com a D-114, na sonda da `ddm`.

## Sessão de 24/11/2026

### D-117. O agente aponta candidatos em relatório separado, depois do inventário, e varre o resto do material por dicas justificáveis

**Decisão.** Revisa o conflito 1 da D-112 em dois pontos.

1. **Inventário.** Continua completo dentro do trecho que o curador indicar, em ordem, nos termos do
   autor e com instante (D-112). Fora do trecho, em vez da lista curta, o agente lista só os itens
   justificáveis, com instante. Entra: mecanismo; definição ou cálculo explicado; onde achar um
   dado; regra de bolso com o porquê dito. Não entra: propaganda, venda e recado; opinião sobre
   empresa específica; número solto, sem explicação; preço, cotação e recomendação. Sem trecho
   indicado, o material inteiro é o trecho e não há varredura.

2. **Candidatos.** Depois do inventário e da classificação pela forma de saída, o agente aponta os
   candidatos, os itens que ele acha que deveriam virar conhecimento, num relatório separado do
   inventário. Cada candidato traz a forma de saída, o motivo, a fala de origem e o instante.
   Candidato é sugestão: o inventário continua completo, o curador pode escolher item que não foi
   apontado, e quem decide é ele. A proposta de redação vem só depois de o curador aprovar os
   candidatos, com as cinco condições da D-112.

3. **Onde fica.** O relatório fica em `ingest/runs/<run>/relatorio-candidatos.md`, junto da
   transcrição, fora do versionamento (RF-119, D-042), porque traz fala literal e o repositório é
   público. A proposta de redação pode ir no mesmo arquivo. O formato fica aberto: o primeiro uso,
   na aula 3, serve de teste, e ajuste de formato não pede decisão nova.

**Motivo.** O curador quer que o agente diga o que acha que vale, para não avaliar cada item do
zero. O que levou à recusa de 20/11/2026 foi a seleção no lugar do inventário. Com o inventário
completo antes e os candidatos num relatório à parte, o curador continua vendo tudo. A varredura
fora do trecho existe porque material com ênfase num tema ensina mecanismos úteis em outros pontos,
e a lista curta os perderia.

**Descartado.** Candidatos no lugar do inventário: é a seleção enviesada recusada em 20/11/2026.
Relatório em `docs/`: versiona fala literal de terceiro em repositório público; sem a fala, o
curador teria que abrir a transcrição a cada item. Manter a lista curta fora do trecho: perde dica
justificável espalhada no material.

**O que muda em decisões anteriores.** D-112, conflito 1: "o agente não seleciona o que entra" passa
a "o agente aponta candidatos e não decide o que entra"; a lista curta fora do trecho dá lugar à
varredura do item 1. As cinco condições da D-112 e a RNF-013 não mudam: apontar candidato é
classificação, não redação. `CLAUDE.md`, seção 5.2: a exceção 2 passa a citar o relatório de
candidatos como passo anterior à proposta. Instruções do projeto: itens (a) e (c).

## Sessão de 25/11/2026

### D-118. O projeto tem três modos de uso, e o primeiro é o repositório clonado operado pelo agente do usuário

**Decisão.**

1. **Modos.** Repositório clonado: quem clona recebe engines, playbooks e conhecimento, e opera
   com o agente que já usa (Claude Code, Codex, Copilot ou equivalente), seguindo o guia do agente
   operador. É o primeiro modo a existir. App com servidor MCP (Fase 6, seção 5.10): o mesmo uso,
   sem clonar o repositório. Site: futuro e fora da v1 (seção 2.2); quando entrar, vira decisão
   própria, junto com a D-099.

2. **Papéis, iguais nos três modos.** A engine calcula. O agente lê o playbook e o conhecimento,
   lista o que falta, pede documentos ao usuário, extrai fato com procedência, pesquisa fato
   externo com fonte e data, explica mecanismo e chama o cálculo. O usuário escolhe toda premissa.
   As restrições RP-001 a RP-008 valem inteiras no modo repositório.

3. **Guia do agente operador.** Arquivo próprio, separado do `CLAUDE.md` e do `AGENTS.md`, que são
   do agente que desenvolve. Diz o fluxo, o que o agente pode e o que não pode fazer. No topo do
   `CLAUDE.md` e do `AGENTS.md` entra um aviso de porta de entrada: se a tarefa é calcular um
   valuation, e não desenvolver o projeto, o guia é o outro arquivo.

4. **Onde o agente operador escreve.** Só numa pasta de análise fora do versionamento. Não edita
   `packages/`, `conhecimento/`, `docs/`, `DECISOES.md` nem outro arquivo rastreado.

5. **Cálculo só pelo comando.** O agente chama um comando do projeto, que passa pelos validadores
   e roda a engine. Não calcula de cabeça, não escreve script próprio e não importa a engine
   direto.

6. **Denúncia de modificação.** O comando confere se há arquivo de `packages/` ou de
   `conhecimento/` alterado em relação ao commit. Se houver, o resultado sai marcado como
   calculado com código ou conhecimento modificado, com o hash do commit. O guia pede; a marcação
   denuncia.

**Quando entra.** A decisão é gravada agora. O guia, a porta de entrada, a pasta de análise, o
comando e a marcação entram junto com a sonda da ddm, porque antes dela não há engine de bancos
para calcular.

**Motivo.** O curador quer que o projeto seja usado para calcular antes do MCP e da tela, por quem
clonar o repositório. Sem guia, um agente que abre o repositório pela primeira vez só encontra a
constituição do agente que desenvolve, e pode mexer em engine, playbook ou conhecimento achando
que ajuda. O modo repositório não tem a trava estrutural do MCP (RF-1001): o guia é declaratório,
e a marcação de modificação devolve parte da proteção à estrutura, porque o resultado não consegue
esconder que o código mudou.

**Descartado.** Esperar a Fase 6 para usar: adia o uso sem ganho de proteção para quem já tem o
código. Só o guia, sem marcação: proteção só declaratória. Bloquear o cálculo quando houver
modificação: impediria o desenvolvimento e quem quer adaptar a própria cópia; marcar basta, porque
a cópia modificada é ferramenta de quem modificou, e não o produto.

**O que muda em decisões anteriores e nos requisitos.** Requisitos: seção 1.5, que passa a ter os
três modos; seção 3, linha do agente externo; RF-1001, que passa a dizer o canal de escrita do
modo repositório; RNF-007, que ganha o guia do agente operador. Nenhuma restrição permanente muda.
A D-003 não muda: o app continua sem LLM embutido. Nenhuma decisão anterior é revogada; esta
acrescenta o modo repositório ao que a seção 1.5 previa.
