# Chá de Casa Nova — Manu & Gustavo

Site de confirmação de presença e lista de presentes para o chá de casa nova de Manu & Gustavo.

## Funcionalidades

- **Convidados**: confirmação de presença, escolha de presente, opção PIX ou levar no dia
- **Presentes**: reserva automática — cada presente fica indisponível após ser escolhido
- **Painel Admin** (`/admin`): dashboard, confirmações, gestão de presentes, controle de PIX, exportação CSV
- **Supabase**: banco de dados em nuvem (com fallback para dados mockados em desenvolvimento)

## Tecnologias

- React 19 + Vite 6 + TypeScript
- React Router
- Supabase (PostgreSQL)
- Deploy na Vercel

## Como rodar localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar o Supabase (obrigatório para salvar dados)

#### Passo A — Criar projeto

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita
2. Clique em **New Project**
3. Escolha um nome (ex: `cha-casa-nova`) e uma senha de banco
4. Aguarde o projeto ficar pronto (~2 min)

#### Passo B — Criar as tabelas

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **New query**
3. Copie todo o conteúdo de `supabase/schema.sql` e cole no editor
4. Clique em **Run** — deve criar 4 tabelas e 8 presentes iniciais

#### Passo C — Copiar as credenciais

1. Vá em **Project Settings** → **API**
2. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

#### Passo D — Configurar o `.env`

```bash
cp .env.example .env
```

Edite o `.env`:

```env
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ADMIN_PASSWORD=sua-senha-segura
VITE_PIX_KEY=seu-pix@email.com
VITE_PIX_NAME=Manu e Gustavo
```

> **Importante:** reinicie o servidor após alterar o `.env` (`Ctrl+C` e `npm run dev`).

#### Verificar conexão

Acesse `/admin` — se estiver tudo certo, aparecerá:
**"Supabase conectado — X presente(s) no banco"**

### 3. Configurar variáveis de ambiente (resumo)

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Preencha as variáveis:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
VITE_ADMIN_PASSWORD=sua-senha-admin
VITE_PIX_KEY=seu-email@exemplo.com
VITE_PIX_NAME=Manu e Gustavo
```

> **Sem Supabase?** O projeto funciona com dados mockados em memória (perdidos ao recarregar). Para produção, configure o Supabase conforme acima.

### 4. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173)

- Painel admin: [http://localhost:5173/admin](http://localhost:5173/admin)
- Senha padrão: valor de `VITE_ADMIN_PASSWORD` (padrão: `admin123`)

### 5. Build de produção

```bash
npm run build
```

## Publicar na Vercel

1. Faça commit e push deste projeto para o GitHub
2. Acesse [vercel.com](https://vercel.com) e clique em **Add New Project**
3. Importe o repositório do GitHub
4. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_PASSWORD`
   - `VITE_PIX_KEY`
   - `VITE_PIX_NAME`
5. Clique em **Deploy**

O arquivo `vercel.json` já está configurado para SPA routing (React Router).

## Estrutura do projeto

```
src/
├── components/       # Componentes reutilizáveis (UI, layout, gifts, admin)
├── context/          # Contexto do fluxo do convidado
├── lib/              # Supabase, mock data, utilitários
├── pages/            # Páginas do fluxo e admin
├── services/         # Camada de dados (guest, gift, admin)
└── types/            # Tipos TypeScript
supabase/
└── schema.sql        # Script SQL para criar tabelas
```

## Tabelas do banco

| Tabela | Descrição |
|--------|-----------|
| `guests` | Convidados e confirmações de presença |
| `gifts` | Lista de presentes |
| `gift_reservations` | Reservas de presentes |
| `pix_payments` | Pagamentos PIX pendentes/confirmados |

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm install` | Instala dependências |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |

---

Feito com 💕 para Manu & Gustavo
