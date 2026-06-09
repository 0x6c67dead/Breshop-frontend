import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'auth_provider.dart';
import '../../presentation/screens/auth/login_screen.dart';
import '../../presentation/screens/auth/register_screen.dart';
import '../../presentation/screens/marketplace/marketplace_screen.dart';
import '../../presentation/screens/marketplace/product_details_screen.dart';
import '../../presentation/screens/admin/admin_panel_screen.dart';
import '../../presentation/screens/owner/shop_dashboard_screen.dart';
import '../../presentation/screens/owner/extrato_screen.dart';
import '../../presentation/screens/profile/profile_screen.dart';
import '../../presentation/screens/reservations/reservations_screen.dart';
import '../../presentation/screens/favorites/favorites_screen.dart';
import '../../presentation/screens/cart/cart_screen.dart';
import '../../presentation/screens/owner/add_item_screen.dart';
import '../../presentation/screens/auth/forgot_password_screen.dart';
import '../../domain/entities/user.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);

  return GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      final isLoggedIn = authState.user != null;
      final loc = state.matchedLocation;
      final isAuthPage = loc == '/login' || loc == '/register';

      if (!isLoggedIn && !isAuthPage) return '/login';
      if (isLoggedIn && isAuthPage) return '/';

      final user = authState.user;
      // Owners/admins não acessam reservations nem cart (são vendedores)
      if (user != null &&
          user.role != UserRole.user &&
          (loc == '/reservations' || loc == '/cart')) {
        return '/';
      }
      // Apenas owners/admins acessam extrato e add-item
      if (user != null &&
          user.role == UserRole.user &&
          (loc == '/extrato' || loc == '/add-item')) {
        return '/';
      }

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
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/admin',
        builder: (context, state) => const AdminPanelScreen(),
      ),
      GoRoute(
        path: '/owner-dashboard',
        builder: (context, state) => const ShopDashboardScreen(),
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfileScreen(),
      ),
      GoRoute(
        path: '/reservations',
        builder: (context, state) => const ReservationsScreen(),
      ),
      GoRoute(
        path: '/item/:id',
        builder: (context, state) {
          final itemId = state.pathParameters['id']!;
          return ItemDetailsScreen(itemId: itemId);
        },
      ),
      GoRoute(
        path: '/favorites',
        builder: (context, state) => const FavoritesScreen(),
      ),
      GoRoute(
        path: '/cart',
        builder: (context, state) => const CartScreen(),
      ),
      GoRoute(
        path: '/extrato',
        builder: (context, state) => const ExtratoScreen(),
      ),
      GoRoute(
        path: '/add-item',
        builder: (context, state) => const AddItemScreen(),
      ),
      GoRoute(
        path: '/forgot-password',
        builder: (context, state) => const ForgotPasswordScreen(),
      ),
    ],
  );
});
