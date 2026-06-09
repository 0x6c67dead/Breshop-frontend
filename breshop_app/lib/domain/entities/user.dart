enum UserRole { user, brechoOwner, admin }

extension UserRoleX on UserRole {
  static UserRole fromApi(String? value) {
    return switch (value?.toUpperCase()) {
      'BRECHO_OWNER' => UserRole.brechoOwner,
      'ADMIN' => UserRole.admin,
      _ => UserRole.user,
    };
  }

  String get label {
    return switch (this) {
      UserRole.admin => 'Administrador',
      UserRole.brechoOwner => 'Lojista',
      UserRole.user => 'Cliente',
    };
  }
}

class User {
  final String id;
  final String name;
  final String email;
  final UserRole role;
  final String? brechoId;
  final int balance;
  final int locked;

  const User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.brechoId,
    this.balance = 0,
    this.locked = 0,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      role: UserRoleX.fromApi(json['role']),
      brechoId: json['brechoId'] as String?,
      balance: (json['balance'] as num?)?.toInt() ?? 0,
      locked: (json['locked'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'role': role.name,
        'brechoId': brechoId,
        'balance': balance,
        'locked': locked,
      };

  User copyWith({
    String? id,
    String? name,
    String? email,
    UserRole? role,
    String? brechoId,
    int? balance,
    int? locked,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      role: role ?? this.role,
      brechoId: brechoId ?? this.brechoId,
      balance: balance ?? this.balance,
      locked: locked ?? this.locked,
    );
  }
}
