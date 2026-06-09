# 📊 RESUMO EXECUTIVO: MIGRAÇÃO BRESHOP WEB → FLUTTER APP

> Documento de uma página para alinhamento com stakeholders
> Data: 2026-05-11

---

## 🎯 OBJETIVO

Transformar **Breshop Web (Next.js/React)** em aplicativo **nativo Android (Flutter/Dart)**.

| Aspecto | Detalhes |
|---------|----------|
| **Plataforma** | Android (API 23+) |
| **Framework** | Flutter 3.x + Dart 3.x |
| **Tipo de UI** | 100% widgets Flutter (zero webview) |
| **Backend** | Permanece intacto (Node.js + Prisma + PostgreSQL) |
| **Estimativa** | 4 semanas (1 dev experiente em Flutter) |

---

## 📈 ESCOPO DA TRANSFORMAÇÃO

### O que será convertido:

| Tipo | Quantidade | Tipo de Widget | Esforço |
|------|-----------|---|---------|
| **Componentes TSX** | 44 | Stateless + Stateful | ⭐⭐⭐ |
| **Páginas/Rotas** | 15+ | Screen widgets | ⭐⭐⭐⭐ |
| **Stores Zustand** | 1 (monolítica) | 6-8 Riverpod providers | ⭐⭐ |
| **Hooks React** | 5+ | Custom Dart functions | ⭐ |
| **Estilos Tailwind** | 100+ classes | ThemeData + Widgets | ⭐⭐⭐ |
| **Testes** | A definir | Unit + Widget + Integration | ⭐⭐ |

### O que NÃO será tocado:

✅ Backend (API endpoints `/api/*` continuam igual)
✅ Database (PostgreSQL intacto)
✅ Business Logic (repositórios de negócio reutilizáveis)
✅ Autenticação (sistema JWT + bcryptjs mantido)

---

## 🏗️ ARQUITETURA NOVA

```
Frontend Web (MORRERÁ)     →    Mobile App (NASCERÁ)
├── Next.js                    ├── Flutter 3.x
├── React 19                   ├── Dart 3.x
├── Zustand                    ├── Riverpod
├── Tailwind CSS               ├── Material Design 3
└── TypeScript                 └── REST API (mesma)

Backend (PERMANECE)
├── Node.js + Express
├── Prisma ORM
├── PostgreSQL
└── JWT Auth
```

---

## 📦 DEPENDÊNCIAS PRINCIPAIS

### Substituições:

| npm (React) | pub (Flutter) | Razão |
|---|---|---|
| zustand | riverpod | State management padrão Flutter |
| next/router | go_router | Routing declarativo |
| fetch API | http package | HTTP client padrão |
| React hooks | Dart functions | Sem hooks, mas providers |
| tailwindcss | ThemeData | Material Design 3 |
| localStorage | shared_preferences | Local key-value storage |
| - | flutter_secure_storage | Armazenar tokens (CRÍTICO) |
| next/image | cached_network_image | Image caching otimizado |
| react/JSX | Flutter widgets | Sem JSX, composição widget |

### Dependências principais:

```yaml
riverpod: ^2.4.0              # State management
go_router: ^13.0.0            # Routing
http: ^1.1.0                  # HTTP client
flutter_secure_storage: ^9.0  # Tokens seguros ⭐
cached_network_image: ^3.3.0  # Image caching
flutter_staggered_grid_view   # Masonry grid
json_serializable: ^6.7.0     # JSON serialization
```

---

## 🚀 ROADMAP (4 SEMANAS)

```
SEMANA 1: INFRASTRUCTURE
├── Setup base do projeto Flutter
├── Configurar pubspec.yaml + theme
├── HTTP client com interceptor de token
├── Storage (secure + local)
└── Riverpod providers base

SEMANA 2: SCREENS PRINCIPAIS
├── Auth (login, register, forgot password)
├── Home (hero carousel + feed)
├── Shop list + detalhe
├── Product detalhe + reserva
└── Navigation routing

SEMANA 3: FEATURES SECUNDÁRIAS
├── Favoritos
├── Wallet + histórico
├── Minhas reservas
├── Perfil
└── Search + filtros

SEMANA 4: OWNER/ADMIN + POLISH
├── Shop dashboard
├── Admin panel
├── Animações e transições
├── Testes
└── Build release + testing
```

---

## 📱 COMPONENTES CRÍTICOS

### Top 10 Widgets para priorizar:

| # | Widget | Complexidade | Impacto | Status |
|---|--------|---|---|---|
| 1 | ProductCard | ⭐⭐ | Alto | Reutilizado em 10+ telas |
| 2 | HeroCarousel | ⭐⭐⭐ | Alto | Home screen, animação crítica |
| 3 | AppBar customizada | ⭐⭐ | Alto | Reutilizado em tudo |
| 4 | ProductGrid | ⭐⭐ | Alto | Feed, masonry |
| 5 | OrderCard | ⭐⭐ | Médio | Reservas, dashboard |
| 6 | AuthForm | ⭐⭐ | Médio | Login, register |
| 7 | WalletDisplay | ⭐ | Médio | Header, detalhes |
| 8 | SearchField | ⭐⭐ | Médio | Global |
| 9 | LoadingWidget | ⭐ | Médio | Reutilizado |
| 10 | ErrorWidget | ⭐ | Médio | Reutilizado |

---

## ⚠️ RISCOS & MITIGAÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| **Animações complexas** | Media | Alto | Testar API 23 cedo, usar `SingleTickerProviderStateMixin` |
| **Masonry grid** | Baixa | Médio | Usar `flutter_staggered_grid_view` (package testado) |
| **Performance imagens** | Média | Alto | `CachedNetworkImage` obrigatório, nunca raw `Image` |
| **State management complexo** | Baixa | Médio | Quebrar Zustand em 6-8 providers Riverpod |
| **Integração com backend** | Muito Baixa | Alto | Backend intacto, mesmos endpoints, token JWT |
| **Delay de release** | Média | Médio | Priorizar features core, deixar admin para final |

---

## 💰 ESFORÇO & TIMELINE

### Por Dev (experiente em Flutter):

| Fase | Atividade | Dias | Dev/days |
|------|----------|------|----------|
| 1 | Setup + infrastructure | 2 | 2 |
| 2 | Screens core (auth, home, shop) | 5 | 5 |
| 3 | Features (favoritos, wallet, reservas) | 4 | 4 |
| 4 | Owner/admin + polish | 3 | 3 |
| 5 | Testing + release | 2 | 2 |
| **Total** | **16 dias úteis** | **~3-4 semanas** | **1 dev Flutter** |

### Se 2 devs (1 Flutter experiente + 1 Flutter junior):

- **Timeline:** 2-3 semanas (parallelizar)
- **Custo:** ~240-320 horas de trabalho

---

## ✅ CRITÉRIOS DE SUCESSO

- ✅ App roda em Android 7+ (API 23+) sem erros
- ✅ Todos os fluxos principais funcionam (login → browse → reserva → pagamento)
- ✅ Animações suaves 60 FPS em devices baixo-end
- ✅ Offline graceful degradation (cache HTTP)
- ✅ Tokens armazenados seguramente (flutter_secure_storage)
- ✅ 80%+ cobertura de testes (unit + widget)
- ✅ APK release < 20MB
- ✅ Performance: home load < 2s (com cache)
- ✅ Zero webviews (UI 100% Flutter)
- ✅ Code-pushed para GitHub com CI/CD (GitHub Actions)

---

## 📋 PRÉ-REQUISITOS PARA COMEÇAR

### Infraestrutura:

- [ ] Flutter SDK 3.x instalado em máquina dev
- [ ] Android SDK (API 23-34) configurado
- [ ] Device Android físico OU emulador
- [ ] Android Studio ou VS Code + Flutter extension

### Conhecimento:

- [ ] Dev Flutter experiente (2-3 anos, production apps)
- [ ] Conhecimento de Riverpod ou similar (Provider, GetX)
- [ ] HTTP REST API experience
- [ ] Dart async/futures

### Projeto:

- [ ] Repositório GitHub novo ou branch `flutter-migration`
- [ ] `.env` com API endpoint (mesmo backend)
- [ ] Documentação da API `/api` existente
- [ ] Designs/mockups (ou usar web como referência)

---

## 🎓 APRENDIZADOS ESPERADOS

### Código atual (Next.js/React):
```typescript
// Zustand (monolítico)
const useMarketplaceStore = create((set, get) => ({
  items: [],
  fetchItems: async () => { ... },
}));

// React component
export default function ProductCard({ product }) {
  return <div className="...">...</div>;
}
```

### Código novo (Flutter/Dart):
```dart
// Riverpod (granular)
final itemsProvider = FutureProvider((ref) async {
  return await ref.watch(repositoryProvider).getItems();
});

// Stateless Widget
class ProductCardWidget extends StatelessWidget {
  final Product product;
  @override
  Widget build(context) => Stack(...);
}
```

---

## 🎯 PRÓXIMOS PASSOS

### Today:
1. Review deste plano com time
2. Aprovar timeline + budget
3. Designar dev Flutter (experiente)

### Tomorrow:
1. Criar repositório Flutter novo
2. Executar FASE 1 (setup) - 2 dias
3. Daily standup para sincronizar

### Week 1:
1. Infrastructure (HTTP, storage, providers)
2. Primeiro build rodando
3. Primeiras telas (login, home)

---

## 📞 CONTATOS & RECURSOS

| Recurso | Link |
|---------|------|
| Flutter Docs | https://flutter.dev |
| Riverpod Docs | https://riverpod.dev |
| pub.dev | https://pub.dev |
| Go Router | https://pub.dev/packages/go_router |
| Flutter Awesome | https://github.com/Solido/awesome-flutter |

---

## 📄 DOCUMENTAÇÃO DETALHADA

Este resumo refere-se aos seguintes documentos (neste repositório):

1. **PLANO_MIGRACAO_FLUTTER.md** — Plano detalhado de 100+ páginas
2. **EXEMPLOS_CONVERSAO_CODIGO.md** — Exemplos práticos de conversão
3. **CHECKLIST_SETUP_INICIAL.md** — Passo-a-passo para começar

---

**Documento aprovado por:**
- [ ] Product Owner
- [ ] Tech Lead
- [ ] Dev Flutter (designado)

**Data:** 2026-05-11
**Status:** ✅ Pronto para Implementação
