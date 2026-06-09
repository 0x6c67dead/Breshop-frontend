import '../entities/item.dart';

abstract class ItemRepository {
  Future<List<Item>> getItems({
    String? brechoId,
    String? tag,
    bool includeUnavailable = false,
    int skip = 0,
    int take = 20,
  });
  Future<Item> getItem(String id);
  Future<Item> addItem({
    required String title,
    required int price,
    required String brechoId,
    List<String>? tagNames,
  });
}
