import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'infrastructure/storage/local_storage.dart';
import 'core/theme/theme.dart';
import 'application/providers/routing_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize local storage
  final localStorage = LocalStorage();
  await localStorage.init();
  
  runApp(
    ProviderScope(
      child: MyApp(localStorage: localStorage),
    ),
  );
}

class MyApp extends ConsumerWidget {
  final LocalStorage localStorage;

  const MyApp({super.key, required this.localStorage});

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
