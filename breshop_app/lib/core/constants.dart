import 'package:flutter/foundation.dart';

class Constants {
  // URL de produção padrão
  static const String _productionUrl = 'https://api.breshop.com';
  
  // URL dinâmica. No Flutter, podemos passar --dart-define=API_BASE_URL=http://<IP_DA_MAQUINA>:3000
  // Se não passarmos nada, no emulador usamos 'http://10.0.2.2:3000' em debug,
  // ou a URL de produção se estiver em release.
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: kDebugMode ? 'http://10.0.2.2:3000' : _productionUrl,
  );
  
  static const int httpTimeoutSeconds = 30;
  static const int retryMaxAttempts = 3;
}
