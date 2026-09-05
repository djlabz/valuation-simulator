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
