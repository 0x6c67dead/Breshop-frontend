import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/colors.dart';
import '../../../domain/entities/order.dart';
import '../../../application/providers/auth_provider.dart';
import '../../../application/providers/orders_provider.dart';
import '../../../application/providers/wallet_provider.dart';
import '../../widgets/common/skeleton_loader.dart';
import '../../widgets/common/item_image.dart';

class ExtratoScreen extends ConsumerStatefulWidget {
  const ExtratoScreen({super.key});

  @override
  ConsumerState<ExtratoScreen> createState() => _ExtratoScreenState();
}

class _ExtratoScreenState extends ConsumerState<ExtratoScreen> {
  final _withdrawController = TextEditingController();
  bool _withdrawLoading = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(brechoOrdersProvider.notifier).fetchOrders(all: true);
      ref.read(walletProvider.notifier).fetchBalance();
    });
  }

  @override
  void dispose() {
    _withdrawController.dispose();
    super.dispose();
  }

  Future<void> _handleWithdraw() async {
    final amount = int.tryParse(_withdrawController.text);
    if (amount == null || amount <= 0) return;

    setState(() => _withdrawLoading = true);
    final ok = await ref.read(walletProvider.notifier).withdraw(amount);
    setState(() => _withdrawLoading = false);

    if (!mounted) return;

    if (ok) {
      _withdrawController.clear();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Saque realizado com sucesso!'),
          backgroundColor: BreshopColors.success,
        ),
      );
    } else {
      final error = ref.read(walletProvider).error;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(error ?? 'Erro ao realizar saque.'),
          backgroundColor: BreshopColors.error,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;
    final ordersState = ref.watch(brechoOrdersProvider);
    final walletState = ref.watch(walletProvider);

    if (user == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final pendingOrders = ordersState.orders
        .where((o) =>
            o.status == OrderStatus.reserved ||
            o.status == OrderStatus.approved)
        .toList();

    final totalEarned = walletState.wallet?.totalEarned ?? 0;
    final balance = walletState.wallet?.balance ?? 0;
    final withdrawAmount = int.tryParse(_withdrawController.text) ?? 0;

    return Scaffold(
      backgroundColor: BreshopColors.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'EXTRATO.',
          style: Theme.of(context)
              .textTheme
              .titleLarge
              ?.copyWith(fontSize: 22, letterSpacing: -0.5),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_outlined),
            onPressed: () {
              ref.read(brechoOrdersProvider.notifier).fetchOrders(all: true);
              ref.read(walletProvider.notifier).fetchBalance();
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Subtítulo
                  Text(
                    'Histórico completo de vendas · ${user.name}',
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: BreshopColors.grey500,
                      letterSpacing: 0.5,
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Stats
                  Row(
                    children: [
                      Expanded(
                        child: _StatCard(
                          label: 'TOTAL GANHO',
                          value: 'C\$ $totalEarned',
                          sub: 'Pedidos concluídos',
                          valueColor: BreshopColors.success,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _StatCard(
                          label: 'SALDO DISPONÍVEL',
                          value: 'C\$ $balance',
                          sub: 'Pronto para sacar',
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  _StatCard(
                    label: 'EM ANDAMENTO',
                    value: '${pendingOrders.length}',
                    sub: 'Reservas ativas',
                    valueColor: BreshopColors.warning,
                    horizontal: true,
                  ),

                  const SizedBox(height: 24),

                  // Saque
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: BreshopColors.foreground,
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Sacar Coins',
                          style: Theme.of(context)
                              .textTheme
                              .titleLarge
                              ?.copyWith(
                                fontSize: 24,
                                color: BreshopColors.white,
                              ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Saldo disponível: C\$ $balance',
                          style: const TextStyle(
                            fontSize: 11,
                            color: BreshopColors.grey400,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 20),
                        Row(
                          children: [
                            Expanded(
                              child: TextField(
                                controller: _withdrawController,
                                keyboardType: TextInputType.number,
                                style: const TextStyle(color: BreshopColors.white),
                                onChanged: (_) => setState(() {}),
                                decoration: InputDecoration(
                                  hintText: 'Valor em Coins',
                                  hintStyle: const TextStyle(
                                    color: BreshopColors.grey500,
                                  ),
                                  filled: true,
                                  fillColor: BreshopColors.white.withAlpha(20),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(9999),
                                    borderSide: BorderSide(
                                      color: BreshopColors.white.withAlpha(40),
                                    ),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(9999),
                                    borderSide: BorderSide(
                                      color: BreshopColors.white.withAlpha(40),
                                    ),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(9999),
                                    borderSide: const BorderSide(
                                      color: BreshopColors.accentLime,
                                      width: 2,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            ElevatedButton(
                              onPressed: (_withdrawLoading ||
                                      withdrawAmount <= 0 ||
                                      withdrawAmount > balance)
                                  ? null
                                  : _handleWithdraw,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: BreshopColors.white,
                                foregroundColor: BreshopColors.foreground,
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 20,
                                  vertical: 16,
                                ),
                              ),
                              child: _withdrawLoading
                                  ? const SizedBox(
                                      height: 18,
                                      width: 18,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                      ),
                                    )
                                  : const Text(
                                      'SACAR',
                                      style: TextStyle(
                                        fontWeight: FontWeight.w900,
                                        letterSpacing: 0.5,
                                      ),
                                    ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 28),

                  // Histórico de vendas
                  Text(
                    'Histórico de Vendas.',
                    style: Theme.of(context)
                        .textTheme
                        .titleLarge
                        ?.copyWith(fontSize: 26),
                  ),
                  const SizedBox(height: 16),

                  if (ordersState.isLoading)
                    Container(
                      decoration: BoxDecoration(
                        color: BreshopColors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: BreshopColors.grey200),
                      ),
                      child: Column(
                        children: List.generate(
                          4,
                          (i) => Column(
                            children: [
                              const ExtratoRowSkeleton(),
                              if (i < 3)
                                const Divider(
                                  height: 1,
                                  color: BreshopColors.grey100,
                                ),
                            ],
                          ),
                        ),
                      ),
                    )
                  else if (ordersState.orders.isEmpty)
                    Container(
                      padding: const EdgeInsets.all(40),
                      decoration: BoxDecoration(
                        color: BreshopColors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: BreshopColors.grey200),
                      ),
                      child: const Center(
                        child: Text(
                          'Nenhuma venda ainda.',
                          style: TextStyle(
                            color: BreshopColors.grey400,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    )
                  else
                    Container(
                      decoration: BoxDecoration(
                        color: BreshopColors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: BreshopColors.grey200),
                        boxShadow: const [
                          BoxShadow(
                            color: BreshopColors.foreground,
                            offset: Offset(2, 2),
                            blurRadius: 0,
                          ),
                        ],
                      ),
                      child: ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: ordersState.orders.length,
                        separatorBuilder: (_, __) => const Divider(
                          height: 1,
                          color: BreshopColors.grey100,
                        ),
                        itemBuilder: (ctx, i) =>
                            _OrderRow(order: ordersState.orders[i]),
                      ),
                    ),

                  const SizedBox(height: 40),
                ],
              ),
            ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final String sub;
  final Color valueColor;
  final bool horizontal;

  const _StatCard({
    required this.label,
    required this.value,
    required this.sub,
    this.valueColor = BreshopColors.foreground,
    this.horizontal = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: BreshopColors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: BreshopColors.grey200),
      ),
      child: horizontal
          ? Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      label,
                      style: const TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.w900,
                        color: BreshopColors.grey400,
                        letterSpacing: 1.0,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      sub,
                      style: const TextStyle(
                        fontSize: 11,
                        color: BreshopColors.grey500,
                      ),
                    ),
                  ],
                ),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w900,
                    fontStyle: FontStyle.italic,
                    color: valueColor,
                  ),
                ),
              ],
            )
          : Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.w900,
                    color: BreshopColors.grey400,
                    letterSpacing: 1.0,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.w900,
                    fontStyle: FontStyle.italic,
                    color: valueColor,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  sub,
                  style: const TextStyle(
                    fontSize: 10,
                    color: BreshopColors.grey400,
                  ),
                ),
              ],
            ),
    );
  }
}

class _OrderRow extends StatelessWidget {
  final Order order;

  const _OrderRow({required this.order});

  Color get _statusColor {
    return switch (order.status) {
      OrderStatus.completed => BreshopColors.success,
      OrderStatus.rejected || OrderStatus.cancelled => BreshopColors.error,
      OrderStatus.approved || OrderStatus.awaitingDelivery => BreshopColors.info,
      _ => BreshopColors.warning,
    };
  }

  IconData get _statusIcon {
    return switch (order.status) {
      OrderStatus.completed => Icons.check_circle_outline,
      OrderStatus.rejected || OrderStatus.cancelled => Icons.cancel_outlined,
      OrderStatus.approved => Icons.thumb_up_outlined,
      _ => Icons.schedule_outlined,
    };
  }

  @override
  Widget build(BuildContext context) {
    final date = _formatDate(order.createdAt);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        children: [
          SizedBox(
            width: 44,
            height: 52,
            child: ItemImage(
              itemId: order.item?.id ?? order.id,
              borderRadius: BorderRadius.circular(10),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  order.item?.title ?? 'Peça',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: BreshopColors.foreground,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                if (order.user != null)
                  Text(
                    order.user!.name,
                    style: const TextStyle(
                      fontSize: 11,
                      color: BreshopColors.grey500,
                    ),
                  ),
                Text(
                  date,
                  style: const TextStyle(
                    fontSize: 10,
                    color: BreshopColors.grey400,
                  ),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${order.total} C',
                style: const TextStyle(
                  fontWeight: FontWeight.w900,
                  fontSize: 16,
                  fontStyle: FontStyle.italic,
                  color: BreshopColors.foreground,
                ),
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  Icon(_statusIcon, size: 11, color: _statusColor),
                  const SizedBox(width: 4),
                  Text(
                    order.status.label.toUpperCase(),
                    style: TextStyle(
                      fontSize: 9,
                      fontWeight: FontWeight.w900,
                      color: _statusColor,
                      letterSpacing: 0.5,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime d) {
    const months = [
      'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
      'jul', 'ago', 'set', 'out', 'nov', 'dez',
    ];
    return '${d.day.toString().padLeft(2, '0')} ${months[d.month - 1]} ${d.year}';
  }
}
