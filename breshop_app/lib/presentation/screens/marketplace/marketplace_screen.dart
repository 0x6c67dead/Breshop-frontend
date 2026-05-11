import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/colors.dart';
import '../../../domain/entities/product.dart';
import '../../widgets/common/product_card.dart';
import '../../widgets/common/breshop_search_bar.dart' as breshop;
import '../../widgets/common/category_filter.dart';

class MarketplaceScreen extends ConsumerStatefulWidget {
  const MarketplaceScreen({super.key});

  @override
  ConsumerState<MarketplaceScreen> createState() => _MarketplaceScreenState();
}

class _MarketplaceScreenState extends ConsumerState<MarketplaceScreen> {
  String selectedCategory = 'Tudo';
  final List<String> categories = ['Tudo', 'Camisetas', 'Calças', 'Vestidos', 'Acessórios', 'Calçados'];

  // Dummy products for initial UI verification
  final List<Product> dummyProducts = [
    Product(
      id: '1',
      name: 'Camiseta Vintage 90s',
      description: 'Camiseta em ótimo estado, algodão premium.',
      price: 89.90,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'],
      category: 'Camisetas',
      size: 'G',
      status: ProductStatus.disponivel,
      condition: ProductCondition.semiNovo,
      brechoId: 'brecho_1',
      createdAt: DateTime.now(),
    ),
    Product(
      id: '2',
      name: 'Calça Jeans Levi\'s 501',
      description: 'Clássica Levi\'s 501, leve desgaste natural.',
      price: 159.00,
      images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80'],
      category: 'Calças',
      size: '42',
      status: ProductStatus.disponivel,
      condition: ProductCondition.usado,
      brechoId: 'brecho_1',
      createdAt: DateTime.now(),
    ),
    Product(
      id: '3',
      name: 'Vestido Floral Verão',
      description: 'Vestido leve, perfeito para dias quentes.',
      price: 120.00,
      images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'],
      category: 'Vestidos',
      size: 'M',
      status: ProductStatus.disponivel,
      condition: ProductCondition.novo,
      brechoId: 'brecho_2',
      createdAt: DateTime.now(),
    ),
    Product(
      id: '4',
      name: 'Jaqueta Bomber Couro',
      description: 'Jaqueta estilosa, couro sintético de alta qualidade.',
      price: 299.90,
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'],
      category: 'Casacos',
      size: 'P',
      status: ProductStatus.disponivel,
      condition: ProductCondition.semiNovo,
      brechoId: 'brecho_3',
      createdAt: DateTime.now(),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: BreshopColors.background,
      body: CustomScrollView(
        slivers: [
          // Custom App Bar / Header
          SliverAppBar(
            floating: true,
            pinned: true,
            expandedHeight: 120,
            backgroundColor: BreshopColors.background,
            elevation: 0,
            surfaceTintColor: Colors.transparent,
            flexibleSpace: FlexibleSpaceBar(
              titlePadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              centerTitle: false,
              title: Text(
                'Marketplace',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  color: BreshopColors.foreground,
                  fontSize: 24,
                ),
              ),
            ),
          ),

          // Search and Filters
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                children: [
                  const breshop.SearchBar(),
                  const SizedBox(height: 16),
                  CategoryFilter(
                    categories: categories,
                    selectedCategory: selectedCategory,
                    onSelected: (cat) {
                      setState(() {
                        selectedCategory = cat;
                      });
                    },
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),

          // Product Grid
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            sliver: SliverMasonryGrid(
              gridDelegate: const SliverSimpleGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
              ),
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final product = dummyProducts[index];
                  return ProductCard(
                    product: product,
                    onTap: () {
                      context.push('/product-details', extra: product);
                    },
                  );
                },
                childCount: dummyProducts.length,
              ),
            ),
          ),
          
          const SliverToBoxAdapter(
            child: SizedBox(height: 100), // Espaço para não ficar atrás da bottom bar se houver
          ),
        ],
      ),
    );
  }
}
