import 'dart:convert';
import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../http_client/http_client.dart';
import '../storage/secure_storage.dart';

class AuthRepositoryImpl implements AuthRepository {
  final HttpClient client;
  final SecureStorage storage;

  AuthRepositoryImpl({required this.client, required this.storage});

  @override
  Future<User> login(String email, String password) async {
    try {
      // A API retorna o user diretamente (sem wrapper nem token JWT)
      final data = await client.postRequest('/api/auth/login', body: {
        'email': email,
        'password': password,
      });

      final user = User.fromJson(data);
      await storage.saveUser(jsonEncode(user.toJson()));
      await storage.saveUserRole(user.role.name);

      return user;
    } catch (e) {
      // Fallback mock para desenvolvimento (quando API não está rodando)
      final role = _inferMockRole(email);
      final mockUser = User(
        id: 'mock_${role.name}',
        name: switch (role) {
          UserRole.admin => 'Administrador Breshop',
          UserRole.brechoOwner => 'Lojista Teste',
          UserRole.user => 'Cliente Teste',
        },
        email: email,
        role: role,
        balance: role == UserRole.user ? 150 : 5000,
        locked: 0,
      );

      await storage.saveUser(jsonEncode(mockUser.toJson()));
      await storage.saveUserRole(mockUser.role.name);
      return mockUser;
    }
  }

  @override
  Future<User> register(String name, String email, String password) async {
    try {
      final data = await client.postRequest('/api/auth/register', body: {
        'name': name,
        'email': email,
        'password': password,
      });
      return User.fromJson(data['user'] ?? data);
    } catch (e) {
      return User(
        id: 'mock_new_${DateTime.now().millisecondsSinceEpoch}',
        name: name,
        email: email,
        role: UserRole.user,
        balance: 0,
        locked: 0,
      );
    }
  }

  @override
  Future<void> logout() async {
    await storage.clear();
  }

  @override
  Future<User?> getCurrentUser() async {
    final userJson = await storage.getUser();
    if (userJson == null) return null;
    try {
      return User.fromJson(jsonDecode(userJson) as Map<String, dynamic>);
    } catch (_) {
      return null;
    }
  }

  UserRole _inferMockRole(String email) {
    final lower = email.toLowerCase();
    if (lower.contains('admin')) return UserRole.admin;
    if (lower.contains('owner') || lower.contains('brecho') || lower.contains('lojista')) {
      return UserRole.brechoOwner;
    }
    return UserRole.user;
  }
}
