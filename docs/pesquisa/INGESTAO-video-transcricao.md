> # Ressalva de leitura, obrigatória antes de usar qualquer coisa daqui
>
> **O que este arquivo é.** Registro de **trabalho de ferramenta**: por que provedor de IA não
> serve para transcrever fonte de vídeo, e o que a ferramenta `tools/baixar-legenda.py` faz no
> lugar. É material de apuração, do mesmo gênero que a consolidação de pesquisa e o relatório de
> conferência desta pasta.
>
> **O que ele NÃO toca.** Nenhuma engine, nenhum playbook, nenhum schema de conhecimento. A única
> alteração que ele produziu fora de `tools/` foi no `.gitignore`, para o ambiente virtual da
> ferramenta ficar fora do versionamento. As decisões que saíram daqui são D-089 a D-092.
>
> **O que ficou VERIFICADO em 04/09/2026, seção 3.7.** As duas pendências que este documento
> declarava fecharam, contra vídeo real numa máquina residencial: a desduplicação foi reconferida
> contra arquivo baixado, com correspondência de 810 linhas distintas na fonte para 810 na saída;
> e o `--transcrever` rodou ponta a ponta, com `ffmpeg` fora do `PATH`, 431 segmentos com fala.
>
> **O que CONTINUA sem verificação, e não deve ser dado por fechado.**
>
> - **Repetição legítima distante na desduplicação.** O vídeo usado não tem uma única frase
>   repetida a mais de trinta segundos de distância, então esse padrão **não foi exercitado por
>   arquivo real**. Ele continua verificado apenas contra caso construído.
> - **Qualidade de legenda.** O script não avalia, e não há como distinguir automaticamente
>   legenda ruim de fala confusa.
> - **Glossário de termo de domínio.** Decidido e não implementado (D-091). Medido nesta rodada:
>   nem a legenda nem o reconhecimento de fala são confiáveis em termo de domínio, e eles erram
>   termos diferentes.
> - **Generalidade.** Um vídeo, uma plataforma, um idioma.
>
> **Duas divergências internas de contagem, corrigidas na leitura e não no texto.** A seção 3.4
> fala em "duas correções" da desduplicação e descreve **três** tentativas; a abertura da seção 4
> diz "quatro itens" e lista **cinco**, 4.1 a 4.5.
>
> **Este arquivo não é fonte de verdade.** A fonte de verdade é
> `docs/REQUISITOS-valuation-simulator-v2.4.md`. Nada daqui autoriza copiar conteúdo para
> `conhecimento/`, e o material bruto que a ferramenta grava fica em `ingest/`, fora do
> versionamento (RNF-013, D-042).

# Ingestão de vídeo: por que não usar IA para transcrever

**O que é este documento.** Registro de um trabalho de ferramenta feito fora do repositório, que resolve um pré-requisito da Etapa do Conhecimento. Não toca engine, playbook nem schema. A seção 4 lista o que precisa de classificação, com a leitura do curador declarada e em aberto.

**Situação.** A ingestão de conhecimento prevista para a Etapa do Conhecimento tem como fonte principal aula e vídeo de terceiro. Isso exige transcrição. O teste abaixo mostra que provedor de IA não serve para essa etapa, e o que serve.

---

## 1. O teste

O mesmo pedido de transcrição do mesmo vídeo foi feito a três provedores. Nenhum dos três devolveu transcrição. Dois devolveram resumo, um recusou explicitamente.

O vídeo tem legenda automática publicada pela plataforma, com 810 linhas de conteúdo e timestamp por linha.

### 1.1. Provedor sem acesso à fonte inventou conteúdo

Um dos provedores, rodando localmente e sem navegador, não tinha acesso à legenda. Ao receber o pedido, produziu um resumo a partir de conhecimento próprio. Quatro afirmações desse resumo não existem na fonte:

| Afirmou | A fonte diz |
|---|---|
| Nomeou quatro concessões que vencem em 2030 | "vencimento de quatro raps, quatro concessões", sem nomear nenhuma |
| "98% no longo prazo" | dois valores absolutos separados. A razão foi calculada e apresentada como declarada |
| Política de payout com o qualificador "o menor" | a fonte não tem esse qualificador |
| "projetos com TIR de IPCA+10%" | a fonte diz "investir um IPCA + 10", sem mencionar TIR |

Os nomes das concessões podem até estar corretos. O problema é outro: são conhecimento de treino do modelo apresentado como conteúdo da fonte, sem marcação.

**Uma distinção que importa, porque muda a mitigação.** Este projeto já registrou erros em que uma descrição de arquivo veio de outra origem do contexto de quem escrevia. Aquilo é contaminação entre fontes que existiam, e se resolve declarando de onde vem cada descrição.

O caso aqui é outro: o provedor não tinha fonte alguma. Produziu texto do nada e apresentou como conteúdo do vídeo. Isso não se resolve com instrução, e é justamente o argumento da seção 2: instrução melhor não corrige ausência de acesso à fonte.

### 1.2. Um provedor recusou, e foi o comportamento certo

O segundo declarou de saída que entregaria resumo, e não transcrição. Avisou.

### 1.3. A transcrição boa não veio de IA

O terceiro caso foi um painel de perguntas embutido na própria plataforma de vídeo. Ele devolveu texto fiel com timestamps.

Investigado: esse painel **lê a legenda que a plataforma já tem** e a formata, removendo a duplicação do formato rolante. Não transcreve. O valor que ele agregou foi desduplicação, não transcrição.

---

## 2. A conclusão, e por que ela é estrutural

**Erro de IA em transcrição é semântico e invisível.** O modelo preenche lacuna com plausibilidade, e o resultado é gramatical, coerente e indistinguível do correto.

**Erro de reconhecimento de fala é fonético e visível.** Na legenda deste vídeo: um nome de ferramenta virou "Word", "Bazin" virou "Bazinha", "WEG" virou "Veg", "Cemig" virou "Semig", "WACC" virou "WK", "Basileia" virou "basiled".

Cinco dos seis são absurdos à leitura e não passam despercebidos.

**O sexto contraria a generalização e está na própria amostra.** Um nome de ferramenta virou "Word". O resultado é uma palavra plausível num contexto plausível: quem extrai conhecimento de uma frase sobre planilha lendo "Word" não estranha nada.

Então a afirmação correta é comparativa, e não absoluta: erro fonético é **mais** visível que erro semântico, e não invariavelmente visível. Quando o erro fonético cai numa palavra do mesmo campo semântico, ele se disfarça.

Num projeto cuja regra é que explicação inferida sem verificação não entra como fato, erro visível é preferível a erro invisível, mesmo sendo mais frequente.

**E determinismo entre provedores não sai de prompt.** Sai de todos partirem do mesmo arquivo de legenda. Instrução melhor não corrige ausência de acesso à fonte.

---

## 3. A ferramenta

`tools/baixar-legenda.py`. Baixa a legenda que a plataforma publica, sem IA em nenhum ponto do caminho.

### 3.1. Comportamento

```
python3 tools/baixar-legenda.py <url>
python3 tools/baixar-legenda.py <url> --idioma en
python3 tools/baixar-legenda.py --listar <url>
python3 tools/baixar-legenda.py            (pergunta a url)
```

Cria um ambiente virtual próprio em `tools/.venv-ingest` na primeira execução e instala o `yt-dlp` dentro dele. Nada é instalado no Python do sistema. Funciona em Windows, Linux e macOS.

Grava dois arquivos em `ingest/`: o `.srt` original e um `.txt` normalizado com uma linha por fala, prefixada pelo timestamp.

Prefere legenda manual a automática quando as duas existem, porque manual é revisada por pessoa.

Idioma padrão é `pt`. Um agente conversando em outro idioma deve passar `--idioma` explicitamente em vez de assumir o padrão.

Exit code 0 em sucesso, 2 quando não existe legenda no idioma pedido, 1 em erro de leitura do vídeo.

Quando não há legenda em idioma útil, a mensagem de erro diz que o caminho é reconhecimento de fala local, e diz explicitamente para não usar provedor de IA.

### 3.2. Cabeçalho de procedência

O `.txt` nasce com cabeçalho declarando: que é material bruto e não conhecimento autorado; que não deve ser carregado em `conhecimento/`; se a legenda é manual ou automática; título, canal, data de publicação, URL e data do download; que o timestamp é a procedência de qualquer afirmação extraída; e que legenda automática erra termo de domínio por semelhança fonética.

### 3.3. O timestamp é a procedência

Esta é a parte que conecta com o resto do projeto.

O RF-304 exige que dado extraído carregue `{documento, pagina, trecho_original}`. Para vídeo, o equivalente é `{url, timestamp, trecho_original}`. Toda afirmação extraída de legenda deve carregar timestamp, e afirmação sem timestamp deve ser rejeitada, pela mesma razão que dado sem procedência é rejeitado.

Isso é verificável: quem duvidar abre o vídeo naquele ponto.

### 3.4. Um detalhe do formato que causou defeito e foi corrigido

A legenda automática da plataforma é rolante: cada bloco repete a linha anterior e acrescenta a nova, com blocos de dezenas de milissegundos servindo de preenchimento entre eles. Processar bloco por bloco produz o dobro de linhas, quase todas duplicadas.

A primeira versão do script tinha esse defeito e devolveu 1635 linhas para um conteúdo de 810. A correção emite cada linha física uma única vez.

O timestamp usado é o de fim do bloco onde a linha aparece pela primeira vez, porque é a atribuição que a própria plataforma faz no painel dela, o que permite comparar os dois textos sem deslocamento.

**A desduplicação passou por duas correções, e as duas vale registrar porque a primeira versão parecia funcionar.**

A primeira tentativa comparava contra o conjunto de tudo que já havia saído. Isso descarta frase repetida de verdade: se o palestrante disser a mesma coisa em dois momentos distintos, a segunda ocorrência desaparece sem deixar rastro. O resultado de "zero duplicadas" descrevia o efeito do algoritmo, não uma propriedade do texto.

A segunda tentativa comparava contra os blocos vizinhos no arquivo. Também falha: bloco vizinho na sequência do arquivo pode estar a minutos de distância no tempo, quando há corte de edição.

A versão atual compara contra janela de tempo de trinta segundos. A repetição do formato rolante ocorre dentro de poucos segundos, e repetição real fica de fora da janela e sobrevive. Verificado com caso construído: repetição rolante desduplicada, repetição real a vinte minutos de distância preservada.

### 3.5. Verificação executada

Testado contra vídeo real, do zero, com o ambiente virtual apagado antes.

Criação do venv, instalação do `yt-dlp`, leitura de metadados, escolha de idioma, download e normalização: todos funcionaram. Resultado de 810 linhas de conteúdo, zero duplicadas, do primeiro ao último timestamp.

Caminhos de erro conferidos: idioma inexistente sai com 2 e mensagem útil, URL inválida sai com 1 e reporta o erro da ferramenta, segunda execução é idempotente.

Nome de arquivo normalizado para ASCII, porque acento em nome de arquivo se comporta de forma diferente conforme o locale do sistema, e o nome precisa ser idêntico em qualquer máquina.

Uma limitação observada: a plataforma aplica limite de requisição. Download repetido em sequência curta pode receber recusa temporária. O script reporta o erro da ferramenta em vez de mascarar.

**E uma promessa que a primeira versão fazia e não podia cumprir.** O cabeçalho dizia "mesma fonte, mesmo resultado, em qualquer máquina e por qualquer agente". Isso vale para execuções simultâneas, e não ao longo do tempo: a versão da ferramenta muda, e a legenda automática que a plataforma publica também.

O que garante reprodutibilidade é o arquivo gravado, não a capacidade de baixar de novo. Duas consequências foram aplicadas.

A ferramenta deixou de se atualizar sozinha em cada execução. A atualização passou a ser deliberada, por `--atualizar`, para que a mesma URL não passe por versões diferentes sem ninguém pedir.

E fica registrada uma questão de política que este documento não resolve: o arquivo bruto que sustenta a procedência mora em `ingest/`, que está fora do versionamento. Isso significa que o material que permite conferir um timestamp meses depois não sobrevive a uma troca de máquina. É o mesmo efeito do arquivo perdido registrado na D-080. A decisão de não versionar pode continuar valendo, mas hoje ela é herdada de uma regra escrita para outro propósito, e merece ser tomada de propósito.

---

### 3.6. Vídeo sem legenda: reconhecimento de fala local

O script cobre esse caso com `--transcrever`, e a distinção conceitual precisa ficar clara antes do resto.

**Reconhecimento de fala não é a mesma coisa que pedir transcrição a um provedor de IA.** Um modelo de fala mapeia áudio para texto. Ele não completa lacuna com plausibilidade, não consulta conhecimento próprio, não resume. O erro dele é fonético e visível, exatamente como o da legenda automática. Usar reconhecimento de fala local não contradiz nada da seção 2.

#### Cadeia de dependência, e por que ela dispensa ffmpeg

O ponto de atrito para funcionar em qualquer sistema seria exigir ffmpeg instalado. O desenho evita isso em dois passos:

O download pede a trilha de áudio já pronta, sem conversão. Não há transcodificação, logo não há ffmpeg envolvido.

A leitura do áudio usa uma biblioteca que traz as próprias bibliotecas de decodificação. **Verificado:** o script rodou com o `PATH` vazio, sem ffmpeg acessível em lugar nenhum, e decodificou o arquivo de áudio normalmente.

Tudo continua dentro do mesmo ambiente virtual isolado. O modelo de fala é instalado lá, os pesos são baixados na primeira execução e reaproveitados.

#### A alucinação em trecho sem fala, medida

Reconhecimento de fala tem exatamente uma forma de invenção, e ela foi reproduzida em laboratório.

Um arquivo de áudio com um tom puro de 440 Hz, ou seja, som sem fala alguma, foi transcrito nas duas configurações:

| Configuração | Resultado |
|---|---|
| Com detecção de atividade de voz | zero segmentos |
| Sem detecção de atividade de voz | uma frase curta e genérica, inventada |

Consequência de desenho: a detecção de atividade de voz é obrigatória e não configurável no script. Sem ela, vinheta de abertura, música de fundo e pausa longa produzem texto que ninguém falou.

Ela reduz e não elimina. O cabeçalho do arquivo gerado registra que frase curta e genérica isolada, perto de vinheta ou música, é suspeita.

#### Escolha de modelo

O padrão é o modelo intermediário. Modelos menores erram termo de domínio com frequência alta, e termo de domínio é justamente o que interessa neste projeto: sigla de indicador, nome de agência, nome de norma, nome de companhia.

O custo é tempo de processamento em máquina sem placa de vídeo. Não é problema de correção, é de paciência.

#### O que não foi verificado ponta a ponta, e por quê

> **Fechado em 04/09/2026. Ver seção 3.7.** O parágrafo abaixo descreve o estado até aquela data e fica como registro de por que a verificação faltava. A execução ponta a ponta em máquina residencial foi feita e está na seção 3.7.

O download de áudio não pôde ser testado do ambiente onde o script foi desenvolvido: a plataforma bloqueou o acesso ao fluxo de mídia por detecção de automação, embora o download de legenda tenha passado. Endpoint de legenda é menos protegido que endpoint de mídia.

As duas metades foram verificadas separadamente. O download de áudio é uma chamada de uma linha à mesma ferramenta que já baixa a legenda. A transcrição foi testada com arquivo de áudio local.

A primeira execução com `--transcrever` numa máquina residencial é o teste que falta.

---

### 3.7. Execução em máquina residencial, 04/09/2026

Rodada contra `https://youtu.be/FR9RRXVpg9I`, 26min22s, que é o mesmo vídeo de onde saíram as observações de termo da seção 4.3. As duas verificações pendentes fecharam.

#### Desduplicação contra arquivo real: o padrão rolante fechou, o outro não foi exercitado

O script devolveu 810 linhas de conteúdo. A conferência não usou a contagem que o próprio script imprime, que seria circular:

| Medida, feita sobre os arquivos | Resultado |
|---|---|
| Linhas distintas no `.srt` bruto | 810 |
| Linhas de conteúdo no `.txt` final | 810 |
| Repetições rolantes no bruto, linha idêntica ao bloco anterior | 1617 |
| Textos repetidos no `.txt` final | 0 |
| Duplicatas sobreviventes dentro da janela de 30s | 0 |

Correspondência de 810 para 810: as 1617 repetições rolantes saíram e **nenhuma linha distinta foi perdida**.

**A repetição legítima distante NÃO foi exercitada por este arquivo, e isso não é detalhe.** Medido: zero linhas com ocorrências separadas por mais de trinta segundos na fonte. Este vídeo não repete frase. Então o arquivo real prova que o rolante desaparece e que nada distinto se perde, e **não** prova que repetição real sobreviveria. Essa metade continua verificada apenas contra caso construído.

#### Reconhecimento de fala ponta a ponta, com ffmpeg fora do PATH

Rodado com `PATH` apontando para um diretório vazio, confirmado antes que `ffmpeg` ficava invisível, embora ele exista na máquina.

```
transcrevendo com modelo 'medium', pode demorar
segmentos com fala: 431
exit: 0
```

Dezesseis minutos para 26min22s de áudio, em CPU, sem placa de vídeo. O modelo foi o padrão intermediário, não trocado por menor.

**Duas afirmações do documento conferidas:** o `.m4a` de 25MB baixou com o `PATH` neutralizado, o que fecha a independência de ffmpeg; e o `vad_filter=True` foi observado na linha de comando do subprocesso em execução, não só lido no código.

#### Legenda contra reconhecimento de fala, no mesmo vídeo

Comparação que não estava prevista, e é a informação mais útil desta rodada. Os dois textos foram alinhados por timestamp e os termos de domínio contados nos dois:

| Termo | Legenda: certo / errado | Fala: certo / errado |
|---|---|---|
| TAESA | 2 / 43 | 40 / 11 |
| yield | 0 / 2 | 16 / 0 |
| Cemig | 0 / 2 | 1 / 1 |
| WACC | 0 / 1 | 0 / 1 |
| Basileia | 0 / 1 | 0 / 1 |
| WEG | 0 / 2 | 0 / 3 |

**Nenhuma das duas fontes é confiável em termo de domínio, e elas erram termos diferentes.** A legenda erra o nome da própria companhia em 43 de 45 ocorrências, incluindo a primeira frase do vídeo: `0:02 Café na mão. Vamos falar de Taía`. O reconhecimento de fala acerta TAESA em 40 de 51 e acerta `yield` onde a legenda escreve `do Y` e `no y`. Nos dois casos WACC vira outra palavra, `WK` na legenda e `walk` na fala, e Basileia vira `basiled` e `basileiro`.

**Consequência que reforça a decisão do glossário.** A divergência entre as duas fontes é, ela mesma, um detector: onde legenda e transcrição discordam num termo, há erro em pelo menos uma das duas. Isso não substitui a lista de correção, porque as duas podem errar junto, como em WACC e Basileia, mas reduz o que precisa ser conferido à mão.

#### O áudio é descartável

O arquivo de áudio fica em `ingest/`, que está fora do versionamento. Depois da conferência da transcrição, ele pode ser apagado: não é conhecimento, e o que precisa sobreviver é o texto com timestamp.

---

## 4. O que precisa ser classificado e registrado

Quatro itens saíram deste trabalho. A leitura do curador sobre cada um está declarada, e a classificação final não está fechada.

### 4.1. Provedor de IA não transcreve, resume

Transcrição de vídeo vem de legenda da plataforma, ou de reconhecimento de fala local quando não houver legenda. Nunca de LLM.

**Leitura do curador:** é regra de ferramenta e cabe como decisão numerada.

**Cuidado de redação, e ele não é cosmético.** A decisão precisa permitir reconhecimento de fala local de forma explícita, com o motivo. Lida ao pé da letra como "nunca de IA", ela proíbe o `--transcrever` que a própria ferramenta implementa, e alguém em seis meses desliga a funcionalidade por conformidade.

O texto precisa carregar a distinção: reconhecimento de fala mapeia áudio para texto e não completa lacuna com plausibilidade. É por isso que ele é aceitável e o LLM não.

**E esta decisão depende da 4.4.** O que sustenta "reconhecimento de fala é aceitável" é ele não inventar. Ele não inventa porque o filtro de atividade de voz está ligado. Se alguém desligar, esta decisão deixa de se sustentar.

### 4.2. Procedência de fonte em vídeo

Afirmação extraída de legenda ou de transcrição carrega `{url, timestamp, trecho_original}`. Afirmação sem timestamp é rejeitada, pela mesma razão que dado sem procedência é rejeitado pelo core.

**Leitura do curador, e é o item mais importante dos quatro:** isto não parece decisão, parece requisito. É o RF-304 aplicado a um tipo de fonte que o documento nunca previu. O RF-304 fala de documento e página, e vídeo não tem página.

Consequência concreta se nada mudar: o core rejeitaria toda afirmação extraída de vídeo, ou aceitaria com o campo de página preenchido por algo que não é página, o que é pior.

**E a lacuna é maior que vídeo.** Criar um conjunto de campos só para vídeo resolve um tipo e deixa o próximo de fora. A conferência da TAESA já extraiu de planilha, e planilha tem arquivo, aba e célula, e também não tem página. Página web tem URL e não tem página.

A forma que resiste: procedência é um conjunto de campos que localiza inequivocamente o trecho na fonte, o conjunto depende do tipo de fonte, e o tipo é declarado. O trecho original é comum a todos os tipos; o resto varia.

Isso é emenda no RF-304 mais um requisito novo declarando os tipos suportados, com incremento de versão do documento.

**Um detalhe que precisa vir junto:** o timestamp que esta ferramenta grava é o de fim do bloco, escolhido para casar com o painel da plataforma. É convenção, e precisa estar declarada junto com a procedência. Sem isso, dois extratores usando ferramentas diferentes produzem timestamps deslocados para a mesma frase.

### 4.3. Glossário de normalização de termo de domínio

Reconhecimento de fala e legenda automática erram justamente o termo de domínio, e sempre a mesma classe: sigla de indicador, nome de agência, nome de norma, nome de companhia. Observado neste vídeo: WACC virou "WK", Basileia virou "basiled", Cemig virou "Semig", WEG virou "Veg", Bazin virou "Bazinha".

Sem lista de correção, a extração transcreve o erro para dentro do repositório.

**Leitura do curador: não sei classificar.** Não é conhecimento analítico, porque corrigir "basiled" para "Basileia" é ortografia e não interpretação. Também não é estrutura, porque não define input nem regra de cálculo.

**A divisão que resolve:** o mecanismo é ferramenta, a lista é conhecimento.

Aplicar um mapa de erro fonético para termo correto é código, e nasce agora. Mas o conteúdo da lista é vocabulário setorial: saber que existe uma coisa chamada Basileia, que WACC é um indicador, que Cemig é uma companhia. Quem não conhece o setor não monta a lista, e essa é exatamente a fronteira da RNF-013.

Então a lista nasce vazia e é preenchida pelo curador, uma entrada por vez, conforme os erros aparecem. Agente não escreve entrada, porque decidir que "Veg" significa WEG exige saber que WEG existe.

Se ela é conhecimento, o lugar dela é `conhecimento/`, com schema próprio, passando pelo CLI de validação como os outros tipos. O argumento a favor: ela influencia dado extraído, e dado extraído alimenta cálculo, então uma entrada errada propaga.

**Uma ressalva que precisa ir junto.** Correção automática de termo é a única operação desta ferramenta que altera o texto da fonte; todo o resto preserva. Então ela precisa ser registrada: o texto normalizado deve marcar onde houve correção, senão a procedência aponta para um timestamp cujo áudio diz outra coisa.

### 4.4. Detecção de atividade de voz obrigatória

Medido na seção 3.6: som sem fala produz frase inventada com o filtro desligado, e nenhum segmento com ele ligado. O script não expõe isso como opção, e a razão está registrada no código.

**Leitura do curador:** merece número, e o comentário no código não basta.

O motivo é que a 4.1 depende desta. Permitir reconhecimento de fala local se apoia em ele não inventar, e ele não inventa porque o filtro está ligado. Comentário não protege isso, porque quem desliga o filtro mexe no código e o comentário sai junto. Decisão numerada registra que a escolha não é configurável e por quê.

**E o teste vira executável.** O caso do tom puro serve de controle negativo: gerar o tom, transcrever com e sem o filtro, afirmar zero segmentos no primeiro caso. É o mesmo padrão de controle negativo já usado no projeto para provar que uma proteção pega.

### 4.5. Python como segundo runtime

O projeto é TypeScript sobre Bun, e `tools/validar-conhecimento.ts` roda com bun. Esta ferramenta traz um segundo runtime, com um ambiente virtual que precisa entrar no `.gitignore` e que nunca vai passar por verificação de tipos.

**Leitura do curador:** foi a escolha certa aqui porque as duas ferramentas que fazem o trabalho, a de download e a de reconhecimento de fala, não têm equivalente em JavaScript. Mas isso precisa estar registrado como exceção justificada, e não como abertura de precedente para ferramenta futura.

---

## 5. O que não está resolvido

O script obtém a legenda. Ele não extrai conhecimento dela.

A extração exige julgamento: separar heurística de leitura, de fato sobre companhia, de premissa do autor. Essa é a `.claude/skills/extrair-conhecimento/` prevista desde o Passo 0, e o teste acima deu a especificação que antes faltava.

Vídeo com legenda ausente está coberto por `--transcrever`, com a ressalva de verificação da seção 3.6.

Legenda existente mas de qualidade ruim continua sem tratamento: o script não avalia qualidade, e não há como distinguir automaticamente legenda ruim de fala confusa. Isso é julgamento de quem lê.

O `--modelo` passou a ser validado contra a lista de modelos conhecidos, para que valor inválido dê erro de argumento em vez de erro de download de pesos.

A escolha de variante regional de idioma passou a avisar quando há ambiguidade, em vez de decidir por ordem alfabética em silêncio. Pedir `pt` com `pt-BR` e `pt-PT` disponíveis não tem resposta óbvia, e a escolha precisa aparecer.

E a última rodada de correções da desduplicação **foi reconferida contra arquivo real em 04/09/2026**, na seção 3.7, com o padrão rolante fechado e **a repetição legítima distante ainda não exercitada**, porque o vídeo usado não tem nenhuma. Essa metade continua valendo só contra caso construído, e fecha no primeiro vídeo que repita frase a mais de trinta segundos de distância.
