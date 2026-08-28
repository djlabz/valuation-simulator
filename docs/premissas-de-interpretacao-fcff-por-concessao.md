# Premissas de interpretação da engine `fcff_por_concessao`

> **Para que este arquivo existe.** A engine foi escrita como sonda deliberada (D-075). Ela
> é o primeiro código do projeto que fica na fronteira entre input e cálculo, e escrever o
> loop que alinha períodos é o que gera as perguntas boas sobre a natureza dos números.
>
> **Nada aqui foi pesquisado.** Cada item é uma escolha de interpretação que a engine foi
> obrigada a fazer para o código existir, declarada em vez de resolvida. Resposta inferida
> por agente é o que a RNF-013 proíbe, e a pesquisa contra fonte primária é trabalho do
> curador.
>
> **Contexto que dá o peso.** O conhecimento que sobreviveu ao expurgo passou por critério
> de natureza, não de veracidade: "isto é imutável" e "isto é verdade" são perguntas
> diferentes, e só a primeira foi respondida. Os inputs e os `onde_encontrar` do playbook
> foram escritos numa conversa de planejamento e nunca conferidos contra documento. Se
> `rap_bruta_ciclo_atual` estiver conceitualmente errado, a engine calcula certo sobre número
> errado, com snapshot, com desagregação, e sem nada falhar.

## Como ler as duas categorias

**BLOQUEANTE:** precisa ser verdade para a engine calcular certo. Se a resposta for outra, o
resultado está errado e a engine muda.

**ROBUSTEZ:** assumido por conveniência de implementação. Se for falso, produz erro visível
ou caso não tratado, não número errado silencioso.

---

## BLOQUEANTE

### B1. O fluxo livre é a RAP líquida atribuível, e não um FCFF completo

**O que a engine assume:** o fluxo de caixa livre de cada período é a RAP líquida reajustada,
multiplicada pela participação, sem subtrair imposto de renda, capex, variação de capital de
giro nem somar depreciação.

**Onde está materializada:** `packages/dominio/src/engines/fcff-por-concessao.ts:241-243`,
onde `fluxo_atribuivel` sai direto de `rap_apos_reducao` vezes `percentual_participacao`.

**Por que a engine assumiu isso:** os `inputs_obrigatorios` do playbook são `concessoes` e
`deducoes_sobre_rap`, e mais nada. Não existe campo para alíquota efetiva, capex, capital de
giro ou depreciação. Ou o modelo pretende essa simplificação, ou a lista de inputs está
incompleta.

**Se for falsa:** o resultado superestima, e por muito. Uma engine chamada `fcff` que não
subtrai imposto nem capex devolve algo mais próximo de receita líquida descontada que de
fluxo livre. **Este é o item de maior consequência da lista inteira.**

**Alternativa que existe e não foi escolhida:** acrescentar inputs de imposto, capex de
manutenção e capital de giro ao playbook, e a engine calcular FCFF de verdade.

**Fonte que responderia:** não sei. É pergunta de metodologia do setor, não de documento de
companhia, e provavelmente se responde no material que o curador vai transcrever na Etapa do
Conhecimento.

### B2. `rap_bruta_ciclo_atual` é valor anual, em reais correntes, do ciclo vigente

**O que a engine assume:** o número é anual, não mensal nem do ciclo inteiro somado; está em
reais e não em milhares; e se refere ao ciclo tarifário vigente na `data_base`.

**Onde está materializada:** `fcff-por-concessao.ts:205-206`, onde a RAP entra como `Money`
e é multiplicada pela fração líquida sem nenhuma conversão de escala ou de periodicidade.

**Se for falsa:** erro multiplicativo direto no resultado inteiro. Se for mensal, o
resultado fica doze vezes menor. Se for em milhares, mil vezes menor.

**Fonte que responderia:** Resolução Homologatória anual da ANEEL, que é o primeiro item do
`onde_encontrar` do input no playbook. Não conferi.

### B3. O período de projeção é anual e ancorado na `data_base`, não no ciclo tarifário

**O que a engine assume:** o período `t` termina em `data_base` mais `t` anos, e a RAP anual
inteira é atribuída a esse período.

**Onde está materializada:** `packages/dominio/src/datas.ts:56-62`, na contagem de períodos
anuais inteiros, e `fcff-por-concessao.ts:230-231`, onde o fim do período é `data_base` mais
`t` anos.

**Se for falsa:** todo alinhamento de período fica deslocado. Se a RAP é publicada por ciclo
de julho a junho e a engine trata como ano contado da data base, o primeiro e o último
período pegam frações de ciclos diferentes, e o erro vale para todas as concessões ao mesmo
tempo, então não se cancela.

**Alternativa que existe e não foi escolhida:** ancorar os períodos no ciclo tarifário e
tratar o primeiro período como fração.

**Fonte que responderia:** Resolução Homologatória, para a data de início do ciclo. Não
conferi.

### B4. O reajuste usa `inflacao_projetada_longo_prazo` para toda concessão, e `indice_reajuste` é ignorado no cálculo

**O que a engine assume:** IPCA e IGPM projetam igual no longo prazo, e uma única premissa de
inflação serve para todas as concessões.

**Onde está materializada:** `fcff-por-concessao.ts:164-166` e `:232`. O campo
`indice_reajuste` é validado como enum em `:59` e nunca é lido no cálculo.

**Se for falsa:** o resultado de uma carteira com concessões em índices diferentes fica
errado, e a direção depende do spread entre os dois índices no período, que não é conhecido a
priori. Uma carteira com tudo no mesmo índice não é afetada.

**Alternativa que existe e não foi escolhida:** exigir uma premissa de projeção por índice, e
a engine escolher pela concessão.

**Fonte que responderia:** não é documento de companhia, é decisão de metodologia. Fica para
a Etapa do Conhecimento.

### B5. O reajuste incide a partir do primeiro período, sobre a RAP líquida

**O que a engine assume:** a RAP informada é a do ciclo vigente e ainda não contém o reajuste
do primeiro período projetado, então o período 1 já sai reajustado uma vez. E o reajuste
incide sobre a RAP líquida, não sobre a bruta antes das deduções.

**Onde está materializada:** `fcff-por-concessao.ts:226` e `:232`, onde `rapReajustada`
começa na RAP líquida e é multiplicada por `(1 + inflação)` antes de o período 1 ser gravado.

**Se for falsa:** o resultado inteiro sai deslocado por um fator de `(1 + inflação)`, para
mais se o período 1 não devia ser reajustado.

**Alternativa que existe e não foi escolhida:** o período 1 usar a RAP informada sem
reajuste, com o reajuste começando no período 2.

**Fonte que responderia:** a Resolução Homologatória, para saber a que ciclo a RAP publicada
se refere frente à data base. Não conferi.

### B6. `deducoes_sobre_rap` é uma fração da RAP bruta, igual para todas as concessões e constante no tempo

**O que a engine assume:** o input é uma fração entre 0 e 1, aplicada uniformemente a toda a
carteira e a todos os períodos.

**Onde está materializada:** `fcff-por-concessao.ts:167` e `:206`.

**Se for falsa:** se o número for um valor em reais em vez de fração, o erro é grosseiro e
provavelmente aparece. Se as deduções variarem por concessão ou por período, o erro é
silencioso e proporcional à dispersão.

**Alternativa que existe e não foi escolhida:** deduções por concessão, como subcampo de
`concessoes`.

**Fonte que responderia:** conciliação de receita regulatória no release, que é o
`onde_encontrar` do input. Não conferi.

### B7. `percentual_participacao` é fração da RAP, não fração do capital

**O que a engine assume:** participação de 0,25 significa direito a um quarto da RAP daquela
concessão.

**Onde está materializada:** `fcff-por-concessao.ts:242`.

**Se for falsa:** em consórcio onde a participação econômica difere da societária, o fluxo
atribuível fica errado na proporção da diferença.

**Fonte que responderia:** Formulário de Referência, seção de contratos relevantes. Não
conferi.

### B8. A redução contratual incide sobre a RAP já reajustada, e é um degrau só

> **Uma metade deste item foi fechada sem pesquisa, porque era ambiguidade de nome e não
> pergunta sobre o mundo (D-078).** O campo se chamava `fator` e o valor `0.5` servia às duas
> leituras, a que sobra e a que se corta, então o número não podia ser conferido contra o
> contrato de onde ele viesse. O campo passou a `percentual_reducao`, que é o que se corta, e
> a engine multiplica a RAP por `1 - percentual_reducao`. O comentário do playbook, que dizia
> `-50%` e contradizia o código, agora concorda com o nome. **O que segue abaixo é o que
> sobrou, e continua sem resposta.**

**O que a engine assume:** que o percentual informado incide sobre a RAP já reajustada pela
inflação do período, e não sobre a RAP original do ciclo informado. E que existe um degrau só,
valendo do primeiro período cujo fim é igual ou posterior a `a_partir_de`, para sempre.

**Onde está materializada:** `fcff-por-concessao.ts:235-241`, onde o fator remanescente
multiplica `rapReajustada` e não `rapLiquida`.

**Se for falsa:** se a redução for sobre o valor original, o resultado superestima a partir do
degrau, e a diferença cresce com a inflação acumulada e com o prazo restante, então concessão
longa erra mais que curta. Se a redução for escalonada em mais de um degrau, a estrutura não
comporta e o segundo degrau some em silêncio.

**Fonte que responderia:** contrato de concessão. Não conferi.

### B9. A indenização de RAB é descontada no período da concessão mais longa

**O que a engine assume:** a indenização informada é um valor único para a carteira, recebido
ao fim da última concessão a vencer, e descontado por esse número de períodos.

**Onde está materializada:** `fcff-por-concessao.ts:278-288`.

**Se for falsa:** a indenização é por concessão e recebida no vencimento de cada uma, e aí
descontar tudo pelo prazo mais longo subestima o valor presente.

**Alternativa que existe e não foi escolhida:** indenização por concessão, como subcampo de
`concessoes`, descontada no vencimento de cada uma.

**Fonte que responderia:** contrato e regulação de indenização de RAB não amortizada. Não
conferi.

### B10. Moeda fixa em BRL

**O que a engine assume:** todo valor é `Money<'BRL'>`.

**Onde está materializada:** `fcff-por-concessao.ts:31`, na constante `MOEDA`.

**Se for falsa:** não produz número errado, produz recusa de compilação, porque o tipo
nominal barra a mistura. Está aqui como BLOQUEANTE e não como ROBUSTEZ porque o playbook
declara `mercado: B3` e a decisão vale para o setor, não para a implementação.

**Fonte que responderia:** o próprio playbook, que já responde. Item de menor risco da
categoria.

---

## ROBUSTEZ

### R1. Nome de concessão é único dentro da carteira

**O que a engine assume:** dois itens de `concessoes` não têm o mesmo `nome`.

**Onde está materializada:** `fcff-por-concessao.ts:176-184`, que levanta `ErroDeRegraDura`.

**Se for falsa:** erro explícito, com o nome duplicado na mensagem. Não produz número errado.
O motivo de recusar em vez de aceitar é que o resultado é indexado por nome, e nome repetido
tornaria a desagregação ambígua.

### R2. `data_base` é anterior aos vencimentos que interessam

**O que a engine assume:** nada. Vencimento anterior ou igual à data base produz zero
período, valor presente zero, e a concessão aparece no resultado com `periodos: []`.

**Onde está materializada:** `datas.ts:56-62`, na contagem que devolve zero.

**Se for falsa:** não há como ser falsa, o caso está tratado e testado. Fica registrado
porque a alternativa razoável seria recusar a entrada em vez de devolver zero, e a escolha de
devolver zero é deliberada: carteira com concessão já vencida é situação real, não erro de
digitação.

### R3. Datas são texto AAAA-MM-DD e a aritmética preserva mês e dia

**O que a engine assume:** somar anos preserva mês e dia, sem tratamento de 29 de fevereiro.

**Onde está materializada:** `datas.ts:46-48`.

**Se for falsa:** uma concessão vencendo em 29 de fevereiro conta um período a menos ou a
mais dependendo do ano base. Efeito de um período em mil, e visível na desagregação, porque a
`data_fim` de cada período sai no resultado.

### R4. `horizonte_maximo_anos` não existe no playbook de transmissão

**O que a engine assume:** o campo é opcional e, na prática, ausente, porque o playbook
declara `ajustavel_pelo_usuario: false`. A engine o aceita para poder aplicar RF-420, que
manda bloquear horizonte que exceda o fato derivado.

**Onde está materializada:** `fcff-por-concessao.ts:188-201`.

**Se for falsa:** nada, é caminho opcional. Registrado porque o campo não existe no playbook
e foi acrescentado ao contrato da engine para a regra ter onde morder, e isso é escolha minha,
não do playbook.

### R5. A engine não implementa `termos_de_renovacao`

**O que a engine assume:** nada. O campo existe nas premissas do playbook e a engine não o
consome.

**Onde está materializada:** ausência. O schema de entrada em `fcff-por-concessao.ts:67-76`
não tem o campo, e `strictObject` recusa se alguém mandar.

**Se for falsa:** recusa explícita na entrada, não cálculo errado.

**Por que ficou de fora:** renovação estende o horizonte além do vencimento contratual, e a
interação disso com RF-420, que manda bloquear horizonte além do fato derivado, é pergunta em
aberto. O playbook diz que sem termos informados o fluxo encerra no vencimento, e não diz o
que acontece com a regra dura quando eles são informados.
