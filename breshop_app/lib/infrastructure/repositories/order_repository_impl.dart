import '../../domain/entities/order.dart';
import '../../domain/repositories/order_repository.dart';
import '../http_client/http_client.dart';

class OrderRepositoryImpl implements OrderRepository {
  final HttpClient client;

  OrderRepositoryImpl({required this.client});

  @override
  Future<Order> reserveItem(String userId, String itemId) async {
    final data = await client.postRequest(
      '/api/orders/reserve',
      body: {'userId': userId, 'itemId': itemId},
    );
    return Order.fromJson(data);
  }

  @override
  Future<List<Order>> getMyOrders(String userId) async {
    final list = await client.getListRequest('/api/orders/mine?userId=$userId');
    return list.map((e) => Order.fromJson(e as Map<String, dynamic>)).toList();
  }

  @override
  Future<List<Order>> getBrechoOrders(String brechoId, {bool all = false}) async {
    final query = all ? '?all=true' : '';
    final list = await client.getListRequest('/api/orders/brecho/$brechoId$query');
    return list.map((e) => Order.fromJson(e as Map<String, dynamic>)).toList();
  }

  @override
  Future<Order> approveOrder(String orderId) async {
    final data = await client.postRequest('/api/orders/$orderId/approve', body: {});
    return Order.fromJson(data);
  }

  @override
  Future<Order> rejectOrder(
    String orderId,
    RejectionReason reason,
    RejectionAction action,
  ) async {
    final data = await client.postRequest(
      '/api/orders/$orderId/reject',
      body: {
        'reason': reason.apiValue,
        'action': action.apiValue,
      },
    );
    return Order.fromJson(data);
  }

  @override
  Future<Order> confirmDelivery(String orderId) async {
    final data = await client.postRequest('/api/orders/$orderId/confirm', body: {});
    return Order.fromJson(data);
  }
}
