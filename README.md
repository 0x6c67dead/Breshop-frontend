# 🏺 Breshop Frontend

Um app de descoberta e compra de peças de brechó com carteira interna, reserva segura e vitrine personalizada por localização e comportamento.

---

## 🛠️ Tecnologias

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Estado Global:** [Zustand](https://docs.pmnd.rs/zustand/)
- **Ícones:** [Lucide React](https://lucide.dev/)

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

Certifique-se de estar usando as versões recomendadas do ambiente:
- **Node.js:** `v25.1.0`
- **Yarn:** `1.22.22`

### 1. Clone o repositório e instale as dependências

```bash
git clone <url-do-repositorio>
cd Breshop-frontend
yarn install
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes chaves (solicite os valores ao responsável):

```env
DATABASE_URL="postgres://..."
DIRECT_URL="postgres://..."
SUPABASE_URL="https://..."
SUPABASE_PUBLISHABLE_KEY="..."
```

### 3. Configure o Banco de Dados (Prisma)

Gere o client do Prisma e execute o seed para popular o banco com dados de teste:

```bash
# Gera o client do Prisma
npx prisma generate

# Popula o banco com dados iniciais (usuários, brechós e itens)
yarn seed
```

### 4. Inicie o servidor de desenvolvimento

```bash
yarn dev
```

O app estará disponível em [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Arquitetura do Projeto

A estrutura segue o padrão do Next.js App Router com separação de camadas:

```plaintext
src/
├── app/                 # Rotas, layouts e componentes de página
│   ├── (app)/           # Rotas protegidas da aplicação
│   ├── (auth)/          # Fluxo de autenticação (Login/Cadastro)
│   ├── api/             # API Routes (Next.js Handlers)
│   ├── explore/         # Vitrine e descoberta de peças
│   └── extrato/         # Histórico financeiro da carteira
├── shared/              # Recursos compartilhados
│   ├── components/      # Componentes UI reutilizáveis (Botões, Cards, etc)
│   ├── lib/             # Clientes (Prisma, Supabase) e utilitários
│   ├── types/           # Definições de tipos TypeScript
│   └── mocks/           # Dados falsos para testes/prototipagem
prisma/                  # Schema do banco de dados e scripts de seed
public/                  # Ativos estáticos (imagens, fontes, ícones)
```

---

## 🛡️ Credenciais de Teste (Seed)

Após rodar o `yarn seed`, você pode utilizar os seguintes logins para testar os diferentes perfis:

| Perfil | Email | Senha |
| :--- | :--- | :--- |
| **Admin** | `admin@breshop.com` | `admin123` |
| **Owner** | `carlos@acervo90s.com` | `owner123` |
| **User** | `clara@gmail.com` | `user123` |

---

## ✨ Funcionalidades Principais

1.  **Vitrine Inteligente:** Descoberta de peças baseada em localização e tags de comportamento.
2.  **Carteira Interna (Coins):** Sistema de saldo para transações rápidas dentro da plataforma.
3.  **Reserva Segura:** Bloqueio temporário do item e do saldo para garantir a compra.
4.  **Gestão para Brechós:** Dashboard para donos de brechós gerenciarem estoque e vendas.

---

## 📄 Licença

Este projeto é privado e de uso restrito conforme o [Acordo de Parceria](./ACORDO_PARCERIA_BRESHOP.md).
