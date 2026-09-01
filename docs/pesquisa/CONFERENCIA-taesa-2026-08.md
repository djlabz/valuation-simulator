> # Ressalva de leitura, obrigatória antes de usar qualquer coisa daqui
>
> **O que este arquivo é.** Registro da **primeira conferência de premissas contra documento
> primário de companhia** feita neste projeto, produzida pelo curador em agosto de 2026.
>
> **Alcance: uma companhia, um trimestre.** Tudo aqui é TAESA, com base no 2T26 e no DCR de
> 2025. O que está confirmado vale **para a TAESA** e é indício forte para o setor, **não é prova
> setorial**. Onde a diferença importa, o texto marca. Nada aqui autoriza afirmar que outra
> transmissora publica igual.
>
> **Documentos efetivamente abertos:** Apresentação de Resultados 2T26 (12/08/2026); tabelas do
> release 2T26 em Excel (`Auxiliar-Release_TAESA_Site_2T26.xlsx`); Demonstrações Contábeis
> Regulatórias de 2025 (`DCR-2025-TAESA-1.pdf`, 84 páginas); ITR findo em 30/06/2026 e release
> de resultados 2T26, os dois consultados **parcialmente**.
>
> **O que ele muda na classificação.** Para os pontos que cobre, este arquivo substitui a classe
> "fonte primária citada" da consolidação em `consolidacao-valuation-b3.md` por **"fonte aberta e
> lida"**. É o que permite que premissas cheguem, pela primeira vez, ao estado CONFERIDA em
> `docs/premissas-de-interpretacao-fcff-por-concessao.md` (D-083). Para os pontos que ele **não**
> cobre, a classificação da consolidação continua valendo, e ela não significa leitura.
>
> **O que ele NÃO confere, e está marcado como tal no corpo.** A tabela de projeção de RAP da
> seção 6 **não foi conferida**: a extração de texto veio com desalinhamento de colunas e valores
> implausíveis, e ela exige leitura da página renderizada antes de qualquer uso. Não use número
> dela para nada.
>
> **Este arquivo não é fonte de verdade.** A fonte de verdade é
> `docs/REQUISITOS-valuation-simulator-v2.4.md`. Nada daqui autoriza copiar conteúdo para
> `conhecimento/`: dado de companhia vira nota de ativo por autoria e revisão do curador, na Etapa
> do Conhecimento, não por cópia (RNF-013, D-069).

# Conferência documental: TAESA, agosto de 2026

**O que é este documento.** Registro da primeira conferência de premissas contra documento primário de companhia. Substitui, para os pontos cobertos, a classificação de "fonte citada" da consolidação de pesquisa por "fonte aberta e lida".

**Ressalva de alcance.** Uma única companhia, um único trimestre. O que aqui está confirmado vale para a TAESA e é forte indício para o setor, não prova setorial. Onde a diferença importa, está marcado.

**Documentos abertos**

| Documento | Referência |
|---|---|
| Apresentação de Resultados 2T26 | 12/08/2026 |
| Tabelas do Release 2T26 (Excel) | `Auxiliar-Release_TAESA_Site_2T26.xlsx` |
| Demonstrações Contábeis Regulatórias 2025 | `DCR-2025-TAESA-1.pdf`, 84 páginas |
| ITR findo em 30/06/2026 | 90 páginas, consultado parcialmente |
| Release de Resultados 2T26 | 46 páginas, consultado parcialmente |

---

## 1. Premissas respondidas

### 1.1. Escala da RAP, e o cabeçalho mente

**Status: respondida, e a resposta é pior que as duas hipóteses previstas.**

Duas abas do mesmo arquivo Excel publicam o mesmo número em escalas diferentes, e ambas declaram a mesma unidade no cabeçalho.

| Aba | Cabeçalho | Novatrans, ciclo 2026-2027 |
|---|---|---|
| `RAP Cycle` | `RAP (R$ MM)` | `560,435` |
| `Ciclo RAP detalhado` | `(R$ MM)`, célula B6 | `560435,514` |

Verificação aritmética: o `Total¹` da aba detalhada é `4.555.843,812`. Em milhares, R$ 4,56 bilhões, compatível com os R$ 4,9 bilhões declarados na apresentação. Em milhões, R$ 4,5 trilhões, absurdo. A aba detalhada está em **R$ mil** e o cabeçalho diz `R$ MM`.

A aba `Participações` declara `R$ 000` e os valores aparentam estar em reais. Indício, não confirmado.

**Consequência.** Extrator que confie no cabeçalho declarado erra por mil, sem nada falhar. A escala precisa ser propriedade do dado extraído, com verificação por ordem de grandeza, e não campo do schema.

### 1.2. Mês base de reajuste

**Status: respondida para a TAESA.**

O DCR publica coluna "Mês Base Reajuste" por concessão. Toda a carteira aparece como **Junho**.

Não generalizar para o setor sem conferir outra companhia.

### 1.3. Índice de correção por concessão

**Status: respondida, e é dado publicado.**

O DCR tem coluna "Índice de Correção" por linha de transmissão, e a nota 7.4 lista nominalmente as concessões de cada índice.

Confirma a decisão de ler o índice por concessão em vez de aplicar constante de carteira. Os reajustes do ciclo 2026-2027 foram de 1,95% e 4,72%, e os do ciclo anterior de 7,03% e 5,32%. A diferença entre os dois índices é material.

### 1.4. Enquadramento de P&D e TFSEE

**Status: respondida, hipótese A.**

A aba `Participações` traz a ponte de receita, e uma das linhas de dedução é:

> Quota para RGR, P&D, TFSEE, CDE e PROINFA

São dedução na ponte entre bruta e líquida, não despesa operacional. Portanto, quando a engine passar a ter OPEX, esses itens não podem aparecer novamente lá.

**Achado não previsto:** CDE e PROINFA existem e não foram mencionados por nenhuma das quatro pesquisas nem pela consolidação. E os cinco vêm em **linha única agregada**, então um input que peça cada um separadamente não tem correspondente no documento.

### 1.5. Ponte completa de receita

**Status: obtida de documento.**

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

Observar a ordem: a Parcela Variável é deduzida **antes** do total bruto, e os tributos e encargos depois.

Isto é insumo direto para a premissa B1. Indica que a lista de inputs do playbook está incompleta, e não que a engine tenha simplificado deliberadamente.

---

## 2. O documento certo não é o release

O `onde_encontrar` do playbook aponta para o release de resultados. A fonte com a estrutura que o input `concessoes` pede são as **Demonstrações Contábeis Regulatórias**.

A tabela "Linhas de Transmissão em Operação, Características Financeiras" traz, por concessão:

| Coluna | Correspondência no playbook |
|---|---|
| Linha de Transmissão | `nome` |
| Propriedade | `percentual_participacao` |
| RAP | `rap_bruta_ciclo_atual` |
| **Ano de degrau da RAP** | **sem campo correspondente** |
| Mês Base Reajuste | sem campo correspondente |
| Índice de Correção | `indice_reajuste` |

A coluna "Ano de degrau da RAP" traz mês e ano por concessão, como `jun/18` e `mai/23`. O playbook declara `reducao_contratual` sem data de início, e a data existe publicada.

**Sobre a obrigatoriedade da fonte.** A DCR não é peculiaridade da TAESA. Foi instituída pela Resolução Normativa ANEEL nº 396/2010, é de adoção obrigatória por concessionárias e permissionárias de transmissão e distribuição, integra a Prestação Anual de Contas, e deve ser disponibilizada no site da concessionária até 30 de abril do ano subsequente. A ANEEL mantém a Central de Informações Econômico-Financeira do Setor Elétrico com as demonstrações societárias e regulatórias de todas as concessionárias a partir de 2011.

Isso é fonte única setorial no site do regulador, e é candidata a provider. Cobre transmissão e distribuição, não geração nem commodities. Demonstrações regulatórias completas, com notas explicativas e auditoria independente, existem a partir de 2015.

---

## 3. Três achados que quebram o modelo atual da engine

### 3.1. Existe concessão com cronograma de faixas, não com degrau

Nota 7.4 do DCR, sobre a concessão SIT: o recebimento da RAP foi dividido em quadrantes ao longo dos trinta anos de vigência, com 72,24% da RAP do 1º ao 5º ano, 100% do 6º ao 15º, e 53,61% do 16º ao 30º.

A primeira faixa é **inferior a 100%**. O campo `percentual_reducao`, aplicado a partir de um ano de corte, não expressa isso.

**Consequência.** `reducao_contratual` como par de corte e ano é insuficiente. A estrutura correta é um perfil temporal de percentual da RAP por faixa de anos, com o degrau clássico virando o caso particular de duas faixas, 100% e 50%.

### 3.2. O degrau não é propriedade da concessão, é do ativo

A mesma nota afirma que, para uma lista nominal de concessões, e também para os reforços realizados nas linhas de transmissão após o ano de 2008, não há decréscimo do faturamento no 16º ano, sendo o recebimento da RAP linear durante o período da concessão.

Ou seja, uma concessão antiga com reforço posterior a 2008 tem duas parcelas de RAP com comportamentos diferentes na mesma concessão.

**Consequência.** Um campo de degrau no nível da concessão está no nível errado. E o Excel confirma a existência da separação: a aba detalhada traz colunas distintas de RAP "Operacional" e "Em Construção" por concessão.

### 3.3. A Parcela Variável tem teto contratual

Nota 7.4: o desconto anual por indisponibilidade não pode ultrapassar 12,5% da receita anual de operação, manutenção e construção, relativa ao período contínuo de doze meses anteriores, com o caso específico da ECTE em 25%.

**Consequência.** Existe limite superior contratual, ele varia por concessão, e nada no playbook o representa.

Referência de magnitude: no 6M26 a Parcela Variável foi de 0,73% da RAP, contra 0,51% no 6M25, com efeito pontual atribuído a um desligamento planejado.

---

## 4. Contradições entre documentos da mesma companhia

### 4.1. Categoria da concessão

O Excel traz a nota de rodapé "Concessão de Categoria II com ajuste pelo IPCA".

O DCR afirma que, no ciclo RAP 2025-2026, os reajustes foram de mais 7,0% para concessões de Categoria II e mais 5,3% para Categoria III, e marca as concessões de IPCA com a nota "Concessão de categoria III".

Como 7,03% é a variação do IGP-M no ciclo e 5,32% a do IPCA, a atribuição do DCR é internamente consistente e a do Excel não. Um dos dois documentos está errado.

### 4.2. Base de PIS/COFINS

O Excel afirma, em nota de rodapé, que todos os valores de RAP estão adicionados de PIS/COFINS.

O DCR, na mesma tabela de características financeiras, traz nota dizendo que a Categoria III é apresentada com adição do PIS/COFINS para os três ciclos, o que sugere que as demais linhas não o são.

Se confirmado, a mesma tabela mistura duas bases.

**Consequência.** RAP não é um número com uma unidade. É um número com escala, base tributária e ciclo de referência, e nenhum dos três é dedutível do campo.

---

## 5. Parcela de Ajuste tem três componentes

A aba `Ciclo RAP detalhado` desdobra a Parcela de Ajuste em três colunas: apuração e outros ajustes, retroativa, e vida útil.

Ordem de magnitude: para a Novatrans, a parcela retroativa é de menos R$ 36,8 milhões contra RAP de R$ 560,4 milhões.

A consolidação apontava a existência da Parcela de Ajuste como item não previsto. A conferência mostra que ela é composta, e que um campo único não a representa.

---

## 6. Projeção de RAP publicada pela companhia

O DCR traz tabela "RAP Esperada em moeda constante de 31/12/2025", por linha de transmissão, com colunas de 2024 a 2030, sendo 2024 e 2025 realizadas.

**Não conferida.** A extração de texto apresentou desalinhamento de colunas nessa tabela, com valores implausíveis para pelo menos uma linha. Exige leitura da página renderizada antes de qualquer uso.

Se confirmada, é material relevante: a própria companhia publica projeção plurianual de RAP por ativo, o que serve tanto de insumo quanto de caso de referência para validação de engine.

---

## 7. Estado das premissas após a conferência

| Premissa | Antes | Depois |
|---|---|---|
| Escala da RAP | aberta | respondida, com armadilha de cabeçalho |
| Mês base de reajuste | aberta | respondida para a TAESA |
| Índice por concessão | estrutural corrigida, valor aberto | fonte publicada identificada |
| P&D e TFSEE na ponte | aberta | respondida, hipótese A |
| Composição da ponte | aberta | obtida de documento |
| Base da redução contratual | respondida por pesquisa | insuficiente, ver 3.1 e 3.2 |
| B1, o que é o fluxo livre | aberta | insumo obtido, decisão pendente |
| Reajuste no primeiro ciclo | aberta | indício forte, ver abaixo |
| Indenização de RAB por safra | aberta | não coberta nesta conferência |

**Sobre o reajuste no primeiro ciclo.** A apresentação traz a ponte do ciclo: RAP operacional do ciclo 2025-2026 de 3.974,7, mais reajuste inflacionário de 129,9, mais entrada em operação de 341,3, resultando em 4.445,9 no ciclo 2026-2027. Indica que a RAP publicada para um ciclo já vem reajustada para ele, e que a engine não deve reajustar de novo no primeiro período.

Indício forte, de documento de companhia reconciliando o número oficial. Não é o Despacho em si.

**Sobre a fonte do ciclo.** A apresentação cita como fonte o Despacho nº 2.268, de 22 de junho de 2026, que estabelece o ciclo RAP 2026-2027, e o DCR cita a Resolução Homologatória nº 3.481, de 15 de julho de 2025, para o ciclo anterior. São dois tipos de ato distintos, e a busca por REH sozinha não encontra o mais recente.

---

## 8. O que continua aberto

1. **B1**, o que compõe o fluxo livre. Há insumo novo, a ponte completa, mas a decisão entre corrigir o nome da engine ou acrescentar campos é do curador, e ainda depende do PRORET quanto à dupla contagem de reinvestimento.
2. **PRORET**, qual submódulo faz o quê e se a RAP embute quota de reintegração regulatória.
3. **Indenização de RAB por safra de contrato**, não coberta nesta conferência.
4. **Regime de PIS/COFINS por concessão**, cumulativo ou não cumulativo.
5. **Projeção de RAP do DCR**, pendente de leitura da página renderizada.
6. **Generalidade setorial** de tudo que aqui está marcado como confirmado para a TAESA.
