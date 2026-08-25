# valuation-simulator

Aplicação desktop que executa cálculos de valuation de ações da B3 de forma determinística
e auditável, aplicando a metodologia correta para cada setor sob premissas escolhidas
integralmente pelo usuário.

**O sistema não recomenda investimentos.** Ele faz o levantamento: identifica o que existe
nos documentos, explica por que aquilo afeta o cálculo, mostra escala de referência,
decompõe premissas em partes observáveis e calcula cenários alternativos. A escolha das
premissas e a leitura do resultado permanecem com o usuário.

## Estado

Passo 0 concluído, governança escrita. Nenhuma linha de código de produto. Escopo fechado
na v2.2.0 do documento de requisitos.

## Como funciona

Roda local, não embute LLM e não pede chave de API. Expõe um servidor MCP ao qual o usuário
conecta o agente que já usa (Claude Code, Codex, Antigravity ou equivalente). O agente
classifica, extrai dado com procedência e contextualiza. As engines calculam, os playbooks
decidem metodologia, o usuário decide as premissas.

Setores da v1: Transmissão de Energia, Bancos, Commodities. Mercado B3, moeda BRL.

## Stack

Bun workspaces, TypeScript, Elysia, SQLite via Drizzle, React com Vite e TanStack Query,
Electron, Zod, Vitest. Toda aritmética financeira em `decimal.js`.

## Documentação

| Arquivo | Papel |
|---|---|
| `docs/REQUISITOS-valuation-simulator-v2.2.md` | Fonte de verdade. Vence qualquer outro documento |
| `CLAUDE.md` | Constituição do agente: invariantes, casos de fronteira, conduta |
| `AGENTS.md` | Estado do projeto, mapa de pastas, ordem de trabalho, questões abertas |
| `DECISOES.md` | Log numerado de decisões |
| `PROTOCOLO-ETAPA.md` | Ciclo obrigatório de etapa |
