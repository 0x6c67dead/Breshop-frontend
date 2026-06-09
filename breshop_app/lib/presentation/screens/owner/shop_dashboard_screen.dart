import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/colors.dart';
import '../../../domain/entities/order.dart';
import '../../../domain/entities/item.dart';
import '../../../application/providers/orders_provider.dart';
import '../../../application/providers/items_provider.dart';
import '../../../application/providers/auth_provider.dart';
import '../../widgets/common/item_image.dart';

class ShopDashboardScreen extends ConsumerStatefulWidget {
  const ShopDashboardScreen({super.key});

  @override
  ConsumerState<ShopDashboardScreen> createState() =>
      _ShopDashboardScreenState();
}

class _ShopDashboardScreenState extends ConsumerState<ShopDashboardScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadData();
  }

  void _loadData() {
    final user = ref.read(authProvider).user;
    if (user?.brechoId != null) {
      ref.read(itemsProvider.notifier).fetchBrechoItems(user!.brechoId!);
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _approveOrder(String orderId) async {
    final ok = await ref.read(brechoOrdersProvider.notifier).approve(orderId);
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(ok ? 'Reserva aprovada!' : 'Erro ao aprovar.'),
        backgroundColor: ok ? BreshopColors.success : BreshopColors.error,
      ),
    );
  }

  void _rejectOrder(String orderId) {
    RejectionReason selectedReason = RejectionReason.itemAlreadySold;
    RejectionAction selectedAction = RejectionAction.returnToStore;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setS) => AlertDialog(
          title: const Text('Rejeitar Reserva'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Motivo:',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 8),
              ...RejectionReason.values.map((r) => RadioListTile<RejectionReason>(
                    value: r,
                    groupValue: selectedReason,
                    title: Text(r.label, style: const TextStyle(fontSize: 13)),
                    dense: true,
                    onChanged: (v) => setS(() => selectedReason = v!),
                  )),
              const SizedBox(height: 8),
              const Text('Ação:',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 8),
              ...RejectionAction.values.map((a) => RadioListTile<RejectionAction>(
                    value: a,
                    groupValue: selectedAction,
                    title: Text(a.label, style: const TextStyle(fontSize: 13)),
                    dense: true,
                    onChanged: (v) => setS(() => selectedAction = v!),
                  )),
            ],
          ),
          actions: [
            TextButton(onPressed: () => ctx.pop(), child: const Text('CANCELAR')),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: BreshopColors.error),
              onPressed: () async {
                ctx.pop();
                final ok = await ref.read(brechoOrdersProvider.notifier).reject(
                      orderId,
                      selectedReason,
                      selectedAction,
                    );
                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(ok ? 'Reserva rejeitada.' : 'Erro ao rejeitar.'),
                    backgroundColor: ok ? BreshopColors.warning : BreshopColors.error,
                  ),
                );
              },
              child: const Text('REJEITAR'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: BreshopColors.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'MEU BRECHÓ',
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 1.0),
        ),
        centerTitle: true,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: BreshopColors.foreground,
          labelColor: BreshopColors.foreground,
          unselectedLabelColor: BreshopColors.grey500,
          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
          tabs: const [
            Tab(text: 'Inventário'),
            Tab(text: 'Reservas Recebidas'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _InventoryTab(onRefresh: _loadData),
          _OrdersTab(
            onApprove: _approveOrder,
            onReject: _rejectOrder,
          ),
        ],
      ),
    );
  }
}

class _InventoryTab extends ConsumerWidget {
  final VoidCallback onRefresh;

  const _InventoryTab({required this.onRefresh});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(itemsProvider);
    final available = state.items.where((i) => i.status == ItemStatus.available).length;
    final total = state.items.length;

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              Expanded(
                child: _StatCard(
                  title: 'Disponíveis',
                  value: '$available',
                  icon: Icons.checkroom_outlined,
                  color: BreshopColors.foreground,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _StatCard(
                  title: 'Total de Peças',
                  value: '$total',
                  icon: Icons.inventory_2_outlined,
                  color: BreshopColors.info,
                ),
              ),
            ],
          ),
        ),
        const Divider(height: 1, color: BreshopColors.grey200),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          child: Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => context.push('/add-item'),
                  icon: const Icon(Icons.add),
                  label: const Text('NOVA PEÇA'),
                ),
              ),
              const SizedBox(width: 12),
              IconButton(
                onPressed: onRefresh,
                icon: const Icon(Icons.refresh_outlined),
              ),
            ],
          ),
        ),
        Expanded(
          child: state.isLoading
              ? const Center(child: CircularProgressIndicator())
              : state.items.isEmpty
                  ? const Center(
                      child: Text(
                        'Nenhuma peça cadastrada',
                        style: TextStyle(color: BreshopColors.grey500),
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      itemCount: state.items.length,
                      itemBuilder: (ctx, i) => _ItemTile(item: state.items[i]),
                    ),
        ),
      ],
    );
  }
}

class _ItemTile extends StatelessWidget {
  final Item item;

  const _ItemTile({required this.item});

  @override
  Widget build(BuildContext context) {
    final isAvail = item.status == ItemStatus.available;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: BreshopColors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: BreshopColors.grey200),
      ),
      child: Row(
        children: [
          SizedBox(
            width: 56,
            height: 56,
            child: ItemImage(
              itemId: item.id,
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.title,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                ),
                const SizedBox(height: 4),
                Text(
                  '${item.price} COINS',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: BreshopColors.grey600,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: isAvail
                  ? BreshopColors.success.withAlpha(30)
                  : BreshopColors.grey100,
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(
              item.status.label,
              style: TextStyle(
                color: isAvail ? BreshopColors.success : BreshopColors.grey600,
                fontSize: 10,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _OrdersTab extends ConsumerWidget {
  final void Function(String) onApprove;
  final void Function(String) onReject;

  const _OrdersTab({required this.onApprove, required this.onReject});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(brechoOrdersProvider);

    if (state.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state.orders.isEmpty) {
      return const Center(
        child: Text(
          'Nenhuma reserva recebida.',
          style: TextStyle(color: BreshopColors.grey500),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: state.orders.length,
      itemBuilder: (ctx, i) => _BrechoOrderCard(
        order: state.orders[i],
        onApprove: onApprove,
        onReject: onReject,
      ),
    );
  }
}

class _BrechoOrderCard extends StatelessWidget {
  final Order order;
  final void Function(String) onApprove;
  final void Function(String) onReject;

  const _BrechoOrderCard({
    required this.order,
    required this.onApprove,
    required this.onReject,
  });

  @override
  Widget build(BuildContext context) {
    final isPending = order.status == OrderStatus.reserved;

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      color: BreshopColors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: BreshopColors.grey200),
      ),
      elevation: 0,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  order.status.label.toUpperCase(),
                  style: TextStyle(
                    color: isPending ? BreshopColors.info : BreshopColors.grey500,
                    fontWeight: FontWeight.bold,
                    fontSize: 11,
                    letterSpacing: 0.5,
                  ),
                ),
                Text(
                  _formatDate(order.createdAt),
                  style: const TextStyle(
                    color: BreshopColors.grey500,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              order.item?.title ?? 'Peça',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            if (order.user != null) ...[
              Row(
                children: [
                  const Icon(Icons.person_outline, size: 16, color: BreshopColors.grey500),
                  const SizedBox(width: 8),
                  Text(
                    order.user!.name,
                    style: const TextStyle(color: BreshopColors.grey700),
                  ),
                ],
              ),
              const SizedBox(height: 4),
            ],
            Row(
              children: [
                const Icon(Icons.account_balance_wallet_outlined,
                    size: 16, color: BreshopColors.grey500),
                const SizedBox(width: 8),
                Text(
                  '${order.total} COINS',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ],
            ),
            if (isPending) ...[
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => onReject(order.id),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: BreshopColors.error,
                        side: const BorderSide(color: BreshopColors.error),
                      ),
                      child: const Text('REJEITAR'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => onApprove(order.id),
                      child: const Text('APROVAR'),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime d) =>
      '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year}';
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;

  const _StatCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: BreshopColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: BreshopColors.grey200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: BreshopColors.grey500),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(
                  color: BreshopColors.grey600,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w900,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}
