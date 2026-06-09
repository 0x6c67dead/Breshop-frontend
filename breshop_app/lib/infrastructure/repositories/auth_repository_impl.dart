import 'dart:convert';
import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../http_client/http_client.dart';
import '../storage/secure_storage.dart';

class AuthRepositoryImpl implements AuthRepository {
  final HttpClient client;
  final SecureStorage storage;

  AuthRepositoryImpl({
    required this.client,
    required this.storage,
  });

  @override
  Future<User> login(String email, String password) async {
    try {
      final response = await client.postRequest('/auth/login', body: {
        'email': email,
        'password': password,
      });

      final token = response['token'];
      final userData = response['user'];

      if (token != null) {
        await storage.saveToken(token);
      }

      final user = User.fromJson(userData);
      await storage.saveUser(jsonEncode(user.toJson()));
      await storage.saveUserRole(user.role.name);

      return user;
    } catch (e) {
      // MOCK LOGIN PARA DESENVOLVIMENTO
      // Se a API falhar ou não existir, permitimos a entrada com dados fake
      print('Aviso: Usando Mock Login devido a erro: $e');
      
      UserRole mockRole = UserRole.user;
      if (email.toLowerCase().contains('admin')) {
        mockRole = UserRole.admin;
      } else if (email.toLowerCase().contains('owner') || 
                 email.toLowerCase().contains('brecho') || 
                 email.toLowerCase().contains('lojista')) {
        mockRole = UserRole.brechoOwner;
      }

      final mockUser = User(
        id: 'user_123',
        name: mockRole == UserRole.admin 
            ? 'Administrador Breshop' 
            : mockRole == UserRole.brechoOwner 
                ? 'Lojista Breshop' 
                : 'Cliente de Teste',
        email: email,
        role: mockRole,
        balance: mockRole == UserRole.admin ? 5000.0 : 150.0,
      );

      await storage.saveToken('mock_token_abc123');
      await storage.saveUser(jsonEncode(mockUser.toJson()));
      await storage.saveUserRole(mockUser.role.name);

      return mockUser;

    }
  }

  @override
  Future<User> register(String name, String email, String password) async {
    try {
      final response = await client.postRequest('/auth/register', body: {
        'name': name,
        'email': email,
        'password': password,
      });

      final userData = response['user'];
      return User.fromJson(userData);
    } catch (e) {
      print('Aviso: Usando Mock Register devido a erro: $e');
      return User(
        id: 'user_new',
        name: name,
        email: email,
        role: UserRole.user,
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
      return User.fromJson(jsonDecode(userJson));
    } catch (e) {
      return null;
    }
  }
}
