# 💻 EXEMPLOS PRÁTICOS: CONVERSÃO REACT → FLUTTER

> Guia de como converter código específico do Breshop web para Flutter
> Inclui padrões de migração, boilerplate e armadilhas comuns

---

## 1️⃣ AUTENTICAÇÃO

### ❌ React + Zustand (Atual)

```typescript
// src/shared/lib/store/marketplaceStore.ts
export const useMarketplaceStore = create<MarketplaceStore>()(
  persist(
    (set, get) => ({
      user: null,
      login: async (email, password) => {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? 'Falha no login');
        }
        const userData = await res.json();
        document.cookie = `user-role=${userData.role}; path=/; max-age=86400`;
        set({
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            brechoId: userData.brechoId,
          },
          balance: userData.balance ?? 0,
        });
      },
      logout: () => {
        document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        set({ user: null, balance: 0 });
      },
    }),
    {
      name: 'breshop-storage',
      partialize: (state) => ({
        user: state.user,
        balance: state.balance,
      }),
    }
  )
);

// src/app/(auth)/login/page.tsx
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useMarketplaceStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full border rounded-lg px-4 py-2"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
        className="w-full border rounded-lg px-4 py-2 mt-4"
      />
      {error && <p className="text-red-600 mt-2">{error}</p>}
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded-lg mt-4 hover:opacity-80"
      >
        Entrar
      </button>
    </form>
  );
}
```

### ✅ Flutter + Riverpod (Novo)

```dart
// lib/domain/entities/user.dart
class User {
  final String id;
  final String name;
  final String email;
  final UserRole role;
  final String? brechoId;
  final double balance;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.brechoId,
    this.balance = 0,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      role: UserRole.values.byName(json['role'] ?? 'USER'),
      brechoId: json['brechoId'],
      balance: (json['balance'] as num?)?.toDouble() ?? 0,
    );
  }
}

enum UserRole { USER, BRECHO_OWNER, ADMIN }

// lib/infrastructure/repositories/auth_repository.dart
abstract class AuthRepository {
  Future<User> login(String email, String password);
  Future<void> logout();
  Future<User?> getCurrentUser();
}

class AuthRepositoryImpl implements AuthRepository {
  final HttpClient httpClient;
  final SecureStorage secureStorage;

  AuthRepositoryImpl({
    required this.httpClient,
    required this.secureStorage,
  });

  @override
  Future<User> login(String email, String password) async {
    final response = await httpClient.post(
      '/api/auth/login',
      body: {'email': email, 'password': password},
    );

    if (response.statusCode != 200) {
      throw AuthException(response.data['error'] ?? 'Login failed');
    }

    final userData = User.fromJson(response.data);
    
    // Salvar token em storage seguro
    await secureStorage.saveToken(response.data['token'] ?? '');
    await secureStorage.saveUserRole(userData.role.name);

    return userData;
  }

  @override
  Future<void> logout() async {
    await secureStorage.deleteToken();
    await secureStorage.deleteUserRole();
  }

  @override
  Future<User?> getCurrentUser() async {
    // Carregar de storage se existir
    final storedUser = await secureStorage.getUser();
    return storedUser;
  }
}

// lib/application/providers/auth_provider.dart
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepositoryImpl(
    httpClient: ref.watch(httpClientProvider),
    secureStorage: ref.watch(secureStorageProvider),
  );
});

class AuthState {
  final User? user;
  final bool isLoading;
  final String? error;

  AuthState({
    this.user,
    this.isLoading = false,
    this.error,
  });

  AuthState copyWith({
    User? user,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _authRepository;

  AuthNotifier({required AuthRepository authRepository})
      : _authRepository = authRepository,
        super(AuthState());

  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final user = await _authRepository.login(email, password);
      state = AuthState(user: user);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> logout() async {
    await _authRepository.logout();
    state = AuthState();
  }

  Future<void> restoreSession() async {
    final user = await _authRepository.getCurrentUser();
    if (user != null) {
      state = AuthState(user: user);
    }
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(authRepository: ref.watch(authRepositoryProvider));
});

// lib/presentation/screens/auth/login_screen.dart
class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() async {
    if (_formKey.currentState!.validate()) {
      await ref.read(authProvider.notifier).login(
            _emailController.text,
            _passwordController.text,
          );

      // Navigation é automática via watch no App
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: Form(
        key: _formKey,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TextFormField(
                controller: _emailController,
                decoration: InputDecoration(
                  hintText: 'Email',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                validator: (value) {
                  if (value?.isEmpty ?? true) return 'Email obrigatório';
                  if (!value!.contains('@')) return 'Email inválido';
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _passwordController,
                decoration: InputDecoration(
                  hintText: 'Senha',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                obscureText: true,
                validator: (value) {
                  if (value?.isEmpty ?? true) return 'Senha obrigatória';
                  if ((value?.length ?? 0) < 6) {
                    return 'Mínimo 6 caracteres';
                  }
                  return null;
                },
              ),
              if (authState.error != null)
                Padding(
                  padding: const EdgeInsets.only(top: 16),
                  child: Text(
                    authState.error!,
                    style: const TextStyle(color: Colors.red),
                  ),
                ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: authState.isLoading ? null : _handleLogin,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.black,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: authState.isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text(
                          'Entrar',
                          style: TextStyle(color: Colors.white),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

---

## 2️⃣ PRODUTO CARD

### ❌ React (Atual)

```typescript
// src/shared/components/feed/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';

export interface ProductCardProps {
    id: string;
    imageUrl: string;
    brand: string;
    model: string;
    price: number;
    size: string;
    tags: string[];
    status?: PieceStatus;
}

export default function ProductCard({ 
    id, imageUrl, brand, model, price, size, tags, status = "AVAILABLE" 
}: ProductCardProps) {
    const isReserved = status === "RESERVED";
    const isSold = status === "SOLD";

    return (
        <Link href={`/product/${id}`} className={`group block w-full mb-6 relative ${isReserved || isSold ? 'pointer-events-none' : ''}`}>
            <div className="relative w-full overflow-hidden bg-foreground/5 border-[1.5px] border-foreground">
                <Image 
                    src={imageUrl} 
                    alt={`${brand} ${model}`} 
                    width={400} 
                    height={500} 
                    className={`w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300 ${(isReserved || isSold) ? 'grayscale opacity-50' : ''}`} 
                />
                
                {/* Tags */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-2 z-10">
                    {tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="tag-pill bg-accent-lime text-foreground uppercase border-[1.5px] border-foreground text-[10px] px-2 py-1">
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Status Badges */}
                {isReserved && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <span className="bg-foreground text-background font-black uppercase text-2xl px-4 py-2 border-2 border-background transform -rotate-12">
                            Reservado
                        </span>
                    </div>
                )}
                {isSold && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <span className="bg-red-600 text-white font-black uppercase text-2xl px-4 py-2 border-2 border-white transform rotate-12">
                            Vendido
                        </span>
                    </div>
                )}

                {/* Size */}
                <div className="absolute top-2 right-2 bg-foreground text-tactile-light font-bold text-xs px-2 py-1 uppercase tracking-wider">
                    {size}
                </div>
            </div>

            <div className="mt-2 flex justify-between items-start">
                <div className="flex flex-col">
                    <span className="font-sans font-black uppercase text-sm leading-tight tracking-wide">{brand}</span>
                    <span className="text-foreground/70 text-sm font-medium">{model}</span>
                </div>
                <div className="font-serif font-black italic text-lg text-foreground flex items-center gap-1">
                    C$ {price.toFixed(0)}
                </div>
            </div>
        </Link>
    );
}
```

### ✅ Flutter (Novo)

```dart
// lib/domain/entities/product.dart
class Product {
  final String id;
  final String title;
  final String imageUrl;
  final String brand;
  final String model;
  final double price;
  final String size;
  final List<String> tags;
  final ProductStatus status;
  final String brechoId;

  Product({
    required this.id,
    required this.title,
    required this.imageUrl,
    required this.brand,
    required this.model,
    required this.price,
    required this.size,
    required this.tags,
    this.status = ProductStatus.available,
    required this.brechoId,
  });

  bool get isAvailable => status == ProductStatus.available;
  bool get isReserved => status == ProductStatus.reserved;
  bool get isSold => status == ProductStatus.sold;

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      brand: json['brand'] ?? '',
      model: json['model'] ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0,
      size: json['size'] ?? '',
      tags: List<String>.from(json['tags'] ?? []),
      status: ProductStatus.values.byName(
        (json['status'] as String?)?.toLowerCase() ?? 'available',
      ),
      brechoId: json['brechoId'] ?? '',
    );
  }
}

enum ProductStatus { available, reserved, sold }

// lib/presentation/widgets/product_card_widget.dart
class ProductCardWidget extends StatelessWidget {
  final Product product;
  final VoidCallback onTap;

  const ProductCardWidget({
    Key? key,
    required this.product,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: product.isAvailable ? onTap : null,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Imagem com overlay
          Stack(
            children: [
              // Imagem de fundo
              Container(
                color: Colors.grey[200],
                child: CachedNetworkImage(
                  imageUrl: product.imageUrl,
                  fit: BoxFit.cover,
                  width: double.infinity,
                  height: 300,
                  placeholder: (context, url) {
                    return Container(
                      color: Colors.grey[300],
                      child: const Center(
                        child: CircularProgressIndicator(),
                      ),
                    );
                  },
                  errorWidget: (context, url, error) {
                    return Container(
                      color: Colors.grey[300],
                      child: const Icon(Icons.image_not_supported),
                    );
                  },
                  // Grayscale se não disponível
                  colorBlendMode:
                      !product.isAvailable ? BlendMode.saturation : null,
                  color: !product.isAvailable
                      ? const Color.fromARGB(255, 100, 100, 100)
                      : null,
                ),
              ),

              // Tags no canto superior esquerdo
              Positioned(
                top: 8,
                left: 8,
                child: Wrap(
                  spacing: 6,
                  children: product.tags.take(2).map((tag) {
                    return Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFFCFFF00), // accent-lime
                        border: Border.all(color: Colors.black, width: 1.5),
                      ),
                      child: Text(
                        '#$tag',
                        style: const TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),

              // Tamanho no canto superior direito
              Positioned(
                top: 8,
                right: 8,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  color: Colors.black,
                  child: Text(
                    product.size.toUpperCase(),
                    style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),

              // Badge de status (Reservado/Vendido)
              if (product.isReserved || product.isSold)
                Positioned.fill(
                  child: Container(
                    color: Colors.black.withOpacity(0.4),
                    child: Center(
                      child: Transform.rotate(
                        angle: product.isReserved ? -0.2 : 0.2,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: product.isReserved
                                ? Colors.black
                                : Colors.red[600],
                            border: Border.all(
                              color: product.isReserved
                                  ? Colors.white
                                  : Colors.white,
                              width: 2,
                            ),
                          ),
                          child: Text(
                            product.isReserved ? 'RESERVADO' : 'VENDIDO',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          ),

          // Info do produto (marca, modelo, preço)
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      product.brand.toUpperCase(),
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      product.model,
                      style: TextStyle(
                        fontSize: 11,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
                Text(
                  'C\$ ${product.price.toStringAsFixed(0)}',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
```

---

## 3️⃣ HOME SCREEN - HERO CAROUSEL

### ❌ React (Atual)

```typescript
// src/app/page.tsx
export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0);
  const heroImages = [
    "https://images.unsplash.com/...",
    "https://images.unsplash.com/...",
    "https://images.unsplash.com/...",
  ];

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(heroInterval);
  }, [heroImages.length]);

  return (
    <section className="w-full h-[85vh] relative overflow-hidden bg-black">
      {heroImages.map((img, i) => (
        <div 
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === heroIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img 
            src={img} 
            alt={`Editorial ${i + 1}`} 
            className="w-full h-full object-cover opacity-60"
          />
        </div>
      ))}
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-7xl md:text-9xl font-serif font-black italic tracking-tighter uppercase leading-none mb-12 drop-shadow-2xl">
          O Novo <br />Passado.
        </h1>
        <Link href="/shop" className="px-12 py-4 border-2 border-white text-white">
          Explorar Acervos
        </Link>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
        {heroImages.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 transition-all duration-500 ${i === heroIndex ? 'w-12 bg-white' : 'w-4 bg-white/30'}`}
          />
        ))}
      </div>
    </section>
  );
}
```

### ✅ Flutter (Novo)

```dart
// lib/presentation/widgets/hero_carousel_widget.dart
class HeroCarouselWidget extends StatefulWidget {
  final List<String> imageUrls;
  final VoidCallback onExplore;

  const HeroCarouselWidget({
    Key? key,
    required this.imageUrls,
    required this.onExplore,
  }) : super(key: key);

  @override
  State<HeroCarouselWidget> createState() => _HeroCarouselWidgetState();
}

class _HeroCarouselWidgetState extends State<HeroCarouselWidget>
    with SingleTickerProviderStateMixin {
  late PageController _pageController;
  int _currentIndex = 0;
  late Timer _timer;

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: 0);
    _startAutoScroll();
  }

  void _startAutoScroll() {
    _timer = Timer.periodic(const Duration(seconds: 5), (timer) {
      if (mounted) {
        _currentIndex = (_currentIndex + 1) % widget.imageUrls.length;
        _pageController.animateToPage(
          _currentIndex,
          duration: const Duration(milliseconds: 800),
          curve: Curves.easeInOutCubic,
        );
      }
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: MediaQuery.of(context).size.height * 0.6, // ~85vh
      child: Stack(
        children: [
          // PageView para carousel
          PageView.builder(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() => _currentIndex = index);
            },
            itemCount: widget.imageUrls.length,
            itemBuilder: (context, index) {
              return Stack(
                children: [
                  // Imagem de fundo com overlay
                  Container(
                    color: Colors.black,
                    child: CachedNetworkImage(
                      imageUrl: widget.imageUrls[index],
                      fit: BoxFit.cover,
                      width: double.infinity,
                      height: double.infinity,
                      colorBlendMode: BlendMode.darken,
                      color: Colors.black.withOpacity(0.4),
                    ),
                  ),
                  // Overlay com texto
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Colors.black.withOpacity(0.3),
                        ],
                      ),
                    ),
                  ),
                ],
              );
            },
          ),

          // Conteúdo centralizado
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'O Novo',
                  style: Theme.of(context).textTheme.displayLarge?.copyWith(
                    color: Colors.white,
                    fontStyle: FontStyle.italic,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'Passado.',
                  style: Theme.of(context).textTheme.displayLarge?.copyWith(
                    color: Colors.white,
                    fontStyle: FontStyle.italic,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 32),
                OutlinedButton(
                  onPressed: _onExplore,
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Colors.white, width: 2),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                  ),
                  child: const Text(
                    'EXPLORAR ACERVOS',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Indicators (bolinhas na base)
          Positioned(
            bottom: 24,
            left: 0,
            right: 0,
            child: Center(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  widget.imageUrls.length,
                  (index) => AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    width: index == _currentIndex ? 24 : 8,
                    height: 3,
                    decoration: BoxDecoration(
                      color: Colors.white
                          .withOpacity(index == _currentIndex ? 1.0 : 0.5),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _onExplore() {
    widget.onExplore();
  }
}
```

---

## 4️⃣ RESERVA DE PRODUTO (Integração com API)

### ❌ React + Zustand (Atual)

```typescript
// src/shared/lib/store/marketplaceStore.ts
reserveItem: async (itemId) => {
  const { user } = get();
  if (!user) throw new Error('Faça login para reservar');

  set((state) => ({ loadingPiece: { ...state.loadingPiece, [itemId]: true } }));

  try {
    // Optimistic update
    set((state) => ({
      items: state.items.map((i) =>
        i.id === itemId ? { ...i, status: 'RESERVED' as const } : i
      ),
    }));

    const res = await fetch('/api/orders/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, itemId }),
    });

    if (!res.ok) {
      // Revert on failure
      set((state) => ({
        items: state.items.map((i) =>
          i.id === itemId ? { ...i, status: 'AVAILABLE' as const } : i
        ),
      }));
      const err = await res.json();
      throw new Error(err.error ?? 'Falha ao reservar');
    }

    const order = await res.json();
    set((state) => ({
      orders: [order, ...state.orders],
      balance: state.balance - (get().items.find((i) => i.id === itemId)?.price ?? 0),
    }));
  } finally {
    set((state) => {
      const lp = { ...state.loadingPiece };
      delete lp[itemId];
      return { loadingPiece: lp };
    });
  }
},
```

### ✅ Flutter + Riverpod (Novo)

```dart
// lib/infrastructure/repositories/order_repository.dart
abstract class OrderRepository {
  Future<Order> reserveItem(String userId, String itemId);
  Future<List<Order>> getMyOrders(String userId);
  Future<void> cancelOrder(String orderId);
}

class OrderRepositoryImpl implements OrderRepository {
  final HttpClient httpClient;

  OrderRepositoryImpl({required this.httpClient});

  @override
  Future<Order> reserveItem(String userId, String itemId) async {
    final response = await httpClient.post(
      '/api/orders/reserve',
      body: {
        'userId': userId,
        'itemId': itemId,
      },
    );

    if (response.statusCode != 200) {
      throw Exception(response.data['error'] ?? 'Falha ao reservar');
    }

    return Order.fromJson(response.data);
  }

  @override
  Future<List<Order>> getMyOrders(String userId) async {
    final response = await httpClient.get(
      '/api/orders/mine?userId=$userId',
    );

    if (response.statusCode != 200) {
      throw Exception('Erro ao buscar pedidos');
    }

    return List<Order>.from(
      (response.data as List).map((json) => Order.fromJson(json)),
    );
  }

  @override
  Future<void> cancelOrder(String orderId) async {
    final response = await httpClient.post(
      '/api/orders/$orderId/reject',
      body: {
        'reason': 'OTHER',
        'action': 'RETURN_TO_STORE',
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Erro ao cancelar pedido');
    }
  }
}

// lib/application/providers/order_provider.dart
final orderRepositoryProvider = Provider<OrderRepository>((ref) {
  return OrderRepositoryImpl(
    httpClient: ref.watch(httpClientProvider),
  );
});

final myOrdersProvider = FutureProvider.autoDispose<List<Order>>((ref) async {
  final auth = ref.watch(authProvider);
  if (auth.user == null) return [];

  final orderRepo = ref.watch(orderRepositoryProvider);
  return orderRepo.getMyOrders(auth.user!.id);
});

// Widget que usa o provider
class ReserveButtonWidget extends ConsumerWidget {
  final String productId;
  final double price;

  const ReserveButtonWidget({
    Key? key,
    required this.productId,
    required this.price,
  }) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authProvider);
    final marketplace = ref.watch(marketplaceProvider);

    return ElevatedButton(
      onPressed: () async {
        if (auth.user == null) {
          // Redirecionar para login
          return;
        }

        try {
          final orderRepo = ref.read(orderRepositoryProvider);
          final order = await orderRepo.reserveItem(
            auth.user!.id,
            productId,
          );

          // Invalidar cache de pedidos e marketplace
          ref.refresh(myOrdersProvider);
          ref.refresh(marketplaceProvider);

          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Pedido reservado com sucesso!')),
            );
          }
        } catch (e) {
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Erro: ${e.toString()}')),
            );
          }
        }
      },
      child: const Text('RESERVAR'),
    );
  }
}
```

---

## 5️⃣ HTTP CLIENT COM INTERCEPTOR

### ✅ Flutter Implementation

```dart
// lib/infrastructure/http_client.dart
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class HttpClient extends http.BaseClient {
  final String baseUrl;
  final SecureStorage secureStorage;

  HttpClient({
    required this.baseUrl,
    required this.secureStorage,
  });

  @override
  Future<http.StreamedResponse> send(http.BaseRequest request) async {
    // Adicionar headers
    request.headers['Content-Type'] = 'application/json';

    // Adicionar token se existe
    final token = await secureStorage.getToken();
    if (token != null) {
      request.headers['Authorization'] = 'Bearer $token';
    }

    // Fazer requisição com timeout
    try {
      final streamedResponse = await super.send(request).timeout(
        const Duration(seconds: 30),
        onTimeout: () {
          throw TimeoutException('Request timeout after 30 seconds');
        },
      );

      // Retornar como Response normal
      final response = await http.Response.fromStream(streamedResponse);

      // Verificar se token expirou
      if (response.statusCode == 401) {
        // Token expirado - limpar e redirecionar para login
        await secureStorage.deleteToken();
        throw UnauthorizedException('Token expired');
      }

      return http.StreamedResponse(
        Stream.value(response.bodyBytes),
        response.statusCode,
        request: request,
        headers: response.headers,
        isRedirect: response.isRedirect,
        persistentConnection: response.persistentConnection,
        reasonPhrase: response.reasonPhrase,
      );
    } on TimeoutException {
      throw TimeoutException('Requisição expirou. Verifique sua conexão.');
    }
  }

  Future<HttpResponse> get(String path) async {
    final uri = Uri.parse('$baseUrl$path');
    final response = await http.get(uri);
    return _parseResponse(response);
  }

  Future<HttpResponse> post(String path, {required Map<String, dynamic> body}) async {
    final uri = Uri.parse('$baseUrl$path');
    final response = await http.post(
      uri,
      body: jsonEncode(body),
    );
    return _parseResponse(response);
  }

  HttpResponse _parseResponse(http.Response response) {
    try {
      final jsonData = jsonDecode(response.body);
      return HttpResponse(
        statusCode: response.statusCode,
        data: jsonData,
        headers: response.headers,
      );
    } catch (e) {
      return HttpResponse(
        statusCode: response.statusCode,
        data: {'error': 'Invalid JSON'},
        headers: response.headers,
      );
    }
  }
}

class HttpResponse {
  final int statusCode;
  final dynamic data;
  final Map<String, String> headers;

  HttpResponse({
    required this.statusCode,
    required this.data,
    required this.headers,
  });
}

class UnauthorizedException implements Exception {
  final String message;
  UnauthorizedException(this.message);

  @override
  String toString() => message;
}

class TimeoutException implements Exception {
  final String message;
  TimeoutException(this.message);

  @override
  String toString() => message;
}

// lib/core/providers.dart
final secureStorageProvider = Provider<SecureStorage>((ref) {
  return SecureStorage();
});

final httpClientProvider = Provider<HttpClient>((ref) {
  return HttpClient(
    baseUrl: 'https://api.breshop.com', // Do .env
    secureStorage: ref.watch(secureStorageProvider),
  );
});
```

---

## 6️⃣ LISTA COM PAGINATION

### ✅ Flutter Implementation

```dart
// lib/presentation/screens/shop_list_screen.dart
class ShopListScreen extends ConsumerStatefulWidget {
  const ShopListScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<ShopListScreen> createState() => _ShopListScreenState();
}

class _ShopListScreenState extends ConsumerState<ShopListScreen> {
  late ScrollController _scrollController;
  int _page = 1;
  final int _pageSize = 10;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    if (_scrollController.position.pixels ==
        _scrollController.position.maxScrollExtent) {
      // Chegou ao final - carregar próxima página
      setState(() => _page++);
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // FutureProvider que usa _page
    final shopsAsync = ref.watch(
      brechoListProvider(page: _page, limit: _pageSize),
    );

    return Scaffold(
      appBar: AppBar(title: const Text('Brechós')),
      body: shopsAsync.when(
        data: (brechos) {
          return ListView.builder(
            controller: _scrollController,
            itemCount: brechos.length + 1,
            itemBuilder: (context, index) {
              if (index == brechos.length) {
                // Loading indicator
                return const Padding(
                  padding: EdgeInsets.all(16),
                  child: CircularProgressIndicator(),
                );
              }

              final brecho = brechos[index];
              return BrechoTileWidget(
                brecho: brecho,
                onTap: () {
                  // Navegar para detalhe
                  context.go('/shop/${brecho.id}');
                },
              );
            },
          );
        },
        loading: () => const Center(
          child: CircularProgressIndicator(),
        ),
        error: (error, st) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Erro: $error'),
              ElevatedButton(
                onPressed: () => ref.refresh(brechoListProvider(page: 1, limit: _pageSize)),
                child: const Text('Tentar Novamente'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// lib/application/providers/brecho_provider.dart
final brechoListProvider =
    FutureProvider.autoDispose.family<List<Brecho>, ({int page, int limit})>(
  (ref, params) async {
    final repo = ref.watch(brechoRepositoryProvider);
    return repo.getBrecos(page: params.page, limit: params.limit);
  },
);
```

---

## Resumo: Padrões Principais

| Padrão | React | Flutter |
|--------|-------|---------|
| **State** | `useState()` | `State<T>` / Riverpod `StateNotifier` |
| **Side Effects** | `useEffect()` | `initState()` + `dispose()` / `ref.listen()` |
| **Global State** | Zustand store | Riverpod providers |
| **Forms** | `<input>` + `useState` | `TextFormField` + `Form` + `FormState` |
| **List Lazy** | `map()` renderizado | `ListView.builder()` |
| **Image Cache** | Manual | `CachedNetworkImage` |
| **Navigation** | `<Link>` + `next/router` | `go_router` |
| **Animações** | CSS `transition` | `AnimatedContainer`, `Hero`, etc. |
| **HTTP** | `fetch()` | `http` package + wrapper customizado |
| **Storage** | `localStorage` | `SharedPreferences` (inseguro) + `flutter_secure_storage` (seguro) |

