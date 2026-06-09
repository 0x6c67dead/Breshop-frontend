# 📱 PLANO DE MIGRAÇÃO: BRESHOP WEB (Next.js) → BRESHOP APP (Flutter/Dart)

> **Documento de Arquitetura e Transformação**
> Preparado para: Transformação completa de aplicativo web em aplicativo nativo Android
> Status: Pronto para Implementação

---

## 📋 EXECUTIVO

O Breshop é um **marketplace de moda sustentável** que precisa ser **completamente reescrito** de Next.js/TypeScript/React para Flutter/Dart. Nenhuma webview será usada—tudo será código Flutter nativo.

**Escopo:**
- ✅ 44 arquivos TypeScript/TSX convertidos em Widgets Flutter
- ✅ Biblioteca Zustand (state management) → Riverpod (padrão Flutter)
- ✅ API REST intacta (backend permanece em Node.js/Prisma)
- ✅ PostgreSQL permanece como banco de dados
- ✅ Nenhuma webview—UI 100% nativa

---

## 🏗️ ARQUITETURA ATUAL (Análise Code Archaeologist)

### 📊 Estado da Codebase

```
Breshop Frontend
├── src/app/                    [Next.js App Router - SERÁ DESTRUÍDO]
│   ├── page.tsx               Home com hero carousel + feed
│   ├── (auth)/                Páginas de autenticação
│   ├── (app)/                 Rotas privadas
│   │   ├── shop/              Listagem e detalhe de brechós
│   │   ├── product/           Detalhe de produto
│   │   ├── favorites/         Favoritos (local storage)
│   │   ├── admin/             Painel administrativo
│   │   └── analytics/         Dashboard de vendas
│   └── api/                   Backend integrado (Next.js API routes)
├── src/shared/                [Compartilhado - Será adaptado]
│   ├── components/            44 componentes React (→ Widgets Flutter)
│   ├── lib/
│   │   ├── store/             Zustand store (→ Riverpod)
│   │   ├── services/          Lógica de negócio
│   │   └── hooks/             React hooks (→ Custom Dart functions)
│   ├── types/                 TypeScript interfaces (→ Dart models)
│   └── mocks/                 Dados de teste
└── prisma/                    [Mantém intacto - Backend]
```

### 🔍 Análise Detalhada

#### **1. Camada de Apresentação (UI)**
- **44 arquivos TSX** = Componentes React com estado, efeitos, e routing
- **Estilo:** Tailwind CSS (gradientes, animações, layout responsivo)
- **Complexidade visual:** ALTA
  - Hero carousel com transições suaves
  - Masonry grid para produtos
  - Animações de scroll/fade
  - Modais e overlays

**Risco Identificado (Chesterton's Fence):**
> Tailwind usa classes CSS bem específicas (ex: `group-hover:scale-105`). Em Flutter, temos que implementar isso com widgets como `GestureDetector` + `AnimatedScale`.

#### **2. Camada de Estado (State Management)**
- **Zustand** com persistência
- **Estrutura:** Uma store monolítica (`marketplaceStore.ts`)
- **Funcionalidades:**
  - Autenticação (login/logout)
  - Carteira de moedas (saldo/bloqueado)
  - Itens (fetch/filtro/busca)
  - Pedidos (reserva/aprovação/rejeição)
  - Favoritos (local storage)

**Transformação requerida:** Zustand → **Riverpod** (padrão Flutter moderno)

#### **3. Serviços e Lógica de Negócio**
- `marketplaceService.ts`: Lógica de pedidos transacional
- `prisma.ts`: Conexão com banco de dados
- `auth.ts`: Autenticação com bcryptjs

**Decisão arquitetural:**
- Backend **permanece intacto** (Node.js + Prisma + PostgreSQL)
- App Flutter faz chamadas HTTP para `/api/*`
- Nenhuma lógica de negócio é replicada (REST API é fonte de verdade)

#### **4. Tipos e Modelos**
- TypeScript interfaces para User, Produto, Brecho, Order, etc.
- Precisam ser convertidas para **Dart models** com serialização JSON

---

## 🚀 ESTRATÉGIA DE MIGRAÇÃO (Mobile Developer Perspective)

### 📱 Decisões de Arquitetura Mobile

#### **1. Framework e Linguagem**
- ✅ **Flutter 3.x + Dart 3.x** (estável, production-ready)
- ✅ **Target:** Android API 23+ (compatível com maioria dos devices)
- ✅ **Sem webview** — UI 100% nativa com widgets Flutter

#### **2. State Management**
- **Migração:** Zustand → **Riverpod**
  - Riverpod é o padrão moderno do Flutter
  - Type-safe (sem runtime surpresas)
  - Testável (dependency injection nativa)
  - Performance (change notification granular)

#### **3. Arquitetura em Camadas**
```
lib/
├── presentation/          ← Widgets & Screens
├── application/           ← Riverpod providers & DTOs
├── domain/               ← Entidades & regras de negócio
├── infrastructure/       ← APIs, storage, repositórios
└── core/                 ← Utils, constantes, extensions
```

#### **4. Comunicação com Backend**
- **HTTP Client:** `http` package (simples) ou `dio` (avançado com interceptors)
- **Endpoints:** Reutilizar todos os `/api/*` existentes
- **Serialização:** `json_serializable` para models com geração de código

#### **5. Persistência Local**
- **Autenticação:** `flutter_secure_storage` (chaves criptografadas)
- **Preferências:** `shared_preferences` (tokens, idioma, tema)
- **Cache:** Riverpod + `cached_networking` (cache transparente)

---

## 📦 MAPEAMENTO: COMPONENTES → WIDGETS

### Legenda
- **Stateless:** Sem estado interno, apenas props
- **Stateful:** Com estado interno (animações, timers, input)
- **Provider:** Acessa estado global via Riverpod

### 1️⃣ HOME PAGE (`src/app/page.tsx`)

**Componentes:**
1. **Hero Carousel** (5000ms auto-rotate)
   - Tipo: **Stateful Widget**
   - Lógica: Timer para rotação + PageView
   - Flutter Equivalente: `PageView` com `AnimatedBuilder`
   
2. **Logo Marquee** (scroll infinito)
   - Tipo: **Stateless Widget**
   - Lógica: ListView.builder com scroll contínuo
   - Flutter: `SingleChildScrollView` com `Row` replicada ou `marquee` package
   
3. **Shop Carousel** (8000ms auto-rotate)
   - Tipo: **Stateful Widget**
   - Lógica: Timer + transform translate CSS → `AnimatedContainer` + `PageView`
   - Renderiza 3 produtos por loja
   
4. **Product Feed** (masonry grid)
   - Tipo: **Stateless com Provider**
   - Lógica: Filtra itens `AVAILABLE` via Riverpod
   - Flutter: `GridView.builder` + `flutter_staggered_grid_view` para efeito masonry

**Arquivo gerado:** `lib/presentation/screens/home_screen.dart`

---

### 2️⃣ PRODUCT CARD (`src/shared/components/feed/ProductCard.tsx`)

**Props:**
```typescript
{
  id: string;
  imageUrl: string;
  brand: string;
  model: string;
  price: number;
  size: string;
  tags: string[];
  status?: 'AVAILABLE' | 'RESERVED' | 'SOLD';
}
```

**Tipo:** **Stateless Widget**
- Renderiza imagem com overlay de tags
- Status badges (Reservado/Vendido rotacionados)
- Ativa `pointer-events-none` se reservado/vendido

**Widget Flutter equivalente:**
```dart
class ProductCardWidget extends StatelessWidget {
  final Product product;
  final VoidCallback onTap;
  
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: !product.isAvailable ? null : onTap,
      child: Stack(
        children: [
          // Imagem com CachedNetworkImage
          // Tags como Positioned children
          // Status badges com Transform.rotate()
        ],
      ),
    );
  }
}
```

---

### 3️⃣ HEADER (`src/shared/components/header/Header.tsx`)

**Funcionalidades:**
- Search com debounce → `/shop?q=...`
- Wallet balance display
- Navigation links (role-based)
- Menu hamburger mobile

**Tipo:** **Stateful Widget** com **Provider**
- Busca local no campo input
- Acessa `useMarketplaceStore` → `authProvider` + `walletProvider` em Riverpod
- Responsividade: App bar customizado

**Widget Flutter:**
```dart
class AppBarWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(userProvider);
    final balance = ref.watch(walletProvider).balance;
    
    return AppBar(
      title: Text('Breshop'),
      actions: [
        SearchField(),
        if (user != null) BalanceDisplay(balance: balance),
      ],
    );
  }
}
```

---

### 4️⃣ ADMIN FORMS

| Componente | Funcionalidade | Tipo | Widget Flutter |
|-----------|----------------|----|---|
| `UserForm` | CRUD de usuários | Stateful | `Form` + `TextFormField` |
| `ProdutoForm` | Criar/editar produtos | Stateful | `Form` com validação + image picker |
| `BrechoForm` | Criar/editar brechó | Stateful | `Form` + `DropdownButton` |
| `TagForm` | Gerenciar tags | Stateful | `Form` + `Chips` |
| `AddressForm` | Formulário de endereço | Stateful | `Form` + `TextFormField` |

**Padrão:** Todos usam `Form` widget nativo do Flutter para validação

---

### 5️⃣ PAGES / TELAS PRINCIPAIS

| Página | Funcionalidades | Tipo de Widget | Estrutura |
|--------|-----------------|---|---|
| **Login** | Email + senha, validação | Stateful | `Form` + `ElevatedButton` |
| **Shop List** | Lista brechós com busca | Stateful + Provider | `ListView.builder` + Provider |
| **Shop Detail** | Detalhe + produtos da loja | Consumer | `GridView` + `AppBar` |
| **Product Detail** | Imagem grande + info + reserva | Stateful + Provider | `PageView` para imagens + `FloatingActionButton` |
| **Reservas** | Meus pedidos com status | Consumer | `ListView` + `Card` com status badges |
| **Carteira** | Saldo + histórico transações | Consumer | `Tabs` (saldo/histórico) + `ListView` |
| **Favoritos** | Grid de favoritos | Stateless + Provider | `GridView` com local storage |
| **Dashboard** (owner) | Pedidos recebidos + análise | Provider | `TabBar` + `ListView` + `Charts` |
| **Admin Panel** | Listas CRUD | Stateful + Provider | `DataTable` ou lista com actions |

---

## 💾 MAPEAMENTO: DEPENDÊNCIAS npm → pubspec.yaml

### Frontend Dependencies (npm)

```json
{
  "zustand": "^5.0.12",
  "lucide-react": "^0.554.0",
  "tailwindcss": "^4",
  "next": "^16.2.4",
  "react": "19.2.0"
}
```

### Equivalentes Flutter (pubspec.yaml)

```yaml
dependencies:
  # Estado
  riverpod: ^2.4.0              # Zustand → Riverpod
  flutter_riverpod: ^2.4.0
  
  # UI & Componentes
  flutter_staggered_grid_view: ^0.7.0  # Masonry grid
  cached_network_image: ^3.3.0         # Image caching
  lucide_icons: ^0.0.1                 # Icons (lucide)
  
  # Formulários & Validação
  form_builder_validators: ^9.0.0
  flutter_form_builder: ^9.0.0
  
  # HTTP & Serialização
  http: ^1.1.0                 # API calls
  json_serializable: ^6.7.0    # JSON models
  
  # Storage & Segurança
  flutter_secure_storage: ^9.0.0       # Tokens (IMPORTANTE)
  shared_preferences: ^2.2.0           # Preferências
  
  # Animações & UI
  animations: ^2.0.0                   # Hero animations
  intl: ^0.19.0                        # Formatação (data/moeda)
  
  # Performance
  infinite_scroll_pagination: ^4.0.0   # Lazy loading
  
  # Utilitários
  equatable: ^2.0.5                    # Igualdade de objetos
  get_it: ^7.6.0                       # Service locator (optional)

dev_dependencies:
  build_runner: ^2.4.0
  json_serializable: ^6.7.0
  riverpod_generator: ^2.3.0
```

### Decisões Críticas

1. **Zustand → Riverpod**
   - Zustand usa store único monolítico
   - Riverpod usa providers granulares (melhor para performance)
   - Migration: Quebra store em providers individuais (auth, wallet, items, orders)

2. **Tailwind → Flutter Widgets**
   - Tailwind usa classes CSS
   - Flutter usa widgets e modifiers
   - Exemplo:
     ```typescript
     // React + Tailwind
     <div className="rounded-full px-12 py-4 border-2 border-white hover:bg-white">
     
     // Flutter equivalente
     FloatingActionButton(
       shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(50)),
       child: Container(
         padding: EdgeInsets.symmetric(horizontal: 12, vertical: 4),
         decoration: BoxDecoration(
           border: Border.all(color: Colors.white, width: 2),
         ),
       ),
     )
     ```

3. **Next.js API Routes → HTTP Requests**
   - Backend permanece em Node.js
   - App Flutter faz `http.get('/api/items')` etc
   - Sem mudanças no backend necessárias (compatível 100%)

4. **React Hooks → Riverpod Providers**
   - `useMarketplaceStore` → `final store = ref.watch(marketplaceProvider);`
   - `useCountdown` → Custom `StatefulHookConsumerWidget`
   - `useEffect` → `ref.listen()` ou `ref.effect()`

---

## 🔄 MAPEAMENTO: STATE MANAGEMENT

### Zustand Store (Atual)

```typescript
useMarketplaceStore = {
  user: User | null,
  login: async (email, password) => {...},
  logout: () => {...},
  
  balance: number,
  locked: number,
  fetchWallet: async () => {...},
  
  items: Item[],
  fetchItems: async () => {...},
  
  orders: Order[],
  fetchMyOrders: async () => {...},
  
  favorites: string[],
  toggleFavorite: (itemId) => {...},
}
```

### Riverpod Providers (Novo)

```dart
// Autenticação
final authProvider = StateNotifierProvider<AuthNotifier, AuthState?>((ref) {
  return AuthNotifier();
});

// Carteira
final walletProvider = FutureProvider<Wallet>((ref) async {
  final auth = ref.watch(authProvider);
  if (auth == null) throw Exception('Not authenticated');
  return fetchWallet(auth.userId);
});

// Itens
final itemsProvider = FutureProvider<List<Item>>((ref) async {
  return fetchItems();
});

// Pedidos do usuário
final myOrdersProvider = FutureProvider<List<Order>>((ref) async {
  final auth = ref.watch(authProvider);
  if (auth == null) throw Exception('Not authenticated');
  return fetchMyOrders(auth.userId);
});

// Favoritos (local storage)
final favoritesProvider = StateNotifierProvider<FavoritesNotifier, List<String>>((ref) {
  return FavoritesNotifier();
});
```

---

## 📋 ORDEM DE EXECUÇÃO (Phase-based Implementation)

### **PHASE 1: Setup Base (2 dias)**

- [ ] Criar novo projeto Flutter: `flutter create breshop_app`
- [ ] Adicionar todas as dependências ao `pubspec.yaml`
- [ ] Setup de projeto:
  - [ ] Pasta `lib/` com estrutura de camadas
  - [ ] Constants (cores, tema, endpoints)
  - [ ] Extensions úteis (String, int, DateTime)
- [ ] Configurar:
  - [ ] `android/app/build.gradle` (targetSdkVersion, dependencies)
  - [ ] `AndroidManifest.xml` (permissões: internet, storage, location)
  - [ ] `.env` ou `constants.dart` com endpoint da API
- [ ] Executar build inicial: `flutter pub get && flutter run`

**Checkpoint:** App abre em branco, sem erros Gradle

---

### **PHASE 2: Infrastructure (3 dias)**

#### A. HTTP Client & API
- [ ] Criar `lib/infrastructure/http_client.dart`
  - [ ] Wrapper ao redor de `http` package
  - [ ] Interceptor de autorização (token no header)
  - [ ] Tratamento de erros centralizado
  - [ ] Retry logic para timeouts

- [ ] Criar repositories:
  - [ ] `auth_repository.dart` (login, logout, register)
  - [ ] `marketplace_repository.dart` (items, orders, wallet)
  - [ ] `brecho_repository.dart` (criar, editar brechó)

#### B. Storage & Autenticação
- [ ] Criar `lib/infrastructure/secure_storage.dart`
  - [ ] Wrapper ao redor de `flutter_secure_storage`
  - [ ] Salvar/carregar token JWT
  - [ ] Salvar user ID & role
- [ ] Criar `lib/infrastructure/local_storage.dart`
  - [ ] Wrapper ao redor de `shared_preferences`
  - [ ] Salvar theme, locale, user preferences

#### C. Riverpod Providers
- [ ] Criar `lib/application/providers/auth_provider.dart`
  - [ ] StateNotifier para login/logout/register
  - [ ] FutureProvider para refresh token
- [ ] Criar `lib/application/providers/wallet_provider.dart`
  - [ ] FutureProvider para fetch saldo
  - [ ] FutureProvider para histórico transações
- [ ] Criar providers para marketplace, orders, etc.

**Checkpoint:** `http` requests funcionando sem UI, tokens sendo salvos corretamente

---

### **PHASE 3: Core Widgets & Navigation (4 dias)**

#### A. Routing Setup
- [ ] Usar `go_router` package:
  ```dart
  final routerProvider = Provider<GoRouter>((ref) {
    final authState = ref.watch(authProvider);
    
    return GoRouter(
      initialLocation: authState == null ? '/login' : '/home',
      routes: [
        GoRoute(path: '/login', builder: (context, state) => LoginScreen()),
        GoRoute(path: '/home', builder: (context, state) => HomeScreen()),
        GoRoute(path: '/shop/:id', builder: (context, state) => ShopDetailScreen(id: state.params['id']!)),
        // ... mais rotas
      ],
    );
  });
  ```

#### B. Tema & Estilo
- [ ] Criar `lib/core/theme/theme.dart`
  - [ ] `ThemeData` com cores brand Breshop (#F4F0EB, #000000)
  - [ ] Typography (fonts: serif, mono, sans)
  - [ ] Componentes customizados (ButtonStyle, InputDecoration)

#### C. Widgets Compartilhados
- [ ] `lib/presentation/widgets/`
  - [ ] `app_bar_widget.dart` (header com search)
  - [ ] `product_card_widget.dart` (card de produto)
  - [ ] `bottom_nav_widget.dart` (nav inferior)
  - [ ] `loading_widget.dart` (skeleton/loading state)
  - [ ] `error_widget.dart` (erro com retry)
  - [ ] `custom_button.dart` (rounded, bordered, etc.)

**Checkpoint:** App abre, pode navegar entre telas vazias, tema aplicado

---

### **PHASE 4: Screens (5 dias)**

Implementar em ordem de importância e dependência:

#### 1️⃣ Autenticação (1 dia)
- [ ] `login_screen.dart` — Form + validação + login
- [ ] `register_screen.dart` — Form + criação de conta
- [ ] `forgot_password_screen.dart` — Reset via email

#### 2️⃣ Home & Browsing (2 dias)
- [ ] `home_screen.dart` — Hero carousel + feed + shop carousel
  - [ ] Hero carousel (Timer + PageView)
  - [ ] Logo marquee (scroll infinito)
  - [ ] Shop carousel (AnimatedContainer)
  - [ ] Product grid (GridView.builder)
  
- [ ] `shop_list_screen.dart` — Listagem de brechós
- [ ] `shop_detail_screen.dart` — Detalhe da loja + produtos
- [ ] `product_detail_screen.dart` — Detalhe com imagem grande + info

#### 3️⃣ Compra & Wallet (1 dia)
- [ ] `my_reservations_screen.dart` — Pedidos do usuário
- [ ] `wallet_screen.dart` — Saldo + histórico
- [ ] `checkout_confirmation_screen.dart` — Confirmação de pedido

#### 4️⃣ Extras (1 dia)
- [ ] `favorites_screen.dart` — Grid de favoritos
- [ ] `profile_screen.dart` — Perfil + editar dados
- [ ] `search_screen.dart` — Busca com filtros

**Checkpoint:** Navegar entre telas, dados carregando da API

---

### **PHASE 5: Owner/Admin Features (3 dias)**

- [ ] `shop_dashboard_screen.dart` — Dashboard do owner
  - [ ] Pedidos recebidos + status
  - [ ] Análise de vendas (charts básicos)
  - [ ] Criar/editar produtos
  
- [ ] `admin_panel_screen.dart` — Painel admin (usuários, tags, etc.)
  - [ ] DataTable com usuários
  - [ ] CRUD de tags
  - [ ] Moderar conteúdo

**Checkpoint:** Owner pode criar brechó e gerenciar pedidos

---

### **PHASE 6: Polishing & Testing (2 dias)**

- [ ] Animações
  - [ ] Hero animations ao navegar
  - [ ] Transitions suaves entre telas
  - [ ] Loading states com skeleton
  
- [ ] Performance
  - [ ] FlatList com `itemExtent` (produtos)
  - [ ] Lazy loading de imagens
  - [ ] Débounce em busca
  
- [ ] Error Handling
  - [ ] Retry buttons em caso de falha
  - [ ] Toast notifications (snackbar)
  - [ ] Offline detection
  
- [ ] Testing
  - [ ] Unit tests dos repositories
  - [ ] Widget tests dos widgets principais
  - [ ] Integration tests (login → browse → reserve)

**Checkpoint:** App funciona offline, trata erros gracefully

---

### **PHASE 7: Build & Release (1 dia)**

- [ ] Configurar `android/app/build.gradle`
  - [ ] Incrementar versionCode
  - [ ] Criar keystore para assinatura
  - [ ] Testar build release
  
- [ ] Testar em device Android externo
  - [ ] `flutter run --release`
  - [ ] Todos os fluxos principais
  - [ ] Offline behavior
  
- [ ] Play Store submission (opcional)
  - [ ] Screenshots
  - [ ] Descrição
  - [ ] APK upload

---

## 📊 MATRIZ DE CONVERSÃO: TSX → DART

| Conceito React | Conceito Flutter | Notas |
|---|---|---|
| Component | Widget | `StatelessWidget` ou `StatefulWidget` |
| `useState` | `State<T>` | `setState()` ou Riverpod `StateNotifier` |
| `useEffect` | `initState()` / `dispose()` | Ou `ref.listen()` em provider |
| Props | Constructor params | `final Product product;` |
| Event handlers | Callbacks | `VoidCallback`, `Function(String)` |
| Conditional render | `if/else` ou ternary | Mesma sintaxe Dart |
| List.map() | `ListView.builder()` ou `GridView.builder()` | Para performance (lazy loading) |
| CSS classes | Widget composition | Stack, Padding, Container, etc. |
| tailwind.css | `ThemeData` + custom widgets | Build theme uma vez, reutilize |
| Next.js routing | `go_router` | Declarativo, tipo-safe |
| Zustand store | Riverpod providers | Granular, type-safe |
| localStorage | `shared_preferences` | Simples key-value |
| Fetch API | `http` package | Wrapper customizado com retry |

---

## 🔐 SEGURANÇA & COMPLIANCE

### Checklist de Segurança

- [ ] **Autenticação**
  - [ ] JWT tokens em `flutter_secure_storage` (NÃO em SharedPreferences)
  - [ ] Token refresh automático quando expira
  - [ ] Logout remove token de storage

- [ ] **Dados Sensíveis**
  - [ ] Senhas NUNCA armazenadas (apenas após login)
  - [ ] Carteira/saldo obtidos sempre do servidor
  - [ ] Logs não contêm tokens ou PII

- [ ] **Rede**
  - [ ] HTTPS obrigatório
  - [ ] SSL pinning (opcional, mas recomendado)
  - [ ] Timeout em todas as requisições (30s)

- [ ] **Validação**
  - [ ] Entrada do usuário validada no client (UX) E server (segurança)
  - [ ] Arquivo upload: validar tipo + tamanho

---

## ⚠️ RISCOS & MITIGAÇÕES

| Risco | Impacto | Mitigação |
|---|---|---|
| **Animações complexas** | Performance ruim em devices antigos | Testar no API 23, usar `SingleTickerProviderStateMixin` |
| **Masonry grid** | Flutter não tem nativo | Usar `flutter_staggered_grid_view` |
| **Imagens pesadas** | Vazamento de memória | Usar `CachedNetworkImage` com cache |
| **Zustand → Riverpod** | Refactor complexo | Quebrar store em pequenos providers |
| **Hero carousel** | Sem exemplo Flutter | Implementar com `PageView` + `Timer` |
| **Backend API mudanças** | App quebra | Versionamento de API (`/api/v1/*`) |

---

## 📱 GUIA DE DESENVOLVIMENTO MOBILE

### Requisitos Mínimos (Mobile Developer Checkpoint)

```
🧠 CHECKPOINT:

Platform:   Android (API 23+)
Framework:  Flutter 3.x + Dart 3.x
Files Read: 
  ✅ mobile-design-thinking.md
  ✅ mobile-performance.md
  ✅ touch-psychology.md
  ✅ platform-android.md

3 Principles I Will Apply:
1. FlatList/GridView.builder para todas as listas (nunca ScrollView)
2. Mínimo 48dp para touch targets (botões, inputs)
3. Carregar imagens com CachedNetworkImage, nunca raw Image

Anti-Patterns I Will Avoid:
1. ScrollView para listas → GridView.builder
2. Rebuild desnecessários → Riverpod watches granulares
3. Tokens em SharedPreferences → flutter_secure_storage
4. Images sem cache → CachedNetworkImage
5. Sem offline support → Cache HTTP responses
```

### Performance Targets

- ✅ Home screen carrega em < 2s (com cache)
- ✅ Produto load em < 1.5s
- ✅ 60 FPS em list scroll (sem jank)
- ✅ Consumo de bateria mínimo (idle < 5% por hora)

### Testes Obrigatórios

```bash
# Build sem erros
flutter run --release

# Testar em device low-end (Moto G antigo, API 23)
flutter run -d <device-id>

# Verificar memory leaks
flutter run --profile
# Abrir DevTools → Memory

# Performance profiling
flutter run --profile
# Abrir DevTools → Performance

# Build final para Play Store
flutter build apk --release
flutter build app-bundle --release
```

---

## 📦 ESTRUTURA FINAL DE PASTAS

```
breshop_app/
├── lib/
│   ├── main.dart                          ← Entry point
│   ├── core/
│   │   ├── constants.dart                 ← API base, cores, etc.
│   │   ├── extensions.dart                ← String, num extensions
│   │   ├── theme/                         ← ThemeData customizado
│   │   └── utils/                         ← Helpers, formatters
│   ├── domain/
│   │   ├── entities/                      ← Pure Dart classes
│   │   │   ├── user.dart
│   │   │   ├── product.dart
│   │   │   ├── order.dart
│   │   │   ├── brecho.dart
│   │   │   └── wallet.dart
│   │   └── repositories/                  ← Abstract interfaces
│   │       ├── auth_repository.dart
│   │       └── marketplace_repository.dart
│   ├── infrastructure/
│   │   ├── http_client.dart               ← Wrapper http
│   │   ├── secure_storage.dart            ← flutter_secure_storage wrapper
│   │   ├── local_storage.dart             ← SharedPreferences wrapper
│   │   └── repositories/                  ← Implementações concretas
│   │       ├── auth_repository_impl.dart
│   │       └── marketplace_repository_impl.dart
│   ├── application/
│   │   ├── providers/                     ← Riverpod providers
│   │   │   ├── auth_provider.dart
│   │   │   ├── wallet_provider.dart
│   │   │   ├── marketplace_provider.dart
│   │   │   └── favorites_provider.dart
│   │   ├── notifiers/                     ← StateNotifier classes
│   │   │   ├── auth_notifier.dart
│   │   │   └── favorites_notifier.dart
│   │   └── dtos/                          ← Data Transfer Objects
│   │       └── (JSON serializable models)
│   └── presentation/
│       ├── screens/                       ← Full screens
│       │   ├── auth/
│       │   │   ├── login_screen.dart
│       │   │   ├── register_screen.dart
│       │   │   └── forgot_password_screen.dart
│       │   ├── home/
│       │   │   ├── home_screen.dart
│       │   │   ├── shop_list_screen.dart
│       │   │   ├── shop_detail_screen.dart
│       │   │   └── product_detail_screen.dart
│       │   ├── marketplace/
│       │   │   ├── my_reservations_screen.dart
│       │   │   ├── wallet_screen.dart
│       │   │   ├── favorites_screen.dart
│       │   │   └── search_screen.dart
│       │   ├── profile/
│       │   │   └── profile_screen.dart
│       │   ├── owner/
│       │   │   └── shop_dashboard_screen.dart
│       │   └── admin/
│       │       └── admin_panel_screen.dart
│       └── widgets/                       ← Reusable components
│           ├── app_bar_widget.dart
│           ├── bottom_nav_widget.dart
│           ├── product_card_widget.dart
│           ├── hero_carousel_widget.dart
│           ├── custom_button_widget.dart
│           ├── loading_widget.dart
│           ├── error_widget.dart
│           └── hero_animations.dart
├── android/
│   ├── app/
│   │   ├── build.gradle                  ← Versões, assinatura
│   │   └── src/main/AndroidManifest.xml  ← Permissões
│   └── gradle.properties
├── assets/
│   ├── images/                            ← Logo, ícones
│   └── fonts/                             ← Serif, mono
├── pubspec.yaml                           ← Dependências
└── README.md                              ← Instruções dev
```

---

## 🚀 QUICK START (Primeira Execução)

```bash
# 1. Criar projeto
flutter create breshop_app --org com.breshop

# 2. Entrar na pasta
cd breshop_app

# 3. Configurar pubspec.yaml com todas as deps acima
# (Copiar seção de dependências)

# 4. Download deps
flutter pub get

# 5. Configurar constantes
# Editar lib/core/constants.dart com API endpoint

# 6. Rodar
flutter run

# 7. Conectar device/emulator Android
adb devices                  # Listar conectados
flutter devices             # Flutter devices

# 8. Build release
flutter build apk --release
# Saída: build/app/outputs/apk/release/app-release.apk
```

---

## 📈 PRÓXIMOS PASSOS

1. **Hoje:** Review deste plano com time
2. **Amanhã:** Criar projeto Flutter base + setup
3. **Semana 1:** Implementar PHASE 1-2 (Infrastructure)
4. **Semana 2:** PHASE 3-4 (Screens principais)
5. **Semana 3:** PHASE 5-6 (Owner features + polishing)
6. **Semana 4:** PHASE 7 (Testing + release)

---

## 📞 CONTATOS & REFERÊNCIAS

- **Flutter Docs:** https://flutter.dev/docs
- **Riverpod Docs:** https://riverpod.dev
- **go_router:** https://pub.dev/packages/go_router
- **CachedNetworkImage:** https://pub.dev/packages/cached_network_image
- **flutter_secure_storage:** https://pub.dev/packages/flutter_secure_storage

---

**Documento preparado por:** Code Archaeologist + Mobile Developer Agent
**Status:** ✅ Pronto para Implementação
**Data:** 2026-05-11
