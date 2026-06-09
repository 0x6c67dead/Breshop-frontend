import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/colors.dart';
import '../../../domain/entities/item.dart';
import '../../../application/providers/favorites_provider.dart';
import '../../../application/providers/items_provider.dart';
import '../../../application/providers/orders_provider.dart';
import '../../../application/providers/auth_provider.dart';
import '../../widgets/common/item_image.dart';

class CartScreen extends ConsumerStatefulWidget {
  const CartScreen({super.key});

  @override
  ConsumerState<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends ConsumerState<CartScreen> {
  bool _checkoutLoading = false;

  List<Item> _getCartItems(WidgetRef ref) {
    final favorites = ref.watch(favoritesProvider);
    final allItems = ref.watch(itemsProvider).items;
    return allItems
        .where((item) =>
            favorites.contains(item.id) && item.status == ItemStatus.available)
        .toList();
  }

  Future<void> _handleCheckout() async {
    final user = ref.read(authProvider).user;
    if (user == null) {
      context.push('/login');
      return;
    }

    final cartItems = _getCartItems(ref);
    if (cartItems.isEmpty) return;

    final subtotal = cartItems.fold(0, (sum, item) => sum + item.price);

    if (user.balance < subtotal) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Saldo insuficiente. Você tem ${user.balance} Coins, precisa de $subtotal Coins.',
          ),
          backgroundColor: BreshopColors.error,
        ),
      );
      return;
    }

    setState(() => _checkoutLoading = true);
    int success = 0;

    for (final item in cartItems) {
      await ref.read(myOrdersProvider.notifier).reserve(item.id);
      final error = ref.read(myOrdersProvider).error;
      if (error == null) {
        ref.read(favoritesProvider.notifier).toggle(item.id);
        success++;
      }
    }

    setState(() => _checkoutLoading = false);

    if (!mounted) return;

    if (success > 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            '$success ${success > 1 ? "peças reservadas" : "peça reservada"}! Aguardando aprovação dos brechós.',
          ),
          backgroundColor: BreshopColors.success,
        ),
      );
      context.go('/reservations');
    }
  }

  @override
  Widget build(BuildContext context) {
    final cartItems = _getCartItems(ref);
    final user = ref.watch(authProvider).user;
    final subtotal = cartItems.fold(0, (sum, item) => sum + item.price);
    final hasBalance = user != null && user.balance >= subtotal;

    return Scaffold(
      backgroundColor: BreshopColors.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'YOUR BAG.',
          style: Theme.of(context)
              .textTheme
              .titleLarge
              ?.copyWith(fontSize: 22, letterSpacing: -0.5),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Center(
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: BreshopColors.white,
                  borderRadius: BorderRadius.circular(9999),
                  border: Border.all(color: BreshopColors.grey200),
                ),
                child: Text(
                  '${cartItems.length} ${cartItems.length == 1 ? "item" : "itens"}',
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                    color: BreshopColors.foreground,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
      body: cartItems.isEmpty
          ? _buildEmpty(context)
          : Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.all(20),
                    itemCount: cartItems.length,
                    itemBuilder: (ctx, i) => _CartItemCard(item: cartItems[i]),
                  ),
                ),
                _buildSummary(context, subtotal, user?.balance ?? 0, hasBalance),
              ],
            ),
    );
  }

  Widget _buildEmpty(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.shopping_bag_outlined,
              size: 80,
              color: BreshopColors.grey200,
            ),
            const SizedBox(height: 20),
            Text(
              'Seu carrinho está vazio.',
              style: Theme.of(context)
                  .textTheme
                  .titleLarge
                  ?.copyWith(fontSize: 22),
            ),
            const SizedBox(height: 8),
            const Text(
              'Adicione peças aos favoritos para reservar aqui.',
              style: TextStyle(color: BreshopColors.grey500),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => context.go('/'),
              child: const Text('EXPLORAR PEÇAS'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummary(
      BuildContext context, int subtotal, int balance, bool hasBalance) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: BreshopColors.white,
        border: Border(top: BorderSide(color: BreshopColors.grey200)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'SUBTOTAL',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w900,
                  color: BreshopColors.grey500,
                  letterSpacing: 1.0,
                ),
              ),
              Text(
                '$subtotal COINS',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                  fontStyle: FontStyle.italic,
                  color: BreshopColors.foreground,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'SEU SALDO',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w900,
                  color: BreshopColors.grey500,
                  letterSpacing: 1.0,
                ),
              ),
              Text(
                '$balance COINS',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: hasBalance
                      ? BreshopColors.success
                      : BreshopColors.error,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed:
                  _checkoutLoading || !hasBalance ? null : _handleCheckout,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: _checkoutLoading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: BreshopColors.white,
                      ),
                    )
                  : const Text(
                      'FINALIZAR RESERVA',
                      style: TextStyle(
                        fontWeight: FontWeight.w900,
                        letterSpacing: 0.5,
                      ),
                    ),
            ),
          ),
          const SizedBox(height: 8),
          const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.shield_outlined, size: 14, color: BreshopColors.grey400),
              SizedBox(width: 6),
              Text(
                'PROTEÇÃO AO COMPRADOR BRESHOP',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  color: BreshopColors.grey400,
                  letterSpacing: 0.8,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _CartItemCard extends ConsumerWidget {
  final Item item;

  const _CartItemCard({required this.item});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: BreshopColors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: BreshopColors.grey200),
        boxShadow: [
          BoxShadow(
            color: BreshopColors.black.withAlpha(5),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          SizedBox(
            width: 80,
            height: 96,
            child: ItemImage(
              itemId: item.id,
              borderRadius: BorderRadius.circular(16),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (item.brecho != null)
                  Text(
                    item.brecho!.name.toUpperCase(),
                    style: const TextStyle(
                      fontSize: 9,
                      fontWeight: FontWeight.w900,
                      color: BreshopColors.grey400,
                      letterSpacing: 1.2,
                    ),
                  ),
                const SizedBox(height: 4),
                Text(
                  item.title,
                  style: Theme.of(context)
                      .textTheme
                      .titleLarge
                      ?.copyWith(fontSize: 18),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                if (item.tags.isNotEmpty)
                  Wrap(
                    spacing: 4,
                    children: item.tags.take(2).map((t) {
                      return Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 3,
                        ),
                        decoration: BoxDecoration(
                          color: BreshopColors.tactileLight,
                          borderRadius: BorderRadius.circular(9999),
                        ),
                        child: Text(
                          t.name.toUpperCase(),
                          style: const TextStyle(
                            fontSize: 9,
                            fontWeight: FontWeight.w700,
                            color: BreshopColors.grey600,
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                const SizedBox(height: 8),
                Text(
                  '${item.price} COINS',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    fontStyle: FontStyle.italic,
                    color: BreshopColors.foreground,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () =>
                ref.read(favoritesProvider.notifier).toggle(item.id),
            icon: const Icon(Icons.close, color: BreshopColors.grey400),
          ),
        ],
      ),
    );
  }
}
