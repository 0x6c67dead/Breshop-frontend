import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/item.dart';
import '../../domain/repositories/item_repository.dart';
import '../../infrastructure/repositories/item_repository_impl.dart';
import 'infrastructure_providers.dart';

final itemRepositoryProvider = Provider<ItemRepository>((ref) {
  return ItemRepositoryImpl(client: ref.watch(httpClientProvider));
});

// --- Items list state ---

class ItemsState {
  final List<Item> items;
  final bool isLoading;
  final String? error;
  final String? selectedTag;
  final bool hasMore;

  const ItemsState({
    this.items = const [],
    this.isLoading = false,
    this.error,
    this.selectedTag,
    this.hasMore = true,
  });

  ItemsState copyWith({
    List<Item>? items,
    bool? isLoading,
    String? error,
    String? selectedTag,
    bool? hasMore,
    bool clearError = false,
    bool clearTag = false,
  }) {
    return ItemsState(
      items: items ?? this.items,
      isLoading: isLoading ?? this.isLoading,
      error: clearError ? null : error ?? this.error,
      selectedTag: clearTag ? null : selectedTag ?? this.selectedTag,
      hasMore: hasMore ?? this.hasMore,
    );
  }
}

const _pageSize = 20;

class ItemsNotifier extends StateNotifier<ItemsState> {
  final ItemRepository repository;

  ItemsNotifier({required this.repository}) : super(const ItemsState()) {
    fetchItems();
  }

  Future<void> fetchItems({String? tag, int skip = 0}) async {
    final isFirstPage = skip == 0;
    state = state.copyWith(
      isLoading: isFirstPage,
      clearError: true,
      selectedTag: tag,
      clearTag: tag == null && skip == 0,
    );
    try {
      final items = await repository.getItems(tag: tag, skip: skip, take: _pageSize);
      final updated = isFirstPage ? items : [...state.items, ...items];
      state = state.copyWith(
        items: updated,
        isLoading: false,
        hasMore: items.length == _pageSize,
      );
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> fetchNextPage() async {
    if (!state.hasMore || state.isLoading) return;
    await fetchItems(tag: state.selectedTag, skip: state.items.length);
  }

  Future<void> fetchBrechoItems(String brechoId) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final items = await repository.getItems(
          brechoId: brechoId, includeUnavailable: true, take: 100);
      state = state.copyWith(items: items, isLoading: false, hasMore: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<bool> addItem({
    required String title,
    required int price,
    required String brechoId,
    List<String>? tagNames,
  }) async {
    try {
      final item = await repository.addItem(
        title: title,
        price: price,
        brechoId: brechoId,
        tagNames: tagNames,
      );
      state = state.copyWith(items: [item, ...state.items]);
      return true;
    } catch (e) {
      state = state.copyWith(error: e.toString());
      return false;
    }
  }

  Future<void> refresh() => fetchItems(tag: state.selectedTag);
}

final itemsProvider = StateNotifierProvider<ItemsNotifier, ItemsState>((ref) {
  final repository = ref.watch(itemRepositoryProvider);
  return ItemsNotifier(repository: repository);
});

// --- Single item provider ---

final itemProvider = FutureProvider.family<Item, String>((ref, id) async {
  final repository = ref.watch(itemRepositoryProvider);
  return repository.getItem(id);
});
