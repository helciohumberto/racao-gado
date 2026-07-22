# Arquitetura — racao-gado

## Estrutura do projeto

racao-gado/
backend/ — Node.js + Express + TypeScript + Prisma + PostgreSQL
frontend/ — React + Vite + TypeScript + Tailwind + Recharts


## Entidades principais

- **Animal** — id, nome, raça, sexo, data nascimento, peso inicial, lote, estado
- **Lote** — id, nome, descrição
- **Pesagem** — id, animal_id, peso, data
- **Racao** — id, nome, tipo, preço/kg
- **Fornecimento** — id, lote_id, racao_id, quantidade, data, custo
- **Usuario** — id, email, senha, role

## Decisões técnicas

- **Prisma ORM** em vez de SQL puro — migrations versionadas, type-safety
- **Multi-tenant** — cada usuário vê só os seus dados (userId em cada entidade)
- **JWT stateless** — sem sessões em BD
- **Recharts** para gráficos — leve e integra bem com React