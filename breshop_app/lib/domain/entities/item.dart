enum ItemStatus {
  available,
  reserved,
  soldPendingDelivery,
  deliveredPendingConfirmation,
  completed,
  cancelled,
  returnedToStore,
  soldOutsideApp,
}

extension ItemStatusX on ItemStatus {
  String get label {
    return switch (this) {
      ItemStatus.available => 'Disponível',
      ItemStatus.reserved => 'Reservado',
      ItemStatus.soldPendingDelivery => 'Vendido (aguardando entrega)',
      ItemStatus.deliveredPendingConfirmation => 'Entregue (aguardando confirmação)',
      ItemStatus.completed => 'Concluído',
      ItemStatus.cancelled => 'Cancelado',
      ItemStatus.returnedToStore => 'Devolvido à loja',
      ItemStatus.soldOutsideApp => 'Vendido fora do app',
    };
  }

  static ItemStatus fromApi(String? value) {
    return switch (value?.toUpperCase()) {
      'RESERVED' => ItemStatus.reserved,
      'SOLD_PENDING_DELIVERY' => ItemStatus.soldPendingDelivery,
      'DELIVERED_PENDING_CONFIRMATION' => ItemStatus.deliveredPendingConfirmation,
      'COMPLETED' => ItemStatus.completed,
      'CANCELLED' => ItemStatus.cancelled,
      'RETURNED_TO_STORE' => ItemStatus.returnedToStore,
      'SOLD_OUTSIDE_APP' => ItemStatus.soldOutsideApp,
      _ => ItemStatus.available,
    };
  }
}

class BrechoInfo {
  final String id;
  final String name;

  const BrechoInfo({required this.id, required this.name});

  factory BrechoInfo.fromJson(Map<String, dynamic> json) =>
      BrechoInfo(id: json['id'] ?? '', name: json['name'] ?? '');
}

class TagInfo {
  final String name;

  const TagInfo({required this.name});

  factory TagInfo.fromJson(Map<String, dynamic> json) =>
      TagInfo(name: json['name'] ?? '');
}

class Item {
  final String id;
  final String title;
  final int price;
  final ItemStatus status;
  final String brechoId;
  final DateTime createdAt;
  final BrechoInfo? brecho;
  final List<TagInfo> tags;

  const Item({
    required this.id,
    required this.title,
    required this.price,
    required this.status,
    required this.brechoId,
    required this.createdAt,
    this.brecho,
    this.tags = const [],
  });

  factory Item.fromJson(Map<String, dynamic> json) {
    return Item(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      price: (json['price'] as num?)?.toInt() ?? 0,
      status: ItemStatusX.fromApi(json['status']),
      brechoId: json['brechoId'] ?? '',
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt']) ?? DateTime.now()
          : DateTime.now(),
      brecho: json['brecho'] != null
          ? BrechoInfo.fromJson(json['brecho'] as Map<String, dynamic>)
          : null,
      tags: (json['tags'] as List<dynamic>?)
              ?.map((t) => TagInfo.fromJson(t as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'price': price,
        'status': status.name,
        'brechoId': brechoId,
        'createdAt': createdAt.toIso8601String(),
      };
}
