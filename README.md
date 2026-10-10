# Chá de Casa Nova — Bia & Daniel

Site de confirmação de presença e lista de presentes para o chá de casa nova de **Anna Beatriz** e **Daniel Amorim**.

**Nome do aplicativo:** Bia e Daniel  
**App ID:** `bia-e-daniel`

Este projeto reutiliza a estrutura do site Manu e Gu, com identidade própria e **banco de dados separado**.

## Isolamento de dados (obrigatório)

Para não misturar informações com o projeto Manu e Gu:

1. Crie um **novo projeto Supabase** (não reutilize o do Manu e Gu)
2. Execute `supabase/schema.sql` nesse projeto novo
3. Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` com as credenciais do projeto novo
4. Na Vercel, crie um **projeto de deploy separado** com essas variáveis

Nunca aponte este app para o mesmo Supabase do Manu e Gu.

## Funcionalidades

- **Convidados**: confirmação de presença, escolha de presente, opção PIX ou levar no dia
- **Presentes**: reserva automática — cada presente fica indisponível após ser escolhido
- **Painel Admin** (`/admin`): dashboard, confirmações, gestão de presentes, controle de PIX, exportação CSV
- **Supabase**: banco de dados em nuvem (com fallback mock em desenvolvimento)

## Tecnologias

- React 19 + Vite 6 + TypeScript
- React Router
- Supabase (PostgreSQL)
- Deploy na Vercel

## Foto do casal

A foto de Anna Beatriz e Daniel Amorim já está em `public/foto-casal.jpg`.

```env
VITE_HERO_PHOTO_URL=/foto-casal.jpg
```

A imagem do hero usa `object-fit: cover` (sem distorção) e se adapta a celular e desktop.

## Como rodar localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar o Supabase (projeto novo)

#### Passo A — Criar projeto

1. Acesse [supabase.com](https://supabase.com)
2. Clique em **New Project**
3. Nome sugerido: `bia-e-daniel` ou `cha-casa-nova-bia-daniel`
4. Aguarde o projeto ficar pronto

#### Passo B — Criar as tabelas

1. No Supabase: **SQL Editor** → **New query**
2. Cole o conteúdo de `supabase/schema.sql`
3. Clique em **Run**

#### Passo C — Credenciais

Em **Project Settings** → **API**:

- **Project URL** → `VITE_SUPABASE_URL`
- **anon public** key → `VITE_SUPABASE_ANON_KEY`

#### Passo D — Arquivo `.env`

```bash
cp .env.example .env
```

```env
VITE_APP_ID=bia-e-daniel
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
VITE_ADMIN_PASSWORD=sua-senha-segura
VITE_PIX_KEY=sua-chave-pix
VITE_PIX_NAME=Bia e Daniel
VITE_HERO_PHOTO_URL=/foto-casal.jpg
```

> Reinicie o servidor após alterar o `.env`.

### 3. Iniciar

```bash
npm run dev
```

- Site: [http://localhost:5173](http://localhost:5173)
- Admin: [http://localhost:5173/admin](http://localhost:5173/admin)

## Publicar na Vercel (projeto separado)

1. Faça deploy desta branch/repositório em um **novo** projeto Vercel
2. Configure as variáveis de ambiente do Bia e Daniel (nunca as do Manu e Gu)
3. Deploy

## Estrutura

```
src/
├── components/
├── context/
├── lib/              # brand.ts, supabase, utils
├── pages/
├── services/
└── types/
supabase/
└── schema.sql
public/
└── foto-casal.jpg    # adicione a foto do casal aqui
```

## Identidade centralizada

Textos de marca ficam em `src/lib/brand.ts` (`Bia & Daniel`, nomes completos, títulos).

---

Feito com 💕 para Anna Beatriz e Daniel Amorim
