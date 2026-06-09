import '../../domain/entities/item.dart';
import '../../domain/repositories/item_repository.dart';
import '../http_client/http_client.dart';

class ItemRepositoryImpl implements ItemRepository {
  final HttpClient client;

  ItemRepositoryImpl({required this.client});

  @override
  Future<List<Item>> getItems({
    String? brechoId,
    String? tag,
    bool includeUnavailable = false,
    int skip = 0,
    int take = 20,
  }) async {
    final params = <String, String>{};
    if (brechoId != null) params['brechoId'] = brechoId;
    if (tag != null) params['tag'] = tag;
    if (includeUnavailable) params['all'] = 'true';
    if (skip > 0) params['skip'] = skip.toString();
    if (take != 20) params['take'] = take.toString();

    final query = params.isNotEmpty
        ? '?${params.entries.map((e) => '${e.key}=${Uri.encodeComponent(e.value)}').join('&')}'
        : '';

    final list = await client.getListRequest('/api/items$query');
    return list.map((e) => Item.fromJson(e as Map<String, dynamic>)).toList();
  }

  @override
  Future<Item> getItem(String id) async {
    final data = await client.getRequest('/api/items/$id');
    return Item.fromJson(data);
  }

  @override
  Future<Item> addItem({
    required String title,
    required int price,
    required String brechoId,
    List<String>? tagNames,
  }) async {
    final body = <String, dynamic>{
      'title': title,
      'price': price,
      'brechoId': brechoId,
    };
    if (tagNames != null && tagNames.isNotEmpty) {
      body['tagNames'] = tagNames;
    }
    final data = await client.postRequest('/api/items', body: body);
    return Item.fromJson(data);
  }
}
