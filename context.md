# 🎨 Manual de Marca — **Breshop**

## 1. Essência da Marca

**Propósito:**
Conectar pessoas a brechós de forma simples, rápida e visualmente agradável, promovendo a moda sustentável.

**Missão:**
Facilitar a descoberta, divulgação e comercialização de peças de brechó.

**Visão:**
Ser a principal plataforma digital de brechós no Brasil.

**Valores:**

* Sustentabilidade
* Acessibilidade
* Comunidade
* Praticidade
* Transparência

---

## 2. Personalidade da Marca

O Breshop deve transmitir:

* 🌿 **Sustentável** (eco-friendly, consciente)
* 🧩 **Organizado** (filtros, busca fácil)
* 🤝 **Acessível** (simples e direto)
* 🛍️ **Estiloso** (moda, tendência, identidade visual forte)
* ⚡ **Ágil** (interação rápida, sem fricção)

**Tom de voz:**

* Informal, mas não infantil
* Direto e claro
* Próximo do usuário (ex: “Encontre peças perto de você”)

---

## 3. Paleta de Cores

### 🎯 Cores principais

| Cor               | Uso                                     | HEX       |
| ----------------- | --------------------------------------- | --------- |
| Verde sustentável | Cor primária (marca, botões principais) | `#2E7D32` |
| Verde claro       | Hover, estados ativos                   | `#4CAF50` |
| Bege neutro       | Background principal                    | `#F5F5DC` |
| Branco            | Cards e áreas de conteúdo               | `#FFFFFF` |

### 🎯 Cores secundárias

| Cor          | Uso                            | HEX       |
| ------------ | ------------------------------ | --------- |
| Marrom suave | Destaques, identidade “brechó” | `#8D6E63` |
| Cinza médio  | Textos secundários             | `#757575` |
| Cinza claro  | Bordas/divisores               | `#E0E0E0` |

### 🎯 Cores de feedback

| Tipo    | Cor       |
| ------- | --------- |
| Sucesso | `#2E7D32` |
| Erro    | `#D32F2F` |
| Aviso   | `#F9A825` |
| Info    | `#0288D1` |

---

## 4. Tipografia

### 🔤 Fonte principal

* **Poppins** → moderna, limpa, ótima para UI
* Alternativa: **Inter**

### Hierarquia:

* **Títulos (H1, H2):**
  `Poppins Bold (600–700)`

* **Subtítulos:**
  `Poppins Medium (500)`

* **Texto comum:**
  `Poppins Regular (400)`

* **UI / botões:**
  `Poppins Medium (500)`

### Tamanhos recomendados:

* H1: 32px
* H2: 24px
* H3: 20px
* Texto: 16px
* Pequeno: 14px

---

## 5. Estilo Visual

### 🎯 UI (Interface)

* Bordas arredondadas → `border-radius: 12px`
* Cards com sombra leve:

  ```
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  ```
* Espaçamento generoso (layout respirável)
* Uso forte de **cards** (brechós e produtos)

---

### 🎯 Componentes-chave

#### 🧩 Cards de produto

* Imagem grande
* Nome da peça
* Tags visuais (chips)
* Estado: disponível / vendido

#### 🏪 Card de brechó

* Foto ou logo
* Nome
* Localização
* Botão: “Ver peças”

---

### 🎯 Tags (muito importante pro produto)

Tags são parte central do sistema:

* Formato: pill (arredondado)
* Ex:

  * `#vintage`
  * `#nike`
  * `#casual`

**Estilo:**

* Fundo: verde claro ou cinza claro
* Texto: escuro
* Pequeno e escaneável

---

## 6. UX (Experiência do Usuário)

### 🔥 Ponto mais crítico do app:

**Busca e descoberta**

Se isso for ruim, o produto morre.

### 🧭 Fluxo ideal:

1. Usuário entra
2. Vê brechós ou produtos próximos
3. Aplica filtros:

   * Localização
   * Tipo de peça
   * Tags
4. Visualiza rapidamente
5. Clica → vai pro brechó → entra em contato

---

### ⚡ Princípios UX:

* **Zero fricção**

  * Nada de formulários longos
* **Descoberta rápida**

  * Mostrar conteúdo antes de pedir login
* **Mobile-first**

  * 90% vai usar no celular
* **Feedback visual imediato**

  * Hover, loading, sucesso

---

## 7. Layout e Estrutura

### 🏠 Home

* Barra de busca (topo)
* Filtros rápidos (horizontal scroll)
* Lista/grid de brechós ou peças

---

### 🔍 Busca

* Input + filtros
* Resultados em grid
* Tags visíveis

---

### 🏪 Página do brechó

* Header com info
* Lista de peças
* Botão de contato (Instagram/WhatsApp)

---

### ⚙️ Admin

* CRUD simples:

  * Adicionar peça
  * Editar
  * Marcar como vendida
* Upload de imagem fácil
* Tags selecionáveis

---

## 8. Animações

* Transições suaves (200–300ms)
* Hover em cards
* Fade-in em listas

Evitar:

* Animações pesadas
* Delay excessivo

---

## 9. Opinião como Frontend + UI/UX Sênior

Vou ser direto contigo:

### 💡 O projeto é MUITO bom — mas o risco é execução

O diferencial NÃO é só a ideia, é:

> 🔥 **como você resolve busca + organização**

---

### 🚨 Pontos críticos que você precisa acertar:

#### 1. Busca precisa ser excelente

* Filtro por localização REAL (não fake)
* Tags bem estruturadas
* Pesquisa rápida

#### 2. Performance

* Muitas imagens → precisa otimizar
* Lazy loading obrigatório

#### 3. UX mobile impecável

* Scroll fluido
* Botões grandes
* Interação rápida

---

### 💡 Sugestões estratégicas (alto nível):

#### 🧠 1. Comece simples

Não implemente tudo de cara:

**MVP:**

* Brechós
* Produtos
* Tags
* Busca

Deixa depois:

* Chat
* Notificação
* Pagamento

---

#### 🧠 2. Integração social é chave

Brechó vive no Instagram:

👉 Integração com Instagram é ouro
(ou pelo menos link direto forte)

---

#### 🧠 3. Evite marketplace completo no início

Não tente ser um “Mercado Livre de brechó”

Seja:

> 🔥 “Google Maps + vitrine de brechó”

---

#### 🧠 4. Dados são o coração

* Tags bem definidas
* Categorias organizadas
* Estrutura consistente

---

## 10. Stack sugerida (bônus)

Como você já usa React:

* Frontend: **Next.js**
* UI: **TailwindCSS**
* Backend: **Supabase**
* Imagens: otimização via Next/Image
* Deploy: Vercel

---

## 11. Resumo Final

O Breshop deve ser:

> 🛍️ Simples + rápido + visual + útil

Se você acertar:

* busca
* organização
* mobile

--------------------------

Esse manual de marca foi baseado nessa produção de documentação do projeto:

## **Contexto:**

- Programa com propósito de facilitar a divulgação e comercialização dos brechós. Com o crescimento da moda suntentável, o Breshop visa facilitar a divulgação entre consumidores e brechós. Para isso, a plataforma hospedará brechós de diferente localidades, disponibilizando formas de contato, localização de seu espaço físico(se houver) e, ou, digital(instagram, facebook, etc).

### **Problemas e Soluções:**

- Problemas:
    - Dificuldade da visualização fácil e objetiva de brechós por parte dos consumidores;
    - Barreiras na divulgação entre o brechó e seus consumidores.
    - Gasto de tempo em responder e editar informações sobre peças novas e, ou, vendidas;
    - Dificuldade dos consumidores em encontrar objetivamente brechós perto de sua localidade;
    - Dificuldade em encontrar tipos de peças enpecíficas por parte dos consumidores;
- Soluções:
    - Hospedar brechós dentro do Breshop. Facilitando a visualização e busca de brechós em um único ambiente;
    - Dentro do Breshop consumidores terão facilidade em ter conhecimento sobre brechós que não haviam sido recomendados ou mencionados em suas redes;
    - Página Admin fácil e intuitiva onde os donos do brechó poderão adicionar, apagar e alterar roupas e produtos de seu estabelecimento;
    - O Breshop contará com informações personalizadas da localidade física(se tiverem) dos brechós;
    - O Breshop contará com filtros baseados em tags pré-registradas pelo administrador do brechó;
        
        

# **Requisitos:**

- **Requisitos funcionais:**
    - Página Admin para donos dos brechós hospedados;
    - Tags conectadas às peças de roupas para a facilidade de busca;
    - Filtro de localização e tags;
    - Layout simples e objetivo;
- **Requisitos não funcionais:**
    - Página de brechós favoritos;
    - Notificação sobre seus brechós favoritos;
    - Chat online comprador ←→ brechó;
    - Segurança;
    - Cadastro e formas de pagamentos;
    - Login/Senha;

    