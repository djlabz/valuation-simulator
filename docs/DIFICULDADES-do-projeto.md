# Dificuldades estruturais do valuation-simulator

**O que é este arquivo.** Registro dos problemas que não tinham solução pronta e exigiram construção própria. Serve de matéria-prima para explicar o projeto depois: cada entrada tem o problema, por que a saída óbvia não funciona, o que foi feito, e como o problema apareceu.

**Como usar.** Vai crescendo. Entrada nova quando um problema se revelar estrutural, e não quando for só trabalhoso.

---

## 1. Uma IA que não pode calcular num produto que só existe para calcular

**O problema.** O produto é uma calculadora de valuation com IA. Mas modelo de linguagem não é determinístico, e resultado financeiro que muda entre execuções não serve para decidir nada nem para auditar.

**Por que a saída óbvia não funciona.** Instruir o modelo a ser cuidadoso não resolve: a não determinação é da natureza dele, não da instrução. E deixar o modelo calcular com verificação depois só move o problema, porque a verificação também seria feita por ele.

**O que foi feito.** Separação por camada com garantia estrutural, não por instrução. O agente classifica o ativo, extrai dado de documento e explica resultado. Quem calcula são funções puras testadas. Quem decide metodologia são arquivos de conhecimento declarativos. Quem escolhe premissa é o usuário.

A garantia não está em pedir que o agente não calcule: está em ele não ter caminho de escrita que produza número. As ferramentas expostas a ele aceitam fato com procedência, nunca resultado.

**Como apareceu.** Foi decisão de partida, e é a tese do projeto.

---

## 2. Metade dos requisitos existe para o software informar sem recomendar

**O problema.** Recomendar investimento sem certificação é atividade regulada. Um simulador que entrega preço-alvo está a um passo de fazer exatamente isso.

**Por que a saída óbvia não funciona.** Aviso legal não protege. Se o software escolhe a taxa de desconto, quem avaliou o ativo foi o software, independentemente do que o rodapé diga.

**O que foi feito.** Oito restrições permanentes que atravessam código, interface e conteúdo. Nenhuma premissa nasce preenchida. Nenhuma ordenação padrão por atratividade. Nenhum cenário marcado como mais provável. Todo número exibido rastreável a fato com procedência, a escolha do usuário, ou a aritmética sobre os dois.

A consequência prática é contraintuitiva: o produto ficou mais útil, não menos. Onde caberia uma sugestão de valor, entraram três mecanismos que informam sem escolher: composição da premissa a partir de partes observáveis, tabela de sensibilidade, e cenários lado a lado.

**Como apareceu.** Preocupação inicial do autor, refinada até virar arquitetura.

---

## 3. A fronteira entre conhecimento imutável e conhecimento autorado

**O problema.** O sistema precisa saber que uma transmissora se avalia diferente de um banco. Esse conhecimento tem duas naturezas misturadas: o que decorre de contrato, norma e aritmética, e o que é prática analítica aprendida.

**Por que a saída óbvia não funciona.** Tratar tudo como conteúdo do projeto faz o software emitir opinião metodológica. Tratar tudo como opinião do usuário deixa o produto sem nada.

**O que foi feito.** Critério único: é imutável o que é verdadeiro por força de contrato, norma contábil, regulação ou aritmética, independentemente do ano, do ciclo e de quem analisa. O resto sai.

Na prática isso removeu cerca de 35% do conteúdo dos arquivos setoriais, incluindo todas as heurísticas de leitura, todas as faixas de referência e todos os modos de granularidade.

**Como apareceu.** Padrão observado ao longo de várias etapas: o agente inventava conteúdo analítico para preencher campo obrigatório de schema, marcava como pendência, e a fila crescia. A causa não era indisciplina: era que os arquivos setoriais tinham sido esboçados numa conversa de planejamento e nunca autorados.

---

## 4. Proteção que existe, aparenta funcionar, e nunca reprovou nada

**O problema.** Validação escrita e nunca exercitada é indistinguível de validação que funciona. A suíte fica verde nos dois casos.

**Por que a saída óbvia não funciona.** Cobertura de teste não pega: o código da validação é executado, ele só nunca reprova. Mutation testing não pega quando não existe mutante que revele o caso. E revisão humana depende de alguém lembrar de procurar.

**O que foi feito.** Uma varredura de dois comandos que compara o conjunto de requisitos citados no schema com o conjunto afirmado em teste. A diferença é a lista de proteções que ninguém tentou furar.

Virou passo obrigatório do protocolo, com triagem manual, porque parte da diferença é rótulo e não lacuna.

**Como apareceu.** Uma inspeção encontrou dois refinamentos de schema que nunca haviam reprovado um único caso. Ao virar procedimento, a varredura pegou o próprio autor na tarefa seguinte: ele criou duas fixtures, rodou as provas, colou o resultado, e esqueceu de escrever os testes. A suíte estava verde com fixtures que nada afirmavam.

---

## 5. Fixture que não discrimina a ambiguidade que deveria testar

**O problema.** Um valor de teste pode dar o mesmo resultado nas duas interpretações possíveis do campo. O teste passa e a interpretação nunca foi verificada.

**Por que a saída óbvia não funciona.** O teste está correto, a asserção é verdadeira, e a cobertura é total. Não existe ferramenta que sinalize.

**O que foi feito.** Regra com teste de decisão: existe outra leitura plausível deste campo? Se existe, o valor escolhido tem que dar resultado diferente nas duas leituras.

**Como apareceu.** Quatro ocorrências antes de virar regra, e uma quinta depois.

Um fator de redução com valor 0,5 é o próprio complemento de si mesmo, então o teste ficava verde tanto lendo o campo como "o que sobra" quanto como "o que se corta". Uma busca de máximo em lista sempre ordenada nunca exercitou a comparação. Um campo sempre preenchido com nulo explícito nunca exercitou a ausência. E, depois da regra escrita, o próprio autor criou uma fixture cuja ordem de inserção já era a ordem alfabética, o que fazia a ordenação sobreviver a ser removida.

A quinta ocorrência é o argumento de que a regra precisa ser passo de procedimento, e não princípio: princípio depende de lembrar no momento errado.

---

## 6. Reprodutibilidade num produto que consome dado que muda

**O problema.** Auditoria exige que o mesmo cálculo dê o mesmo número anos depois. Mas cotação muda por minuto, e a base de conhecimento cresce.

**Por que a saída óbvia não funciona.** Guardar só os inputs não basta: o resultado depende também da versão da metodologia, da versão da engine e do que o usuário viu ao decidir.

**O que foi feito.** Registro imutável por cálculo, contendo fatos com procedência, premissas do usuário, versões de tudo que participou, modelo selecionado com justificativa, e a cotação congelada no instante da execução. Engine nunca lê dado ao vivo.

E a consequência menos óbvia: a base de conhecimento não muda em tempo de execução. Ingestão de conteúdo novo é processo offline com revisão humana e commit, justamente para que o mesmo cálculo não mude sozinho.

**Como apareceu.** Ao desenhar a auditoria, ficou claro que o registro precisava de versão de formato própria: sem ela, um registro antigo sem campo de cenário é indistinguível de um registro cujo formato ainda não conhecia cenários.

---

## 7. Escrever a engine é o que gera as perguntas certas

**O problema.** O produto exige entender profundamente a mecânica de cada setor. O autor não tinha esse conhecimento, e essa é justamente a razão de o produto existir.

**Por que a saída óbvia não funciona.** Estudar o setor antes de programar é pesquisa sem foco: sem cálculo escrito, não existe critério para saber quais perguntas importam, e o estudo expande sem terminar.

**O que foi feito.** A primeira engine foi escrita como sonda deliberada. O entregável dela não era o código, era a lista das premissas de interpretação que ela foi obrigada a assumir por falta de especificação. Dezesseis premissas, dez bloqueantes.

Com a lista na mão, a pesquisa passou a ter escopo e fim.

**Como apareceu.** Tentativa de decidir entre parar tudo para estudar ou seguir programando. A sonda é o híbrido, e ela funcionou: uma das dezesseis revelou que a engine chamada de fluxo de caixa livre não calculava fluxo de caixa livre, porque a lista de inputs não tinha imposto, capex nem capital de giro.

---

## 8. Correção estrutural cria pergunta que antes não existia

**O problema.** Tornar um modelo mais preciso pode expor ambiguidade que a imprecisão anterior escondia.

**O que foi observado.** Enquanto o período de projeção era genérico, "reajustar antes de usar o valor" e "usar como está" eram indistinguíveis. Ao modelar o ciclo tarifário explicitamente, a pergunta passou a existir, e a resposta errada infla o resultado inteiro por um fator.

**Por que isso é estrutural e não acidente.** Vai acontecer a cada correção de modelagem. A imprecisão não é neutra: ela mascara escolhas que ninguém fez conscientemente.

**Como apareceu.** A correção da grade temporal produziu, como efeito colateral, uma premissa nova que ninguém tinha listado.

---

## 9. Provedor de IA não transcreve, resume

**O problema.** A ingestão de conhecimento tem vídeo como fonte principal, o que exige transcrição.

**Por que a saída óbvia não funciona.** Pedir transcrição a um modelo de linguagem devolve resumo. Testado em três provedores: dois resumiram e um recusou explicitamente. O que resumiu sem acesso ao vídeo produziu quatro afirmações que não existem na fonte, a partir de conhecimento de treino, apresentadas como conteúdo do vídeo.

E instrução melhor não corrige, porque o problema é ausência de acesso à fonte, não redação do pedido.

**O que foi feito.** Ferramenta que usa a legenda publicada pela plataforma, ou reconhecimento de fala local quando não houver legenda. Sem modelo de linguagem em nenhum ponto.

O critério que sustenta a escolha: erro de modelo de linguagem é semântico e invisível, porque ele completa lacuna com plausibilidade e o resultado é coerente. Erro de reconhecimento de fala é fonético, e na maioria dos casos absurdo à leitura.

**Como apareceu.** Ao tentar obter a transcrição de um vídeo, três provedores devolveram três resultados diferentes, e a comparação revelou que nenhum era transcrição.

---

## 10. Reconhecimento de fala inventa em trecho sem fala

**O problema.** A alternativa ao modelo de linguagem também inventa, só que em outro lugar.

**O que foi medido.** Um arquivo com um tom puro de 440 Hz, som sem fala alguma, transcrito nas duas configurações: com detecção de atividade de voz, zero segmentos; sem ela, uma frase curta e genérica, inventada.

**O que foi feito.** O filtro é obrigatório e não configurável, e a razão está registrada como decisão. Comentário no código não protegeria, porque quem desliga o filtro mexe no código e o comentário sai junto.

E a decisão que permite reconhecimento de fala depende desta: ele é aceitável porque não inventa, e ele não inventa porque o filtro está ligado.

**Como apareceu.** Teste deliberado de laboratório, depois confirmado em vídeo real de 26 minutos, com conferência independente de terceiro sem contexto do projeto.

---

## 11. O erro de transcrição não é estável, e a correção não é onde se resolve

**O problema.** Legenda automática e reconhecimento de fala erram sistematicamente o vocabulário técnico, e erram diferente. No mesmo vídeo, um único nome de companhia apareceu em sete grafias erradas na legenda e três no reconhecimento de fala.

**Por que a saída óbvia não funciona.** Mapa de erro para termo correto pressupõe erro estável. Se um termo vira dez coisas, o mapa precisa de dez entradas e a próxima execução inventa a décima primeira.

E parte dos erros produz palavra real do idioma. Um termo financeiro virou o nome de uma criatura de ficção, que existe no dicionário e passa por qualquer verificação de vocabulário.

**A primeira solução, e por que ela estava no lugar errado.** A inversão parecia resolver: em vez de listar erros, listar termos que existem no domínio e comparar por proximidade fonética, deixando as variações colapsarem sem entrada própria.

Isso continua válido, e deixou de ser a peça principal. Uma rodada de pesquisa com três provedores mostrou convergência num ponto que reordena tudo: **a alavanca principal é adaptar o modelo de fala ao vocabulário antes de transcrever, não corrigir depois.** Existe parâmetro para isso no modelo local, com limite documentado.

**A consequência que salva metade do caso.** O enviesamento antes só alcança o que se controla. Para legenda publicada por plataforma não há acesso ao processo de transcrição, e ali o dicionário continua sendo a única defesa.

Então são dois mecanismos com pesos diferentes, e não um: enviesamento onde há controle, dicionário onde não há, e o dicionário pega o que escapar dos dois.

**Limite conhecido, que nenhum dos dois resolve.** Correção fonética não pega erro que produz palavra plausível de campo semântico próximo. O dicionário reduz, não elimina, e texto normalizado nunca é texto confiável.

**Como apareceu.** Medição termo a termo entre as duas fontes do mesmo vídeo, comparação que não estava prevista na tarefa que a produziu. A reordenação veio depois, de pesquisa deliberada.

---

## 12. Corrigir o texto quebra a rastreabilidade que a correção deveria preservar

**O problema.** O texto transcrito precisa ser corrigido para ser útil, e precisa permanecer conferível contra o áudio para ser confiável. As duas exigências se contradizem.

**Por que a saída óbvia não funciona.** Substituir uma expressão errada de duas palavras por um termo correto de três muda a contagem de palavras. Qualquer referência posicional ao texto original desalinha, e o instante citado passa a apontar para outra fala.

Marcar a correção no próprio texto atenua e não resolve: o texto passa a conter algo que não foi dito, e o registro de procedência aponta para um instante cujo áudio diz outra coisa.

**O que foi feito.** Anotação em camada separada. O texto original e os instantes ficam imutáveis, e a normalização é uma camada que aponta para posições no original, registrando a regra aplicada, a versão do dicionário e quem decidiu.

Isso resolve de graça uma exigência que já estava registrada como pendente, de que o texto normalizado precisava marcar onde houve correção. Com camada separada não há o que marcar, porque o original nunca é tocado: a camada é a própria marcação.

**Como apareceu.** A exigência de marcar a correção foi levantada antes, ao registrar a decisão sobre o dicionário. O mecanismo que a satisfaz apareceu na pesquisa, com nome e precedente em outra área, e a resposta era mais simples que o problema sugeria.

---

## 13. Pesquisar domínio que não se domina com ferramenta que fabrica fonte

**O problema.** Construir o produto exige conhecimento de domínio que o autor não tem, e a via mais rápida de obter esse conhecimento são modelos de linguagem, que inventam fonte com fluência.

**Por que a saída óbvia não funciona.** Instruir a citar fonte primária não basta: as instruções foram dadas e os erros aconteceram de todo modo. E convergência entre provedores não confirma nada, porque eles podem convergir no mesmo erro por consumirem o mesmo material.

**O que foi feito.** Mesmo pedido em três ou quatro provedores, e consolidação em conversa separada, com três regras: divergência não se resolve por voto, quem citou fonte verificável ganha mesmo sozinho, e afirmação sem fonte fica classificada como não verificada em vez de aceita.

E a regra que mais rendeu, incorporada na segunda rodada: **verificar na fonte citada as afirmações que decidem a classificação, antes de classificar.** Numa rodada de quatro verificações, três derrubaram ou reduziram a afirmação.

**Os erros medidos, para dimensionar o problema.** Um provedor inventou o significado de uma sigla do domínio. Outro usou relatório de bolsa estrangeira como fonte sobre companhia brasileira. Outro atribuiu a uma norma internacional um fluxo que ela não define, e inventou campos de um formato. Outro apresentou artigo sobre comentário esportivo em inglês como evidência de ganho terminológico. Outro declarou inviável uma operação para a qual existe ferramenta documentada e madura.

E o provedor com melhor desempenho também errou um número por mais de trinta vezes.

**O que não se resolve.** O padrão não é de um provedor específico. Em duas rodadas, o pior foi um diferente em cada. É comportamento de qualquer modelo respondendo sem acesso a fonte primária, e a única defesa é abrir a fonte.

**Como apareceu.** Duas rodadas de pesquisa, sobre assuntos distintos, com o mesmo tipo de falha e evidência documentada em cada.

---

## 14. Procedência exige forma diferente por tipo de fonte

**O problema.** O requisito de procedência exigia documento e página. Vídeo não tem página. Planilha também não.

**Por que a saída óbvia não funciona.** Criar um conjunto de campos para vídeo resolve um tipo e deixa o próximo de fora.

**O que foi feito.** Procedência passou a ser um conjunto de campos que localiza o trecho na fonte, com o conjunto dependendo do tipo declarado. Trecho original é comum a todos.

Um tipo ficou como exceção assumida: imagem localiza apenas o arquivo, porque não existe caso real de extração de imagem no projeto e definir formato de região sem caso concreto seria inventar estrutura.

**Uma sutileza que a medição revelou:** procedência de vídeo precisa declarar o método que produziu o texto. Legenda e reconhecimento de fala produzem trechos diferentes para o mesmo instante do mesmo vídeo. Sem o método declarado, dois registros de procedência se contradizem e nada explica a contradição.

**Como apareceu.** Ao registrar a ferramenta de vídeo, ficou claro que o requisito assumia um único tipo de fonte enquanto o escopo do produto já declarava quatro.

---

## 15. O agente de desenvolvimento como verificador do autor

**O problema.** Especificação escrita por quem não domina o domínio contém erro, e o erro se propaga para o código sem nada sinalizar.

**O que foi observado.** Ao longo do projeto, o agente que executa encontrou repetidamente erros de quem especifica: requisito citado que não existia, arquivo descrito com conteúdo que estava em outra versão, números atribuídos a um documento que não os continha, e comportamento de ferramenta afirmado sem verificação.

Em todos os casos, o agente recusou executar e provou a ausência por medição, em vez de deduzir.

**O que foi feito.** Regras de conduta que tornam isso obrigatório e não opcional: justificar toda implementação, contestar instrução que viole invariante em vez de executá-la reclamando, e não transformar inferência em fato documentado.

**Por que é estrutural.** Num projeto onde o autor está aprendendo o domínio enquanto o constrói, essa verificação é a única barreira entre erro de especificação e erro em produção.
