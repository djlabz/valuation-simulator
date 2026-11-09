> **Ressalva de leitura, inserida em 09/11/2026.** Material de pesquisa bruto, versionado pela D-080. Não é fonte de verdade e não é requisito. É a resposta de uma sessão de pesquisa sobre design de conversão, CTA, Gestalt e IHC à pergunta sobre fluxos em que o sistema pede documentos ao usuário. Limites declarados pela própria resposta: a evidência é de checkout e formulários, aplicada a documentos por analogia; as fontes vêm de uma base consolidada e não foram reabertas na data; os itens marcados "(inferência)" são raciocínio da sessão. Os blocos sobre dado pessoal, consentimento e celular não se aplicam a este app, que é local, desktop e pede documentos públicos. Uso previsto: Fase 7, e os quatro testes do bloco 4 como critério de inspeção adversarial. Nada daqui foi verificado neste repositório. As tabelas foram remontadas em markdown a partir do texto colado pelo autor no chat do projeto; o conteúdo não foi alterado.

Separei em quatro blocos. As fontes são as da base consolidada (conversion-design-kb.yaml); não reabri cada uma hoje. Nenhuma delas estudou envio de documentos especificamente: a evidência forte é de checkout e formulários (Baymard, NN/g), então a aplicação a documentos é transferência por analogia. Onde a aplicação é raciocínio meu, marquei "(inferência)".

## 1. Revelação progressiva da explicação

| Princípio | Aplicado ao pedido de documento | Fonte |
|---|---|---|
| Uma decisão por tela em sequências de alto risco | Um documento por etapa. | Padrão "one thing per page" do GOV.UK; Nielsen 2006 |
| Nunca esconder informação crítica para a decisão | A lista completa do que será pedido aparece antes de começar; o que se revela por camadas é a explicação, não a exigência (inferência). | Nielsen 2006 |
| Memória de trabalho de cerca de 4 itens | Visível: o que enviar e o motivo em uma linha. Sob "ver detalhes": formatos, tamanho, exemplo. | Cowan 2001; Sweller 1988 |
| Texto de ajuda antes do erro | Formato, tamanho e validade aceitos aparecem antes do envio. | NN/g; Baymard |
| Nada essencial em tooltip | A regra que causa rejeição fica em texto visível. | NN/g |
| Justificar cada campo | Cada documento traz o motivo do pedido. | Baymard |
| Fácil primeiro, sensível depois | Documento sensível só depois de o usuário ter recebido algum valor. Efeito pequeno e condicional. | NN/g, Pyramid of Trust; Burger 1999 |
| Proximidade e região comum | Explicação, controle de envio e erro no mesmo bloco visual. | Wertheimer 1923; Palmer 1992 |
| Reconhecer em vez de lembrar | Mostrar exemplo de documento aceito. | Nielsen, heurística 6 |

## 2. Redação do pedido e do erro

| Princípio | Aplicado | Fonte |
|---|---|---|
| Botão com verbo + objeto, nomeando o resultado | "Enviar comprovante de residência", não "Enviar". | NN/g; Baymard |
| Incerteza é o maior custo oculto | Dizer quem vê o documento, por quanto tempo fica guardado e o que acontece depois. | NN/g, interaction cost |
| Linguagem simples, informação no início da frase, números em algarismos | "Envie 1 foto da frente do RG." | Nielsen 1997, 2005; Morkes & Nielsen 1997 |
| Rótulo sempre visível; obrigatório e opcional marcados | Só 14% dos sites marcam os dois corretamente. | NN/g; Baymard |
| Erro diz o que houve, por quê e como corrigir, ao lado do campo | "A foto está cortada. Envie outra com as 4 bordas visíveis." | NN/g; Baymard |
| Validar no momento, não no fim | Checar o arquivo assim que é enviado (inferência a partir da validação inline). | Baymard |
| Nunca apagar o que já foi preenchido | Um arquivo recusado não descarta os já aceitos (inferência; o dado original é que 34% dos sites limpam o cartão após erro). | Baymard |
| Prevenir vale mais que avisar | Restringir formatos no seletor e checar tamanho antes do upload. | Nielsen, heurística 5; Norman 1988; Bastien & Scapin 1993; ISO 9241-110:2020 |
| Erro em texto, nunca só por cor | Vale também para leitor de tela. | WCAG 2.2 |
| Estado do sistema visível | Progresso do upload e resposta imediata. | Nielsen, heurística 1; Doherty & Thadani 1982 |
| A confirmação diz o que aconteceu e o que vem depois | "Recebemos 3 documentos. A análise leva até 2 dias úteis." | Kahneman et al. 1993; NN/g |

## 3. Redução de abandono

| Princípio | Aplicado | Fonte |
|---|---|---|
| Custo acumulado contra motivação | Mapear por etapa: espera, leitura, decisão, digitação, incerteza, retrabalho. | NN/g; Zipf 1949 |
| A complexidade vai para o sistema | Aceitar foto do celular e vários formatos, converter no servidor (inferência). | Lei de Tesler |
| Quantidade de campos pesa mais que quantidade de etapas | Cortar ou adiar documentos que não servem a esta etapa. | Baymard 2024 |
| Indicador 1:1 com as etapas reais, voltar seguro, "Editar" na revisão, nada novo na revisão | Nenhum documento extra surge no final. | Baymard |
| Progresso real motiva | Contar etapas já concluídas. Barra de velocidade constante não reduz abandono; só o padrão rápido-depois-lento. | Kivetz et al. 2006; Nunes & Drèze 2006; Villar et al. 2013 |
| Lembrar estado entre sessões | Salvar e retomar: o usuário costuma precisar buscar o documento (inferência). | NN/g |
| Não pedir o mesmo dado duas vezes | Reaproveitar o que já foi informado. | WCAG 2.2, SC 3.3.7 |
| Celular: coluna única, alvo de 24 px no mínimo (44 a 48 recomendado) | Botão de câmera grande, na metade inferior. | WCAG 2.2, SC 2.5.8; Hoober 2013 |
| Sinal de confiança no ponto sensível | Segurança e política de dados ao lado do upload, não no rodapé. | Baymard; Özpolat et al. 2013; Fogg et al. 2003 |
| Fricção proporcional ao dano | Confirmar antes do envio irreversível. | CNIL 2019; ISO 9241-110 |
| Achado de revisão é hipótese | Confirmar com funil por etapa e teste com 5 usuários antes de redesenhar. | Cockton & Woolrych 2001; Nielsen & Landauer 1993 |

## 4. Onde a persuasão vira padrão enganoso

Quatro testes, síntese da base a partir de Brignull (2010/2023): funcionaria se o usuário entendesse o mecanismo? Dizer não é tão fácil quanto dizer sim? Toda afirmação é verdadeira? O resultado depende de usuário confuso?

| Legítimo | Enganoso | Fonte |
|---|---|---|
| Lista completa de documentos no início | Documento sensível revelado só no fim, explorando o esforço já investido (análogo a custo escondido) | Brignull; Baymard |
| Prazo real, com data | "Envie em 10 minutos ou perde a vaga", contador que reinicia | Mathur et al. 2019; UCPD (UE) |
| Perda real descrita com precisão | Perda inventada. O efeito de aversão à perda tem magnitude contestada. | Gal & Rucker 2018 |
| Recusa em texto neutro | Confirmshaming ("Não, prefiro ficar sem acesso") | Brignull |
| Consentimento separado, caixa desmarcada | Consentimento pré-marcado ou embutido nos termos | TJUE Planet49 (C-673/17); GDPR; LGPD |
| Contar etapas de fato concluídas | Progresso falso para prender o usuário | Nunes & Drèze 2006 (o efeito existe mesmo com avanço artificial, por isso o limite) |
| Garantia de segurança verdadeira e específica | "Seus dados estão 100% seguros" sem base | FTC; Fogg et al. 2003 |
| Sair, cancelar e apagar documentos tão fácil quanto enviar | Obstrução (roach motel) | Brignull; ROSCA; caso Amazon Prime, US$ 2,5 bi, 2025 |
| Default seguro | Default que decide consentimento | Johnson & Goldstein 2003; LGPD |

Dois dados de contexto: padrões suaves levaram a aceitação de 11% para 26% e os agressivos para 42%, com raiva e desistência (Luguri & Strahilevitz 2021, n=1.963). Funcionam no curto prazo; o custo aparece em reclamação, cancelamento e risco legal, que devem ser medidos por variante.

Fora do material, do meu conhecimento e não verificado agora: o princípio da necessidade da LGPD (art. 6º, III) limita pedir mais documentos do que a finalidade exige. E o GOV.UK Design System tem padrões específicos para upload de arquivo que a base não cobre; posso buscá-los se for útil.
