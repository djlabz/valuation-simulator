# Consolidação: normalização de texto transcrito com dicionário de termos de domínio

Três pesquisas (Claude, Gemini, Qwen), mesmo prompt, consolidadas em 06/09/2026.

**Nota de método.** Antes de classificar, quatro afirmações que decidiam classificação foram verificadas na fonte citada. Três delas caíram ou mudaram de tamanho. Classificação sem verificação da fonte citada é classificação de fachada: registra que uma pesquisa disse algo, não que aquilo é verdade.

## Verificações feitas antes de classificar

1. **"CRA = Central de Registros de Ativos"** (Gemini, modos de falha, entrada ambígua). Não existe. A busca retorna Certificado de Recebíveis do Agronegócio, Conselho Regional de Administração e Central de Remessa de Arquivos. A segunda expansão foi inventada.
2. **arXiv 2602.18966, "Whisper: Courtside Edition"** (Gemini, fonte para "reduz WER sobre entidades terminológicas em até 17%"). O artigo existe: pipeline multiagente de LLM que gera prompts para o Whisper, avaliado em 421 segmentos de comentário de basquete da NBA, em inglês. Redução relativa de 17,0% no WER geral (0,217 para 0,180). Não é WER sobre terminologia e não é pt-BR.
3. **TugaPhone** (Qwen, citado só pelo nome). Existe: biblioteca Python no PyPI, Portuguese-only, mais jovem que espeak-ng, cobre pt-PT, pt-BR, pt-AO, pt-MZ e pt-TL. Qwen não descreveu o que faz.
4. **Descript** (Claude). A página de ajuda confirma quase literalmente: ao corrigir a mesma palavra pelo menos 3 vezes entre transcrições, o Descript adiciona ao glossário automaticamente, o glossário suporta só inglês e não afeta transcrições traduzidas. Erro do Claude: disse "até 1000 termos por Drive"; a página diz até 30.

Sobre a qualidade geral das citações. Claude não deu URLs, mas identificou fontes por nome e trecho (help do Descript, prompting guide da OpenAI, docs do memoQ), o suficiente para localizar. Gemini deu 54 URLs, muitas de baixa qualidade (Reddit, Scribd, patente chinesa, glossário de IA), e usou artigos sobre persa e cingalês para sustentar afirmações genéricas. Qwen deu URLs, várias de blog de fornecedor (Lingvanex, Gladia), e citou arXiv de 2026 sobre agentes de IA como fonte para versionamento de dicionário.

Legenda de classificação:
- **A. Confirmado**: fonte verificável citada por pelo menos uma pesquisa.
- **B. Convergente sem fonte**: as três concordam, nenhuma citou fonte verificável. Não verificado.
- **C. Divergente**: se contradizem; registrado o que cada lado disse e quem tinha fonte melhor.

---

## 1. O que existe pronto

### Correspondência aproximada de string. Veredito: resolvido. Classe A.
As três concordam. Fontes verificáveis: RapidFuzz (documentação e GitHub oficiais; Claude lista os algoritmos: Levenshtein, Damerau-Levenshtein, Indel, Jaro-Winkler, LCS, OSA) e SymSpell (GitHub de Wolf Garbe). Gemini citou RapidFuzz por um post de Reddit sobre VecFuzz; Qwen citou python-Levenshtein por blog da Gladia.

Divergência menor: Qwen afirma que Levenshtein é "particularmente eficaz" para "basileiro → Basileia" e para erros que produzem palavra válida. Claude e Gemini afirmam o oposto (distância de string não captura erro fonético). Qwen sem fonte, e errado por definição do problema.

### Correspondência fonética para pt-BR. Veredito: existe, maturidade contestada. Classe C.
Metaphone-PT-BR existe (github.com/carlosjordao/metaphone-ptbr, URL do Gemini; Claude cita o mesmo repositório e a origem no trabalho da Prefeitura de Várzea Paulista). Gemini classifica como "Maduro". Claude classifica como "artesanal / semi-experimental, projeto individual" e diz que a avaliação é dele. Nenhuma apresenta benchmark. BuscaBR só Claude menciona, sem identificação da dissertação. Claude é mais honesto; a pergunta "quão bom é" fica aberta.

### Estrangeirismo com sotaque brasileiro. Veredito: não existe pronto. Classe B (negativa convergente).
As três dizem que não há biblioteca. Gemini fundamenta o fenômeno (epêntese vocálica: WACC vira [ˈwaki]) com dissertação da UNESP e artigo da UFU, fontes acadêmicas sobre a fonologia, não sobre ferramenta. Caminho proposto por Claude: G2P para IPA (Epitran: Mortensen, Dalmia e Littell, LREC 2018, repositório; ou phonemizer com espeak-ng), comparar sequências de fonemas com PanPhon/abydos. Claude marca como "composição própria, experimental". G2P pt-BR citados: FalaBrasil (Qwen, artigo Springer; Gemini, SIGAA UFPA), PETRUS (Gemini, GitHub alessandrobokan/PETRUS), TugaPhone (Qwen, só nome; existência verificada acima). Gemini afirma que FalaBrasil e PETRUS só transcrevem pela norma culta e não tratam interlíngua: plausível, sem fonte.

### Detecção de OOV. Veredito: parcial. Classe C.
- Claude: confiança por palavra do Whisper (whisper-timestamped, faster-whisper, stable-ts; repositórios verificáveis, Gemini dá a URL do linto-ai) para rankear revisão, com ressalva de que esses escores são fracos para detectar alucinação (cita arXiv sem identificar o artigo; não verificável).
- Gemini: Hunspell/Aspell para não-palavra; BERTimbau (MLM) para palavra real. BERTimbau existe; "técnica estabelecida" para correção de ASR é afirmação sem fonte.
- Qwen descreveu um substituto: classificou "Detecção de OOV" como maturidade "Alta" e listou fine-tuning e vocabulário customizado do Riva. Isso é adaptação do modelo (evitar OOV), não detecção. O prompt pedia para dizer quando algo não existe em vez de descrever substituto.

### Ciclo completo (detectar, sugerir, perguntar, aprender). Veredito: não existe pronto. Classe A pelo levantamento negativo do Claude.
As três dizem que não existe. Só Claude examinou ferramentas (Descript, Trint, Otter, Sonix, Rev, Happy Scribe, Amberscript, Reduct, hunspell, LanguageTool) e citou help centers. Descript verificado: detecta e aprende, mas sem perguntar e só em inglês. Trint: "até 100 palavras, aplica só a arquivos futuros" (não verificado). Gemini e Qwen afirmam a inexistência sem examinar nada. Qwen propõe arquitetura de quatro componentes citando artigos sobre agentes, que não são fonte para "não existe".

---

## 2. Medicina, direito, transcrição judicial

### Pré-adaptação é o caminho principal, pós-correção é complemento. Classe A para nuvem e medicina; sem resposta para judicial.
Fontes verificáveis: AWS Transcribe custom vocabulary com colunas Phrase/IPA/SoundsLike/DisplayAs (Claude e Gemini; docs AWS com URL), NVIDIA Riva customização de vocabulário e léxico (Qwen; docs NVIDIA com URL), Deepgram keyterm prompting (Claude; docs), Google model adaptation e Azure Custom Speech (Claude nomeia; Gemini cita Azure por cópias no Scribd, fraco), MedASR treinado em 4.500 horas de áudio médico (Qwen; página do Google Health AI e arXiv 2605.16555). Dragon Medical/Nuance: as três mencionam, nenhuma cita fonte.

**Transcrição judicial: sem resposta.** Gemini: "motores judiciais baseados em Kaldi", sem fonte. Qwen: blog da Lingvanex, e invoca MiFID II, regulação europeia, para contexto de compliance em finanças (jurisdição errada, periférico). Claude não trata judicial. Ninguém trouxe como tribunal ou serviço de estenotipia trata vocabulário.

### Enviesar o Whisper com lista de termos (initial_prompt). Veredito: viável e barato, com efeitos colaterais. Classe A para o limite; B para o resto.
- Limite de 224 tokens, com descarte silencioso dos anteriores: Claude cita o Whisper prompting guide da OpenAI (verificável). Gemini cita o artigo do basquete para o mesmo número.
- Convergente sem fonte específica: tokens do fim pesam mais; o prompt influencia sobretudo os primeiros 30 s; lista crua induz alucinação/repetição; escrever em prosa em vez de vírgulas (só Gemini).
- Custo: "desprezível" (Gemini), "parâmetro na requisição" (Claude), "intermediário" (Qwen). Ninguém mediu.
- Números de ganho: Deepgram, "até 90% de keyword recall, 20 a 50 termos, 500 tokens, 100 keyterms" (Claude; docs do fornecedor, marcado como tal). Os 17% do Gemini: ver verificação 2.
- **Nenhum número para pt-BR.** Claude admite isso nos caveats.
- Métodos de pesquisa (TCPGen, OWSM-Biasing arXiv 2506.09448, CB-Whisper) citados pelo Gemini existem; experimentais, não produto.

### Divergência de ênfase. Classe C.
Qwen recomenda fine-tuning (LoRA, CORAA 290 h, SRSet) como principal. Gemini classifica adaptação acústica como "custo muito alto". Claude não propõe fine-tuning, só initial_prompt + pós-correção. Observação decisiva do Claude: metade das transcrições vem de legenda de plataforma, que não pode ser enviesada; biasing só alcança o Whisper local.

---

## 3. Dicionário em camadas

### Base curada + camada pessoal como sobreposição. Veredito: padrão consolidado. Classe A.
Fonte verificável: Hunspell (dicionário base .dic/.aff separado do pessoal) e Chromium (.dic_delta, nunca edita a base), citados por Claude. Gemini chama de "lexical shadowing" e cita o manual do Wordfast Classic. Qwen sem fonte. Convergem que a camada pessoal vence.

### Conflito entre camadas. Veredito: divergente. Classe C.
- Claude: precedência explícita por rank + marca de termo proibido, modelo memoQ (docs do memoQ, verificável; OmegaT como contraexemplo onde a prioridade é só visual).
- Gemini: pessoal vence, exceto entradas da base marcadas `is_protected` (tickers da B3, nomes da CVM). Proposta de design, sem fonte.
- Qwen: pessoal sempre vence, com notificação opcional. Sem fonte.
Claude ganha por fonte. O `is_protected` do Gemini é razoável, mas é invenção dele.

### Contribuição voltando para a base. Veredito: só por submissão revisada. Classe B.
As três convergem. Claude nomeia o padrão (pull request; Weblate/Crowdin com aprovação de glossário; dicionários Hunspell/LibreOffice) e diz "a síntese é minha". Qwen propõe voto de N usuários antes da fila de revisão, sem fonte. **Erro do Gemini:** afirma que o fluxo de revisão em dois estágios é "estruturado de acordo com a ISO 30042". ISO 30042 é TBX, formato de intercâmbio de termbases; não define fluxo de revisão. A fonte citada é documento da Enosema Foundation, uma consultoria.

### Deriva de normalização (texto normalizado ontem e hoje fica diferente). Veredito: problema conhecido, receita convergente, sem padrão específico. Classe B.
As três reconhecem o problema e convergem na mitigação: versionar o dicionário (SemVer), gravar no texto normalizado a versão ou hash do dicionário usado, tratar renormalização como migração deliberada com diff para revisão humana, nunca renormalizar silenciosamente. Claude oferece analogia com fonte verificável: Unicode Normalization Stability Policy (unicode.org) e lockfiles de gerenciadores de pacote; diz que é analogia. Gemini: SHA-256 do dicionário compilado, sem fonte. Qwen: cita arXiv sobre "Autogenesis" e "Agent Control Protocol", sobre pipelines de agentes, não dicionários. Nenhuma trouxe um sistema de terminologia que documente essa política para o caso específico.

TBX (ISO 30042) como formato de exportação/portabilidade do dicionário: Classe A (norma ISO; Claude e Gemini).

---

## 4. Offline e online

### Distribuição. Veredito: pacote imutável versionado com cópia local completa. Classe A pela fonte do Claude, B no restante.
Claude cita o paper "Local-first software" (Kleppmann et al., Ink & Switch). Gemini propõe SQLite imutável + log de mutações append-only com timestamps de Lamport (design, sem fonte). Qwen propõe download de deltas (sem fonte). Sync engines e CRDTs (PouchDB, ElectricSQL, PowerSync, Replicache, Automerge, Yjs) são nomeados por Claude, não verificados para este uso; ressalva correta dele: CRDT resolve convergência, não correção semântica.

### Submissão com revisão em vez de escrita direta. Veredito: sim, convergente. Classe B.
Ninguém escreve na base compartilhada; sobe proposta, revisa, publica nova versão. Gemini chama o risco de "lexical poisoning" (sem fonte). Claude acrescenta: base imutável e versionada elimina a retroatividade acidental, porque uma entrada errada aprovada só afeta quem adotar a nova versão e é revertível publicando outra.

**Inconsistência interna do Qwen:** na tabela de operação híbrida diz que no modo online "a base curada sempre está na versão mais recente no servidor". Contradiz o próprio item 3 (fixar versão): um usuário web receberia deriva automaticamente.

---

## 5. Onde entra IA

### Divisão em camadas. Veredito: convergente, sem fonte publicada. Classe B.
As três desenham o mesmo: determinístico (mapa exato, fuzzy, ITN, NFC, precedência) como espinha dorsal; modelo de linguagem para erro que virou palavra real e desambiguação; humano para aprovar entrada na base e decidir em baixa confiança; sem IA, cair para o determinístico. Claude diz que é recomendação de engenharia, não padrão publicado. Gemini apresenta como estabelecido, sem fonte. Qwen cita arXiv 2606.29280 como "prática consolidada em sistemas de alto risco", sem título; não dá para conferir.

### Qual modelo de linguagem. Veredito: divergente. Classe C.
Claude: n-grama local (KenLM) primeiro, LLM opcional e experimental, com risco documentado de sobrecorreção. Gemini: BERTimbau (MLM) como "maduro". Qwen: LLM direto. Ninguém apresenta evidência para correção de ASR em pt-BR. O caminho do Claude tem menor risco por construção.

### ITN (números por extenso para dígitos). Registro de sinal.
Claude admitiu não ter confirmado detalhes do NeMo. Qwen trouxe a fonte verificável (blog da NVIDIA sobre NeMo TN/ITN: WFST + LM para desambiguar). Uma admitiu não saber; a outra supriu fonte. Nenhuma confirma cobertura de pt-BR no NeMo ITN.

### Quando perguntar ao usuário. Veredito: divergente. Classe C.
Claude: só na faixa intermediária de confiança (alta aplica ou nem mexe, baixa nem sugere). Gemini: baixa confiança vira marca passiva, sem interromper. Qwen: "limitar as perguntas apenas aos casos de maior confiança". Como está escrito, Qwen inverte a lógica. Nenhuma tem fonte; Claude e Gemini são coerentes entre si.

### Degradação sem IA. Classe B.
Convergente: feature flag/circuit breaker (Claude); desligar correção de palavra real e mostrar sublinhado passivo (Gemini); ignorar a chamada (Qwen).

---

## 6. Modos de falha

| Categoria | Veredito | Classe | Detalhe |
|---|---|---|---|
| Correção excessiva | Limiar calibrado + whitelist; ponderar por frequência da palavra na língua | B (frequência: A fraco) | Gemini cita artigo sobre correção com LM pré-treinado para a ponderação por frequência. Claude: literatura diz que falso positivo irrita mais que falso negativo, sem artigo. Qwen: não corrigir automaticamente; "votação entre algoritmos", sem fonte. |
| Correção de palavra correta | Só contexto resolve | B, com peça A | Claude cita a linha de pesquisa (Golding, método bayesiano, anos 1990, ACL), identificável. Qual modelo usar: ver item 5. |
| Fronteira de palavra | SymSpell LookupCompound trata junção e separação | **C, Claude ganha** | LookupCompound documentado no README do SymSpell. Gemini: janelas deslizantes de n-gramas (cita artigo sobre persa). **Qwen: "correção post-hoc é inviável; só melhorar o ASR"**, contradiz as duas e é refutado por ferramenta verificável. Qwen também confundiu o exemplo do prompt. |
| Termo composto | Casar frases inteiras; match mais longo tem precedência | B, com peça A (memoQ) | Gemini: trie Aho-Corasick com greedy match (algoritmo padrão, sem fonte). Qwen agrupou "termos compostos e números" e respondeu ITN, que não trata "marcação a mercado". Substituto. |
| Entrada ambígua | Tags de contexto; desambiguar por LM ou deixar intacto | B | Gemini deu o exemplo do CRA com a segunda expansão inventada (verificação 1). |
| Deterioração da lista (bloat) | Regressão em corpus de referência e métrica por termo antes de publicar | C, sem fonte de ninguém | Claude: testes de regressão. Gemini: "poda por telemetria em janelas de 180 dias" como "prática padrão"; número inventado. Qwen: camadas + revisão (não trata crescimento). |
| Portabilidade | Pacote imutável com hash; NFC obrigatório na entrada | A pelo padrão Unicode | Gemini cita thread do AWS re:Post que não é sobre isso; Claude também recomenda NFC. |
| Rastreabilidade | Nunca destruir a fonte; original + normalizado + diff + versão do dicionário + regra que disparou; anotação stand-off | B, com peças A | Claude: W3C PROV (norma W3C). Gemini: trocar "WK" por "WACC" desalinha timestamps; mitigação stand-off + alinhamento forçado (WhisperX, GitHub). **Erro do Gemini:** "TBX-Core exige created_by, approved_by, source_context_hash"; campos inventados. Qwen: registrar prompt e resposta quando a decisão veio de LLM; boa ideia, sem fonte. |
| Fadiga de quem responde | Agrupar ocorrências em lote; marca passiva para baixa confiança; undo fácil | B | Claude: alert fatigue e automation bias da literatura de apoio à decisão clínica (tema identificável, artigo não). Gemini: cita artigo sobre laudos de ultrassom (tangencial). Qwen: permitir silenciar palavra; e a inversão de lógica já apontada. |

Categorias extras que vieram: conjunto de teste com métrica por termo em vez de WER geral (Claude; Qwen cita M-WER médico via blog); tickers e siglas como classe especial de alta precedência (Claude); idempotência e ordem fixa de regras (Claude); não colocar PII em vocabulário compartilhado (Claude cita aviso da AWS, A); alucinação do ASR como falha separada (Qwen, arXiv 2506.08846).

---

## O que continua sem resposta confiável

- Como transcrição judicial e estenotipia tratam vocabulário. Nada com fonte.
- Acurácia real de Metaphone-PT-BR e BuscaBR. Existem; ninguém mediu.
- Qualquer número de ganho de initial_prompt ou keyterm em pt-BR. Só há números em inglês, de fornecedor ou de basquete.
- Se os escores de confiança do Whisper servem para triagem de termo de domínio (Claude diz que são fracos para alucinação, sem identificar o artigo).
- Cobertura de pt-BR no ITN do NeMo.
- Um sistema de terminologia que documente política de estabilidade de versão para dicionário de normalização. Só analogias.
- Mitigação com evidência para bloat de léxico. Só propostas.

## O que contradiz premissas do prompt original

- As três dizem que a alavanca principal está antes da transcrição, não no dicionário de pós-correção. Vale para o Whisper local; para a legenda de plataforma o dicionário continua sendo a única defesa.
- Claude: o "dicionário pessoal" de hunspell/aspell/LanguageTool é lista de ignorar, não memória A→B.
- Gemini: corrigir texto quebra alinhamento temporal. Se a rastreabilidade até o áudio for por timestamp, a correção precisa ser stand-off e re-alinhar quando mudar a contagem de palavras.
- Claude: a premissa de que escrita ao vivo em base compartilhada é perigosa está correta; base imutável versionada resolve a retroatividade sem precisar de mais nada.

## Solução padrão que eu talvez estivesse ignorando

Do Claude: Whisper initial_prompt com os 20 a 50 termos mais raros perto do fim; SymSpell LookupCompound para fronteira de palavra; modelo memoQ (rank + termo proibido) para conflito entre camadas; Unicode Stability Policy e lockfile como disciplina para a deriva; W3C PROV para procedência; TBX como formato de exportação; anotação stand-off; métrica por termo em vez de WER; literatura de alert fatigue para desenhar a interação. Do Gemini: NFC obrigatório na entrada; alinhamento forçado pós-correção. Do Qwen: NeMo WFST + LM para ITN.

---

## Usar em vez de construir

| Peça | O que resolve | Fonte | Quem trouxe |
|---|---|---|---|
| **RapidFuzz** | Distância de edição (Indel, Damerau-Levenshtein, Jaro-Winkler) contra o dicionário. Motor de correspondência aproximada. | Documentação oficial e repositório GitHub do RapidFuzz (licença MIT, implementação C++) | Claude (fonte primária); Gemini via Reddit |
| **SymSpell, LookupCompound** | Geração rápida de candidatos contra dicionário grande e tratamento de erro de fronteira de palavra (junção/separação). | README do SymSpell, GitHub de Wolf Garbe; portes symspellpy e SymSpellCppPy | Claude |
| **Enviesamento por lista no Whisper (initial_prompt)** | Reduz erro de vocabulário antes da transcrição, onde eu controlo o ASR. Limite de 224 tokens, últimos pesam mais, 20 a 50 termos, em prosa. | Whisper prompting guide da OpenAI (limite e descarte silencioso); código decoding.py (n_text_ctx//2). Efeitos colaterais: convergente sem fonte específica. | Claude (fonte); Gemini (prosa em vez de lista, sem fonte) |
| **Anotação stand-off** | Correção como camada separada apontando para offsets do original; original e timestamps nunca são tocados. | Prática de linguística de corpus e arquivística (identificada por nome, sem artigo específico); WhisperX (GitHub m-bain/whisperx) para re-alinhar quando a contagem de palavras mudar | Claude e Gemini |
| **W3C PROV** | Procedência por entrada do dicionário e por correção: entidade, atividade, agente (wasGeneratedBy, wasAttributedTo). | Recomendação W3C PROV (w3.org/TR/prov-overview) | Claude |
| **NFC obrigatório na entrada** | Evita que acento e cedilha em NFD quebrem hash map e busca entre Windows, Linux e macOS. | Unicode Standard Annex #15 (Normalization Forms); unicodedata.normalize em Python | Gemini (recomendação); Claude (recomendação) |
| **Métrica por termo** | Medir acurácia nos termos do domínio em vez de WER geral; teste de regressão a cada versão do dicionário. | Keyword Recall Rate (docs Deepgram, número do fornecedor); M-WER médico (Qwen, via blog); a prática é de engenharia, sem padrão publicado | Claude; Qwen |
| **Modelo memoQ para conflito entre camadas** | Term bases com rank; rank maior vence; match mais longo esconde o mais curto; flag de termo proibido. | Documentação do memoQ (term base ranking e forbidden terms) | Claude |

---

## O que muda no que eu já tinha decidido

**1. A correção passa a ser stand-off, não alteração do texto.** O texto original e os timestamps ficam imutáveis; a normalização é uma camada que aponta para offsets do original e registra regra, versão do dicionário e quem decidiu. Isso resolve de graça uma ressalva que eu já tinha registrado: que o texto normalizado precisava marcar onde houve correção. Com stand-off não há o que marcar, porque o original nunca é tocado; a marcação é a própria camada. Bônus: se eu emitir legenda ou precisar de timestamp por palavra, re-alinho com WhisperX só quando a contagem de palavras mudar.

**2. O dicionário deixa de ser a alavanca principal.** Passa a ser a defesa onde eu não controlo a transcrição, que é a legenda de plataforma. Onde eu controlo, o Whisper local, o caminho é enviesar antes com initial_prompt (termos críticos e raros, perto do fim, em prosa, dentro de 224 tokens) e medir se não introduziu alucinação. O dicionário pega o que escapar dos dois lados.

**3. O "dicionário pessoal" de corretor ortográfico não serve de modelo.** Em hunspell, aspell e LanguageTool ele é lista de palavras a ignorar, não memória de substituição A→B. O modelo certo é o de ferramentas de tradução assistida (term base com precedência e termo proibido, memoQ) mais o overlay do Chromium (.dic_delta separado da base, nunca editando a base).

---

## Registro sobre os provedores

Desta vez o pior foi o **Gemini**, com evidência:
- Sigla inventada: "CRA = Central de Registros de Ativos" não existe.
- Norma atribuída errado: ISO 30042 (TBX) apresentada como definidora de fluxo de revisão em dois estágios.
- Campos de formato inventados: "TBX-Core exige created_by, approved_by, source_context_hash".
- Artigo de basquete em inglês (arXiv 2602.18966, WER geral em comentário da NBA) apresentado como ganho em terminologia.
- Também: "Maduro" e "180 dias" sem base; artigos sobre persa e cingalês como fonte para afirmações genéricas; Reddit, Scribd e patente chinesa como referências.

**Qwen** teve problemas de outra natureza: MiFID II (regulação europeia) via blog de fornecedor em contexto brasileiro; IPA inglês para EBITDA; arXiv sobre agentes de IA como fonte para versionamento de dicionário; substituiu "detecção de OOV" por "adaptação do modelo"; afirmou que correção post-hoc de fronteira de palavra é inviável (refutado por SymSpell); inverteu a lógica de quando perguntar ao usuário; inconsistência interna entre fixar versão e "base sempre na versão mais recente" no modo online. Não inventou sigla.

**Claude** errou um número: "até 1000 termos por Drive" no Descript; a página de ajuda diz até 30. Não deu URLs, mas as fontes foram identificáveis e a que foi conferida (Descript) estava certa no conteúdo.

Correção de expectativa: eu tinha marcado outro provedor como o problemático, com base numa consolidação anterior. O padrão observado aqui é que qualquer um dos três erra desse jeito quando responde sem acesso a fonte primária; o que variou foi o grau. Não verifiquei todas as citações das três; verifiquei as que decidiam classificação.
