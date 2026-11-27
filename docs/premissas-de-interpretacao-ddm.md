# Premissas de interpretação da engine `ddm`

> **O que este arquivo é.** A lista do que a engine `ddm` foi obrigada a assumir para existir,
> escrita junto com ela, como na sonda da `fcff_por_concessao` (D-075, D-095). Nenhuma premissa
> daqui veio de documento de banco: todas nasceram de escrever o laço de anos e ver o que ele
> precisava fixar. A conferência documental de bancos (Banco do Brasil e Bradesco) vem depois da
> sonda e só para premissa que impeça a engine seguinte, a `excess_return` (D-105).
>
> **Aponta, não copia.** Onde a pesquisa já existe, a premissa aponta a seção da consolidação ou
> a premissa de origem no arquivo da fcff.

## O resultado da `ddm` não é confiável enquanto houver premissa BLOQUEANTE aberta

Pela D-105, a marca de não confiável mora aqui até o snapshot existir. Em 26/11/2026 há quatro
BLOQUEANTES abertas: A1, A3, A4 e A5.

## Os quatro estados

| Estado | Significa |
|---|---|
| **CONFERIDA** | alguém abriu o documento primário e leu |
| **CITADA E NÃO ABERTA** | existe identificação suficiente para abrir, e ninguém abriu |
| **CONVENÇÃO** | convergência de prática, sem norma que a defina, ou escolha de desenho declarada |
| **ABERTA** | sem resposta |

Nenhuma premissa deste arquivo está em CONFERIDA.

**As duas propriedades da D-105.** BLOQUEANTE: se a premissa for falsa, a engine muda, e o
resultado não é confiável enquanto ela estiver aberta. IMPEDE A ENGINE SEGUINTE: a `excess_return`
teria que fixar a resposta na estrutura de entrada ou na fórmula, e a resposta errada obrigaria a
reescrevê-la. Quem declara a segunda propriedade é o curador; aqui ela aparece como proposta.

---

## BLOQUEANTE

### A1. O PL faz o papel do capital regulatório

**Estado:** ABERTA.

**Onde está materializada:** `ddm.ts`, no capital exigido (Basileia alvo × RWA do fim) comparado
com o PL do início para dar a retenção. O PL do fim de cada ano sai igual ao capital exigido.

**O que a engine assume.** Que o patrimônio líquido contábil é o capital que a Basileia mede. A
norma mede o Patrimônio de Referência e as suas camadas (Res. CMN 4.958, citada na N12 do arquivo
da fcff), e a relação entre ele e o PL contábil não foi aberta em documento nenhum deste projeto.

**Efeito.** Se o capital que a norma mede for menor que o PL, a engine subestima a retenção e
superestima o dividendo; se for maior, o contrário.

**Proposta, não declaração:** candidata a IMPEDE A ENGINE SEGUINTE, porque responder exige um
input novo (as deduções, ou o PR) nas duas engines de bancos.

### A3. O capital exigido incide sobre o RWA do fim do ano

**Estado:** CITADA E NÃO ABERTA. Mesma questão da N11 do arquivo da fcff (consolidação,
contradição 7), que fala em RWA médio do período.

**Onde está materializada:** `ddm.ts`, `capital_exigido = rwa_fim × basileia_alvo`.

**Efeito.** Com RWA crescendo, o RWA do fim é maior que o médio, e a retenção sai maior que a de
quem mede pelo médio. Trocar para o médio muda a fórmula e não a estrutura de entrada: os dois
RWA já existem em cada ano.

### A4. As faixas de retenção da Res. CMN 4.958 não são modeladas

**Estado:** CITADA E NÃO ABERTA. Mesma questão da N12 do arquivo da fcff (consolidação, seção 10).

**Onde está materializada:** em lugar nenhum, e é esse o ponto. A guarda do R-102 confere só que
o dividendo não passa do lucro menos a retenção derivada (D-121).

**O que falta.** A norma retém 100%, 80%, 60% ou 40% do lucro conforme a distância do capital
principal exigido (art. 9º, §4º, segundo a consolidação). A engine não sabe a distância, porque
não separa capital principal (A1). A N12 já avisa: a norma define piso e trava, e o teto de payout
é derivado; tratar o teto como regra dura seria tratar derivação como norma.

### A5. Capital Complementar e Nível II aliviam a retenção, e não estão no modelo

**Estado:** CITADA E NÃO ABERTA. Mesma questão da N10 do arquivo da fcff (consolidação,
contradição 6, Res. CMN 5.007/2022).

**Efeito.** Banco que emite instrumento elegível precisa reter menos lucro que o modelo calcula.
Lucro menos retenção é piso de necessidade, não teto de distribuição.

---

## ROBUSTEZ

### A2. O ano 1 é descontado inteiro

**Estado:** ABERTA.

**Onde está materializada:** `ddm.ts`, fator de desconto do ano t igual a 1 / (1 + Ke)^t, sem
data na entrada.

**O que fica de fora.** Entre a data-base das demonstrações e a data da cotação passa uma fração
de ano. Descontar o ano 1 inteiro trata a data-base como hoje. Resolver depois muda só o fator de
desconto, não a estrutura das listas.

### C1. O lucro do ano é o ROE do ano sobre o PL do início do ano

**Estado:** CONVENÇÃO, declarada na D-114.

**Por que não o PL médio.** O PL do fim depende do lucro do próprio ano, então lucro sobre PL
médio é conta circular. A fixture tem ROE diferente em cada ano, e trocar a convenção muda o
lucro, o que a suíte pega.

### C2. Payout sem lucro positivo sai nulo, com o motivo

**Estado:** CONVENÇÃO.

**Onde está materializada:** `ddm.ts`, `payoutDe`. Com lucro zero, `payout: null` e
`payout_indefinido_porque: lucro_zero`; com lucro negativo, `lucro_negativo`. Dividendo e
retenção continuam calculados e saem no resultado.

**Por que.** Com lucro zero, dividendo sobre lucro é divisão por zero. Com lucro negativo, a
razão tem sinal e não tem significado. Com lucro positivo e dividendo negativo (aporte), o payout
existe e sai negativo, como na fixture do ano 2.

### C3. Dividendo negativo é mantido e marcado como aporte implícito

**Estado:** CONVENÇÃO, decidida pelo curador em 26/11/2026 (D-121).

**Onde está materializada:** `ddm.ts`, `aporte_implicito` em cada ano e na perpetuidade. O valor
presente inclui o fluxo negativo.

**Por que.** Zerar seria a engine escolher valor e mudar o caminho do PL (RP-003). Bloquear
impediria simular banco que cresce acima do que o lucro sustenta.

### C4. A passagem para a perpetuidade não acontece à taxa g

**Estado:** CONVENÇÃO, declarada na D-114.

**Onde está materializada:** `ddm.ts`. O lucro do primeiro ano da perpetuidade é o ROE da
perpetuidade × PL do fim do horizonte, a retenção é g × esse PL, e o dividendo dali em diante
cresce a g. O dividendo do ano N + 1 não é o do ano N vezes (1 + g): o salto entre os dois aparece
no resultado, e não é suavizado.

**Consequência conferida em teste.** Com lucro da perpetuidade positivo, o payout da perpetuidade
sai igual a 1 − g / ROE da perpetuidade, para qualquer par de valores; sem lucro positivo ele sai
nulo, pela C2.

### C5. O dividendo é pago no fim de cada ano

**Estado:** CONVENÇÃO. É a convenção do modelo de dividendos descontados. Pagamento no meio do
ano trocaria o fator de desconto, e não a estrutura.

### C6. A unit vale a soma das ações dela, com o mesmo valor por ação em ON e PN

**Estado:** CONVENÇÃO.

**Onde está materializada:** `ddm.ts`, `valor_por_unit = valor_por_acao × (acoes_on + acoes_pn)`.

**Por que.** A engine não tem dado para distinguir as classes: o dividendo e o valor saem para o
patrimônio inteiro e são divididos pelo total de ações em circulação, ON e PN juntas.

### C7. Banco acima da Basileia alvo distribui mais que o lucro

**Estado:** CONVENÇÃO, consequência da D-114.

**Onde está materializada:** quando o capital exigido do ano é menor que o PL do início, a
retenção sai negativa e o dividendo sai maior que o lucro. A fixture do ano 1 mostra isso: razão
atual 12,5%, alvo 11%, payout acima de 1. O R-102 é respeitado, porque o limite é lucro menos
retenção, e a retenção é negativa. Se o alvo for alcançado aos poucos, é o usuário que preenche a
lista por ano desse jeito (D-114, item 3).

### C8. A base nominal ou real é rótulo, e a engine não converte nada

**Estado:** CONVENÇÃO, declarada na D-114.

A engine devolve a base que recebeu, e a guarda do R-103 confere isso. Converter exigiria uma
inflação, que é premissa.

### R1. A escala das frações não é conferida

**Estado:** ABERTA.

ROE, crescimento dos RWA e Basileia alvo entram como fração ("0.11"). Escrever "11" no lugar de
"0.11" não é recusado: diferente do `percentual_reducao` da fcff (D-078), estas grandezas não têm
faixa de 0 a 1 por definição, e uma faixa escolhida pela engine seria número de premissa
escolhido por ela. O erro aparece no resultado, que sai fora de qualquer escala plausível.

### R3. Escala da quantidade de ações

**Estado:** ABERTA. Registrada pelo curador em 27/11/2026, sem mudança de código nesta PR.

O quadro Composição do Capital vem em unidades ou em mil, à escolha da companhia, e há caso
documentado de rótulo "(Mil)" com o número digitado em unidades. A engine recebe quantidade em
unidades, e um erro de escala muda o valor por ação em mil vezes.

**Checagens candidatas, para decisão futura:** total igual à soma das classes, tesouraria menor
que o total, e ordem de grandeza comparada com o capital social da nota de Patrimônio Líquido e
com o período anterior. Não implementar agora. Das três, a de tesouraria menor que o total já
existe na entrada da engine; as outras duas exigem dado que a entrada não tem.

### R2. O lucro é o que o ROE informado diz, e a engine não mexe na PDD

**Estado:** CITADA E NÃO ABERTA, pela N9 do arquivo da fcff (consolidação, contradição 5).

A engine não recebe lucro nem PDD: recebe ROE. A N9 existe para nenhuma engine de bancos somar a
provisão de volta ao lucro, e a `ddm` não soma. Se o ROE que o usuário digita foi calculado com a
provisão somada, o erro está fora da engine.

---

## Hipóteses da D-105 que a sonda não tocou

### H1. Controle da União sobre a política de dividendos do Banco do Brasil

**Estado:** a sonda não tocou. Nenhuma linha da engine depende disso: o dividendo é derivado
do capital exigido, e não de política declarada. Continua hipótese levantada pelo autor, sem
conferência em documento (D-105).

### H2. Operação de seguros dentro do grupo Bradesco

**Estado:** a sonda não tocou. A engine trata o grupo como um banco só, com um PL e um RWA. Se a
operação de seguros precisar de tratamento separado, isso é estrutura de entrada nova, e a
pergunta vai para a conferência de bancos. Continua hipótese (D-105).

---

## Premissas de bancos do arquivo da fcff, propostas como transversais

N9, N10, N11 e N12 nasceram no arquivo da `fcff_por_concessao`, vindas da consolidação, quando
nenhuma engine de bancos existia. Esta sonda as usou como origem de R2, A5, A3 e A4. Pela D-105,
só o curador declara uma premissa como transversal; até lá, a relação acima é proposta, e cada
premissa herdada mantém o estado que tem na origem.
