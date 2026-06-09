import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/colors.dart';
import '../../../domain/entities/item.dart';
import '../../../application/providers/auth_provider.dart';
import '../../../application/providers/orders_provider.dart';
import '../../../application/providers/favorites_provider.dart';
import '../../../application/providers/items_provider.dart';
import '../../widgets/common/item_image.dart';

class ItemDetailsScreen extends ConsumerStatefulWidget {
  final String itemId;

  const ItemDetailsScreen({super.key, required this.itemId});

  @override
  ConsumerState<ItemDetailsScreen> createState() => _ItemDetailsScreenState();
}

class _ItemDetailsScreenState extends ConsumerState<ItemDetailsScreen> {
  Item? _item;
  bool _isReserving = false;
  bool _isFetching = true;

  @override
  void initState() {
    super.initState();
    _loadItem();
  }

  void _loadItem() {
    final cached = ref
        .read(itemsProvider)
        .items
        .where((i) => i.id == widget.itemId)
        .firstOrNull;
    setState(() {
      _item = cached;
      _isFetching = false;
    });
  }

  Future<void> _handleReserve() async {
    final user = ref.read(authProvider).user;
    if (user == null) {
      context.push('/login');
      return;
    }
    if (_item == null) return;

    if (user.balance < _item!.price) {
      _showInsufficientFundsDialog();
      return;
    }

    setState(() => _isReserving = true);
    await ref.read(myOrdersProvider.notifier).reserve(_item!.id);
    setState(() => _isReserving = false);

    final error = ref.read(myOrdersProvider).error;
    if (!mounted) return;

    if (error != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(error), backgroundColor: BreshopColors.error),
      );
    } else {
      _showSuccessDialog();
    }
  }

  void _showInsufficientFundsDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Saldo Insuficiente'),
        content: const Text(
          'Você não tem Coins suficientes. Recarregue sua carteira no Meu Perfil!',
        ),
        actions: [
          TextButton(onPressed: () => ctx.pop(), child: const Text('FECHAR')),
          ElevatedButton(
            onPressed: () {
              ctx.pop();
              context.push('/profile');
            },
            child: const Text('IR PARA PERFIL'),
          ),
        ],
      ),
    );
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        title: const Text('Reserva Realizada!'),
        content: Text(
          'Sua reserva para "${_item!.title}" foi criada!\nAguarde a aprovação da loja.',
        ),
        actions: [
          ElevatedButton(
            onPressed: () {
              ctx.pop();
              context.go('/');
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: BreshopColors.accentLime,
              foregroundColor: BreshopColors.foreground,
            ),
            child: const Text('VOLTAR AO INÍCIO'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isFetching) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (_item == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: Text('Item não encontrado.')),
      );
    }

    final item = _item!;
    final isFav = ref.watch(favoritesProvider).contains(item.id);
    final user = ref.watch(authProvider).user;
    final isAvailable = item.status == ItemStatus.available;

    return Scaffold(
      backgroundColor: BreshopColors.background,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 320,
            pinned: true,
            backgroundColor: BreshopColors.foreground,
            flexibleSpace: FlexibleSpaceBar(
              background: Hero(
                tag: 'item-image-${widget.itemId}',
                child: ItemImage(itemId: widget.itemId),
              ),
            ),
            leading: IconButton(
              icon: const Icon(Icons.arrow_back, color: BreshopColors.white),
              onPressed: () => Navigator.pop(context),
            ),
            actions: [
              IconButton(
                icon: Icon(
                  isFav ? Icons.favorite : Icons.favorite_border,
                  color: isFav ? BreshopColors.accentOrange : BreshopColors.white,
                ),
                onPressed: () => ref.read(favoritesProvider.notifier).toggle(item.id),
              ),
            ],
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Tags
                  if (item.tags.isNotEmpty)
                    Wrap(
                      spacing: 8,
                      runSpacing: 6,
                      children: item.tags.map((tag) {
                        return Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: BreshopColors.accentLime,
                            borderRadius: BorderRadius.circular(9999),
                            border: Border.all(color: BreshopColors.foreground),
                          ),
                          child: Text(
                            tag.name.toUpperCase(),
                            style: const TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              color: BreshopColors.foreground,
                              letterSpacing: 0.8,
                            ),
                          ),
                        );
                      }).toList(),
                    ),

                  const SizedBox(height: 16),
                  Text(item.title, style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(height: 12),

                  // Price
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Text(
                        '${item.price}',
                        style: const TextStyle(
                          fontSize: 36,
                          fontWeight: FontWeight.w900,
                          color: BreshopColors.foreground,
                        ),
                      ),
                      const SizedBox(width: 6),
                      const Text(
                        'COINS',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: BreshopColors.grey500,
                          letterSpacing: 1.0,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),

                  // Brecho info
                  if (item.brecho != null)
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: BreshopColors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: BreshopColors.foreground),
                        boxShadow: const [
                          BoxShadow(
                            color: BreshopColors.foreground,
                            offset: Offset(2, 2),
                            blurRadius: 0,
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.store_outlined,
                            color: BreshopColors.foreground,
                            size: 20,
                          ),
                          const SizedBox(width: 12),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'VENDIDO POR',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w700,
                                  color: BreshopColors.grey500,
                                  letterSpacing: 1.0,
                                ),
                              ),
                              Text(
                                item.brecho!.name,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700,
                                  color: BreshopColors.foreground,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                  // Status badge
                  if (item.status != ItemStatus.available) ...[
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 10,
                      ),
                      decoration: BoxDecoration(
                        color: BreshopColors.grey100,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.info_outline,
                            size: 16,
                            color: BreshopColors.grey600,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            item.status.label,
                            style: const TextStyle(
                              color: BreshopColors.grey700,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],

                  // Saldo do usuário
                  if (user != null) ...[
                    const SizedBox(height: 16),
                    Text(
                      'Seu saldo: ${user.balance} Coins',
                      style: TextStyle(
                        color: user.balance >= item.price
                            ? BreshopColors.success
                            : BreshopColors.error,
                        fontWeight: FontWeight.w600,
                        fontSize: 13,
                      ),
                    ),
                  ],

                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: BreshopColors.white,
          border: Border(top: BorderSide(color: BreshopColors.grey200)),
        ),
        child: ElevatedButton(
          onPressed: isAvailable && !_isReserving ? _handleReserve : null,
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 16),
          ),
          child: _isReserving
              ? const SizedBox(
                  height: 20,
                  width: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: BreshopColors.white,
                  ),
                )
              : Text(
                  isAvailable ? 'RESERVAR AGORA' : 'INDISPONÍVEL',
                  style: const TextStyle(
                    fontWeight: FontWeight.w900,
                    letterSpacing: 0.5,
                  ),
                ),
        ),
      ),
    );
  }
}
