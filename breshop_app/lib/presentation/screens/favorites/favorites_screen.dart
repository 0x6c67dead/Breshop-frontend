import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/colors.dart';
import '../../../application/providers/favorites_provider.dart';
import '../../../application/providers/items_provider.dart';
import '../../widgets/common/breshop_navigation_drawer.dart';
import '../../widgets/common/item_image.dart';

class FavoritesScreen extends ConsumerStatefulWidget {
  const FavoritesScreen({super.key});

  @override
  ConsumerState<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends ConsumerState<FavoritesScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tab;

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tab.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final favorites = ref.watch(favoritesProvider);
    final allItems = ref.watch(itemsProvider).items;
    final favoritedItems =
        allItems.where((item) => favorites.contains(item.id)).toList();

    return Scaffold(
      backgroundColor: BreshopColors.background,
      drawer: const BreshopNavigationDrawer(),
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            expandedHeight: 130,
            backgroundColor: BreshopColors.background,
            elevation: 0,
            surfaceTintColor: Colors.transparent,
            flexibleSpace: FlexibleSpaceBar(
              titlePadding: const EdgeInsets.fromLTRB(24, 0, 24, 60),
              centerTitle: false,
              title: Text(
                'Favorites.',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontSize: 30,
                      letterSpacing: -0.5,
                    ),
              ),
            ),
            bottom: TabBar(
              controller: _tab,
              indicatorColor: BreshopColors.foreground,
              labelColor: BreshopColors.foreground,
              unselectedLabelColor: BreshopColors.grey400,
              labelStyle: const TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 12,
                letterSpacing: 0.5,
              ),
              tabs: const [
                Tab(text: 'PEÇAS'),
                Tab(text: 'BRECHÓS'),
              ],
            ),
          ),
          SliverFillRemaining(
            child: TabBarView(
              controller: _tab,
              children: [
                _ItemsTab(items: favoritedItems),
                _ShopsTab(favoriteIds: favorites),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ItemsTab extends ConsumerWidget {
  final List items;

  const _ItemsTab({required this.items});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (items.isEmpty) {
      return _EmptyState(
        icon: Icons.favorite_border,
        message: 'Nenhuma peça favorita',
        sub: 'Explore o marketplace e salve suas peças preferidas.',
        onAction: () => context.go('/'),
        actionLabel: 'Explorar Marketplace',
      );
    }

    return GridView.builder(
      padding: const EdgeInsets.all(20),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 0.72,
      ),
      itemCount: items.length,
      itemBuilder: (context, index) {
        final item = items[index];
        return _FavoriteItemCard(item: item);
      },
    );
  }
}

class _FavoriteItemCard extends ConsumerWidget {
  final dynamic item;

  const _FavoriteItemCard({required this.item});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return GestureDetector(
      onTap: () => context.push('/item/${item.id}'),
      child: Container(
        decoration: BoxDecoration(
          color: BreshopColors.white,
          borderRadius: BorderRadius.circular(20),
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
            Expanded(
              child: Stack(
                children: [
                  ItemImage(
                    itemId: item.id,
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(18),
                    ),
                  ),
                  Positioned(
                    top: 8,
                    right: 8,
                    child: GestureDetector(
                      onTap: () =>
                          ref.read(favoritesProvider.notifier).toggle(item.id),
                      child: Container(
                        width: 36,
                        height: 36,
                        decoration: const BoxDecoration(
                          color: BreshopColors.white,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.favorite,
                          size: 18,
                          color: BreshopColors.accentOrange,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 10, 12, 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.title,
                    style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 13,
                      color: BreshopColors.foreground,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (item.brecho != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      item.brecho.name,
                      style: const TextStyle(
                        fontSize: 10,
                        color: BreshopColors.grey500,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                  const SizedBox(height: 6),
                  Text(
                    '${item.price} COINS',
                    style: const TextStyle(
                      fontWeight: FontWeight.w900,
                      fontSize: 15,
                      color: BreshopColors.foreground,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ShopsTab extends StatelessWidget {
  final Set<String> favoriteIds;

  const _ShopsTab({required this.favoriteIds});

  @override
  Widget build(BuildContext context) {
    return _EmptyState(
      icon: Icons.store_outlined,
      message: 'Nenhum brechó favorito',
      sub: 'Em breve você poderá seguir seus brechós favoritos.',
    );
  }
}

class _EmptyState extends StatelessWidget {
  final IconData icon;
  final String message;
  final String sub;
  final VoidCallback? onAction;
  final String? actionLabel;

  const _EmptyState({
    required this.icon,
    required this.message,
    required this.sub,
    this.onAction,
    this.actionLabel,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 72, color: BreshopColors.grey200),
            const SizedBox(height: 20),
            Text(
              message,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: BreshopColors.foreground,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              sub,
              style: const TextStyle(
                color: BreshopColors.grey500,
                fontSize: 13,
              ),
              textAlign: TextAlign.center,
            ),
            if (onAction != null && actionLabel != null) ...[
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: onAction,
                child: Text(actionLabel!),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
