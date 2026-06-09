# PROPOSTA TÉCNICO-COMERCIAL E ACORDO DE PARCERIA
## Breshop — Plataforma Digital de Brechós
**Recife, PE | 2026**

---

## SUMÁRIO EXECUTIVO

O Breshop é uma plataforma de marketplace para brechós com um diferencial estrutural: **opera com economia interna de moedas (Coins)**, onde cada transação gera margem direta para a plataforma. O modelo é simples: usuários compram moedas, usam moedas para reservar peças, brechós convertem moedas em real e cada etapa dessa conversão gera receita.

O MVP já está **construído, em produção no Vercel, com banco PostgreSQL no Supabase**, e cobre o fluxo completo de reserva, carteira, dashboard do vendedor e painel administrativo. A versão de produção que este documento descreve amplia essa base com funcionalidades que aumentam diretamente a retenção, o volume de transações e o ticket médio: busca geolocalizada, analytics para o vendedor, sistema de reputação, programa de indicação e infraestrutura dedicada com monitoramento profissional.

**O que o sócio comercial recebe ao entrar:** um terço de uma plataforma funcional, com modelo de receita provado, tecnologia de nível enterprise já implementada pelos sócios técnicos, e um mercado sem player dominante no Brasil.

---

## 1. IDENTIFICAÇÃO DAS PARTES

| Papel | Contribuição |
|---|---|
| **Sócio Técnico 1 — DevOps** | Arquitetura de infraestrutura, provisionamento K3s/KVM, CI/CD, deploy, manutenção, evolução da plataforma e desenvolvimento |
| **Sócio Técnico 2 — DevSec** | Arquitetura de segurança, auditoria de código, hardening do cluster, monitoramento de ameaças, desenvolvimento |
| **Sócio Comercial** | Custeio de infraestrutura e divulgação, gestão de Customer Success, onboarding de brechós, coordenação de projeto |

**Distribuição de lucros:** 1/3 (33,33%) para cada sócio sobre o lucro líquido gerado pela plataforma, com periodicidade mensal após reserva de caixa operacional.

---

## 2. O PRODUTO

### 2.1 Posicionamento

> **"Dar a cada brechó a presença digital de uma grande marca — com vitrine profissional, sistema de vendas seguro e analytics de verdade."**

O Brasil tem dezenas de milhares de brechós, algumas dezenas deles situados em Recife-PE e a grande maioria dependente de Instagram e WhatsApp como único canal de vendas. Isso significa: sem controle de estoque, sem proteção ao comprador, sem histórico de transações, sem dados sobre o próprio negócio.

O Breshop resolve esse problema sendo, ao mesmo tempo:
- **Para o comprador:** o lugar onde se descobre brechós por localização, filtros e reputação — sem depender de indicação de amigos
- **Para o dono do brechó:** uma ferramenta de gestão com vitrine, pedidos, financeiro e analytics — sem precisar contratar ninguém
- **Para a plataforma:** uma máquina de receita com margem embutida em cada transação via sistema de moedas

### 2.2 Oportunidade de Mercado

- Moda sustentável cresceu 25% ao ano nos últimos 3 anos no Brasil
- Nenhuma plataforma nacional domina o segmento de brechós com foco em gestão + marketplace integrados
- Enjoei e OLX são plataformas generalistas sem ferramentas específicas para o vendedor de brechó
- A tendência de consumo consciente entre 18–35 anos é a principal base de usuários da plataforma

---

## 3. FUNCIONALIDADES DA PLATAFORMA

### 3.1 Já Implementado (MVP em Produção)

**Autenticação e Controle de Acesso**
- Login por e-mail e senha com hash bcrypt
- Sessão persistida via cookie httpOnly com middleware de proteção de rotas
- RBAC com 3 perfis: `USER`, `BRECHO_OWNER`, `ADMIN`
- Redirecionamento automático por papel (dono não acessa carrinho; usuário não acessa dashboard)

**Marketplace — Vitrine e Descoberta**
- Landing page com carrossel de brechós em destaque e feed de produtos
- Catálogo completo com cards de produto (imagem, nome, preço em coins, status)
- Página de favoritos com persistência local
- Interface de filtros por categoria e tags (UI implementada)

**Sistema de Reservas (fluxo completo)**
- Reserva de peça com débito imediato de coins — coins ficam bloqueados até conclusão
- Janela de reserva de 48 horas com countdown em tempo real
- Ciclo completo: `RESERVED → APPROVED → DELIVERED → COMPLETED`
- Rejeição com motivo categorizável e destino da peça (`RETURN_TO_STORE` ou `SOLD_OUTSIDE_APP`)
- Atualização otimista — peça desaparece da vitrine imediatamente após reserva

**Carteira Interna de Coins**
- 1 Coin = R$5,00
- Saldo disponível e saldo bloqueado por carteira
- Tipos de transação: `TOPUP`, `RESERVE`, `RELEASE`, `REFUND`
- Carteira individual por usuário e carteira separada por brechó
- Compra de pacotes de coins e solicitação de saque (conversão para R$)

**Dashboard do Vendedor**
- Painel de pedidos com status em tempo real e ações (aprovar / rejeitar / confirmar entrega)
- Modal de rejeição com motivo e destino da peça
- Métricas: total de pedidos, pedidos pendentes, total ganho e valor em reserva
- Extrato financeiro com histórico de transações

**Painel Administrativo da Plataforma**
- CRUD completo de: usuários, brechós, produtos, tags, endereços, admins
- Controle centralizado de inventário e operações

**Área do Comprador**
- Página "Minhas Reservas" com status e countdown de cada reserva ativa
- Perfil com saldo, histórico de pedidos e links de gestão
- Carrinho com checkout de múltiplos itens

**Criação de Brechó (wizard 3 etapas)**
- Básico: nome, descrição, localização, contatos
- Mídia: avatar e banner
- Legal: CPF/CNPJ

---

### 3.2 Funcionalidades de Produção (V1 Completo)

Além do core do MVP, a versão de produção entregará:

**Busca por Geolocalização**
- "Brechós perto de mim" usando a Geolocation API do browser e raio de busca configurável
- Filtro por CEP, cidade ou estado — alimentado pela tabela `Address` com dados completos
- Ordenação de resultados por distância, combinável com filtros de tag e categoria
- *Impacto direto em receita:* usuário que encontra brechó próximo tem maior probabilidade de visitar fisicamente e comprar recorrentemente

**Analytics e Dashboard para o Vendedor**
- Métricas de vitrine: visualizações por produto (`User_Interactions`), taxa de favoritos, conversão de reservas
- Histórico financeiro com gráficos de ganhos por período
- Produtos mais vistos vs. mais reservados — dados acionáveis para o dono do brechó precificar e priorizar estoque
- *Impacto direto em receita:* dono do brechó com visibilidade do próprio negócio tem menor churn e maior engajamento com a plataforma

**Sistema de Avaliações e Reputação**
- Comprador avalia o brechó após a entrega (rating 1–5 + comentário opcional)
- Score público do brechó visível na vitrine
- `Product_Like` e `Product_Comment` para engajamento social em peças individuais
- *Impacto direto em receita:* reputação gera confiança → maior taxa de conversão → mais coins comprados

**Programa de Indicação (Referral)**
- Usuário ganha coins bônus ao indicar um amigo que se cadastra e faz a primeira compra
- Brechó ganha destaque ao indicar outro brechó para a plataforma
- Crescimento orgânico com custo de aquisição próximo de zero
- *Impacto direto em receita:* cada novo usuário trazido por referral já entra com comportamento de compra e coins no radar

**Sistema de Conversão de Moeda**
- Interface dedicada de compra de coins com pacotes (ex: 20 coins, 50 coins, 100 coins, 200 coins)
- Painel de saque do brechó com simulação do valor a receber antes de confirmar
- Taxa de conversão aplicada transparentemente — modelo de spread entre compra e saque
- Histórico completo de movimentações financeiras para brechó e comprador
- *Impacto direto em receita:* quanto mais coins circulam na plataforma, maior a margem acumulada

**Engajamento e Retenção**
- Favoritar brechós com histórico personalizado (`User_Favorite_Brecho`)
- Comentários e curtidas em produtos — geram retorno orgânico à plataforma
- Vetor de interesses do usuário (`interest_vector` na tabela `Common`) para alimentar recomendações personalizadas em V2
- Controle de opt-in para emails promocionais (`receive_promo`)

---

### 3.3 Roadmap V2

| Feature | Valor de Negócio |
|---|---|
| App nativo Android + iOS (Flutter) | Acessibilidade mobile nativa — reduz fricção de compra |
| Engine de recomendação por IA | Usa `interest_vector` acumulado na V1 para personalizar vitrine — aumenta ticket médio |
| Chat comprador ↔ brechó | Negociação e engajamento dentro da plataforma |
| Push notifications (FCM + APNs) | Reengajamento automático — "nova peça do brechó que você favoritou" |
| Integração Instagram (importar catálogo) | Reduz atrito de onboarding para brechós já presentes no Instagram |
| Expansão geográfica | Nordeste → Sul → Brasil |

---

## 4. ARQUITETURA DO BANCO DE DADOS

A versão de produção migra do schema enxuto do MVP para um modelo relacional completo, desenhado para suportar todas as funcionalidades sociais, de analytics e de recomendação.

### 4.1 Diagrama de Entidades

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Address    │       │    Brecho    │       │     User     │
│──────────────│       │──────────────│       │──────────────│
│ id (PK)      │◄──────│ address_id   │       │ id (PK)      │
│ CEP          │       │ id (PK)      │◄──────│ address_id   │
│ state        │       │ name         │       │ name         │
│ city         │       │ email        │       │ email        │
│ street       │       │ phone        │       │ role         │
│ number       │       │ instagram    │       │ receive_promo│
└──────────────┘       │ whatsapp_url │       └──────┬───────┘
                       │ is_visible   │              │
                       │ user_id (FK) │         ┌────┴────────────────┐
                       └──────┬───────┘         │                     │
                              │            ┌────▼────┐  ┌──────────┐  │
                              │            │  Admin  │  │  Owner   │  │
                              │            │─────────│  │──────────│  │
                              │            │user_id  │  │user_id   │  │
                              │            │access_  │  │cpf_cnpj  │  │
                              │            │level    │  └──────────┘  │
                              │            └─────────┘                 │
                              │                               ┌────────▼───────┐
                              │                               │     Common     │
                              │                               │────────────────│
                              │                               │ user_id        │
                              │                               │ interest_vector│ ←IA
                              │                               │ last_login     │
                              │                               └───────┬────────┘
                              │                                       │
         ┌────────────────────┤               ┌───────────────────────┘
         │                    │               │
┌────────▼───────┐   ┌────────▼───────────────▼──────┐
│    Product     │   │      User_Favorite_Brecho      │
│────────────────│   │───────────────────────────────│
│ id (PK)        │   │ common_user_id (FK)            │
│ name           │   │ brecho_id (FK)                 │
│ price          │   └───────────────────────────────┘
│ status         │
│ brecho_id (FK) │◄──┐   ┌──────────────────────────┐
└────────┬───────┘   │   │    User_Interactions     │
         │           │   │──────────────────────────│
    ┌────┴────────────────┤ common_user_id (FK)      │ ← analytics
    │    │            │   │ product_id (FK)          │
    │    │            │   │ view_count               │
    │    │            │   │ last_viewed              │
    │    │            │   └──────────────────────────┘
    │    │
    │  ┌─▼───────────────┐  ┌───────────────────┐
    │  │  Product_Image  │  │    Product_Tag    │
    │  │─────────────────│  │───────────────────│
    │  │ id (PK)         │  │ product_id (FK)   │──► Tag (id, name)
    │  │ url             │  │ tag_id (FK)       │
    │  │ position        │  └───────────────────┘
    │  │ product_id (FK) │
    │  └─────────────────┘
    │
    │  ┌─────────────────┐  ┌───────────────────┐  ┌─────────────────────┐
    └──► Product_Like    │  │ Product_Comment   │  │   Brecho_Review     │
        │─────────────────│  │───────────────────│  │─────────────────────│
        │ id (PK)         │  │ id (PK)           │  │ id (PK)             │
        │ common_user_id  │  │ common_user_id    │  │ common_user_id (FK) │
        │ product_id (FK) │  │ product_id (FK)   │  │ brecho_id (FK)      │
        │ is_active       │  │ comment_text      │  │ rating (1–5)        │
        │ created_at      │  │ created_at        │  │ comment (opcional)  │
        └─────────────────┘  └───────────────────┘  └─────────────────────┘
```

### 4.2 Decisões de Design e Impacto de Negócio

| Decisão | Justificativa técnica | Impacto de negócio |
|---|---|---|
| `is_visible` no Brecho | Controle de vitrine sem excluir dados | Admin pode suspender brechó problemático sem perder histórico |
| `is_active` no Product_Like | Permite descurtir sem delete — preserva histórico | Dados de engajamento mais ricos para analytics e recomendação |
| `interest_vector` (vector) | Embedding de preferências do usuário para ML | Base para engine de recomendação da V2 — diferencial competitivo |
| `User_Interactions` | Rastreia views por produto com timestamp | Alimenta analytics do vendedor e detecta produtos de alta demanda não convertida |
| `view_count + last_viewed` | Dados de comportamento passivo | Revela produtos populares que não convertem → oportunidade de precificação |
| `receive_promo` | Opt-in explícito para marketing | Conformidade com LGPD + segmentação de e-mail marketing eficiente |
| `access_level` no Admin | Granularidade de permissão para admins | Suporte (nível 1) não acessa financeiro; C-level acessa tudo |
| Tabela `Address` normalizada | Evita duplicação de CEP/cidade | Base para busca geolocalizada e análise de concentração geográfica |
| Múltiplas imagens por produto | Carrossel de fotos com ordenação | Maior taxa de conversão — comprador vê peça de múltiplos ângulos |

---

## 5. STACK TECNOLÓGICA

| Camada | Tecnologia | Versão |
|---|---|---|
| **Framework Web** | Next.js — App Router + SSR | 16.2.4 |
| **Interface** | React + TypeScript | 19.2.0 / TS 5 |
| **Estilização** | Tailwind CSS | 4.x |
| **Estado Global** | Zustand | 5.0.12 |
| **ORM** | Prisma | 7.8.0 |
| **Banco de Dados** | PostgreSQL | 16 |
| **Autenticação** | Cookie-based session + bcrypt + JWT (V1) | — |
| **Storage de Imagens** | Cloudinary / S3-compatible | a integrar |
| **E-mail Transacional** | Resend | a integrar |
| **Orquestração** | K3s (Kubernetes leve) | — |
| **Containers** | Docker | — |
| **Proxy / Ingress** | NGINX Ingress Controller | — |
| **SSL/TLS** | cert-manager + Let's Encrypt | — |
| **CI/CD** | GitHub Actions | — |
| **Monitoramento** | Prometheus + Grafana + Loki | — |
| **Segurança de Host** | UFW + Fail2Ban | — |
| **App Mobile (V2)** | Flutter — Android + iOS | planejado |
| **Ícones** | Lucide React | 0.554.0 |

---

## 6. ARQUITETURA TÉCNICA E INFRAESTRUTURA

### 6.1 Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    BRESHOP PLATFORM                     │
│         PWA (Next.js) — Comprador / Vendedor / Admin    │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────┐
│         NGINX Ingress Controller + cert-manager         │
│                    TLS automático (Let's Encrypt)        │
└──────┬────────────────────────────────────┬─────────────┘
       │                                    │
┌──────▼──────────────┐      ┌──────────────▼──────────────┐
│  Next.js App        │      │   Static Assets / CDN       │
│  SSR + API Routes   │      │   Imagens de produtos       │
│  HPA: 2–4 réplicas  │      │   Cloudinary                │
└──────┬──────────────┘      └─────────────────────────────┘
       │ Prisma ORM
       ▼
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL 16 — Banco Principal            │
│    Users · Brechos · Products · Orders · Wallet        │
│    Interactions · Reviews · Tags · Comments            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│           STACK DE MONITORAMENTO (K3s namespace)        │
│  Prometheus (métricas) → Grafana (dashboards)          │
│  Loki (logs centralizados) → alertas automáticos       │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Cluster K3s em KVM

A plataforma é implantada em servidor KVM com K3s, saindo da dependência de plataformas serverless (como Vercel) para infraestrutura própria com controle total, monitoramento nativo e custo previsível.

**Configuração inicial (MVP → V1):**

| Nó | Papel | vCPU | RAM | NVMe | Workloads |
|---|---|---|---|---|---|
| Node 1 | Control Plane + Banco | 8 | 32 GB | 400 GB | K3s CP, PostgreSQL, Prometheus, Grafana, Loki |
| Node 2 | App Worker | 4 | 16 GB | 100 GB | Next.js (HPA 2–4 réplicas), NGINX Ingress, cert-manager |

**SLA proposto:** 99,9% de disponibilidade mensal
- Falha de um worker não interrompe serviço (rolling deployments)
- Backups automáticos do PostgreSQL comprimidos para object storage

**Caminho de crescimento horizontal:**

| Fase | Usuários | Configuração | Custo adicional |
|---|---|---|---|
| Lançamento | Até 5.000 | 2 nós (base) | — |
| Crescimento | Até 20.000 | Node 2 escala via HPA | sem hardware novo |
| Expansão | Até 50.000+ | Node 3 (App Worker) | +R$ 200–300/mês |

Adição de nó worker via automação: operação de menos de 15 minutos, sem downtime.

### 6.3 Segurança

| Camada | Implementação | Proteção |
|---|---|---|
| Host | UFW (firewall) | Bloqueia portas não autorizadas; apenas 80, 443, 22 expostos |
| Host | Fail2Ban | Bane IPs após N tentativas falhas de autenticação SSH |
| Aplicação | bcrypt (senhas) | Hash com salt — senhas nunca armazenadas em texto plano |
| Aplicação | Middleware RBAC | Cada rota valida papel do usuário antes de processar request |
| Aplicação | Headers de segurança (CSP, HSTS, X-Frame-Options) | Proteção contra XSS, clickjacking, sniffing |
| Rede | NGINX Ingress + TLS | Todo tráfego criptografado — HTTP redireciona para HTTPS |
| Certificados | cert-manager + Let's Encrypt | Renovação automática — zero custo e zero intervenção manual |
| Dados | Variáveis de ambiente via K8s Secrets | Credenciais nunca expostas em código-fonte |
| CI/CD | Scan de dependências (Dependabot) | Alertas automáticos de vulnerabilidades em dependências |

### 6.4 CI/CD

```
git push → branch main
  ↓
GitHub Actions
  ├─ Lint + type check (TypeScript)
  ├─ Build da imagem Docker
  ├─ Push → GitHub Container Registry (GHCR)
  ├─ Deploy: kubectl apply + kubectl rollout restart
  ├─ Health check automático
  └─ Notificação de resultado
```

- **Staging automático:** branch `develop` faz deploy automático em ambiente de homologação
- **Produção com aprovação:** branch `main` requer revisão antes do deploy
- **Rollback:** em falha no health check, pipeline reverte para imagem anterior automaticamente

### 6.5 Monitoramento e Observabilidade

| Ferramenta | Função | O que monitora |
|---|---|---|
| **Prometheus** | Coleta de métricas | CPU, memória, latência de requisições, erros HTTP 5xx |
| **Grafana** | Dashboards visuais | Painel operacional em tempo real com alertas configurados |
| **Loki** | Logs centralizados | Logs de aplicação, banco e NGINX em um único lugar — retenção 30 dias |

**Alertas configurados:**
- CPU > 80% por 5 minutos → notificação imediata
- Erro HTTP 5xx > 1% das requisições → notificação imediata
- Banco de dados com espaço < 20% → alerta antecipado
- Pod crashed → restart automático + alerta

---

## 7. MODELO DE NEGÓCIO E RECEITA

### 7.1 O Motor Econômico

O Breshop opera com **economia fechada de Coins**, criando uma camada de receita em cada direção do fluxo de dinheiro:

```
COMPRADOR
  Compra pacote de 100 Coins por R$ 500 (1 coin = R$5)
        ↓ plataforma recebe R$500
  Usa 80 Coins para reservar uma peça (R$400 em coins)
        ↓
VENDEDOR
  Recebe 80 Coins ao confirmar entrega
  Solicita saque: recebe R$360 (taxa de conversão de 10%)
        ↓
BRESHOP
  Receita = R$500 (venda de coins) - R$360 (saque do vendedor) = R$140
  Margem bruta por transação: ~28%
```

**Vantagens do modelo:**
- Margem embutida em cada transação
- Coins não utilizados ficam na plataforma — float financeiro favorável
- O comprador que comprou coins e não gastou todos tem incentivo para voltar

### 7.2 Fontes de Receita

| Fonte | Mecanismo | Quando gera receita |
|---|---|---|
| Venda de Coins | Usuário compra pacote pré-pago | Imediato, no momento da compra |
| Taxa de conversão | % aplicado ao saque do vendedor (recomendado: 10%) | Na confirmação de entrega |
| Float de Coins | Coins comprados mas não utilizados ficam na plataforma | Contínuo |
| Referral | Novos usuários trazidos por indicação chegam com intenção de compra | Indireto — aumenta GMV |

### 7.3 Projeção Financeira Conservadora

**Premissas:**
- Ticket médio de R$750 por transação (150 coins × R$5)
- Margem bruta de 28% por transação (spread de compra + taxa de conversão de 10%)
- 5% dos usuários cadastrados fazem ao menos 1 transação por mês

| Mês | Brechós | Usuários | Transações/mês | GMV (R$) | Receita Bruta | Receita/Sócio |
|---|---|---|---|---|---|---|
| 1 | 10 | 300 | 30 | R$ 22.500 | R$ 6.300 | R$ 2.100 |
| 2 | 15 | 600 | 60 | R$ 45.000 | R$ 12.600 | R$ 4.200 |
| 3 | 20 | 1.000 | 100 | R$ 75.000 | R$ 21.000 | R$ 7.000 |
| 6 | 50 | 5.000 | 500 | R$ 375.000 | R$ 105.000 | R$ 35.000 |
| 12 | 150 | 20.000 | 2.000 | R$ 1.500.000 | R$ 420.000 | R$ 140.000 |

> Projeção conservadora. O programa de referral, os analytics para vendedores e o sistema de reputação são multiplicadores de crescimento que aceleram estas curvas sem custo proporcional de infra.

### 7.4 Por que a Plataforma se Valoriza com o Tempo

- **Efeito de rede:** mais brechós → mais produtos → mais usuários → mais brechós
- **Moat de dados:** `User_Interactions` + `interest_vector` acumulam dados proprietários que alimentam recomendações da V2 — concorrentes não conseguem replicar sem anos de histórico
- **Retenção estrutural:** brechó com reviews, analytics e histórico de vendas na plataforma não sai por concorrente que ofereça margem de 9% em vez de 10%
- **Custo de infra escala mais lento que a receita:** adicionar um novo nó ao cluster custa R$200–300/mês, mas pode suportar 10.000 novos usuários gerando dezenas de milhares em receita adicional

---

## 8. ESTRUTURA DA PARCERIA

### 8.1 Responsabilidades Detalhadas

**Sócio Técnico 1 — DevOps**
- Provisionamento e manutenção do cluster K3s em KVM
- Configuração de UFW, Fail2Ban, NGINX, cert-manager
- CI/CD via GitHub Actions (build, testes, deploy, rollback)
- Gestão de backups, migrations de banco e escalabilidade
- Stack de monitoramento (Prometheus + Grafana + Loki)
- Desenvolvimento de features e correção de bugs
- On-call para incidentes de infraestrutura

**Sócio Técnico 2 — DevSec**
- Arquitetura e auditoria de segurança da aplicação (OWASP Top 10)
- Hardening do cluster (RBAC Kubernetes, Network Policies, K8s Secrets)
- Revisão de código antes de merge para produção
- Gestão de secrets e variáveis de ambiente
- Scan de vulnerabilidades em dependências e imagens Docker
- Desenvolvimento de features e correção de bugs
- Resposta a incidentes de segurança

**Sócio Comercial**
- Custeio integral da infraestrutura (KVM, storage, CDN, domínio, e-mail)
- Investimento em estratégia e execução de divulgação (ads, influenciadores, parceria com brechós)
- Onboarding e suporte aos brechós parceiros (Customer Success)
- Gestão de roadmap e priorização de features junto aos sócios técnicos
- Relatório financeiro mensal (receita, custos, lucro distribuível)
- Prospecção dos primeiros 20 brechós parceiros para o lançamento

### 8.2 Divisão de Lucros

```
Receita Bruta da Plataforma (coins vendidos + taxas de conversão)
  − Custos de Infraestrutura         (responsabilidade do Sócio Comercial)
  − Custos de Divulgação/Marketing   (responsabilidade do Sócio Comercial)
  − Custos Operacionais (ferramentas, serviços, eventuais contratações)
  = Lucro Líquido

Lucro Líquido ÷ 3 = 1/3 por sócio (33,33%)
```

- Distribuição mensal após fechamento do ciclo
- Reserva mínima de caixa: 2 meses de custos operacionais antes de qualquer distribuição
- Relatório financeiro disponibilizado até o 5º dia útil de cada mês

---

## 9. INFRAESTRUTURA — CUSTOS MENSAIS

### Fase 1 — Lançamento (0–3 meses, até 1.000 usuários)

| Serviço | Especificação | Custo/mês |
|---|---|---|
| KVM Node 1 — Control Plane + DB | 8 vCPU · 32GB RAM · 400GB NVMe | R$ 450 |
| KVM Node 2 — App Worker | 4 vCPU · 16GB RAM · 100GB NVMe | R$ 200 |
| Object Storage — backups | 100 GB (S3-compatible) | R$ 30 |
| Cloudinary — imagens | 25GB storage / 25GB bandwidth | R$ 0 (free tier) |
| Resend — e-mail transacional | 3.000 e-mails/mês | R$ 0 (free tier) |
| Domínio (.com.br) | — | R$ 7 |
| **Total Fase 1** | | **R$ 687/mês** |

### Fase 2 — Crescimento (3–12 meses, até 20.000 usuários)

| Serviço | Especificação | Custo/mês |
|---|---|---|
| KVM Node 1 — Control Plane + DB | 8 vCPU · 32GB RAM · 400GB NVMe | R$ 450 |
| KVM Node 2 — App Worker | 8 vCPU · 16GB RAM · 100GB NVMe | R$ 300 |
| KVM Node 3 — App Worker Adicional | 4 vCPU · 16GB RAM · 100GB NVMe | R$ 200 |
| Object Storage | 500 GB | R$ 80 |
| Cloudinary Plus | 80GB storage | R$ 100 |
| Resend Pro | 50.000 e-mails/mês | R$ 120 |
| Domínio | — | R$ 7 |
| **Total Fase 2** | | **~R$ 1.257/mês** |

> Todos os custos de infraestrutura são de responsabilidade do **Sócio Comercial**, conforme acordo. Com receita mensal de R$21.000 no mês 3 e R$105.000 no mês 6, os custos de infra representam menos de 4% da receita bruta na fase de crescimento.

---

## 10. EQUIPE PARA MANTER A PLATAFORMA EM PRODUÇÃO

A arquitetura K3s + Next.js + PostgreSQL foi projetada para operar sem equipe adicional no MVP e V1:

| Função | Responsável | Dedicação pós-lançamento |
|---|---|---|
| Infraestrutura e deploy | Sócio DevOps | ~5–8h/semana |
| Segurança e revisão | Sócio DevSec | ~5–8h/semana |
| Novas features e bug fixes | Ambos técnicos | ~15–20h/semana (variável) |
| Customer Success e suporte | Sócio Comercial | Dedicação principal |
| Onboarding de brechós | Sócio Comercial | Dedicação principal |
| Gestão de produto e roadmap | Sócio Comercial | Dedicação principal |

**Nenhuma contratação necessária no MVP e V1.**

Contratações futuras conforme crescimento:
- Desenvolvedor Flutter para app mobile (contrato por projeto — V2)
- Analista de CS quando volume exceder capacidade operacional do Sócio Comercial

---

## 11. CRONOGRAMA

### Fase 0 — Completar MVP para Lançamento (semanas 1–6)

| Semana | Entregável | Responsável |
|---|---|---|
| 1 | Migração de Vercel/Supabase para cluster KVM + K3s | DevOps |
| 1–2 | Endpoint de registro de usuário + recuperação de senha | DevSec |
| 2 | Integração de upload de imagens (Cloudinary) | DevOps |
| 2–3 | Backend de busca com filtros + PostGIS para geolocalização | DevSec |
| 3 | Páginas de detalhe do produto e do brechó | Ambos |
| 4 | Cron job de expiração de reservas (48h) | DevOps |
| 4–5 | Notificações por e-mail transacional (Resend) | DevSec |
| 5 | Schema V1 completo (Prisma migration) + seed de produção | Ambos |
| 6 | Hardening de segurança, testes, QA, go-live com domínio próprio | Ambos |

### Fase 1 — Tração (meses 2–4)
- Onboarding dos primeiros 20 brechós parceiros (Sócio Comercial)
- Analytics de vendedor em produção
- Sistema de avaliações e reputação
- Programa de indicação (referral com coins bônus)
- Monitoramento de KPIs: GMV, taxa de conversão de reservas, churn

### Fase 2 — Escala (meses 5–12)
- Funcionalidades sociais completas (likes, comentários, feed personalizado)
- Engine de recomendação (alimentada por `interest_vector` coletado na Fase 1)
- Desenvolvimento do app mobile Flutter
- Expansão regional

---

## 12. ENTREGÁVEIS

**Sócios Técnicos entregam:**
- Plataforma web/PWA funcional em produção com todas as features V1
- Cluster K3s configurado e operacional em KVM com monitoramento ativo
- Pipeline CI/CD com deploy automatizado e rollback
- Schema de banco completo com migrations versionadas
- Stack de segurança ativa (UFW, Fail2Ban, TLS, headers)
- Stack de monitoramento (Prometheus, Grafana, Loki) com dashboards e alertas
- Documentação técnica: arquitetura, endpoints, runbook operacional
- Código-fonte completo no repositório GitHub da empresa
- Manutenção contínua, correções de bugs e atualizações pós-lançamento

**Sócio Comercial entrega:**
- Custeio mensal de infraestrutura e serviços
- Estratégia e investimento em divulgação
- Onboarding e suporte dos primeiros 20 brechós
- Gestão de Customer Success e suporte ao usuário
- Relatório financeiro mensal

---

## 13. TERMOS DA PARCERIA

1. **Propriedade:** código-fonte, banco de dados, marca Breshop e ativos digitais pertencem igualmente aos 3 sócios na proporção de 1/3 cada.

2. **Saída de sócio:** participação é negociada entre as partes restantes com base em avaliação do momento. Cláusula de não-concorrência de 12 meses para uso de código, marca ou dados.

3. **Decisões estratégicas:** alterações no modelo de negócio, divisão de lucros, stack principal ou roadmap requerem consenso dos 3 sócios.

4. **Decisões operacionais:** cada sócio tem autonomia total na sua área, conforme seção 8.1.

5. **Gastos extraordinários:** acima de R$500 não previstos requerem aprovação dos 3 sócios.

6. **Reserva de caixa:** distribuição de lucros apenas após reserva de 2 meses de custos operacionais.

7. **SLA técnico:** disponibilidade mínima de 99% mensais; resposta a bugs críticos em até 24 horas.

8. **Transparência financeira:** relatório completo disponível até o 5º dia útil de cada mês.

9. **LGPD:** a plataforma coleta e trata dados pessoais de usuários — os sócios técnicos são responsáveis pela implementação técnica de conformidade; o Sócio Comercial é responsável pelas políticas e termos de uso.

10. **Vigência:** acordo com prazo indeterminado, revisável por consenso unânime.

---

## ASSINATURAS

| Sócio | Papel | Assinatura | Data |
|---|---|---|---|
| _________________________________ | DevOps | _________________ | ___/___/2026 |
| _________________________________ | DevSec | _________________ | ___/___/2026 |
| _________________________________ | Comercial | _________________ | ___/___/2026 |

---

*Breshop · Proposta Técnico-Comercial e Acordo de Parceria · Recife, PE · 2026*
