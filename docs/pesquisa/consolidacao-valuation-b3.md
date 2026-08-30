> # Ressalva de leitura, obrigatória antes de usar qualquer coisa daqui
>
> **O que este arquivo é.** Consolidação, feita pelo curador num chat separado, das respostas de
> **quatro agentes de IA** (`claude.md`, `gemini.md`, `qwen.md`, `antigravity.md`) às mesmas
> perguntas de metodologia de valuation nos três setores da v1. A regra da consolidação foi **não
> decidir por maioria**, e sim classificar cada afirmação por rastreabilidade de fonte.
>
> **Nenhuma fonte primária foi aberta e conferida por ninguém.** Nem pelas quatro pesquisas, nem
> pelo curador, nem por agente nenhum depois. O próprio arquivo declara isso na seção "Como ler a
> classificação", e registra que uma das pesquisas admitiu bloqueio de acesso ao `cedoc` da ANEEL.
>
> **A classificação A significa fonte citada e rastreável, não conferida.** "Existe fonte primária
> citada com identificação suficiente para você abrir" é coisa diferente de "alguém abriu e leu".
> Tratar A como verificado é o erro que este cabeçalho existe para impedir.
>
> **A `qwen.md` foi descartada como voto.** Ela chama a RAP de "Receita Anual de Permanência"
> quando o nome é Receita Anual Permitida, cita a mesma REH em bloco para afirmações que ela não
> sustenta, usa relatórios de bolsa australiana como fonte de reservas de companhia da B3, e erra
> fórmulas, somando PDD de volta ao lucro do banco e partindo da RAP bruta sem deduzir PIS/COFINS
> nem OPEX. Quando ela diverge sozinha, a divergência é ruído. As afirmações dela aparecem no
> texto abaixo e **não têm peso**.
>
> **Este arquivo não é fonte de verdade.** A fonte de verdade do projeto é
> `docs/REQUISITOS-valuation-simulator-v2.4.md`. Nada daqui autoriza copiar conteúdo para
> `conhecimento/`: conteúdo analítico não é escrito por agente nem transcrito de pesquisa de
> agente (RNF-013, D-069). O caminho para conhecimento continua sendo a Etapa do Conhecimento,
> com autoria e revisão do curador.
>
> **Como ele é usado.** `docs/premissas-de-interpretacao-fcff-por-concessao.md` aponta para as
> seções daqui e registra o estado de cada premissa. O estado CONFERIDA está vazio de propósito.

# Consolidação classificada das quatro pesquisas (Transmissão, Bancos, Commodities)

Fontes consolidadas: `claude.md`, `gemini.md`, `qwen.md`, `antigravity.md`.

## Como ler a classificação

- **A. CONFIRMADO** significa "existe fonte primária citada com identificação suficiente para você abrir". Não significa que eu abri e conferi. Nenhuma das quatro pesquisas conseguiu comprovar ter aberto o anexo tabular de uma REH (a `claude.md` admite explicitamente bloqueio de acesso ao `www2.aneel.gov.br/cedoc`).
- **B. CONVERGENTE SEM FONTE** significa concordância entre pesquisas sem fonte primária. Não verificado. Em várias dessas, a convergência é esperada e não informativa: são convenções de modelagem, não fatos documentais.
- **C. DIVERGENTE** inclui divergência real e divergência por omissão (uma responde, outra se abstém).

## Confiabilidade relativa das quatro fontes

Isso importa porque muda o peso de cada divergência.

| Pesquisa | Avaliação |
| :--- | :--- |
| `claude.md` | Melhor rastreabilidade. Cita norma por número e artigo, transcreve literalmente a cláusula de redução e a Lei 9.991/2000, e declara o que não verificou. Erro interno: lista o contrato 006/1997 entre os "licitados entre 1999 e 2006". |
| `antigravity.md` | Curta, mas entrega os dois únicos artefatos literais úteis (cabeçalho de coluna da REH e cláusula de redução). Fraqueza: o rótulo do documento e a URL não batem em dois casos (chama de "Nota Técnica" um arquivo `nreh2023...pdf`; ancora o cabeçalho da REH 3.344/2024 em uma URL de notícia do gov.br, não no anexo). |
| `gemini.md` | Boa cobertura de armadilhas operacionais (Parcela de Ajuste, CFR vs FOB, RWA médio). Fraqueza de fonte: a nota de rodapé mais usada no capítulo de transmissão é uma página institucional de RI de companhia (ISA Energia), que é fonte secundária, não norma. |
| `qwen.md` | Não use como voto. Chama a RAP de "Receita Anual de Permanência" (o nome é Receita Anual Permitida), cita a mesma REH em bloco para afirmações que ela não sustenta, usa como fonte de reservas relatórios australianos de ASX sem relação com a B3, e erra fórmulas (soma PDD de volta ao lucro do banco; parte da RAP bruta e não deduz OPEX nem PIS/COFINS). Quando `qwen.md` divergir sozinha, a divergência é ruído. |

---

## 1. Unidade, escala e periodicidade da RAP homologada

| Item | Conteúdo |
| :--- | :--- |
| **Veredito** | Valor **anual**, expresso em **Reais**, referente ao ciclo tarifário (não ao ano civil). Faturado em duodécimos mensais. Sobre a escala: duas pesquisas afirmam **reais inteiros, não milhares**. |
| **Classificação** | **A** para "anual, em R$". **B (com risco alto)** para "reais inteiros e não milhares". |
| **Fonte** | `antigravity.md` transcreve o cabeçalho de coluna: `"Receita Anual Permitida (RAP) Revisada (R$)"`, atribuído à REH ANEEL nº 3.344/2024 (URL fornecida é a notícia do gov.br sobre o ciclo 2024-2025, não o anexo). `claude.md`: contrato-padrão de concessão define RAP como "valor em Reais", e REH 3.066/2022 e 3.217/2023. `gemini.md`: NT nº 107/2026-STR/ANEEL. `qwen.md`: REH nº 2857/2021 (citação em bloco). |
| **Divergência** | Nenhuma sobre "anual em R$": as quatro concordam. Sobre escala, só `claude.md` e `antigravity.md` se pronunciam. |
| **Alerta que muda a premissa** | `claude.md` acrescenta que as tabelas auxiliares de custo da metodologia (PRORET) aparecem em `R$ x 1000`, ou seja, escala diferente da RAP homologada no mesmo universo documental. Se a engine ingere os dois de um mesmo pipeline, o erro é de 1000x e silencioso. Nenhuma das quatro comprovou ter aberto o anexo da REH. Esta é a primeira coisa a conferir com documento na tela. |

## 2. Ciclo tarifário

| Item | Conteúdo |
| :--- | :--- |
| **Veredito** | **1º de julho a 30 de junho do ano seguinte.** Não é o ano civil. |
| **Classificação** | **A**, com divergência resolvida contra `qwen.md`. |
| **Fonte** | `claude.md` (REH 3.066/2022, REH 3.217/2023; ciclo 2025-2026 homologado em 15/07/2025), `gemini.md` (NT 107/2026-STR/ANEEL), `antigravity.md` (comunicado do ciclo 2024-2025). |
| **Divergência** | Três dizem julho a junho. `qwen.md` afirma que "o Ciclo Tarifário geralmente tem duração de quatro anos" e em nenhum momento menciona julho a junho. `qwen.md` perde: nenhuma fonte primária sustenta os quatro anos, e a citação usada é a mesma REH usada em bloco para tudo. |
| **Observação técnica** | O "quatro anos" da `qwen.md` parece ser confusão com a **revisão tarifária periódica**, que `claude.md` registra como ocorrendo a cada 4 a 5 anos conforme contrato. São dois relógios distintos: reajuste anual (1º de julho) e revisão periódica plurianual. Se a engine tem um só parâmetro de ciclo, tem um bug de modelagem, não de dado. |

## 3. O que se subtrai da RAP líquida para chegar ao fluxo de caixa livre

| Item | Conteúdo |
| :--- | :--- |
| **Veredito** | Subtrai-se OPEX caixa (O&M/PMSO), IRPJ e CSLL, CAPEX de manutenção/reforços e variação do capital de giro. O regime de disponibilidade estabiliza a **receita**, e não dispensa custo, tributo nem investimento. Projetar a RAP líquida diretamente como fluxo é simplificação, não equivalência. |
| **Classificação** | **B.** Convergência de três pesquisas com argumento explícito, mas nenhuma norma define fluxo de caixa livre de uma companhia. Isso é metodologia, não regra. |
| **Fonte** | `claude.md` e `gemini.md` afirmam a incorreção da projeção direta em termos explícitos (`gemini.md`: "conceitualmente incorreta"). `antigravity.md` concorda e separa norma de prática. Nenhuma cita norma que defina o FCF. |
| **Divergência** | `qwen.md` afirma o contrário em dois pontos: (i) que o CAPEX de manutenção "está implicitamente coberto pelas deduções reguladas" e não deve ser subtraído; (ii) que as deduções entre RAP bruta e líquida são custos operacionais (pessoal, manutenção, seguros). Ambas as afirmações são erradas de categoria e sem fonte que as sustente. Sua fórmula final (`RAP_bruta - IR - CSLL - ΔCGT - Capex_expansão`) parte da RAP **bruta**, o que também elimina PIS/COFINS e encargos do cálculo. Descarte. |
| **Item de fonte única a conferir** | `antigravity.md` afirma que o PRORET **Submódulo 9.8** calcula a RAP a partir de um FCFF teórico que já deduz reinvestimentos necessários. Se isso for verdade, existe risco real de dupla contagem em modelagens que partem da RAP regulatória e subtraem CAPEX outra vez com a mesma lógica de retorno. Fonte única, não confirmada, e a numeração conflita com `claude.md`, que atribui a metodologia de revisão ao **Submódulo 9.1** e `gemini.md`, que atribui o WACC regulatório ao **Submódulo 2.4**. Vale abrir o PRORET e checar qual submódulo faz o quê antes de decidir a fórmula. |

## 4. Base da redução contratual de RAP (50% a partir do 16º ano)

| Item | Conteúdo |
| :--- | :--- |
| **Veredito** | Incide sobre a RAP **já reajustada** do 15º ano de operação comercial, não sobre o valor nominal da licitação. O valor reduzido continua sujeito a reajuste e revisão. |
| **Classificação** | **A.** A mais bem sustentada das dez. |
| **Fonte** | Duas transcrições literais independentes e idênticas da subcláusula: "A partir do 16º (décimo sexto) ano de OPERAÇÃO COMERCIAL, a RECEITA ANUAL PERMITIDA da TRANSMISSORA será de 50% (cinquenta por cento) da RECEITA ANUAL PERMITIDA do 15º ano de OPERAÇÃO COMERCIAL [...] A esta receita aplica-se os critérios de reajuste e revisão previstos nesta Cláusula". `claude.md` atribui à NT nº 39/2023-STR/ANEEL (Cláusula Sexta) e lista contratos afetados. `antigravity.md` atribui a uma Nota Técnica ANEEL com URL `www2.aneel.gov.br/cedoc/nreh20233216.pdf`. |
| **Divergência** | `gemini.md` concorda, mas com fonte secundária (página de RI da ISA Energia). `qwen.md` se abstém e classifica como armadilha a consultar contrato por contrato. Abstenção com três respostas fundamentadas não muda o veredito. |
| **Ressalvas** | (i) `antigravity.md` chama o documento de Nota Técnica mas aponta um arquivo de nomenclatura de REH: os dois identificadores precisam ser reconciliados ao abrir. (ii) O escopo é contrato dependente: `claude.md` diz "licitados entre 1999 e 2006" mas inclui o contrato 006/1997 na lista de afetados, o que é inconsistente; `gemini.md` diz "1999 a novembro de 2006". O gatilho na engine não pode ser uma data fixa, tem que ser um flag por contrato. (iii) A cláusula é transcrita como "Subcláusula" sem número em `antigravity.md` e como parte da Cláusula Sexta em `claude.md`. |

## 5. Base sobre a qual incide a participação societária

| Item | Conteúdo |
| :--- | :--- |
| **Veredito** | Formalmente, **não incide sobre a RAP**. A RAP é receita integral da SPE. A participação da holding incide sobre o patrimônio e o resultado da SPE, reconhecidos por equivalência patrimonial (CPC 18/R2) quando não há consolidação integral. O caixa que chega à investidora é o **dividendo efetivamente pago** pela SPE, sujeito a covenants e índices de cobertura dos contratos de financiamento da própria SPE. Com consolidação integral, a RAP entra direto na receita consolidada. |
| **Classificação** | **A** para a regra contábil (CPC 18/R2 nomeado; `gemini.md` aponta DFP da Cemig GT como documento de companhia). **Convenção**, para etapa posterior, o atalho de ponderar a RAP pelo percentual. |
| **Divergência** | `antigravity.md` separa os dois planos com honestidade: diz que pela norma a RAP é integral da SPE, e que a prática de mercado pondera o FCFE consolidado pelo percentual detido. `claude.md` e `gemini.md` são mais duros: a incidência é sobre resultado e dividendo, não sobre RAP. `qwen.md` se abstém. |
| **Consequência para a engine** | `%` × RAP e `%` × dividendo distribuível não são a mesma grandeza e podem divergir muito, porque entre as duas estão a dívida da SPE, os covenants e a política de distribuição. Se a premissa assumida foi "aplica o percentual sobre a RAP", ela é defensável como convenção declarada, e não como regra. |

## 6. Composição das deduções entre RAP bruta e líquida, e proporcionalidade

| Item | Conteúdo |
| :--- | :--- |
| **Veredito** | Tributos sobre o faturamento (PIS/Pasep e COFINS) mais encargos setoriais. Os encargos com base legal identificada são: P&D, mínimo de 1% da receita operacional líquida (Lei nº 9.991/2000, art. 4º); TFSEE (Lei nº 9.427/1996, apontada como 0,4% da receita); RGR (Lei nº 5.655/1971, "quando aplicável"). Somam-se ainda os ajustes de Parcela Variável e Parcela de Ajuste, que não são tributos. |
| **Classificação** | **A** para a existência e base legal de P&D, TFSEE e RGR (leis identificadas por número; `claude.md` transcreve o texto do art. 4º da Lei 9.991/2000). **B** para a proporcionalidade mensal. **C** para as alíquotas efetivas de PIS/COFINS. |
| **Divergência 1: alíquotas** | `claude.md`: 9,25% ou 9,65% no lucro real e 3,65% cumulativo em concessões antigas. `gemini.md`: PIS de 0,65% a 1,65% e COFINS de 3,0% a 7,6%. `antigravity.md`: não quantifica. As faixas não se contradizem, elas descrevem regimes diferentes. O que nenhuma resolve é **qual regime se aplica a qual concessão**, o que é justamente o que a engine precisa. |
| **Divergência 2: proporcionalidade** | Convergem em que tributos indiretos e TFSEE acompanham o faturamento mensal e que a Parcela Variável é evento dependente e não linear. `gemini.md` acrescenta que a Parcela de Ajuste segue cronograma de recomposição definido pela ANEEL, também não uniforme. `antigravity.md` afirma proporcionalidade mensal via faturamento AVC/AVD do ONS, citando genericamente edital de leilão e notas do ONS. `qwen.md` está errada aqui (trata as deduções como custos operacionais contratados) e afirma proporcionalidade sem base. |
| **Contradição interna que ninguém resolveu** | O texto que `claude.md` transcreve da Lei 9.991/2000 obriga a concessionária a **aplicar** no mínimo 1% da ROL em P&D. Isso é obrigação de dispêndio, não necessariamente uma dedução na ponte entre RAP bruta e RAP líquida. Duas pesquisas colocam o P&D dentro da ponte, mas a própria citação literal não sustenta esse enquadramento. Mesma dúvida para a TFSEE. Se a engine subtrai P&D na ponte **e** reconhece a despesa de P&D no OPEX, conta duas vezes. |

## 7. Como o reajuste inflacionário entra no primeiro período de projeção

| Item | Conteúdo |
| :--- | :--- |
| **Veredito** | **Sem resposta.** Nenhuma das quatro trata do primeiro período de projeção. |
| **Classificação** | **C por omissão.** |
| **O que existe de aproveitável** | (i) A data de referência do reajuste é 1º de julho, mesma base documental da pergunta 2 (classe A). (ii) `gemini.md` afirma que contratos antigos são corrigidos por IGP-M e os celebrados após novembro de 2006 por IPCA, com fonte secundária (página de RI). (iii) `claude.md` declara explicitamente que **não verificou**, por contrato, se o índice é IPCA ou IGP-M, e recomenda ler o parâmetro do contrato ou da REH. |
| **Sinal registrado** | Pela sua regra: `claude.md` admitiu não saber, `gemini.md` respondeu com fonte secundária, as outras duas silenciaram. Isso é sinal. Trate o índice como parâmetro por contrato, nunca como constante do setor. |
| **Convenção, não regra** | `gemini.md` propõe compor o ano civil ponderando metade do ciclo encerrado em junho e metade do iniciado em julho. Isso é convenção de harmonização temporal, plausível, sem fonte, e ainda depende de a projeção ser anual em base civil. Fica para etapa posterior. |

## 8. Indenização de RAB não amortizada, e a que prazo se refere

| Item | Conteúdo |
| :--- | :--- |
| **Veredito** | **Sem resposta confiável.** Ninguém responde "a que prazo". |
| **Classificação** | **C por omissão, com uma contradição relevante entre pesquisas.** |
| **O que cada uma disse** | `gemini.md` é a única a tratar do tema: ao fim do contrato os ativos revertem ao poder concedente e a concessionária tem direito regulatório a indenização calculada sobre o Custo de Reposição Valorado da BAR remanescente; o modelo deve incluir o valor presente dessa indenização no último período. Sem fonte primária citada nessa seção. `claude.md` menciona de passagem "valor residual/indenização de ativos reversíveis" e acrescenta, via imprensa setorial (Agência iNFRA/Abrate, secundária), que **os contratos dos leilões a partir de 2020 impõem a depreciação dos investimentos dentro do prazo de 30 anos**. `antigravity.md` e `qwen.md` não tratam. |
| **Por que isso é um problema para a engine** | Se os contratos pós-2020 amortizam integralmente dentro do prazo, a indenização terminal tende a zero neles, e o parâmetro passa a ser dependente da safra do contrato. Uma indenização terminal aplicada a todos os contratos infla o valuation dos mais novos. Nenhuma das quatro fecha (a) qual prazo de amortização regulatória vale por safra, (b) se o prazo relevante é o da concessão ou o da vida regulatória do ativo, (c) como se calcula o valor. Isso continua aberto. |

## 9. Vida útil de reserva: por companhia ou por ativo produtivo

| Item | Conteúdo |
| :--- | :--- |
| **Veredito** | Por **ativo produtivo** (mina, complexo, campo, concessão), nos relatórios técnicos. O número consolidado por companhia existe, mas é agregação derivada, e a modelagem correta é por ativo, porque cada jazida tem curva de declínio, custo caixa e prazo de exaustão próprios. |
| **Classificação** | **A.** |
| **Fonte** | `claude.md`: o S-K 1300 exige um Technical Report Summary por propriedade material, anexado ao Form 20-F (identifica os exhibits ex96-1/ex96-2 da Vale); registra também o R/P agregado divulgado pela Petrobras com certificação D&M, e a diferença de critério SEC vs ANP/SPE. `gemini.md`: laudos técnicos SPE-PRMS, NI 43-101 ou JORC, mais a seção de operações do Formulário de Referência (CVM). `antigravity.md`: mesma direção, com 20-F e Reserves Reports. |
| **Divergência** | `qwen.md` classifica a vida útil de reserva como "calculada pela empresa (Reservas / Produção Anual)" divulgada em relatórios anuais e de investidores, isto é, puxa para o nível companhia. Além de contrariar as outras três, suas fontes de reservas são documentos ASX australianos (RML, Deep Yellow) sem relação com companhias da B3. Descarte. |
| **Nuance útil que sobrevive** | O R/P por companhia e o prazo de exaustão por ativo não são intercambiáveis, e sob critério ANP/SPE é possível considerar volumes além do prazo contratual de concessão, o que não vale sob critério SEC (`claude.md`). Se a engine aceita "vida útil da reserva" como um campo único, ela está aceitando duas grandezas diferentes no mesmo slot. |

## 10. O que define o horizonte de projeção de um banco

| Item | Conteúdo |
| :--- | :--- |
| **Veredito** | **Nada formal define.** Não há contrato nem reserva. O horizonte explícito é convenção de modelagem: projeta-se até o estado estacionário (convergência de ROE e do crescimento do crédito a patamares sustentáveis) e depois assume-se perpetuidade, com `g` limitado por `ROE × taxa de retenção`. |
| **Classificação** | **B.** As quatro convergem, e convergem justamente em que **não existe regra**. A ausência de norma citada por qualquer das quatro é, aqui, a evidência. |
| **Fonte** | Nenhuma primária, e não deveria haver. `antigravity.md` cita Damodaran e práticas de banco de investimento, isto é, fonte secundária de convenção. `claude.md` rotula explicitamente como convenção de continuidade (going concern) e não norma. `qwen.md` diz "5 a 10 anos, mas arbitrário". `gemini.md` ancora o estado estacionário no crescimento do PIB nominal, sem fonte. |
| **O que é regra e entra agora** | A restrição **de distribuição**, que é coisa diferente de horizonte. `claude.md` detalha a Res. CMN nº 4.958/2021: mínimos de PR 8%, Nível I 6%, Capital Principal 4,5%; ACP de Conservação 2,5% desde 1º/04/2022, Contracíclico 0 a 2,5%, Sistêmico 0 a 2% para S1; e as faixas de retenção do art. 9º, §4º: retém 100% se o valor verificado for menor que 25% do ACP exigido, 80% entre 25% e 50%, 60% entre 50% e 75%, 40% entre 75% e 100%. `gemini.md` confirma o art. 9º e a Res. CMN 4.958/2021 (via LegisWeb) e acrescenta a Res. CMN nº 5.007/2022 para instrumentos elegíveis. Classe **A** com identificação de artigo e parágrafo, e é o único pedaço normativo do módulo bancário. |
| **Ressalva honesta** | O teto de payout **não é normativo**. `claude.md` diz isso de forma direta: a norma define pisos e travas, o teto efetivo (`lucro líquido − ΔRWA × requerimento total`) é derivado. Se a engine trata esse teto como regra, está tratando derivação como norma. |

---

# Perguntas que continuam sem resposta confiável

Estas exigem documento aberto. Estão em ordem de risco para a engine.

1. **Escala da RAP no anexo da REH (pergunta 1).** Nenhuma das quatro comprovou ter aberto o anexo. `claude.md` admite bloqueio de acesso. A transcrição de cabeçalho da `antigravity.md` vem com URL de notícia, não do anexo. Erro possível: 1000x, silencioso. Abrir: anexo tabular da REH do ciclo corrente e conferir o cabeçalho da coluna de valor e a nota de escala.
2. **Reajuste no primeiro período de projeção (pergunta 7).** Sem resposta. Precisa de: cláusula de reajuste de um contrato de cada safra, para saber a data de aniversário, o índice e o tratamento pro rata.
3. **Indenização de RAB não amortizada e seu prazo (pergunta 8).** Sem resposta. Precisa de: cláusula de reversão e indenização em contratos de safras distintas, e a regra de amortização dos contratos pós-2020.
4. **Qual submódulo do PRORET faz o quê, e se a RAP já embute reinvestimento (pergunta 3).** Três numerações diferentes citadas (9.8, 9.1, 2.4) para funções adjacentes. É o item que pode gerar dupla contagem de CAPEX.
5. **Regime de PIS/COFINS aplicável por concessão (pergunta 6).** Cumulativo ou não cumulativo muda a alíquota de 3,65% para cerca de 9,25%. Nenhuma resolve por companhia.
6. **Se RGR ainda incide, e sobre qual base (pergunta 6).** Duas pesquisas escrevem "quando aplicável" sem dizer quando se aplica. `claude.md` dá a faixa 2,5% a 3% como típica, sem confirmar vigência.
7. **Enquadramento de P&D e TFSEE: dedução na ponte ou despesa (pergunta 6).** A citação literal da lei fala em obrigação de aplicação, e duas pesquisas colocam na ponte. Risco de contagem dupla.
8. **Regime tributário da SPE de transmissão: lucro real ou presumido.** Só `claude.md` levanta, apresentando presunção de 8% para IRPJ e 12% para CSLL como frequente no setor, com base em "jurisprudência e prática", isto é, sem norma citada. Muda materialmente o imposto e, portanto, o fluxo.
9. **Escopo por safra da cláusula de redução de 50% (pergunta 4).** O veredito é sólido, o escopo não: "1999 a 2006" com um contrato de 1997 na lista.

---

# Coisas que as pesquisas trouxeram e que contradizem premissas suas

Você não perguntou nada disso, e cada item colide com alguma premissa implícita nas dez perguntas.

1. **A receita contábil de uma transmissora não é a RAP.** `claude.md` (IFRIC 12 / ICPC 01 / CPC 47) e `gemini.md` (CPC 47 / OCPC 08) convergem: sob IFRS a receita reconhecida é movimentação de ativo de contrato ou financeiro, com margem de construção e remuneração do ativo, e a depreciação física não aparece na DRE. Contradiz qualquer premissa de que se pode ler RAP a partir da receita de ITR/DFP, ou validar a RAP contra a DRE. Consequência: EBITDA IFRS é inutilizável no setor, e existe uma fonte separada que ninguém dentro das suas dez perguntas mencionou: as **Demonstrações Contábeis Regulatórias (DCR)**, apontadas por `claude.md`.
2. **RAP homologada não é RAP faturada.** `gemini.md` introduz a **Parcela de Ajuste**, que compensa excessos e déficits de arrecadação do ciclo anterior, e vem em anexo próprio da REH. Nenhuma das suas perguntas cobre isso. Se a engine projeta a RAP homologada como receita, ela ignora um ajuste que é justamente descasado no tempo. Some-se a Parcela Variável, que `claude.md` trata como evento não linear, e não como percentual médio.
3. **Duodécimos.** As quatro convergem em que o faturamento é mensal, um doze avos. `gemini.md` nomeia o erro: confundir valor anual homologado com receita mensal de competência gera erro de 12x. Isso convive mal com o ciclo julho a junho e com o exercício social civil. São três grades temporais no mesmo módulo.
4. **Indenização terminal depende da safra do contrato.** Ver pergunta 8. `claude.md` diz que os contratos pós-2020 depreciam dentro dos 30 anos, o que esvazia a indenização terminal que `gemini.md` recomenda incluir no último período para todos. Se a engine tem um único parâmetro de valor terminal em transmissão, ele está errado para pelo menos uma das safras.
5. **Bancos: PDD não se soma de volta ao lucro.** `qwen.md` instrui somar a provisão por perdas esperadas de volta ao lucro líquido para projetar fluxo. As outras três não fazem isso, e `claude.md` aponta a Res. CMN nº 4.966/2021 como o regime de perda esperada aplicável. Se alguma premissa da engine veio dessa direção, ela produz lucro distribuível inflado.
6. **Bancos: o teto de distribuição não depende só de lucro e RWA.** `gemini.md` aponta que a emissão de instrumentos elegíveis ao Capital Complementar ou Nível II (Res. CMN nº 5.007/2022) alivia a necessidade de retenção. Ou seja, `lucro líquido − ΔPR requerido` é piso de necessidade, não teto absoluto de distribuição.
7. **Bancos: base de cálculo do crescimento de capital.** `gemini.md` alerta que a expansão deve ser aplicada sobre **RWA médio** do período, não sobre estoque de fechamento, e que mudanças de ponderação regulatória (por exemplo revisões do RWA operacional padronizado) alteram a exigência de capital sem que a carteira mude de tamanho. Nenhuma das suas dez perguntas toca nisso, e é uma premissa silenciosa em qualquer módulo de banco.
8. **Commodities: desembolso de descomissionamento no fim da vida.** `gemini.md` (ABEX) e `antigravity.md` convergem: ao esgotar a reserva há saída de caixa de abandono e recuperação ambiental. Um modelo que encerra a projeção na exaustão sem esse desembolso superestima o valor, e o erro aparece exatamente no último período, onde ninguém olha.
9. **Commodities: paridade comercial e unidade física.** `gemini.md` (custo em FOB contra preço de referência em CFR, tonelada úmida contra seca, BOE misturando gás com óleo, ADMT em celulose) e `antigravity.md` (dmt contra wmt, BOE, recurso contra reserva provada) convergem. Isso não é armadilha de dado, é armadilha de **premissa**: se a engine aceita "preço" e "custo caixa" como campos livres, ela vai aceitar combinações que produzem margem inexistente. `claude.md` acrescenta que o C1 é frequentemente reportado líquido de créditos de subproduto, o que quebra até a comparação dentro do mesmo subtipo.
10. **Commodities: comparabilidade de custo caixa.** As quatro concordam que não se compara custo caixa entre subtipos. `claude.md` e `gemini.md` vão além e mostram que mesmo dentro do subtipo é preciso normalizar inclusões, exclusões, paridade e moeda. Isso é regra de bloqueio de comparação, não parâmetro, e provavelmente deveria estar codificado como restrição da engine, não como nota.
