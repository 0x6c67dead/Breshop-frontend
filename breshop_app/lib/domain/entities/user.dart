enum UserRole { user, brechoOwner, admin }

class User {
  final String id;
  final String name;
  final String email;
  final UserRole role;
  final String? brechoId;
  final double balance;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.brechoId,
    this.balance = 0,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      role: UserRole.values.byName(json['role'] ?? 'user'),
      brechoId: json['brechoId'],
      balance: (json['balance'] as num?)?.toDouble() ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'role': role.name,
      'brechoId': brechoId,
      'balance': balance,
    };
  }
}
