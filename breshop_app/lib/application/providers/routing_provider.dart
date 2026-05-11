import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'auth_provider.dart';
import '../../presentation/screens/auth/login_screen.dart';
import '../../presentation/screens/marketplace/marketplace_screen.dart';
import '../../presentation/screens/marketplace/product_details_screen.dart';
import '../../domain/entities/product.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);

  return GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      final isLoggedIn = authState.user != null;
      final isLoggingIn = state.matchedLocation == '/login';

      if (!isLoggedIn && !isLoggingIn) return '/login';
      if (isLoggedIn && isLoggingIn) return '/';

      return null;
    },
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const MarketplaceScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/product-details',
        builder: (context, state) {
          final product = state.extra as Product;
          return ProductDetailsScreen(product: product);
        },
      ),
    ],
  );
});
