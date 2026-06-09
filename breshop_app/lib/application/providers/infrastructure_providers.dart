import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants.dart';
import '../../infrastructure/http_client/http_client.dart';
import '../../infrastructure/storage/secure_storage.dart';
import '../../infrastructure/storage/local_storage.dart';

final secureStorageProvider = Provider<SecureStorage>((ref) {
  return SecureStorage();
});

final localStorageProvider = Provider<LocalStorage>((ref) {
  return LocalStorage();
});

final httpClientProvider = Provider<HttpClient>((ref) {
  return HttpClient(
    baseUrl: Constants.apiBaseUrl,
    // A API atual não exige Bearer token — autenticação via userId nos requests.
    getToken: () => null,
  );
});
