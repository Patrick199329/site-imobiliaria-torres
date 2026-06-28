# Tôrres Imobiliária — Site

Site institucional e de listagem de imóveis da Tôrres Imobiliária.

## Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Estilização:** Tailwind CSS com tokens de marca customizados
- **ORM:** Prisma
- **Banco (dev):** PostgreSQL via Docker
- **Banco (prod):** Supabase

## Pré-requisitos

- Node.js 18+
- Docker Desktop (para o banco local)

## Instalação e execução local

```bash
# 1. Instalar dependências
npm install

# 2. Copiar variáveis de ambiente
cp .env.example .env.local

# 3. Subir o banco de dados local (Fase 1 em diante)
docker compose up -d

# 4. Rodar migrations e seed (Fase 1 em diante)
npx prisma migrate dev
npx prisma db seed

# 5. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Estrutura de pastas

```
torres-imobiliaria/
├── app/           # Rotas e páginas (App Router)
├── components/    # Componentes reutilizáveis
│   └── ui/        # Componentes base de UI
├── lib/           # Utilitários, helpers e cliente Prisma
├── types/         # Tipos TypeScript compartilhados
├── prisma/        # Schema, migrations e seed
├── public/
│   └── brand/     # Arquivos originais de logo e banner da marca
└── .env.example   # Variáveis de ambiente necessárias
```

## Roadmap de desenvolvimento

Ver `documento-mestre-prompts-site-imobiliario.md` na raiz do projeto pai para o roadmap completo em 14 fases.
