# Caderno de estudo: premissas de autor

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

## Regras do caderno (D-115)

1. Não registra preço teto nem resultado de terceiro.
2. A Selic da data vem da série do Banco Central, com a fonte, e não da fala do autor.
3. Empresa, taxa, data e motivo são registro do que o autor disse.
4. A linha "método usado" é análise e é confirmada pelo curador.
5. O caderno mantém aula e instante. A D-108 tira a origem do conhecimento carregado pelo app. No
   caderno, a origem só serve para ouvir de novo e não toca cálculo nenhum.

## 1. Premissas calibradas no método do autor

Colunas da D-115. Data, Selic da data e método usado são iguais nas quatro linhas e estão
repetidos em cada uma, porque cada linha tem que se sustentar sozinha.

| Empresa | Taxa | Data | Selic da data | Método usado | Motivo dado pelo autor | Aula e instante |
|---|---|---|---|---|---|---|
| BR Partners | 14% a.a. | agosto de 2026, informada pelo curador; a aula não diz o dia | 14,25% a.a. até 05/08/2026 e 14,00% a.a. a partir de 06/08/2026 (SGS 432, Taxa de juros, Meta Selic definida pelo Copom, consultada em 23/11/2026); a aula não diz o dia. A fala diz 14% (38:52) | Lucro líquido inteiro como fluxo; crescimento dos anos projetados tirado da parte retida, (1 menos payout) vezes ROE; três anos projetados; perpetuidade trazida a valor presente a 10% fixos, independentemente da taxa de desconto (D-113). Confirmado pelo curador em 23/11/2026 | Usou a Selic do dia, que ele apresenta como taxa livre de risco e ponto de partida | aula 3, 1:25:04 |
| Itaú | 14% a.a. | agosto de 2026, informada pelo curador; a aula não diz o dia | 14,25% a.a. até 05/08/2026 e 14,00% a.a. a partir de 06/08/2026 (SGS 432, Taxa de juros, Meta Selic definida pelo Copom, consultada em 23/11/2026); a aula não diz o dia. A fala diz 14% (38:52) | Lucro líquido inteiro como fluxo; crescimento dos anos projetados tirado da parte retida, (1 menos payout) vezes ROE; três anos projetados; perpetuidade trazida a valor presente a 10% fixos, independentemente da taxa de desconto (D-113). Confirmado pelo curador em 23/11/2026 | Manteve a Selic do dia e disse que a taxa é escolha de quem calcula; adiante, diz que o Itaú é bem mais seguro que o Banco do Brasil | aula 3, 1:36:41 |
| Banco do Brasil | 14% a.a. | agosto de 2026, informada pelo curador; a aula não diz o dia | 14,25% a.a. até 05/08/2026 e 14,00% a.a. a partir de 06/08/2026 (SGS 432, Taxa de juros, Meta Selic definida pelo Copom, consultada em 23/11/2026); a aula não diz o dia. A fala diz 14% (38:52) | Lucro líquido inteiro como fluxo; crescimento dos anos projetados tirado da parte retida, (1 menos payout) vezes ROE; três anos projetados; perpetuidade trazida a valor presente a 10% fixos, independentemente da taxa de desconto (D-113). Confirmado pelo curador em 23/11/2026 | Aplicada e descartada pelo autor: aplicou a Selic do dia e em seguida a chamou de armadilha, porque não faz sentido cobrar o mesmo do Itaú e do Banco do Brasil | aula 3, 1:45:01 |
| Banco do Brasil | 20% a.a. | agosto de 2026, informada pelo curador; a aula não diz o dia | 14,25% a.a. até 05/08/2026 e 14,00% a.a. a partir de 06/08/2026 (SGS 432, Taxa de juros, Meta Selic definida pelo Copom, consultada em 23/11/2026); a aula não diz o dia. A fala diz 14% (38:52) | Lucro líquido inteiro como fluxo; crescimento dos anos projetados tirado da parte retida, (1 menos payout) vezes ROE; três anos projetados; perpetuidade trazida a valor presente a 10% fixos, independentemente da taxa de desconto (D-113). Confirmado pelo curador em 23/11/2026 | Subiu a taxa para ser exigente com o Banco do Brasil, que considera bem menos seguro que o Itaú; diz que a taxa é o quanto ele exige de rendimento e que acompanha o nível da Selic | aula 3, 1:45:34 |

Fonte da Selic da data: `https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados?formato=json&dataInicial=01/08/2026&dataFinal=31/08/2026`,
consultada em 23/11/2026. O nome da série foi conferido no Portal de Dados Abertos do Banco Central.

**Nota de pista, não de data.** A aula tem quatro pontos que dão pista do momento da gravação:

- 38:54: a fala diz que a Selic baixou e está em 14%;
- 12:56: a fala diz que a mentoria abre numa segunda-feira, dia 17, sem dizer o mês;
- 2:33:07: a fala dá quinta, sexta, sábado e domingo para pensar antes da abertura na segunda;
- 2:40:34: a fala dá um prazo de acesso às lives até um dia 17 do mês 8, com o ano dito como 27.
  É prazo de acesso, e não a data de abertura.

Nenhuma é o autor dizendo a data da gravação. Na série 432 do SGS, todos os dias de 06/08/2026 a
16/08/2026 têm o valor 14,00% a.a.

## 2. Observações que não dependem do método e esperam a segunda fonte da RF-113

| Premissa | Valor observado | Setor em que a fonte usou | Termos nominais ou reais | Motivo dado pelo autor | Aula e instante | O que falta para virar faixa |
|---|---|---|---|---|---|---|
| Horizonte de projeção explícita | 3 ou 5 anos; 3 aplicados às três empresas da aula | Bancos (BR Partners, Itaú, Banco do Brasil) para os 3 anos; o critério de 5 anos é dado sem setor | Não se aplica, contagem de anos | Além de poucos anos a previsão fica muito difícil; 5 anos dão espaço para a empresa com mais perspectiva de crescimento crescer antes da perpetuidade | aula 3, 1:43:02; 1:07:46; 1:00:46 | Segunda fonte independente (RF-113), com faixa de horizonte pela RF-419 |
| Crescimento na perpetuidade | 3% a.a., dentro de uma faixa de 1 a 3% que o autor diz | Bancos, na BR Partners (1:23:27); dito como regra para empresa brasileira em geral; para Itaú e Banco do Brasil a fala não diz | Não declarado pelo autor | Uma empresa não pode crescer para sempre mais que a economia do país, ou fica maior que ele; por isso o crescimento acompanha o PIB | aula 3, 1:10:48 a 1:12:11; 1:23:27 | Segunda fonte independente (RF-113); termos declarados; a questão aberta sobre a base de 1 a 3% |

**Nota sobre a base do crescimento, sem conclusão.** Série do IBGE, SIDRA tabela 6784, consultada em
24/11/2026. Variação em volume (real) do PIB, de 2013 a 2024: entre -3,5% e 4,8% ao ano, média
geométrica de 0,97%. Variação dos valores correntes (nominal), de 2014 a 2024: entre 2,98% e 18,43%
ao ano, média geométrica de 7,47%. A base do intervalo de 1 a 3% dito na aula continua não declarada
pelo autor, e a leitura desta comparação é do curador.

## 3. Atribuições a terceiro, a conferir em texto do próprio terceiro

| O que o autor atribui | A quem | Aula e instante | Onde conferir | Estado |
|---|---|---|---|---|
| Projetar até 10 anos | Warren Buffett | aula 3, 1:01:09 | | não conferido |
| Taxa fixa de 10% na perpetuidade | Warren Buffett | aula 3, 1:38:29 | | não conferido |
| Usar o fluxo de caixa aos acionistas como o fluxo a descontar (1:01:35), que o livro mostrado na aula chama de lucro aos proprietários (29:24). A igualdade entre esse fluxo e o lucro líquido é afirmação do autor da aula (31:13, 34:46, 1:01:48), e não parte da atribuição | Warren Buffett | aula 3, 1:01:35; 29:24 | | não conferido |
| Crescimento na perpetuidade pela média do PIB, um pouco abaixo | "todos os analistas" | aula 3, 1:11:19 | | não conferido |
| 90% do resultado da empresa vem dos próximos cinco anos, então não precisa projetar mais. Conta a conferir no livro: na tabela citada na aula, 100 por ano a 10%, os cinco primeiros anos somam 379,08, e a perpetuidade soma 1.000 | Ricardo Goulart Serra, coautor com Michael Wickert de Valuation: guia fundamental e modelagem em Excel (São Paulo: Atlas, 2021, 1. ed.), mostrado na aula em 1:05:23 | aula 3, 1:06:23 | | não conferido |
