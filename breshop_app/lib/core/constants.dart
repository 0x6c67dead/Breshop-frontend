import 'package:flutter/foundation.dart';

class Constants {
  // URL de produção padrão (Next.js web app hospedado na Vercel)
  static const String _productionUrl = 'https://breshop-frontend.vercel.app';
  
  // URL dinâmica. No Flutter, podemos passar --dart-define=API_BASE_URL=https://...
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: _productionUrl,
  );
  
  static const int httpTimeoutSeconds = 30;
  static const int retryMaxAttempts = 3;
}
