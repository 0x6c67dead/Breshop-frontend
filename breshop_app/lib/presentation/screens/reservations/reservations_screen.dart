import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/colors.dart';
import '../../../domain/entities/order.dart';
import '../../../application/providers/orders_provider.dart';
import '../../../application/providers/auth_provider.dart';
import '../../widgets/common/skeleton_loader.dart';
import '../../widgets/common/item_image.dart';

class ReservationsScreen extends ConsumerWidget {
  const ReservationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(myOrdersProvider);
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
          'MINHAS RESERVAS',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w900,
            letterSpacing: 1.0,
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_outlined),
            onPressed: () => ref.read(myOrdersProvider.notifier).fetchOrders(),
          ),
        ],
      ),
      body: state.isLoading
          ? ListView.builder(
              padding: const EdgeInsets.all(24),
              itemCount: 4,
              itemBuilder: (_, __) => const OrderCardSkeleton(),
            )
          : state.orders.isEmpty
              ? _buildEmpty(context)
              : ListView.builder(
                  padding: const EdgeInsets.all(24),
                  itemCount: state.orders.length,
                  itemBuilder: (context, index) {
                    return _OrderCard(order: state.orders[index]);
                  },
                ),
    );
  }

  Widget _buildEmpty(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.shopping_bag_outlined,
            size: 80,
            color: BreshopColors.grey300,
          ),
          const SizedBox(height: 16),
          const Text(
            'Nenhuma reserva ativa',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: BreshopColors.grey600,
            ),
          ),
          const SizedBox(height: 8),
          TextButton(
            onPressed: () => context.pop(),
            child: const Text('Explorar Marketplace'),
          ),
        ],
      ),
    );
  }
}

class _OrderCard extends ConsumerWidget {
  final Order order;

  const _OrderCard({required this.order});

  Color get _statusColor {
    return switch (order.status) {
      OrderStatus.reserved => BreshopColors.warning,
      OrderStatus.approved || OrderStatus.awaitingDelivery => BreshopColors.info,
      OrderStatus.completed => BreshopColors.success,
      OrderStatus.rejected || OrderStatus.cancelled => BreshopColors.error,
      _ => BreshopColors.grey500,
    };
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final item = order.item;

    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        color: BreshopColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: BreshopColors.foreground, width: 1.5),
        boxShadow: const [
          BoxShadow(
            color: BreshopColors.foreground,
            offset: Offset(2, 2),
            blurRadius: 0,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Status bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: _statusColor.withAlpha(30),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(14)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'PEDIDO #${order.id.substring(0, 8).toUpperCase()}',
                  style: const TextStyle(
                    fontWeight: FontWeight.w900,
                    fontSize: 11,
                    letterSpacing: 0.5,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: _statusColor,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    order.status.label.toUpperCase(),
                    style: const TextStyle(
                      color: BreshopColors.white,
                      fontSize: 9,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Info do item
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                SizedBox(
                  width: 72,
                  height: 72,
                  child: ItemImage(
                    itemId: item?.id ?? order.id,
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item?.title ?? 'Item',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      if (item?.brecho != null) ...[
                        const SizedBox(height: 4),
                        Text(
                          item!.brecho!.name,
                          style: const TextStyle(
                            color: BreshopColors.grey500,
                            fontSize: 13,
                          ),
                        ),
                      ],
                      const SizedBox(height: 8),
                      Text(
                        '${order.total} COINS',
                        style: const TextStyle(
                          fontWeight: FontWeight.w900,
                          fontSize: 16,
                          color: BreshopColors.foreground,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Rodapé
          const Divider(color: BreshopColors.grey200, height: 1),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      _formatDate(order.createdAt),
                      style: const TextStyle(
                        color: BreshopColors.grey500,
                        fontSize: 11,
                      ),
                    ),
                    if (order.status == OrderStatus.rejected &&
                        order.rejectionReason != null)
                      Text(
                        order.rejectionReason!.label,
                        style: const TextStyle(
                          color: BreshopColors.error,
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                  ],
                ),
                if (order.status == OrderStatus.approved ||
                    order.status == OrderStatus.awaitingDelivery) ...[
                  const SizedBox(height: 10),
                  _ConfirmDeliveryButton(orderId: order.id),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
  }
}

class _ConfirmDeliveryButton extends ConsumerStatefulWidget {
  final String orderId;

  const _ConfirmDeliveryButton({required this.orderId});

  @override
  ConsumerState<_ConfirmDeliveryButton> createState() =>
      _ConfirmDeliveryButtonState();
}

class _ConfirmDeliveryButtonState
    extends ConsumerState<_ConfirmDeliveryButton> {
  bool _loading = false;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      onPressed: _loading ? null : _confirm,
      style: ElevatedButton.styleFrom(
        backgroundColor: BreshopColors.success,
        foregroundColor: BreshopColors.white,
        padding: const EdgeInsets.symmetric(vertical: 10),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
      icon: _loading
          ? const SizedBox(
              width: 16,
              height: 16,
              child: CircularProgressIndicator(
                  strokeWidth: 2, color: BreshopColors.white),
            )
          : const Icon(Icons.check_circle_outline, size: 18),
      label: const Text(
        'CONFIRMAR RECEBIMENTO',
        style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 0.5),
      ),
    );
  }

  Future<void> _confirm() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Confirmar Recebimento'),
        content: const Text(
          'Você confirma que recebeu o item? Esta ação libera os Coins para o vendedor e não pode ser desfeita.',
        ),
        actions: [
          TextButton(
            onPressed: () => ctx.pop(false),
            child: const Text('CANCELAR'),
          ),
          ElevatedButton(
            onPressed: () => ctx.pop(true),
            style: ElevatedButton.styleFrom(
              backgroundColor: BreshopColors.success,
            ),
            child: const Text('CONFIRMAR'),
          ),
        ],
      ),
    );

    if (confirmed != true || !mounted) return;

    setState(() => _loading = true);
    final ok =
        await ref.read(myOrdersProvider.notifier).confirmDelivery(widget.orderId);
    if (!mounted) return;
    setState(() => _loading = false);

    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(ok
          ? 'Recebimento confirmado! Coins liberados para o vendedor.'
          : 'Erro ao confirmar recebimento.'),
      backgroundColor: ok ? BreshopColors.success : BreshopColors.error,
    ));
  }
}
