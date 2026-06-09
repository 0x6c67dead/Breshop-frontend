import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../infrastructure/storage/local_storage.dart';
import 'infrastructure_providers.dart';

class FavoritesNotifier extends StateNotifier<Set<String>> {
  final LocalStorage _storage;

  FavoritesNotifier(super.initialState, this._storage);

  void toggle(String itemId) {
    final updated = Set<String>.from(state);
    if (updated.contains(itemId)) {
      updated.remove(itemId);
    } else {
      updated.add(itemId);
    }
    state = updated;
    _storage.setFavorites(updated.toList());
  }

  bool isFavorited(String itemId) => state.contains(itemId);
}

final favoritesProvider =
    StateNotifierProvider<FavoritesNotifier, Set<String>>((ref) {
  final localStorage = ref.watch(localStorageProvider);
  final saved = localStorage.getFavorites();
  return FavoritesNotifier(Set<String>.from(saved), localStorage);
});
