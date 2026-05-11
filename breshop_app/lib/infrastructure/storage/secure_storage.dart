import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorage {
  static const String _tokenKey = 'breshop_auth_token';
  static const String _userKey = 'breshop_user';
  static const String _roleKey = 'breshop_user_role';

  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  // Token
  Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  Future<void> saveToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
  }

  Future<void> deleteToken() async {
    await _storage.delete(key: _tokenKey);
  }

  // User
  Future<String?> getUser() async {
    return await _storage.read(key: _userKey);
  }

  Future<void> saveUser(String userJson) async {
    await _storage.write(key: _userKey, value: userJson);
  }

  // Role
  Future<String?> getUserRole() async {
    return await _storage.read(key: _roleKey);
  }

  Future<void> saveUserRole(String role) async {
    await _storage.write(key: _roleKey, value: role);
  }

  // Logout
  Future<void> clear() async {
    await _storage.delete(key: _tokenKey);
    await _storage.delete(key: _userKey);
    await _storage.delete(key: _roleKey);
  }
}
