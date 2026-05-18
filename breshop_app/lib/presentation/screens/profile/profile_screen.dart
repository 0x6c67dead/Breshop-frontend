import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../application/providers/auth_provider.dart';
import '../../../core/theme/colors.dart';
import '../../../domain/entities/user.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  final List<Map<String, dynamic>> _mockTransactions = [
    {'title': 'Bônus de Cadastro', 'date': '10/05/2026', 'amount': 50.0, 'type': 'in'},
    {'title': 'Jaqueta Jeans Vintage', 'date': '15/05/2026', 'amount': -150.0, 'type': 'out'},
  ];

  void _addCoins() {
    // Simular recarga de coins
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Coins recarregados com sucesso (Simulação de Pix)!'),
        backgroundColor: BreshopColors.success,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final user = authState.user;

    if (user == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
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
            // User Main Card
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: BreshopColors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: BreshopColors.grey200),
              ),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: BreshopColors.black,
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
                      color: BreshopColors.grey100,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      user.role == UserRole.admin
                          ? 'Administrador'
                          : user.role == UserRole.brechoOwner
                              ? 'Dono de Brechó (Lojista)'
                              : 'Cliente',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        color: BreshopColors.black,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 24),

            // Wallet Section
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: BreshopColors.black,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.account_balance_wallet_outlined, color: BreshopColors.accentLime, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        'SALDO ATUAL',
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
                  Text(
                    '${user.balance.toStringAsFixed(0)} COINS',
                    style: const TextStyle(
                      color: BreshopColors.white,
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: _addCoins,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: BreshopColors.accentLime,
                      foregroundColor: BreshopColors.black,
                      minimumSize: const Size(double.infinity, 48),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text(
                      'ADICIONAR COINS (PIX)',
                      style: TextStyle(fontWeight: FontWeight.w900),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // Recent Transactions Title
            const Text(
              'Transações Recentes',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),

            // Transactions List
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _mockTransactions.length,
              itemBuilder: (context, index) {
                final tx = _mockTransactions[index];
                final bool isIncome = tx['type'] == 'in';

                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),

                  decoration: BoxDecoration(
                    color: BreshopColors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: BreshopColors.grey200),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            tx['title'],
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            tx['date'],
                            style: const TextStyle(color: BreshopColors.grey500, fontSize: 12),
                          ),
                        ],
                      ),
                      Text(
                        '${isIncome ? '+' : ''}${tx['amount'].toStringAsFixed(0)} C',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: isIncome ? BreshopColors.success : BreshopColors.error,
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
