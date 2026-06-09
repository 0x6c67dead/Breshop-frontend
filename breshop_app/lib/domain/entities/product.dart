enum ProductStatus { disponivel, vendido, reservado }
enum ProductCondition { novo, semiNovo, usado }

class Product {
  final String id;
  final String name;
  final String description;
  final double price;
  final List<String> images;
  final String category;
  final String size;
  final ProductStatus status;
  final ProductCondition condition;
  final String brechoId;
  final DateTime createdAt;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.images,
    required this.category,
    required this.size,
    required this.status,
    required this.condition,
    required this.brechoId,
    required this.createdAt,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0,
      images: List<String>.from(json['images'] ?? []),
      category: json['category'] ?? '',
      size: json['size'] ?? '',
      status: ProductStatus.values.byName(json['status'] ?? 'disponivel'),
      condition: ProductCondition.values.byName(json['condition'] ?? 'usado'),
      brechoId: json['brechoId'] ?? '',
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'price': price,
      'images': images,
      'category': category,
      'size': size,
      'status': status.name,
      'condition': condition.name,
      'brechoId': brechoId,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
