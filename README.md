# 🐄 racao-gado

> Sistema de gestão de pecuária construído por alguém que conhece o problema de perto.

## A história por trás do projeto

Cresci vendo meu tio gerenciar uma fazenda no Brasil com gado de corte. O controle de pesagens era feito num caderno. O custo de ração era calculado de cabeça. O histórico de cada animal? Na memória.

Quando aprendi a programar, a primeira coisa que quis construir foi uma solução para esse problema real — que eu conheço desde criança.

**racao-gado** é um sistema de gestão de pecuária que permite ao produtor rural controlar animais, pesagens, ração e custos num só lugar.

---

## 🚀 Demo ao vivo

- **Frontend:** [em breve no Vercel]
- **Backend API:** [em breve no Railway]
- **Documentação Swagger:** [em breve]/docs

---

## ✨ Funcionalidades

- 🐮 **Gestão de animais** — cadastro, histórico, filtros por lote e sexo
- ⚖️ **Pesagens** — registro de peso com cálculo automático de GMD (Ganho Médio Diário)
- 📅 **Estimativa de abate** — data estimada baseada no GMD actual
- 🌾 **Controle de ração** — registo de fornecimentos por lote
- 💰 **Custos** — custo por cabeça por dia, custo total por período
- 📊 **Dashboard** — métricas em tempo real com gráficos
- 📈 **Relatórios** — análise de custos e distribuição por lote
- 🔐 **Multi-tenant** — cada produtor vê só os seus dados

---

## 🛠️ Stack

**Backend**
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- JWT Authentication
- Swagger/OpenAPI docs

**Frontend**
- React + Vite + TypeScript
- Tailwind CSS
- Recharts (gráficos)
- React Hook Form + Zod (validação)
- Axios

**Deploy**
- Railway (backend + banco de dados)
- Vercel (frontend)

---

## 🏗️ Arquitectura

racao-gado/
backend/
src/
routes/ — endpoints HTTP
services/ — lógica de negócio
middleware/ — autenticação JWT
prisma/
schema.prisma — 6 modelos de dados
frontend/
src/
pages/ — Dashboard, Animais, Relatórios
services/ — cliente HTTP com Axios
types/ — tipos TypeScript


---

## 🚦 Como rodar localmente

**Backend:**
```bash
cd backend
npm install
cp .env.example .env  # configura DATABASE_URL e JWT_SECRET
npx prisma migrate dev
npx prisma db seed
npm start
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env  # configura VITE_API_URL
npm run dev
```

---

## 📐 Modelo de dados

| Entidade | Descrição |
|----------|-----------|
| Usuario | Produtor rural (multi-tenant) |
| Lote | Agrupamento de animais |
| Animal | Animal individual com histórico |
| Pesagem | Registro de peso por data |
| Racao | Tipo de ração e preço/kg |
| Fornecimento | Registro de ração fornecida por lote |

---

*Construído durante o plano de 60 dias para primeiro emprego dev em Portugal 🇵🇹*