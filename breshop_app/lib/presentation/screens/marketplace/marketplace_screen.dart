import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/colors.dart';
import '../../../application/providers/items_provider.dart';
import '../../../application/providers/favorites_provider.dart';
import '../../widgets/common/product_card.dart';
import '../../widgets/common/breshop_search_bar.dart' as breshop;
import '../../widgets/common/category_filter.dart';
import '../../widgets/common/breshop_navigation_drawer.dart';
import '../../widgets/common/skeleton_loader.dart';

class MarketplaceScreen extends ConsumerStatefulWidget {
  const MarketplaceScreen({super.key});

  @override
  ConsumerState<MarketplaceScreen> createState() => _MarketplaceScreenState();
}

class _MarketplaceScreenState extends ConsumerState<MarketplaceScreen> {
  String _search = '';
  String _selectedCategory = 'Tudo';

  static const _categories = [
    'Tudo', 'Camisetas', 'Calças', 'Vestidos', 'Casacos', 'Acessórios', 'Calçados',
  ];

  @override
  Widget build(BuildContext context) {
    final itemsState = ref.watch(itemsProvider);
    final favorites = ref.watch(favoritesProvider);

    final filtered = itemsState.items.where((item) {
      final matchesSearch = _search.isEmpty ||
          item.title.toLowerCase().contains(_search.toLowerCase()) ||
          (item.brecho?.name.toLowerCase().contains(_search.toLowerCase()) ?? false);
      final matchesCategory = _selectedCategory == 'Tudo' ||
          item.tags.any((t) => t.name.toLowerCase() == _selectedCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    }).toList();

    return Scaffold(
      backgroundColor: BreshopColors.background,
      drawer: const BreshopNavigationDrawer(),
      body: NotificationListener<ScrollUpdateNotification>(
        onNotification: (notification) {
          if (notification.metrics.extentAfter < 400 &&
              !itemsState.isLoading &&
              itemsState.hasMore &&
              _search.isEmpty) {
            ref.read(itemsProvider.notifier).fetchNextPage();
          }
          return false;
        },
        child: CustomScrollView(
        slivers: [
          SliverAppBar(
            floating: true,
            pinned: true,
            expandedHeight: 100,
            backgroundColor: BreshopColors.background,
            elevation: 0,
            surfaceTintColor: Colors.transparent,
            flexibleSpace: FlexibleSpaceBar(
              titlePadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              centerTitle: false,
              title: Text(
                'Breshop',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(fontSize: 26),
              ),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.refresh_outlined),
                onPressed: () => ref.read(itemsProvider.notifier).refresh(),
              ),
            ],
          ),

          // Search + filtros
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                children: [
                  breshop.SearchBar(
                    onChanged: (v) => setState(() => _search = v),
                  ),
                  const SizedBox(height: 12),
                  CategoryFilter(
                    categories: _categories,
                    selectedCategory: _selectedCategory,
                    onSelected: (cat) {
                      setState(() => _selectedCategory = cat);
                      final tag = cat == 'Tudo' ? null : cat;
                      ref.read(itemsProvider.notifier).fetchItems(tag: tag);
                    },
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),

          // Loading / erro / grid
          if (itemsState.isLoading)
            const MarketplaceGridSkeleton()
          else if (itemsState.error != null && itemsState.items.isEmpty)
            SliverFillRemaining(
              child: _EmptyState(
                icon: Icons.wifi_off_outlined,
                message: 'Sem conexão com a API',
                sub: 'Verifique se o servidor está rodando.',
                onRetry: () => ref.read(itemsProvider.notifier).refresh(),
              ),
            )
          else if (filtered.isEmpty)
            SliverFillRemaining(
              child: _EmptyState(
                icon: Icons.search_off_outlined,
                message: 'Nenhum item encontrado',
                sub: 'Tente outro filtro ou busca.',
              ),
            )
          else
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
                    final item = filtered[index];
                    final isFav = favorites.contains(item.id);
                    return ProductCard(
                      item: item,
                      isFavorited: isFav,
                      onFavorite: () {
                        ref.read(favoritesProvider.notifier).toggle(item.id);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(isFav
                                ? 'Removido dos favoritos.'
                                : 'Adicionado aos favoritos!'),
                            duration: const Duration(seconds: 1),
                          ),
                        );
                      },
                      onTap: () => context.push('/item/${item.id}'),
                    );
                  },
                  childCount: filtered.length,
                ),
              ),
            ),

          // Footer: loading mais itens
          if (itemsState.hasMore && !itemsState.isLoading)
            const SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 24),
                child: Center(
                  child: SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
                ),
              ),
            ),

          const SliverToBoxAdapter(child: SizedBox(height: 80)),
        ],
      ),
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  final IconData icon;
  final String message;
  final String sub;
  final VoidCallback? onRetry;

  const _EmptyState({
    required this.icon,
    required this.message,
    required this.sub,
    this.onRetry,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 64, color: BreshopColors.grey300),
          const SizedBox(height: 16),
          Text(message, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text(sub, style: const TextStyle(color: BreshopColors.grey500)),
          if (onRetry != null) ...[
            const SizedBox(height: 20),
            OutlinedButton(onPressed: onRetry, child: const Text('Tentar novamente')),
          ],
        ],
      ),
    );
  }
}
