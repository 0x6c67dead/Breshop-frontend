import '../entities/order.dart';

abstract class OrderRepository {
  Future<Order> reserveItem(String userId, String itemId);
  Future<List<Order>> getMyOrders(String userId);
  Future<List<Order>> getBrechoOrders(String brechoId, {bool all = false});
  Future<Order> approveOrder(String orderId);
  Future<Order> rejectOrder(String orderId, RejectionReason reason, RejectionAction action);
  Future<Order> confirmDelivery(String orderId);
}
