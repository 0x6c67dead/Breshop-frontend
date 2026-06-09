import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../application/providers/auth_provider.dart';
import '../../../core/theme/colors.dart';
import '../../../domain/entities/user.dart';

class BreshopNavigationDrawer extends ConsumerWidget {
  const BreshopNavigationDrawer({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final user = authState.user;

    if (user == null) {
      return const Drawer(
        child: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    final bool isAdmin = user.role == UserRole.admin;
    final bool isOwner = user.role == UserRole.brechoOwner || user.role == UserRole.admin;

    return Drawer(
      backgroundColor: BreshopColors.background,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.horizontal(right: Radius.circular(24)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Custom Premium Header (safe area aware)
          GestureDetector(
            onTap: () {
              context.pop();
              context.push('/profile');
            },
            child: Container(
              padding: EdgeInsets.only(
                top: MediaQuery.of(context).padding.top + 24,
                left: 24,
                right: 24,
                bottom: 20,
              ),
              decoration: const BoxDecoration(
                color: BreshopColors.black,
                borderRadius: BorderRadius.only(
                  topRight: Radius.circular(24),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CircleAvatar(
                    radius: 28,
                    backgroundColor: BreshopColors.accentLime,
                    child: Text(
                      user.name.isNotEmpty ? user.name[0].toUpperCase() : 'U',
                      style: const TextStyle(
                        color: BreshopColors.black,
                        fontWeight: FontWeight.w900,
                        fontSize: 22,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    user.name,
                    style: const TextStyle(
                      color: BreshopColors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    user.email,
                    style: TextStyle(
                      color: BreshopColors.grey300,
                      fontSize: 12,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ),

          // User Info & Coins Bar
          Container(
            color: BreshopColors.black,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.wallet, color: BreshopColors.accentLime, size: 18),
                    const SizedBox(width: 8),
                    Text(
                      '${user.balance} Coins',
                      style: const TextStyle(
                        color: BreshopColors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: BreshopColors.accentLime,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    user.role == UserRole.admin
                        ? 'Admin'
                        : user.role == UserRole.brechoOwner
                            ? 'Lojista'
                            : 'Cliente',
                    style: const TextStyle(
                      color: BreshopColors.black,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Navigation Links
          _NavigationItem(
            icon: Icons.storefront_outlined,
            title: 'Marketplace',
            onTap: () {
              context.pop();
            },
          ),
          _NavigationItem(
            icon: Icons.person_outline,
            title: 'Meu Perfil',
            onTap: () {
              context.pop();
              context.push('/profile');
            },
          ),
          if (!isOwner) ...[
            _NavigationItem(
              icon: Icons.favorite_border,
              title: 'Favoritos',
              onTap: () {
                context.pop();
                context.push('/favorites');
              },
            ),
            _NavigationItem(
              icon: Icons.shopping_bag_outlined,
              title: 'Carrinho',
              onTap: () {
                context.pop();
                context.push('/cart');
              },
            ),
            _NavigationItem(
              icon: Icons.receipt_long_outlined,
              title: 'Minhas Reservas',
              onTap: () {
                context.pop();
                context.push('/reservations');
              },
            ),
          ],

          if (isOwner) ...[
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
              child: Divider(color: BreshopColors.grey300, height: 1),
            ),
            _NavigationItem(
              icon: Icons.store_mall_directory_outlined,
              title: 'Meu Brechó',
              onTap: () {
                context.pop();
                context.push('/owner-dashboard');
              },
            ),
            _NavigationItem(
              icon: Icons.bar_chart_outlined,
              title: 'Extrato',
              onTap: () {
                context.pop();
                context.push('/extrato');
              },
            ),
          ],

          if (isAdmin) ...[
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
              child: Divider(color: BreshopColors.grey300, height: 1),
            ),
            _NavigationItem(
              icon: Icons.admin_panel_settings_outlined,
              title: 'Painel Admin',
              onTap: () {
                context.pop();
                context.push('/admin');
              },
            ),
          ],

          const Spacer(),

          // Logout Button
          const Divider(color: BreshopColors.grey300, height: 1),
          _NavigationItem(
            icon: Icons.logout,
            title: 'Sair da Conta',
            iconColor: BreshopColors.error,
            textColor: BreshopColors.error,
            onTap: () {
              context.pop();
              ref.read(authProvider.notifier).logout();
            },
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class _NavigationItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;
  final Color iconColor;
  final Color textColor;

  const _NavigationItem({
    required this.icon,
    required this.title,
    required this.onTap,
    this.iconColor = BreshopColors.black,
    this.textColor = BreshopColors.black,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 4.0),
      child: ListTile(
        leading: Icon(icon, color: iconColor),
        title: Text(
          title,
          style: TextStyle(
            color: textColor,
            fontWeight: FontWeight.bold,
            fontSize: 15,
          ),
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        onTap: onTap,
      ),
    );
  }
}
