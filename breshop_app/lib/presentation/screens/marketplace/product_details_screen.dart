import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../core/theme/colors.dart';
import '../../../domain/entities/product.dart';
import '../../../application/providers/auth_provider.dart';

class ProductDetailsScreen extends ConsumerStatefulWidget {
  final Product product;

  const ProductDetailsScreen({super.key, required this.product});

  @override
  ConsumerState<ProductDetailsScreen> createState() => _ProductDetailsScreenState();
}

class _ProductDetailsScreenState extends ConsumerState<ProductDetailsScreen> {
  bool _isLoading = false;

  void _handlePurchase() async {
    final user = ref.read(authProvider).user;
    if (user == null) {
      context.push('/login');
      return;
    }

    if (user.balance < widget.product.price) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Saldo Insuficiente'),
          content: const Text('Você não tem Coins suficientes para comprar esta peça. Recarregue sua carteira no Meu Perfil!'),
          actions: [
            TextButton(
              onPressed: () => context.pop(),
              child: const Text('FECHAR'),
            ),
            ElevatedButton(
              onPressed: () {
                context.pop();
                context.push('/profile');
              },
              child: const Text('IR PARA PERFIL'),
            ),
          ],
        ),
      );
      return;
    }

    setState(() => _isLoading = true);
    await Future.delayed(const Duration(milliseconds: 800)); // Simulando API
    setState(() => _isLoading = false);

    if (mounted) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => AlertDialog(
          title: const Text('🎉 Compra Realizada!'),
          content: Text('Sua reserva para "${widget.product.name}" foi concluída com sucesso!'),
          actions: [
            ElevatedButton(
              onPressed: () {
                context.pop();
                context.pop(); // Volta pro marketplace
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: BreshopColors.accentLime,
                foregroundColor: BreshopColors.black,
              ),
              child: const Text('VOLTAR AO INÍCIO'),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final product = widget.product;

    return Scaffold(
      backgroundColor: BreshopColors.white,
      body: CustomScrollView(
        slivers: [
          // Hero Image / App Bar
          SliverAppBar(
            expandedHeight: 400,
            pinned: true,
            backgroundColor: BreshopColors.black,
            flexibleSpace: FlexibleSpaceBar(
              background: Hero(
                tag: 'product_image_${product.id}',
                child: CachedNetworkImage(
                  imageUrl: product.images.first,
                  fit: BoxFit.cover,
                  placeholder: (ctx, url) => Container(color: BreshopColors.grey100),
                ),
              ),
            ),
            leading: IconButton(
              icon: const Icon(Icons.arrow_back, color: BreshopColors.white),
              onPressed: () => Navigator.pop(context),
            ),
          ),

          // Product Info
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        product.category.toUpperCase(),
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: BreshopColors.grey500,
                          letterSpacing: 1.2,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: BreshopColors.accentLime,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          product.condition.name.toUpperCase(),
                          style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                            color: BreshopColors.black,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    product.name,
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.w900,
                      fontFamily: 'Serif',
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'R\$ ${product.price.toStringAsFixed(2).replaceAll('.', ',')}',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w700,
                      color: BreshopColors.black,
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'DESCRIÇÃO',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: BreshopColors.grey900,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    product.description,
                    style: const TextStyle(
                      fontSize: 16,
                      color: BreshopColors.grey700,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      _InfoTile(label: 'TAMANHO', value: product.size),
                      const SizedBox(width: 48),
                      _InfoTile(label: 'CONDIÇÃO', value: product.condition.name),
                    ],
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: BreshopColors.white,
          boxShadow: [
            BoxShadow(
              color: BreshopColors.black.withAlpha(10),
              blurRadius: 10,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: ElevatedButton(
          onPressed: _isLoading ? null : _handlePurchase,
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 16),
          ),
          child: _isLoading
              ? const SizedBox(
                  height: 20,
                  width: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: BreshopColors.white,
                  ),
                )
              : const Text('COMPRAR AGORA'),
        ),
      ),
    );
  }
}

class _InfoTile extends StatelessWidget {
  final String label;
  final String value;

  const _InfoTile({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w700,
            color: BreshopColors.grey500,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value.toUpperCase(),
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: BreshopColors.black,
          ),
        ),
      ],
    );
  }
}
