import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'infrastructure/storage/local_storage.dart';
import 'core/theme/theme.dart';
import 'application/providers/routing_provider.dart';
import 'application/providers/infrastructure_providers.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final localStorage = LocalStorage();
  await localStorage.init();

  runApp(
    ProviderScope(
      overrides: [
        localStorageProvider.overrideWithValue(localStorage),
      ],
      child: const BreshopApp(),
    ),
  );
}

class BreshopApp extends ConsumerWidget {
  const BreshopApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      title: 'Breshop',
      theme: BreshopTheme.lightTheme,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}
