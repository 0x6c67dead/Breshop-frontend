
# ✅ CHECKLIST: SETUP INICIAL DO PROJETO FLUTTER

> Guia passo-a-passo para criar e configurar o novo projeto Flutter/Dart
> Tempo estimado: 2-3 horas

---

## 🔧 PRÉ-REQUISITOS

- [ ] Flutter SDK 3.x ou superior instalado
- [ ] Dart SDK 3.x (vem com Flutter)
- [ ] Android SDK (API 23-34)
- [ ] Android Studio ou VS Code com extensão Flutter
- [ ] Git configurado
- [ ] Device Android físico OU emulador configurado

### Verificar Instalação

```bash
# Verificar Flutter
flutter --version

# Verificar ambiente
flutter doctor

# Output esperado: ✓ Flutter (X.X.X)
#                  ✓ Android SDK
#                  ✓ Android toolchain
```

---

## 📱 PASSO 1: CRIAR PROJETO BASE

```bash
# 1. Criar novo projeto
flutter create breshop_app \
  --org com.breshop \
  --project-name breshop_app \
  --no-offline

# 2. Entrar na pasta
cd breshop_app

# 3. Verificar estrutura inicial
ls -la
# Saída esperada:
# android/
# ios/
# lib/
# test/
# pubspec.yaml
# README.md
```

---

## 📦 PASSO 2: CONFIGURAR pubspec.yaml

### Backup do arquivo original

```bash
cp pubspec.yaml pubspec.yaml.backup
```

### Editar pubspec.yaml

```yaml
name: breshop_app
description: "Marketplace de moda sustentável - Flutter Version"
publish_to: 'none'

version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter

  # ===== STATE MANAGEMENT =====
  riverpod: ^2.4.0
  flutter_riverpod: ^2.4.0
  riverpod_generator: ^2.3.0
  hooks_riverpod: ^2.4.0                # Para usar hooks com Riverpod

  # ===== ROUTING =====
  go_router: ^13.0.0

  # ===== HTTP & SERIALIZAÇÃO =====
  http: ^1.1.0
  json_serializable: ^6.7.0
  json_annotation: ^4.8.0

  # ===== STORAGE & SEGURANÇA =====
  flutter_secure_storage: ^9.0.0
  shared_preferences: ^2.2.0

  # ===== UI & COMPONENTES =====
  cached_network_image: ^3.3.0          # Cache de imagens
  flutter_staggered_grid_view: ^0.7.0   # Masonry grid
  infinite_scroll_pagination: ^4.0.0    # Pagination
  intl: ^0.19.0                         # Formatação de data/moeda
  animations: ^2.0.0                    # Transições customizadas

  # ===== ICONS =====
  lucide_icons: ^0.0.1                  # Icons tipo lucide-react

  # ===== UTILITÁRIOS =====
  equatable: ^2.0.5                     # Igualdade de objetos
  uuid: ^4.0.0                          # Geração de UUIDs
  get_it: ^7.6.0                        # Service locator (opcional)

dev_dependencies:
  flutter_test:
    sdk: flutter

  # ===== LINTING & ANÁLISE =====
  flutter_lints: ^3.0.0
  very_good_analysis: ^5.0.0

  # ===== GERAÇÃO DE CÓDIGO =====
  build_runner: ^2.4.0
  json_serializable: ^6.7.0
  riverpod_generator: ^2.3.0

flutter:
  uses-material-design: true

  # ===== ASSETS =====
  assets:
    - assets/images/
    - assets/icons/
    - assets/fonts/

  # ===== FONTS =====
  fonts:
    - family: Serif
      fonts:
        - asset: assets/fonts/Serif-Regular.ttf
        - asset: assets/fonts/Serif-Bold.ttf
          weight: 700
        - asset: assets/fonts/Serif-Italic.ttf
          style: italic
        - asset: assets/fonts/Serif-BoldItalic.ttf
          weight: 700
          style: italic

    - family: Mono
      fonts:
        - asset: assets/fonts/Mono-Regular.ttf
        - asset: assets/fonts/Mono-Bold.ttf
          weight: 700
```

### Download dependências

```bash
flutter pub get

# Gerar código de serialização
flutter pub run build_runner build --delete-conflicting-outputs
```

---

## 🗂️ PASSO 3: ESTRUTURA DE PASTAS

### Criar estrutura de camadas

```bash
mkdir -p lib/{core,domain,infrastructure,application,presentation}
mkdir -p lib/core/{constants,extensions,theme,utils}
mkdir -p lib/domain/{entities,repositories}
mkdir -p lib/infrastructure/{http_client,storage,repositories}
mkdir -p lib/application/{providers,notifiers,dtos}
mkdir -p lib/presentation/{screens,widgets}
mkdir -p lib/presentation/screens/{auth,home,marketplace,profile,owner,admin}
mkdir -p lib/presentation/widgets/{common,animations}

# Assets
mkdir -p assets/{images,icons,fonts}

# Tests
mkdir -p test/{unit,widget,integration}
```

### Estrutura final

```
lib/
├── main.dart                          [Entry point]
├── core/
│   ├── constants.dart                 [API_BASE, COLORS, etc]
│   ├── extensions.dart                [String, num extensions]
│   ├── theme/
│   │   ├── theme.dart                 [ThemeData]
│   │   ├── colors.dart                [Color constants]
│   │   └── text_styles.dart           [Text styles]
│   └── utils/
│       ├── formatters.dart            [Currency, date]
│       ├── validators.dart            [Email, password, etc]
│       └── logger.dart                [Simple logging]
├── domain/
│   ├── entities/
│   │   ├── user.dart
│   │   ├── product.dart
│   │   ├── brecho.dart
│   │   ├── order.dart
│   │   └── wallet.dart
│   └── repositories/
│       ├── auth_repository.dart
│       ├── marketplace_repository.dart
│       ├── brecho_repository.dart
│       └── order_repository.dart
├── infrastructure/
│   ├── http_client.dart
│   ├── http_client/
│   │   ├── http_client.dart
│   │   ├── exceptions.dart
│   │   └── response.dart
│   ├── storage/
│   │   ├── secure_storage.dart
│   │   └── local_storage.dart
│   └── repositories/
│       ├── auth_repository_impl.dart
│       ├── marketplace_repository_impl.dart
│       ├── brecho_repository_impl.dart
│       └── order_repository_impl.dart
├── application/
│   ├── providers/
│   │   ├── auth_provider.dart
│   │   ├── marketplace_provider.dart
│   │   ├── brecho_provider.dart
│   │   ├── order_provider.dart
│   │   ├── wallet_provider.dart
│   │   ├── favorites_provider.dart
│   │   └── http_client_provider.dart
│   ├── notifiers/
│   │   ├── auth_notifier.dart
│   │   └── favorites_notifier.dart
│   └── dtos/
│       ├── login_request_dto.dart
│       └── create_order_request_dto.dart
└── presentation/
    ├── screens/
    │   ├── auth/
    │   │   ├── login_screen.dart
    │   │   ├── register_screen.dart
    │   │   └── forgot_password_screen.dart
    │   ├── home/
    │   │   ├── home_screen.dart
    │   │   ├── shop_list_screen.dart
    │   │   ├── shop_detail_screen.dart
    │   │   └── product_detail_screen.dart
    │   ├── marketplace/
    │   │   ├── my_reservations_screen.dart
    │   │   ├── wallet_screen.dart
    │   │   ├── favorites_screen.dart
    │   │   └── search_screen.dart
    │   ├── profile/
    │   │   └── profile_screen.dart
    │   ├── owner/
    │   │   ├── shop_dashboard_screen.dart
    │   │   └── create_product_screen.dart
    │   └── admin/
    │       └── admin_panel_screen.dart
    └── widgets/
        ├── common/
        │   ├── app_bar_widget.dart
        │   ├── bottom_nav_widget.dart
        │   ├── product_card_widget.dart
        │   ├── custom_button_widget.dart
        │   ├── loading_widget.dart
        │   └── error_widget.dart
        └── animations/
            ├── hero_carousel_widget.dart
            └── marquee_widget.dart
```

---

## 🎨 PASSO 4: CONFIGURAR TEMA (colors.dart)

```dart
// lib/core/theme/colors.dart
import 'package:flutter/material.dart';

class BreshopColors {
  // Brand colors (do Figma/design atual)
  static const Color background = Color(0xFFF4F0EB);  // Bege claro
  static const Color foreground = Color(0xFF000000);  // Preto
  static const Color accentLime = Color(0xFFCFFF00);  // Lime

  // Neutrals
  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF000000);
  static const Color grey50 = Color(0xFFFAFAFA);
  static const Color grey100 = Color(0xFFF3F4F6);
  static const Color grey200 = Color(0xFFE5E7EB);
  static const Color grey300 = Color(0xFFD1D5DB);
  static const Color grey400 = Color(0xFF9CA3AF);
  static const Color grey500 = Color(0xFF6B7280);
  static const Color grey600 = Color(0xFF4B5563);
  static const Color grey700 = Color(0xFF374151);
  static const Color grey800 = Color(0xFF1F2937);
  static const Color grey900 = Color(0xFF111827);

  // States
  static const Color success = Color(0xFF10B981);
  static const Color error = Color(0xFFEF4444);
  static const Color warning = Color(0xFFF59E0B);
  static const Color info = Color(0xFF3B82F6);
}

// lib/core/theme/theme.dart
import 'package:flutter/material.dart';
import 'colors.dart';
import 'text_styles.dart';

class BreshopTheme {
  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    primaryColor: BreshopColors.black,
    scaffoldBackgroundColor: BreshopColors.background,
    
    colorScheme: ColorScheme.light(
      primary: BreshopColors.black,
      secondary: BreshopColors.accentLime,
      surface: BreshopColors.white,
      error: BreshopColors.error,
      tertiary: BreshopColors.grey700,
    ),

    // App Bar
    appBarTheme: AppBarTheme(
      elevation: 0,
      backgroundColor: BreshopColors.background,
      foregroundColor: BreshopColors.foreground,
      surfaceTintColor: Colors.transparent,
      titleTextStyle: TextStyle(
        color: BreshopColors.foreground,
        fontSize: 20,
        fontWeight: FontWeight.bold,
      ),
    ),

    // Buttons
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: BreshopColors.black,
        foregroundColor: BreshopColors.white,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        textStyle: const TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 14,
        ),
      ),
    ),

    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: BreshopColors.black,
        side: const BorderSide(
          color: BreshopColors.black,
          width: 2,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    ),

    // Text Fields
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: BreshopColors.white,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: BreshopColors.grey200),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: BreshopColors.grey200),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(
          color: BreshopColors.black,
          width: 2,
        ),
      ),
      hintStyle: const TextStyle(color: BreshopColors.grey400),
      contentPadding: const EdgeInsets.symmetric(
        horizontal: 16,
        vertical: 12,
      ),
    ),

    // Text Styles
    textTheme: TextTheme(
      displayLarge: BreshopTextStyles.displayLarge,
      displayMedium: BreshopTextStyles.displayMedium,
      titleLarge: BreshopTextStyles.titleLarge,
      bodyLarge: BreshopTextStyles.bodyLarge,
      bodyMedium: BreshopTextStyles.bodyMedium,
      labelLarge: BreshopTextStyles.labelLarge,
    ),

    // Snack Bar
    snackBarTheme: SnackBarThemeData(
      backgroundColor: BreshopColors.grey900,
      contentTextStyle: const TextStyle(
        color: BreshopColors.white,
        fontSize: 14,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
    ),
  );

  static ThemeData get darkTheme {
    // Futura implementação (opcional)
    return lightTheme;
  }
}

// lib/core/theme/text_styles.dart
import 'package:flutter/material.dart';

class BreshopTextStyles {
  // Headlines (Serif Italic - estilo brand)
  static const TextStyle displayLarge = TextStyle(
    fontSize: 56,
    fontWeight: FontWeight.w900,
    fontStyle: FontStyle.italic,
    fontFamily: 'Serif',
    letterSpacing: -1.5,
  );

  static const TextStyle displayMedium = TextStyle(
    fontSize: 44,
    fontWeight: FontWeight.w900,
    fontStyle: FontStyle.italic,
    fontFamily: 'Serif',
    letterSpacing: -1.2,
  );

  static const TextStyle titleLarge = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.w900,
    fontStyle: FontStyle.italic,
    fontFamily: 'Serif',
  );

  // Body
  static const TextStyle bodyLarge = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w400,
    fontFamily: 'SanFrancisco',
  );

  static const TextStyle bodyMedium = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w400,
    fontFamily: 'SanFrancisco',
  );

  static const TextStyle labelLarge = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.w600,
    fontFamily: 'Mono',
    letterSpacing: 0.5,
  );
}
```

---

## 🔌 PASSO 5: SETUP HTTP CLIENT

```dart
// lib/core/constants.dart
class Constants {
  static const String apiBaseUrl = 'https://api.breshop.com';
  // ou usar variáveis de ambiente:
  // static const String apiBaseUrl = String.fromEnvironment('API_BASE_URL');

  static const int httpTimeoutSeconds = 30;
  static const int retryMaxAttempts = 3;
}

// lib/infrastructure/http_client/exceptions.dart
class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final dynamic originalError;

  ApiException({
    required this.message,
    this.statusCode,
    this.originalError,
  });

  @override
  String toString() => message;
}

class UnauthorizedException extends ApiException {
  UnauthorizedException() : super(message: 'Unauthorized');
}

class NetworkException extends ApiException {
  NetworkException() : super(message: 'Network error');
}

class TimeoutException extends ApiException {
  TimeoutException() : super(message: 'Request timeout');
}

// lib/infrastructure/http_client/http_client.dart
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../core/constants.dart';
import 'exceptions.dart';

class HttpClient extends http.BaseClient {
  final String baseUrl;
  final String Function()? getToken;

  HttpClient({
    required this.baseUrl,
    this.getToken,
  });

  @override
  Future<http.StreamedResponse> send(http.BaseRequest request) async {
    // Adicionar headers default
    request.headers['Content-Type'] = 'application/json';
    request.headers['Accept'] = 'application/json';

    // Adicionar token se disponível
    final token = getToken?.call();
    if (token != null) {
      request.headers['Authorization'] = 'Bearer $token';
    }

    try {
      // Enviar com timeout
      final streamedResponse = await super.send(request).timeout(
        const Duration(seconds: Constants.httpTimeoutSeconds),
      );

      // Converter para Response normal
      final response = await http.Response.fromStream(streamedResponse);

      // Tratamento de status codes
      if (response.statusCode == 401) {
        throw UnauthorizedException();
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
    } on http.ClientException {
      throw NetworkException();
    } on TimeoutException {
      throw TimeoutException();
    }
  }

  // Helpers
  Future<Map<String, dynamic>> get(String path) async {
    final response = await http.get(Uri.parse('$baseUrl$path'));
    return _parseResponse(response);
  }

  Future<Map<String, dynamic>> post(
    String path, {
    required Map<String, dynamic> body,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl$path'),
      body: jsonEncode(body),
    );
    return _parseResponse(response);
  }

  Map<String, dynamic> _parseResponse(http.Response response) {
    try {
      return jsonDecode(response.body);
    } catch (e) {
      if (response.statusCode == 200 || response.statusCode == 201) {
        return {'status': 'success'};
      }
      throw ApiException(
        message: 'Failed to parse response',
        statusCode: response.statusCode,
      );
    }
  }
}
```

---

## 🔐 PASSO 6: SETUP STORAGE

```dart
// lib/infrastructure/storage/secure_storage.dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorage {
  static const String _tokenKey = 'breshop_auth_token';
  static const String _userKey = 'breshop_user';
  static const String _roleKey = 'breshop_user_role';

  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  // Token
  Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  Future<void> saveToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
  }

  Future<void> deleteToken() async {
    await _storage.delete(key: _tokenKey);
  }

  // User
  Future<String?> getUser() async {
    return await _storage.read(key: _userKey);
  }

  Future<void> saveUser(String userJson) async {
    await _storage.write(key: _userKey, value: userJson);
  }

  // Role
  Future<String?> getUserRole() async {
    return await _storage.read(key: _roleKey);
  }

  Future<void> saveUserRole(String role) async {
    await _storage.write(key: _roleKey, value: role);
  }

  // Logout
  Future<void> clear() async {
    await _storage.delete(key: _tokenKey);
    await _storage.delete(key: _userKey);
    await _storage.delete(key: _roleKey);
  }
}

// lib/infrastructure/storage/local_storage.dart
import 'package:shared_preferences/shared_preferences.dart';

class LocalStorage {
  static const String _themeKey = 'breshop_theme';
  static const String _localeKey = 'breshop_locale';
  static const String _favoritesKey = 'breshop_favorites';

  late SharedPreferences _prefs;

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // Theme
  bool isDarkMode() => _prefs.getBool(_themeKey) ?? false;
  Future<void> setDarkMode(bool value) async {
    await _prefs.setBool(_themeKey, value);
  }

  // Locale
  String getLocale() => _prefs.getString(_localeKey) ?? 'pt_BR';
  Future<void> setLocale(String locale) async {
    await _prefs.setString(_localeKey, locale);
  }

  // Favorites (lista de IDs)
  List<String> getFavorites() =>
      _prefs.getStringList(_favoritesKey) ?? [];
  Future<void> setFavorites(List<String> favorites) async {
    await _prefs.setStringList(_favoritesKey, favorites);
  }
}
```

---

## 🚀 PASSO 7: MAIN.DART INICIAL

```dart
// lib/main.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'infrastructure/storage/local_storage.dart';
import 'core/theme/theme.dart';
import 'application/providers/routing_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Inicializar storage local
  final localStorage = LocalStorage();
  await localStorage.init();
  
  runApp(
    ProviderScope(
      child: MyApp(localStorage: localStorage),
    ),
  );
}

class MyApp extends ConsumerWidget {
  final LocalStorage localStorage;

  const MyApp({Key? key, required this.localStorage}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      title: 'Breshop',
      theme: BreshopTheme.lightTheme,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}

// lib/application/providers/routing_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

final routerProvider = Provider<GoRouter>((ref) {
  // Por enquanto, rota simples para home
  // Depois será condicional baseado em auth
  
  return GoRouter(
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const Scaffold(
          body: Center(
            child: Text('Home - Será implementado'),
          ),
        ),
      ),
    ],
  );
});
```

---

## 📱 PASSO 8: PRIMEIRO RUN

### Conectar device/emulator

```bash
# Listar devices
adb devices

# Ou verificar via Flutter
flutter devices

# Output exemplo:
# Android Emulator (emulator-5554) • emulator-5554 • android • Android 12 (API 31)
# Motorola Moto G (48cc4e52) • 48cc4e52 • android • Android 13
```

### Rodar app

```bash
# Debug
flutter run

# Ou com device específico
flutter run -d <device-id>

# Hot reload durante desenvolvimento
# No terminal: r (hot reload) ou R (hot restart)
```

### Expected Output

```
Launching lib/main.dart on Android Emulator in debug mode...
Running Gradle task 'assembleDebug'...
✓ Built build/app/outputs/apk/debug/app-debug.apk (12.3 MB).
Installing and launching...
...
I/flutter: App launched successfully!
```

---

## ✅ CHECKLIST PÓS-SETUP

- [ ] `flutter doctor` retorna OK em tudo (Flutter, Android, etc)
- [ ] Projeto cria sem erros: `flutter create`
- [ ] Dependências instaladas: `flutter pub get`
- [ ] Build runner executado: `flutter pub run build_runner build`
- [ ] Tema configurado (colors, typography)
- [ ] HTTP client criado com interceptor
- [ ] Storage (secure + local) inicializado
- [ ] Main.dart rodando sem erros
- [ ] App abre em device/emulator
- [ ] Hot reload funciona (pressionar `r`)

---

## 🐛 TROUBLESHOOTING

### Erro: "Gradle build failed"

```bash
# Limpar build
flutter clean

# Executar novamente
flutter pub get
flutter run
```

### Erro: "compileSdkVersion too low"

```bash
# Editar android/app/build.gradle
android {
    compileSdkVersion 34  // Aumentar para 34 ou superior
    
    defaultConfig {
        targetSdkVersion 34  // Aumentar para 34
        minSdkVersion 23     // Keep API 23
    }
}
```

### Erro: "Emulator not found"

```bash
# Listar AVDs disponíveis
emulator -list-avds

# Criar novo emulator
flutter emulators --create --name "pixel_5"

# Rodar emulator
flutter emulators --launch pixel_5

# Ou usar Android Studio: Tools → AVD Manager
```

### Erro: "SecureStorage failing on Android"

```bash
# Verificar AndroidManifest.xml
# Adicionar a seção <uses-permission> se necessário:

<manifest ...>
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.USE_CREDENTIALS" />
    <application ...>
        ...
    </application>
</manifest>
```

---

## 📊 PRÓXIMAS FASES

Após completar este setup inicial:

1. **PHASE 2:** Implementar providers Riverpod (auth, marketplace, etc)
2. **PHASE 3:** Criar widgets base (AppBar, ProductCard, etc)
3. **PHASE 4:** Implementar screens principais (Login, Home, Shop, etc)
4. **PHASE 5:** Owner/Admin features
5. **PHASE 6:** Polishing e testes
6. **PHASE 7:** Build release

---

## 📞 REFERÊNCIAS RÁPIDAS

```bash
# Criar novo widget/screen
flutter create --template=package breshop_widgets

# Rodar testes
flutter test

# Build APK
flutter build apk --release

# Verificar cobertura de testes
flutter test --coverage

# Análise estática
flutter analyze

# Format código
dart format lib/

# Fix issues
dart fix --apply lib/
```

---

**Tempo estimado:** 2-3 horas
**Próximo checkpoint:** Setup inicial completo ✓
