import 'item.dart';

enum OrderStatus {
  reserved,
  approved,
  rejected,
  awaitingDelivery,
  deliveredPendingConfirmation,
  completed,
  cancelled,
}

extension OrderStatusX on OrderStatus {
  String get label {
    return switch (this) {
      OrderStatus.reserved => 'Aguardando Aprovação',
      OrderStatus.approved => 'Aprovado',
      OrderStatus.rejected => 'Rejeitado',
      OrderStatus.awaitingDelivery => 'Aguardando Entrega',
      OrderStatus.deliveredPendingConfirmation => 'Entregue (aguardando confirmação)',
      OrderStatus.completed => 'Concluído',
      OrderStatus.cancelled => 'Cancelado',
    };
  }

  static OrderStatus fromApi(String? value) {
    return switch (value?.toUpperCase()) {
      'APPROVED' => OrderStatus.approved,
      'REJECTED' => OrderStatus.rejected,
      'AWAITING_DELIVERY' => OrderStatus.awaitingDelivery,
      'DELIVERED_PENDING_CONFIRMATION' => OrderStatus.deliveredPendingConfirmation,
      'COMPLETED' => OrderStatus.completed,
      'CANCELLED' => OrderStatus.cancelled,
      _ => OrderStatus.reserved,
    };
  }
}

enum RejectionReason { itemAlreadySold, itemNotFound, stockError, other }

extension RejectionReasonX on RejectionReason {
  String get apiValue {
    return switch (this) {
      RejectionReason.itemAlreadySold => 'ITEM_ALREADY_SOLD',
      RejectionReason.itemNotFound => 'ITEM_NOT_FOUND',
      RejectionReason.stockError => 'STOCK_ERROR',
      RejectionReason.other => 'OTHER',
    };
  }

  String get label {
    return switch (this) {
      RejectionReason.itemAlreadySold => 'Peça já vendida',
      RejectionReason.itemNotFound => 'Peça não encontrada',
      RejectionReason.stockError => 'Erro de estoque',
      RejectionReason.other => 'Outro motivo',
    };
  }

  static RejectionReason? fromApi(String? value) {
    return switch (value?.toUpperCase()) {
      'ITEM_ALREADY_SOLD' => RejectionReason.itemAlreadySold,
      'ITEM_NOT_FOUND' => RejectionReason.itemNotFound,
      'STOCK_ERROR' => RejectionReason.stockError,
      'OTHER' => RejectionReason.other,
      _ => null,
    };
  }
}

enum RejectionAction { returnToStore, markAsSoldOutsideApp }

extension RejectionActionX on RejectionAction {
  String get apiValue {
    return switch (this) {
      RejectionAction.returnToStore => 'RETURN_TO_STORE',
      RejectionAction.markAsSoldOutsideApp => 'MARK_AS_SOLD_OUTSIDE_APP',
    };
  }

  String get label {
    return switch (this) {
      RejectionAction.returnToStore => 'Devolver à loja',
      RejectionAction.markAsSoldOutsideApp => 'Marcar como vendido fora do app',
    };
  }

  static RejectionAction? fromApi(String? value) {
    return switch (value?.toUpperCase()) {
      'RETURN_TO_STORE' => RejectionAction.returnToStore,
      'MARK_AS_SOLD_OUTSIDE_APP' => RejectionAction.markAsSoldOutsideApp,
      _ => null,
    };
  }
}

class OrderItem {
  final String id;
  final String title;
  final int price;
  final String brechoId;
  final BrechoInfo? brecho;

  const OrderItem({
    required this.id,
    required this.title,
    required this.price,
    required this.brechoId,
    this.brecho,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) => OrderItem(
        id: json['id'] ?? '',
        title: json['title'] ?? '',
        price: (json['price'] as num?)?.toInt() ?? 0,
        brechoId: json['brechoId'] ?? '',
        brecho: json['brecho'] != null
            ? BrechoInfo.fromJson(json['brecho'] as Map<String, dynamic>)
            : null,
      );
}

class OrderUser {
  final String id;
  final String name;
  final String email;

  const OrderUser({required this.id, required this.name, required this.email});

  factory OrderUser.fromJson(Map<String, dynamic> json) => OrderUser(
        id: json['id'] ?? '',
        name: json['name'] ?? '',
        email: json['email'] ?? '',
      );
}

class Order {
  final String id;
  final String userId;
  final String itemId;
  final OrderStatus status;
  final int total;
  final DateTime createdAt;
  final RejectionReason? rejectionReason;
  final RejectionAction? rejectionAction;
  final OrderItem? item;
  final OrderUser? user;

  const Order({
    required this.id,
    required this.userId,
    required this.itemId,
    required this.status,
    required this.total,
    required this.createdAt,
    this.rejectionReason,
    this.rejectionAction,
    this.item,
    this.user,
  });

  factory Order.fromJson(Map<String, dynamic> json) => Order(
        id: json['id'] ?? '',
        userId: json['userId'] ?? '',
        itemId: json['itemId'] ?? '',
        status: OrderStatusX.fromApi(json['status']),
        total: (json['total'] as num?)?.toInt() ?? 0,
        createdAt: json['createdAt'] != null
            ? DateTime.tryParse(json['createdAt']) ?? DateTime.now()
            : DateTime.now(),
        rejectionReason: RejectionReasonX.fromApi(json['rejectionReason']),
        rejectionAction: RejectionActionX.fromApi(json['rejectionAction']),
        item: json['item'] != null
            ? OrderItem.fromJson(json['item'] as Map<String, dynamic>)
            : null,
        user: json['user'] != null
            ? OrderUser.fromJson(json['user'] as Map<String, dynamic>)
            : null,
      );
}
