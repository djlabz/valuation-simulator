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

> ## O estado CONFERIDA deixou de estar vazio em 31/08/2026, e continua sendo minoria
>
> **De 30/08 a 31/08/2026 este bloco dizia que nenhuma premissa estava em CONFERIDA.** Deixou
> de ser verdade com a conferência documental da TAESA, registrada em
> `docs/pesquisa/CONFERENCIA-taesa-2026-08.md`, que é a primeira vez que alguém abriu documento
> primário de companhia neste projeto.
>
> **O que mudou de estado:** a escala da RAP (B2) e o mês base de reajuste (dentro de B5). Duas.
> Todo o resto continua em CITADA E NÃO ABERTA, CONVENÇÃO ou ABERTA.
>
> **O alcance do que foi conferido é uma companhia e um trimestre.** CONFERIDA aqui significa
> "alguém abriu e leu um documento da TAESA", não "vale para o setor". Onde a distinção importa,
> a premissa marca. Generalizar sem abrir documento de outra companhia é o mesmo erro de tratar
> classe A como leitura, com uma camada a mais de aparência de rigor.
>
> **Por que o estado existe.** A consolidação declara de si mesma que a classe A significa
> "existe fonte primária citada com identificação suficiente para você abrir", e explicitamente
> **não** significa que alguém abriu. Sem um estado separado, "classe A" e "conferido" viram
> sinônimos, e a regra deste projeto é que explicação inferida sem verificação não entra em
> documento como fato.

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

**Estado:** **CONFERIDA** para a escala, contra documento da TAESA. A resposta é pior que as
duas hipóteses que a premissa previa.

**Fonte:** `CONFERENCIA-taesa-2026-08.md`, seção 1.1. Não é mais a consolidação.

**A resposta, e ela não é "milhares" nem "reais".** Duas abas do mesmo Excel publicam o mesmo
número em escalas diferentes **declarando a mesma unidade**: a aba `RAP Cycle` mostra `560,435`
sob cabeçalho `RAP (R$ MM)`, e a aba `Ciclo RAP detalhado` mostra `560435,514` sob `(R$ MM)`. O
cabeçalho mente numa das duas.

**O que resolve é a aritmética, não o cabeçalho.** O total da aba detalhada em milhares dá cerca
de R$ 4,56 bilhões, compatível com o que a apresentação declara. Em milhões daria R$ 4,5
trilhões, absurdo.

**Consequência para o desenho, e ela é diferente do que a premissa supunha.** Escala não é campo
de schema, é **propriedade do dado extraído**, com verificação por ordem de grandeza. Um campo
de schema descreve o que o documento diz, e o documento diz coisas diferentes em duas abas.

**A limitação da própria verificação, que precisa ficar dita.** Ordem de grandeza só decide
**contra uma referência externa**: "compatível com bilhões" pressupõe saber de antemão que a RAP
daquela companhia é bilionária. O playbook não tem nenhuma referência dessas hoje, e sem ela a
verificação não roda sozinha.

**O que continua aberto:** o anexo tabular da REH em si não foi aberto, e a consolidação registra
que as tabelas do PRORET aparecem em `R$ x 1000`. E isto é TAESA: outra companhia pode publicar
em outra escala.

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

**O dado é publicado, e agora se sabe onde (conferência, seção 1.3).** O DCR traz coluna
"Índice de Correção" por linha de transmissão, e a nota 7.4 lista **nominalmente** as concessões
de cada índice. Não é dedução, é tabela.

**E a diferença entre índices é material, medida.** Os reajustes do ciclo 2026-2027 foram de
1,95% e 4,72%, e os do ciclo anterior de 7,03% e 5,32%. Aplicar um número só para a carteira,
que é o que a engine fazia antes da D-084, erra na diferença entre esses pares.

**O que ficou faltando, e é o que ainda depende de pesquisa:** qual valor cada índice recebe. A
premissa nasce vazia e o cálculo bloqueia até ser preenchida, sem default e sem valor sugerido.

### B5. O reajuste incide a partir do primeiro período, sobre a RAP líquida

**Estado:** ABERTA.

**Estado do mês base: CONFERIDA para a TAESA.** O DCR publica coluna "Mês Base Reajuste" por
concessão, e **toda a carteira aparece como junho** (conferência, seção 1.2). Isso corrobora a
grade de ciclo de julho a junho da B3 por um segundo caminho documental. **Não generalizar sem
conferir outra companhia:** uma transmissora com mês base diferente quebraria o alinhamento
entre o mês base e a virada do ciclo, e nada foi aberto fora da TAESA.

**Estado do reajuste no primeiro período: INDÍCIO FORTE, não conferida.** Ver premissa N17, que
é onde o indício está registrado com o que falta para fechar.

**Fonte:** consolidação, seção 7, e é o item 2 da lista de perguntas sem resposta. Nenhuma das
quatro trata do primeiro período de projeção.

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

**Estado:** **RESPONDIDA PARA A APRESENTAÇÃO DA TAESA**, e não como enquadramento da obrigação
legal. Consolidação, seção 6, item 7 da lista de perguntas sem resposta, mais a conferência,
seção 1.4.

> **Divergência de rótulo, registrada de propósito.** O relatório de conferência rotula este
> ponto como "respondida, hipótese A". Aqui ele fica um grau abaixo, e o motivo está no parágrafo
> da circularidade. O que a ponte prova é **onde a TAESA apresenta** esses itens, não como a
> obrigação legal se enquadra.

A **Lei 9.991/2000, art. 4º** obriga a concessionária a **aplicar** no mínimo 1% da receita
operacional líquida em P&D, o que é obrigação de dispêndio. Duas pesquisas colocam o P&D dentro
da ponte entre RAP bruta e RAP líquida, e a citação literal **não sustenta** esse enquadramento.
Mesma dúvida para a TFSEE.

**O que a conferência mostrou.** A ponte de receita da TAESA traz a linha literal "Quota para
RGR, P&D, TFSEE, CDE e PROINFA" como **dedução entre bruta e líquida**, e não como despesa
operacional.

**A circularidade que a apresentação não resolve, e é por isso que o estado não é CONFERIDA.** Se
o P&D é deduzido para chegar à receita **líquida**, e a Lei 9.991/2000 manda aplicar 1% da receita
operacional **líquida**, então ou a quota daquela linha não é o dispêndio de que a lei fala, ou
existe uma ordem de cálculo que a apresentação não mostra. As duas leituras continuam de pé.

**A armadilha, e ela está armada e não disparada.** Se a engine subtrair P&D na ponte **e**
reconhecer a despesa no OPEX, conta duas vezes. Hoje não conta, porque a engine não tem OPEX,
por causa da B1. Quando a B1 fechar e o OPEX entrar, isto precisa ser resolvido antes. **É a
conclusão prática que sobrevive à circularidade**: qualquer que seja o enquadramento, esses
itens não podem aparecer duas vezes.

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

**Indício forte obtido em 31/08/2026, e ele não fecha a premissa.** A apresentação da TAESA
reconcilia o ciclo: RAP operacional do ciclo 2025-2026 de 3.974,7, mais reajuste inflacionário de
129,9, mais entrada em operação de 341,3, chegando a 4.445,9 no ciclo 2026-2027 (conferência,
seção 7). Isso indica que **a RAP publicada para um ciclo já vem reajustada para aquele ciclo**, e
portanto que a engine não deve reajustar de novo no primeiro período.

**Por que continua ABERTA mesmo assim.** A resposta depende de **qual número o extrator vai
pegar**, e a fonte do input mudou para a DCR nesta mesma etapa (D-085). Falta saber a que ciclo a
coluna de RAP da DCR se refere. Enquanto isso não estiver respondido, "a RAP já vem reajustada"
vale para o número da apresentação e não necessariamente para o número que a engine vai receber.

---

## Premissas novas vindas da conferência documental da TAESA

Registradas em 31/08/2026, a partir de `docs/pesquisa/CONFERENCIA-taesa-2026-08.md`. **Nenhuma
foi aplicada em código.**

**Alcance, e vale para as catorze:** uma companhia, um trimestre. O que está marcado como
confirmado vale para a TAESA e é indício forte para o setor, não prova setorial.

### N18. RAP não é um valor, são quatro eixos

**Estado:** CONFERIDA para a TAESA quanto à existência dos eixos.

O campo `rap_bruta_ciclo_atual` carrega um número, e para aquele número significar alguma coisa
faltam quatro respostas:

| Eixo | Por que não é dedutível do campo |
|---|---|
| **Escala** | duas abas do mesmo Excel, mesmo número, escalas diferentes, mesma unidade declarada (B2) |
| **Base tributária** | o Excel diz que toda RAP está adicionada de PIS/COFINS; o DCR sugere que só a Categoria III está (N29) |
| **Ciclo de referência** | a que ciclo o número se refere, que é o que a N17 precisa saber da DCR |
| **Ponto na ponte** | **este é novo** |

**O quarto eixo, que a conferência descobriu.** A ponte da TAESA deduz a **Parcela Variável antes**
do total da receita operacional bruta, e os tributos e encargos **depois**. Então existem pelo
menos três números que alguém pode chamar de RAP: a homologada na REH, a após parcela variável, e
a líquida de tributos e encargos. O campo não diz qual dos três.

### N19. A ponte completa de receita, e o que ela diz sobre a B1

**Estado:** CONFERIDA para a TAESA. Conferência, seção 1.5.

Transcrita do documento, na ordem em que aparece:

```
RECEITA OPERACIONAL BRUTA
  (−) Parcela variável
= TOTAL DA RECEITA OPERACIONAL BRUTA
  (−) PIS e COFINS
  (−) ISS
  (−) ICMS
  (−) Quota para RGR, P&D, TFSEE, CDE e PROINFA
  (−) Outras deduções
= RECEITA OPERACIONAL LÍQUIDA
  (−) Pessoal
  (−) Material
  (−) Serviços de terceiros
  (−) Outras despesas operacionais
  (−) Depreciação e amortização
= RESULTADO OPERACIONAL
```

**O que isso significa para a B1, e é uma correção de leitura.** Isto é insumo direto e indica que
**a lista de inputs do playbook está incompleta**, e não que a engine tenha simplificado
deliberadamente. A distinção importa: a primeira leitura é defeito de levantamento, a segunda
seria decisão de modelagem. É a primeira.

### N20. ISS e ICMS existem na ponte, e ninguém os mencionou

**Estado:** ABERTA.

Aparecem como deduções próprias na ponte, e **nenhuma das quatro pesquisas nem a consolidação os
citou**. ICMS sobre receita de transmissão é estranho o bastante para merecer conferência própria:
pode ser específico de alguma operação, pode ser recuperável, pode ser resíduo de outra atividade
da companhia. Nada disso foi verificado.

### N21. CDE e PROINFA existem na quota, e ela vem agregada

**Estado:** ABERTA.

Os dois estão na linha "Quota para RGR, P&D, TFSEE, CDE e PROINFA" e também não foram mencionados
por ninguém. E os cinco itens vêm em **linha única agregada**: um input que peça cada um
separadamente não tem correspondente no documento.

### N22. Existe concessão com cronograma de faixas, não com degrau

**Estado:** CONFERIDA para a TAESA. Conferência, seção 3.1, nota 7.4 do DCR.

A concessão SIT teve o recebimento da RAP dividido em quadrantes ao longo dos trinta anos:
**72,24% do 1º ao 5º ano, 100% do 6º ao 15º, e 53,61% do 16º ao 30º**.

**A primeira faixa é inferior a 100%.** `percentual_reducao` aplicado a partir de um ano de corte
não expressa isso de jeito nenhum: ele pressupõe que a RAP começa cheia e cai uma vez.

### N23. O degrau é propriedade do ativo, não da concessão

**Estado:** CONFERIDA para a TAESA. Conferência, seção 3.2.

A mesma nota afirma que, para uma lista nominal de concessões e **para os reforços realizados nas
linhas de transmissão após 2008**, não há decréscimo do faturamento no 16º ano, com recebimento
linear ao longo da concessão. Uma concessão antiga com reforço posterior tem **duas parcelas com
comportamentos diferentes dentro da mesma concessão**.

**A consequência que vai além do degrau.** A RAP de uma concessão **não é um número, é soma de
parcelas com origens e datas diferentes**, e a companhia já publica assim: o Excel traz colunas
distintas de RAP "Operacional" e "Em Construção" por concessão.

### N24. `concessoes` vira lista de parcelas de RAP

**Estado:** **DECISÃO ACEITA E NÃO IMPLEMENTADA.** Ver D-086.

As premissas N22 e N23 são o mesmo problema, e a solução resolve as duas juntas. Não foi
implementada porque depende do PRORET, que segue aberto, e de decisões do curador sobre a B1.

### N25. Degrau e reajuste são eventos datados diferentes dentro do mesmo ciclo

**Estado:** CONFERIDA para a TAESA quanto às datas, ABERTA quanto à ordem.

O DCR traz coluna "Ano de degrau da RAP" com **mês e ano por concessão**, como `jun/18` e
`mai/23`, e o mês base de reajuste de toda a carteira é junho. Então em pelo menos um caso o
**degrau é em maio e o reajuste em junho**, dentro do mesmo ciclo.

**A ordem entre os dois muda o valor daquele ciclo**, e nada declara qual vem primeiro.

**O que isto não é.** Não é uma quarta grade temporal. É **evento datado dentro da grade do
ciclo**, e o que falta é posição declarada, não grade nova. A distinção importa para não inflar o
modelo de `grades.ts` com algo que é atributo de dado.

### N26. A Parcela Variável tem teto contratual, e ele varia por concessão

**Estado:** CONFERIDA para a TAESA. Conferência, seção 3.3.

O desconto anual por indisponibilidade **não pode ultrapassar 12,5%** da receita anual de
operação, manutenção e construção do período contínuo de doze meses anteriores, com o caso
específico da **ECTE em 25%**. Nada no playbook representa isso.

**Magnitude de referência:** no 6M26 a Parcela Variável foi de 0,73% da RAP, contra 0,51% no 6M25.

### N27. A Parcela de Ajuste tem três componentes

**Estado:** CONFERIDA para a TAESA. Conferência, seção 5.

O Excel desdobra a Parcela de Ajuste em três colunas: **apuração e outros ajustes, retroativa, e
vida útil**. A consolidação apontava a existência dela como item não previsto (N6); a conferência
mostra que ela é **composta**, e que um campo único não a representa.

**Magnitude:** para a Novatrans, a parcela retroativa é de menos R$ 36,8 milhões contra RAP de
R$ 560,4 milhões.

### N28. Divergência entre duas fontes primárias da mesma companhia

**Estado:** **LACUNA DE REQUISITO**, não premissa de engine. Ver D-087.

**O caso documentado (conferência, seção 4.1).** O Excel traz nota de rodapé "Concessão de
Categoria II com ajuste pelo IPCA". O DCR marca as concessões de IPCA como "Concessão de
categoria III", e afirma que no ciclo 2025-2026 os reajustes foram de 7,0% para Categoria II e
5,3% para Categoria III. Como **7,03% é a variação do IGP-M e 5,32% a do IPCA**, o DCR é
internamente consistente e o Excel não. Um dos dois está errado.

**Por que é lacuna de requisito.** RF-123 cobre conflito entre fontes na **ingestão de
conhecimento**, resolvido pelo curador. Não cobre **dado extraído**: dois documentos primários da
mesma companhia dizendo coisas diferentes sobre o mesmo campo não tem mecanismo no projeto.

### N29. A base de PIS/COFINS pode variar dentro da mesma tabela

**Estado:** ABERTA. Conferência, seção 4.2.

O Excel afirma em rodapé que **todos** os valores de RAP estão adicionados de PIS/COFINS. O DCR,
na mesma tabela de características financeiras, traz nota dizendo que **a Categoria III** é
apresentada com adição de PIS/COFINS, o que sugere que as demais não são.

**Se confirmado, a mesma tabela mistura duas bases**, e o extrator não tem como saber por linha.
É o segundo eixo da N18.

### N30. A tabela de projeção de RAP do DCR não foi lida

**Estado:** ABERTA, e **não é ativo do projeto**.

O DCR traz tabela "RAP Esperada em moeda constante de 31/12/2025", por linha de transmissão, com
colunas de 2024 a 2030, sendo 2024 e 2025 realizados.

**A conferência NÃO conseguiu lê-la.** A seção 6 do relatório registra desalinhamento de colunas
na extração de texto, com valores implausíveis em pelo menos uma linha, e diz que a tabela **exige
leitura da página renderizada antes de qualquer uso**.

**Consequência.** Ela é **candidata** a caso de referência da Fase 8, e **não serve como alvo de
validação** enquanto ninguém a ler direito. Nenhum número dela entra em lugar nenhum.

> **Nota de procedência desta entrada.** A tarefa que pediu este registro descrevia a tabela com
> números específicos, incluindo quantas linhas reconciliam e valores por concessão. **Esses
> números não existem no relatório de conferência**, verificado por busca. O que está registrado
> acima é o que o relatório afirma. Registrar os números seria afirmar como fato uma leitura que o
> próprio documento diz não ter conseguido fazer.

### N31. A companhia projeta na unidade em que declara

**Estado:** CONFERIDA quanto à unidade da tabela, que é o que a seção 6 descreve com segurança.

A projeção de RAP do DCR é **por linha de transmissão**, mesma unidade da tabela de características
financeiras, **não por parcela**.

**O que isso responde e o que não responde.** Não resolve a questão de granularidade da N24: a
companhia projeta na mesma unidade em que declara, então o documento não oferece a decomposição
por parcela que a D-086 vai exigir. Quem preencher parcela vai ter que decompor à mão.
