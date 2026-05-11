import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../application/providers/auth_provider.dart';
import '../../../core/theme/colors.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() {
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();
    
    if (email.isNotEmpty && password.isNotEmpty) {
      ref.read(authProvider.notifier).login(email, password);
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    // Listen for errors
    ref.listen(authProvider, (previous, next) {
      if (next.error != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(next.error!), backgroundColor: BreshopColors.error),
        );
      }
    });

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              Text(
                'Breshop',
                style: Theme.of(context).textTheme.displayMedium,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'Moda sustentável ao seu alcance.',
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: BreshopColors.grey600,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 48),
              TextField(
                controller: _emailController,
                decoration: const InputDecoration(
                  hintText: 'Email',
                  prefixIcon: Icon(Icons.email_outlined),
                ),
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _passwordController,
                decoration: const InputDecoration(
                  hintText: 'Senha',
                  prefixIcon: Icon(Icons.lock_outline),
                ),
                obscureText: true,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: authState.isLoading ? null : _handleLogin,
                child: authState.isLoading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Text('ENTRAR'),
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: () {
                  // TODO: Navegar para cadastro
                },
                child: const Text('Ainda não tem conta? Cadastre-se'),
              ),
              const Spacer(),
            ],
          ),
        ),
      ),
    );
  }
}
