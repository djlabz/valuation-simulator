# Premissas de interpretação da engine `fcff_por_concessao`

> **O que este arquivo é agora.** Ele nasceu como lista de perguntas que a engine foi obrigada
> a responder sozinha para existir (D-075). Depois da pesquisa consolidada em
> `docs/pesquisa/consolidacao-valuation-b3.md`, ele vira **registro de estado**: cada premissa
> diz em que pé está, com que fonte, e o que faltou.
>
> **Aponta, não copia.** O conteúdo da pesquisa mora na consolidação. Aqui só entra a
> referência à seção dela. Duas cópias divergem e ninguém sabe qual vale.

## Os quatro estados

| Estado | Significa |
|---|---|
| **CONFERIDA** | alguém abriu o documento primário e leu |
| **CITADA E NÃO ABERTA** | existe identificação suficiente para abrir, e ninguém abriu |
| **CONVENÇÃO** | convergência de prática, sem norma que a defina |
| **ABERTA** | sem resposta |

> ## Nenhuma das dezesseis premissas está no estado CONFERIDA.
>
> Nenhuma. Zero. A consolidação declara isso de si mesma na seção "Como ler a classificação":
> a classe A dela significa "existe fonte primária citada com identificação suficiente para
> você abrir", e explicitamente **não** significa que alguém abriu. Nenhuma das quatro
> pesquisas comprovou ter aberto o anexo tabular de uma REH, e uma delas registra bloqueio de
> acesso ao `cedoc` da ANEEL.
>
> O estado CONFERIDA existe neste arquivo justamente para ficar vazio de forma visível. Sem
> ele, "classe A" e "conferido" viram sinônimos em três meses, e a regra deste projeto é que
> explicação inferida sem verificação não entra em documento como fato. Fonte citada e fonte
> lida são coisas diferentes.

---

## BLOQUEANTE

### B1. O fluxo livre é a RAP líquida atribuível, e não um FCFF completo

**Estado:** CONVENÇÃO, e a convenção da engine **contraria** a convergência das pesquisas.

**Fonte:** consolidação, seção 3. Veredito: subtrai-se OPEX caixa, IRPJ e CSLL, CAPEX de
manutenção e variação de capital de giro. Classe **B**, porque nenhuma norma define fluxo de
caixa livre de uma companhia: isso é metodologia, não regra.

**Onde está materializada:** `fcff-por-concessao.ts`, no fluxo atribuível que sai direto da RAP
após redução vezes a participação.

**O que ficou faltando:** a seção 3 registra um item de fonte única não confirmada, que é o
PRORET Submódulo 9.8 já deduzir reinvestimentos ao calcular a RAP. Se for verdade, uma
modelagem que parta da RAP regulatória e subtraia CAPEX de novo conta duas vezes. As três
pesquisas citam submódulos diferentes (9.8, 9.1, 2.4) para funções adjacentes. **Isto é o item
4 da lista de perguntas sem resposta da consolidação, e continua sendo o que trava
`fcff_normalizado`.**

### B2. `rap_bruta_ciclo_atual` é valor anual, em reais correntes, do ciclo vigente

**Estado:** CITADA E NÃO ABERTA para "anual, em reais". **ABERTA** para a escala.

**Fonte:** consolidação, seção 1. Classe **A** para anual em R$, com transcrição de cabeçalho
de coluna. Classe **B com risco alto** para "reais inteiros e não milhares".

**O que ficou faltando, e é o item 1 da lista de perguntas sem resposta:** ninguém abriu o
anexo tabular da REH. A transcrição do cabeçalho vem com URL de notícia, não do anexo. E a
consolidação registra que as tabelas auxiliares do PRORET aparecem em `R$ x 1000`, ou seja,
escala diferente da RAP homologada no mesmo universo documental. Erro possível de 1000x, e
silencioso. **É a primeira coisa a conferir com documento na tela.**

### B3. O período de projeção é anual e ancorado na `data_base`

**Estado:** RESPONDIDA, CITADA E NÃO ABERTA, e a premissa era **falsa**. Corrigida (D-081).

**Fonte:** consolidação, seção 2. Classe **A**: o ciclo tarifário vai de 1º de julho a 30 de
junho, não é o ano civil. Três pesquisas convergem com REH identificada; a `qwen.md` diverge
afirmando ciclo de quatro anos, e a divergência dela é ruído pela tabela de confiabilidade.

**O que mudou:** a projeção passou a correr na grade do ciclo tarifário, e as três grades
temporais viraram tipos distintos em `packages/dominio/src/grades.ts`. Ver D-081 e as premissas
novas N1 a N4, que são o que sobrou em aberto depois da correção.

### B4. Qual valor de inflação cada índice recebe

**Estado:** ABERTA quanto ao **valor**. A parte estrutural foi **corrigida** pela D-084.

**Fonte:** consolidação, seção 7. Veredito: **sem resposta**, classe C por omissão. O que
sobrevive: contratos antigos por IGP-M e os celebrados após novembro de 2006 por IPCA, com
fonte secundária, e a instrução explícita de tratar o índice como parâmetro **por contrato**,
nunca como constante do setor.

**O que era e foi corrigido (D-084).** `indice_reajuste` era declarado por concessão, validado
como enum, e **nunca lido no cálculo**: a projeção usava um `inflacao_projetada_longo_prazo`
único para a carteira, que é a constante do setor que a consolidação manda não usar. A premissa
virou `inflacao_projetada_por_indice`, um valor por índice, e cada concessão reajusta pelo índice
dela. Isso não é resposta de pesquisa, é a engine parar de aplicar um número único a concessões
com índices diferentes.

**O que ficou faltando, e é o que ainda depende de pesquisa:** qual valor cada índice recebe, e
ler a cláusula de reajuste de um contrato de cada safra para confirmar o índice por contrato. A
premissa nasce vazia e o cálculo bloqueia até ser preenchida, sem default e sem valor sugerido.

### B5. O reajuste incide a partir do primeiro período, sobre a RAP líquida

**Estado:** ABERTA.

**Fonte:** consolidação, seção 7, e é o item 2 da lista de perguntas sem resposta. Nenhuma das
quatro trata do primeiro período de projeção. O que existe: a data de referência do reajuste é
1º de julho, que a grade nova já usa como virada.

**O que ficou faltando:** a data de aniversário, o índice e o tratamento pro rata, por safra de
contrato. **Ver também a premissa N17**, que é a assimetria que a grade nova tornou visível e
que não se resolve sem responder esta. A consolidação registra uma proposta de compor o ano civil ponderando meio ciclo com
meio ciclo, e a classifica como convenção de harmonização temporal, plausível e sem fonte. Não
foi adotada, justamente por isso.

### B6. `deducoes_sobre_rap` é fração da RAP bruta, igual para todas e constante no tempo

**Estado:** CITADA E NÃO ABERTA para a **composição**. ABERTA para a **fração**.

**Fonte:** consolidação, seção 6. Classe **A** para a existência e base legal de P&D
(Lei 9.991/2000, art. 4º), TFSEE (Lei 9.427/1996) e RGR (Lei 5.655/1971). Classe **C** para as
alíquotas efetivas de PIS/COFINS.

**O que ficou faltando:** qual regime tributário se aplica a qual concessão, que é justamente o
que muda a alíquota de 3,65% para cerca de 9,25%. E se a RGR ainda incide. São os itens 5 e 6
da lista de perguntas sem resposta. Ver também a premissa nova N15, que é uma contradição
interna que nenhuma pesquisa resolveu.

### B7. `percentual_participacao` é fração da RAP

**Estado:** **CONVENÇÃO DECLARADA QUE CONTRARIA A REGRA FORMAL.** Isto não é ajuste de estado,
é mudança de natureza da premissa, e está registrado em D-082.

**Fonte:** consolidação, seção 5. Classe **A** para a regra contábil.

**A regra formal, e ela diz o contrário do que a engine faz.** A participação **não incide sobre
a RAP**. A RAP é receita integral da SPE. A participação da holding incide sobre o patrimônio e
o resultado da SPE, reconhecidos por **equivalência patrimonial (CPC 18/R2)** quando não há
consolidação integral. O caixa que chega à investidora é o **dividendo efetivamente pago** pela
SPE, sujeito a covenants e índices de cobertura dos contratos de financiamento da própria SPE.

**O que a engine faz:** aplica o percentual sobre a RAP, e há fixture com participação de 25%
exercitando esse caminho. **O código não foi alterado**, porque a consolidação registra que
ponderar a RAP pelo percentual é defensável **como convenção declarada**, e a alternativa
exigiria modelar dívida da SPE, covenants e política de distribuição, que não têm campo no
playbook.

**A consequência, que não é pequena.** `%` × RAP e `%` × dividendo distribuível não são a mesma
grandeza e podem divergir muito, porque entre as duas estão a dívida da SPE, os covenants e a
política de distribuição. Uma holding com participação minoritária em SPEs alavancadas pode ter
`%` × RAP muito acima do que ela recebe de fato.

**Interação com a D-078, e a ordem importa.** A D-078 registrou que `percentual_participacao`
não tem checagem de faixa, na mesma família do erro de escala que ela fechou em
`percentual_reducao`. **O problema aqui é anterior à faixa.** Faixa garante que o número está
entre 0 e 1; ela não garante que o número mede a coisa certa. Se o campo mede fração da RAP
quando a grandeza econômica é fração do dividendo, uma faixa correta valida um número que
responde à pergunta errada.

**O que a engine é obrigada a comunicar quando tiver interface:** que este número é convenção
declarada e não regra. Enquanto não há interface, o registro é aqui.

### B8. A redução contratual: base e escopo

**Estado:** CITADA E NÃO ABERTA para a **base**, e a engine **conforma**, verificado por teste.
**ABERTA** para o **escopo por safra**.

**Fonte:** consolidação, seção 4, classe **A**, que a própria consolidação chama de a mais bem
sustentada das dez, com duas transcrições literais independentes e idênticas da subcláusula.

**A base, conferida contra o código.** O veredito é que a redução incide sobre a RAP **já
reajustada** do 15º ano, não sobre o valor nominal da licitação, e que o valor reduzido continua
sujeito a reajuste. A engine multiplica o fator remanescente pela RAP reajustada do ciclo, e o
valor reduzido segue sendo reajustado nos ciclos seguintes. As duas formulações coincidem porque
o reajuste é geométrico: `0,5 × RAP₁₅ × (1+i)^k` é o mesmo que `0,5 × RAPₖ`. Há teste com
inflação diferente de zero afirmando as duas coisas, e ele distingue a leitura correta da que
usaria o valor nominal.

**O escopo, que continua aberto.** É o item 9 da lista de perguntas sem resposta. As pesquisas
divergem sobre a safra afetada, e uma delas lista um contrato de 1997 entre os "licitados entre
1999 e 2006". **Verificado agora:** a engine não codifica safra nenhuma, nem data fixa. O
gatilho é a presença de `reducao_contratual` naquela concessão, que é flag por contrato, que é o
que a consolidação exige. O que resta ao curador é preencher por contrato.

**O que a estrutura ainda não comporta:** redução escalonada em mais de um degrau. O segundo
degrau some em silêncio.

### B9. A indenização de RAB é descontada no período da concessão mais longa

**Estado:** ABERTA, e agravada pela pesquisa.

**Fonte:** consolidação, seção 8. Veredito: **sem resposta confiável**, classe C por omissão,
com contradição relevante entre pesquisas. É o item 3 da lista de perguntas sem resposta.

**O que a pesquisa acrescentou, e piora o quadro:** os contratos dos leilões a partir de 2020
depreciam os investimentos dentro do prazo de 30 anos, o que esvazia a indenização terminal
neles, enquanto outra pesquisa recomenda incluir a indenização no último período para todos. A
engine tem `indenizacao_rab_estimada` como valor único de carteira. Ver premissa nova N8.

**O que ficou faltando:** qual prazo de amortização regulatória vale por safra, se o prazo
relevante é o da concessão ou o da vida regulatória do ativo, e como se calcula o valor.

### B10. Moeda fixa em BRL

**Estado:** CONVENÇÃO, e é o próprio playbook que a declara, com `mercado: B3`.

**Fonte:** nenhuma da consolidação. Não é pergunta de metodologia setorial.

**Se for falsa:** não produz número errado, produz recusa de compilação, porque o tipo nominal
barra a mistura. Item de menor risco da categoria.

---

## ROBUSTEZ

### R1. Nome de concessão é único dentro da carteira

**Estado:** CONVENÇÃO, e é decisão de implementação, não pergunta sobre o mundo. Nome repetido
tornaria a desagregação ambígua, então a engine recusa com erro explícito.

### R2. `data_base` é anterior aos vencimentos que interessam

**Estado:** CONVENÇÃO. Vencimento anterior à data base produz zero ciclo e valor presente zero,
com a concessão aparecendo no resultado com lista de períodos vazia. Carteira com concessão já
vencida é situação real, não erro de digitação.

### R3. Datas são texto AAAA-MM-DD e a aritmética preserva mês e dia

**Estado:** **DISSOLVIDA** pela D-081, e não respondida.

A preocupação era o 29 de fevereiro em `somarAnos`. Com a projeção na grade do ciclo tarifário,
todo limite de período é 1º de julho ou 30 de junho, datas fixas que não dependem de somar anos
a uma data arbitrária. As duas funções que carregavam o problema saíram de `datas.ts`.

### R4. `horizonte_maximo_ciclos` não existe no playbook de transmissão

**Estado:** CONVENÇÃO, e o campo mudou de nome com a D-081, de `horizonte_maximo_anos` para
`horizonte_maximo_ciclos`, porque "anos" deixava a grade implícita. O campo continua sendo
escolha da engine, para RF-420 ter onde morder, e não vem do playbook.

### R5. A engine não implementa `termos_de_renovacao`

**Estado:** ABERTA quanto à renovação, e a **recusa agora tem teste** (D-084). O campo existe nas
premissas do playbook, o schema de entrada da engine não o tem, e `strictObject` recusa quem
mandar com `unrecognized_keys`. Até 30/08/2026 isso era afirmação sem exercício, achada na
inspeção da própria etapa que corrigiu o defeito irmão: `indice_reajuste` era aceito e ignorado,
esta recusa era alegada e não provada. A interação de renovação com RF-420
continua sem decisão.

---

## Premissas novas da grade temporal, criadas pela D-081

A correção do ciclo tarifário resolveu a B3 e abriu estas quatro. Todas são consequência de a
grade certa não coincidir com a data base nem com o vencimento contratual.

### N1. O trecho entre a data base e a virada do ciclo não é projetado

**Estado:** CONVENÇÃO DECLARADA.

A projeção abre no primeiro ciclo que começa em ou depois da `data_base`. Data base que não caia
em 1º de julho deixa de fora o pedaço até 30 de junho seguinte. Incluir o ciclo inteiro traria
caixa já passado; ratear exigiria a convenção de duodécimo, que a consolidação classifica como
plausível e sem fonte (seção 7). O trecho descartado sai no resultado em
`trecho_inicial_nao_projetado`, para a omissão ser auditável em vez de invisível.

**Consequência:** subestima, em até um ciclo de fluxo.

### N2. Vencimento no meio de um ciclo descarta aquele ciclo inteiro

**Estado:** CONVENÇÃO DECLARADA, e a pergunta é nova, não estava em lugar nenhum.

A data de vencimento é data de contrato e não tem obrigação de coincidir com 30 de junho. Um
ciclo só conta se fecha em ou antes do vencimento. O trecho final descartado sai em
`trecho_final_nao_projetado` por concessão.

**O que ficou faltando:** a consolidação não trata de como a RAP é apurada num ciclo em que a
concessão vence no meio. Precisa de cláusula de encerramento de contrato.

### N3. O desconto usa a posição do ciclo, e ignora a defasagem da data base

**Estado:** CONVENÇÃO DECLARADA.

O fator de desconto do período `t` é `1/(1+Ke)^t`, com `t` sendo a posição do ciclo. Entre a data
base e o fim do primeiro ciclo pode haver mais de um ano, e essa defasagem não entra no
expoente. A alternativa, descontar por tempo decorrido de verdade, exige convenção de contagem
de dias, que também não tem fonte.

### N4. A revisão tarifária periódica não é modelada

**Estado:** ABERTA.

A consolidação, seção 2, separa dois relógios: reajuste anual em 1º de julho, e revisão
tarifária periódica a cada quatro ou cinco anos conforme contrato. A engine modela o primeiro e
não o segundo. `grades.ts` declara a ausência em vez de deixá-la implícita.

---

## Premissas novas vindas da seção de contradições da consolidação

Esta seção registra os dez itens que a consolidação levanta e que colidem com premissas do
projeto, mais duas questões que ela deixa explicitamente em aberto. **Nenhum item aqui foi
aplicado em código.** Os de bancos e commodities entram agora porque aquelas engines ainda não
existem, e registrar custa uma linha enquanto refazer custa uma engine.

### N5. A receita contábil de uma transmissora não é a RAP

**Estado:** CITADA E NÃO ABERTA. Consolidação, contradição 1.

Sob IFRIC 12, ICPC 01 e CPC 47 a receita reconhecida é movimentação de ativo de contrato ou
financeiro, com margem de construção, e a depreciação física não aparece na DRE. **Consequência:
RAP não se valida contra DRE e não se lê de ITR nem de DFP.** A consolidação aponta uma fonte
que o playbook não conhece, as **Demonstrações Contábeis Regulatórias (DCR)**.

**Conferido no playbook, e reportado sem corrigir.** O `onde_encontrar` de `concessoes` lista
"3. Release de resultados, anexo de portfólio de concessões", e o de `deducoes_sobre_rap` lista
"Release de resultados, conciliação de receita regulatória". Os dois apontam para o release, que
é o documento cuja receita não é a RAP. O item 1, Resolução Homologatória, é o que de fato
contém a RAP. A correção do playbook não estava no escopo desta etapa.

### N6. RAP homologada não é RAP faturada

**Estado:** CITADA E NÃO ABERTA. Consolidação, contradição 2.

Existe **Parcela de Ajuste**, que compensa excessos e déficits de arrecadação do ciclo anterior e
vem em anexo próprio da REH, e **Parcela Variável**, que é evento não linear e não percentual
médio. **O playbook não tem campo para nenhuma das duas**, e a engine projeta a RAP homologada
como se fosse a faturada.

### N7. Duodécimos são a terceira grade temporal

**Estado:** CITADA E NÃO ABERTA, e parcialmente endereçada. Consolidação, contradição 3.

O faturamento é mensal, um doze avos. Confundir valor anual homologado com receita mensal de
competência é erro de 12x. A D-081 criou a grade `CompetenciaMensal` como tipo distinto, e
**nenhuma aritmética de dinheiro passa por ela**, porque nada na engine consome valor mensal
enquanto a B1 não fechar. O risco de 12x é estrutural e fica registrado.

### N8. A indenização terminal depende da safra do contrato

**Estado:** ABERTA. Consolidação, contradição 4, e seção 8.

Contratos pós-2020 depreciam dentro dos 30 anos, o que esvazia a indenização terminal neles. A
engine tem `indenizacao_rab_estimada` como **valor único de carteira**, descontado no prazo da
concessão mais longa. **Registro que ela pode precisar ser por concessão**, e não por carteira,
porque uma indenização aplicada a todos os contratos infla o valuation dos mais novos.

### N9. Bancos: PDD não se soma de volta ao lucro

**Estado:** CITADA E NÃO ABERTA. Consolidação, contradição 5.

O regime aplicável é a **Res. CMN 4.966/2021**, de perda esperada. A pesquisa descartada como
voto instruía somar a provisão de volta ao lucro líquido, e as outras três não fazem isso.
Premissa nessa direção produz lucro distribuível inflado. Nenhuma engine de bancos existe ainda,
e este registro existe para ela não nascer assim.

### N10. Bancos: o teto de distribuição não depende só de lucro e RWA

**Estado:** CITADA E NÃO ABERTA. Consolidação, contradição 6.

A emissão de instrumentos elegíveis a Capital Complementar ou Nível II (**Res. CMN 5.007/2022**)
alivia a necessidade de retenção. Ou seja, lucro líquido menos ΔPR requerido é **piso de
necessidade**, não teto absoluto de distribuição.

### N11. Bancos: a expansão de capital se aplica sobre RWA médio

**Estado:** CITADA E NÃO ABERTA. Consolidação, contradição 7.

A expansão incide sobre **RWA médio do período**, não sobre estoque de fechamento. E mudança de
ponderação regulatória altera a exigência de capital sem a carteira mudar de tamanho.

### N12. Bancos: a retenção regulatória tem norma, mas o teto de payout é derivado

**Estado:** CITADA E NÃO ABERTA, com ressalva que muda o desenho de R-102. Consolidação,
seção 10.

Classe **A** com artigo e parágrafo: **Res. CMN 4.958/2021**, mínimos de PR 8%, Nível I 6% e
Capital Principal 4,5%; e as faixas de retenção do art. 9º, §4º, que retêm 100%, 80%, 60% e 40%
conforme a distância do ACP exigido. Isto dá substância à regra dura R-102.

**A ressalva, e ela é a parte que importa para o desenho.** A norma define **pisos e travas**. O
teto de payout é **derivado**, não normativo. Se a engine tratar o teto como regra dura, ela
trata derivação como norma, que é o oposto do que a R-102 deveria fazer.

### N13. Commodities: descomissionamento no fim da vida

**Estado:** CITADA E NÃO ABERTA. Consolidação, contradição 8.

Ao esgotar a reserva há saída de caixa de abandono e recuperação ambiental (**ABEX**). Modelo
que encerra a projeção na exaustão sem esse desembolso superestima o valor, e o erro aparece
exatamente no último período.

### N14. Commodities: paridade comercial, unidade física e comparabilidade de custo caixa

**Estado:** CITADA E NÃO ABERTA. Consolidação, contradições 9 e 10.

Custo em FOB contra preço de referência em CFR, tonelada úmida contra seca, BOE misturando gás
com óleo, ADMT em celulose, e o C1 frequentemente reportado líquido de créditos de subproduto, o
que quebra a comparação até dentro do mesmo subtipo. A consolidação registra que **isto não é
armadilha de dado, é armadilha de premissa**: se a engine aceita preço e custo caixa como campos
livres, ela aceita combinações que produzem margem inexistente.

**Registrado e não decidido.** A consolidação sugere que a não comparabilidade de custo caixa
provavelmente deveria ser **restrição codificada da engine, e não nota**. Essa decisão não foi
tomada aqui.

### N15. P&D e TFSEE: dedução na ponte ou despesa, e o risco de contagem dupla

**Estado:** ABERTA, e é contradição interna que nenhuma pesquisa resolveu. Consolidação,
seção 6, e item 7 da lista de perguntas sem resposta.

A **Lei 9.991/2000, art. 4º** obriga a concessionária a **aplicar** no mínimo 1% da receita
operacional líquida em P&D, o que é obrigação de dispêndio. Duas pesquisas colocam o P&D dentro
da ponte entre RAP bruta e RAP líquida, e a citação literal **não sustenta** esse enquadramento.
Mesma dúvida para a TFSEE.

**A armadilha, e ela está armada e não disparada.** Se a engine subtrair P&D na ponte **e**
reconhecer a despesa no OPEX, conta duas vezes. Hoje não conta, porque a engine não tem OPEX,
por causa da B1. Quando a B1 fechar e o OPEX entrar, isto precisa ser resolvido antes.

### N16. Commodities: R/P por companhia e prazo de exaustão por ativo não são a mesma grandeza

**Estado:** CITADA E NÃO ABERTA. Consolidação, seção 9, classe **A**.

A vida útil relevante é **por ativo produtivo**, e a mudança de `vida_util_reserva` para
subcampo da lista `ativos_produtivos` (D-072) estava certa. **Nada a corrigir.**

**A nuance que sobra:** o R/P divulgado por companhia e o prazo de exaustão por ativo não são
intercambiáveis, e sob critério **ANP/SPE** é possível considerar volumes além do prazo
contratual de concessão, o que **não vale sob critério SEC**. O campo hoje aceita duas grandezas
diferentes no mesmo slot, sem declarar o critério.

### N17. A RAP informada é reajustada uma vez antes do primeiro ciclo, inclusive quando o primeiro ciclo é o dela

**Estado:** ABERTA, e é uma assimetria **criada pela D-081**, achada na inspeção adversarial
desta etapa.

**O que acontece.** O campo se chama `rap_bruta_ciclo_atual`, ou seja, ele declara a que ciclo
o número se refere: o ciclo que contém a `data_base`. A engine aplica um reajuste antes de
gravar o período 1, sempre. O resultado depende de onde a data base cai:

| `data_base` | Ciclo da RAP informada | Primeiro ciclo projetado | Reajustes entre os dois | Reajustes aplicados |
|---|---|---|---|---|
| 2026-01-01 | 2025-2026 | 2026-2027 | 1 | 1 |
| 2026-07-01 | 2026-2027 | 2026-2027 | 0 | 1 |

**Verificado em runtime nesta etapa.** Com `data_base` 2026-07-01, RAP de 1000, sem deduções e
inflação de 10%, o período 1 é o ciclo 2026-2027 e usa RAP de 1100. Ou seja, a RAP declarada
como sendo daquele ciclo é reajustada antes de ser usada naquele mesmo ciclo.

**Por que não foi corrigida aqui.** A correção óbvia, aplicar tantos reajustes quantas viradas
existirem entre o ciclo da RAP e o ciclo projetado, é indistinguível de responder a **B5**, que
pergunta se a RAP informada já contém o reajuste do primeiro período. Escolher entre as duas é
decidir a B5 por conta própria, e a B5 depende de cláusula de contrato que ninguém abriu.

**Antes da D-081 isto não existia como pergunta**, porque não havia noção de a qual ciclo a RAP
pertencia: o período era um ano contado da data base, e a assimetria não tinha onde aparecer.
Tornar a grade explícita é o que tornou a inconsistência visível, que é o efeito pretendido.

**Consequência:** superestima em um fator de `(1 + inflação)` quando a data base cai em 1º de
julho, e não superestima nos outros dias. O erro depende da data base, não dos dados da
companhia, que é a pior categoria: some quando alguém muda a data e reaparece depois.
