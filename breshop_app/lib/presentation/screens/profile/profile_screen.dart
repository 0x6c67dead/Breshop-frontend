import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../application/providers/auth_provider.dart';
import '../../../application/providers/wallet_provider.dart';
import '../../../core/theme/colors.dart';
import '../../../domain/entities/user.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider).user;

    if (user == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Scaffold(
      backgroundColor: BreshopColors.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'MEU PERFIL',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w900,
            letterSpacing: 1.0,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Avatar card
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: BreshopColors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: BreshopColors.foreground, width: 1.5),
                boxShadow: const [
                  BoxShadow(
                    color: BreshopColors.foreground,
                    offset: Offset(3, 3),
                    blurRadius: 0,
                  ),
                ],
              ),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: BreshopColors.foreground,
                    child: Text(
                      user.name.isNotEmpty ? user.name[0].toUpperCase() : 'U',
                      style: const TextStyle(
                        color: BreshopColors.accentLime,
                        fontSize: 32,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    user.name,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    user.email,
                    style: const TextStyle(
                      color: BreshopColors.grey500,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: BreshopColors.accentLime,
                      borderRadius: BorderRadius.circular(9999),
                      border: Border.all(color: BreshopColors.foreground),
                    ),
                    child: Text(
                      user.role.label.toUpperCase(),
                      style: const TextStyle(
                        fontWeight: FontWeight.w900,
                        color: BreshopColors.foreground,
                        fontSize: 11,
                        letterSpacing: 0.8,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Wallet card
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: BreshopColors.foreground,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(
                        Icons.account_balance_wallet_outlined,
                        color: BreshopColors.accentLime,
                        size: 20,
                      ),
                      SizedBox(width: 8),
                      Text(
                        'CARTEIRA',
                        style: TextStyle(
                          color: BreshopColors.grey400,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.0,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Text(
                        '${user.balance}',
                        style: const TextStyle(
                          color: BreshopColors.white,
                          fontSize: 40,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Text(
                        'COINS',
                        style: TextStyle(
                          color: BreshopColors.grey400,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  if (user.locked > 0) ...[
                    const SizedBox(height: 4),
                    Text(
                      '${user.locked} COINS bloqueados em reservas',
                      style: const TextStyle(
                        color: BreshopColors.grey500,
                        fontSize: 12,
                      ),
                    ),
                  ],
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () => _handleTopup(context, ref, user),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: BreshopColors.accentLime,
                      foregroundColor: BreshopColors.foreground,
                      minimumSize: const Size(double.infinity, 48),
                      shape: const StadiumBorder(),
                    ),
                    child: const Text(
                      'ADICIONAR COINS (PIX)',
                      style: TextStyle(fontWeight: FontWeight.w900),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Ações rápidas
            if (user.role == UserRole.brechoOwner || user.role == UserRole.admin) ...[
              _ActionTile(
                icon: Icons.store_mall_directory_outlined,
                title: 'Meu Brechó',
                onTap: () => context.push('/owner-dashboard'),
              ),
            ],
            _ActionTile(
              icon: Icons.shopping_bag_outlined,
              title: 'Minhas Reservas',
              onTap: () => context.push('/reservations'),
            ),
            if (user.role == UserRole.admin)
              _ActionTile(
                icon: Icons.admin_panel_settings_outlined,
                title: 'Painel Admin',
                onTap: () => context.push('/admin'),
              ),

            const SizedBox(height: 20),

            OutlinedButton.icon(
              onPressed: () => ref.read(authProvider.notifier).logout(),
              icon: const Icon(Icons.logout, color: BreshopColors.error),
              label: const Text(
                'SAIR DA CONTA',
                style: TextStyle(color: BreshopColors.error, fontWeight: FontWeight.w900),
              ),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: BreshopColors.error),
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _handleTopup(BuildContext context, WidgetRef ref, User user) {
    showDialog(
      context: context,
      builder: (ctx) {
        int amount = 100;
        return AlertDialog(
          title: const Text('Adicionar Coins'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('Selecione o valor a adicionar:'),
              const SizedBox(height: 16),
              Wrap(
                spacing: 8,
                children: [50, 100, 200, 500].map((v) {
                  return OutlinedButton(
                    onPressed: () => amount = v,
                    child: Text('$v C'),
                  );
                }).toList(),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => ctx.pop(), child: const Text('CANCELAR')),
            ElevatedButton(
              onPressed: () async {
                ctx.pop();
                await ref.read(walletProvider.notifier).topup(amount);
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('$amount Coins adicionados!'),
                      backgroundColor: BreshopColors.success,
                    ),
                  );
                }
              },
              child: const Text('CONFIRMAR'),
            ),
          ],
        );
      },
    );
  }
}

class _ActionTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;

  const _ActionTile({
    required this.icon,
    required this.title,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: BreshopColors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: BreshopColors.grey200),
      ),
      child: ListTile(
        leading: Icon(icon, color: BreshopColors.foreground),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        trailing: const Icon(Icons.chevron_right, color: BreshopColors.grey400),
        onTap: onTap,
      ),
    );
  }
}
