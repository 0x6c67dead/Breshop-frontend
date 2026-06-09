class Tag {
  final String id;
  final String name;

  const Tag({required this.id, required this.name});

  factory Tag.fromJson(Map<String, dynamic> json) =>
      Tag(id: json['id'] ?? '', name: json['name'] ?? '');
}
