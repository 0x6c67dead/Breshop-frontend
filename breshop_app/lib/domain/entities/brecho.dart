class Brecho {
  final String id;
  final String name;
  final String ownerId;
  final DateTime createdAt;

  const Brecho({
    required this.id,
    required this.name,
    required this.ownerId,
    required this.createdAt,
  });

  factory Brecho.fromJson(Map<String, dynamic> json) => Brecho(
        id: json['id'] ?? '',
        name: json['name'] ?? '',
        ownerId: json['ownerId'] ?? '',
        createdAt: json['createdAt'] != null
            ? DateTime.tryParse(json['createdAt']) ?? DateTime.now()
            : DateTime.now(),
      );
}
