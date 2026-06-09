import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/colors.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _emailController = TextEditingController();
  bool _sent = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  void _handleSubmit() {
    final email = _emailController.text.trim();
    if (email.isEmpty) return;
    setState(() => _sent = true);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: BreshopColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              IconButton(
                alignment: Alignment.centerLeft,
                icon: const Icon(Icons.arrow_back_ios_new, size: 20),
                padding: EdgeInsets.zero,
                onPressed: () => context.pop(),
              ),
              const SizedBox(height: 32),

              Text(
                'Recovery.',
                style: Theme.of(context).textTheme.displayMedium?.copyWith(
                      fontSize: 40,
                    ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Informe seu e-mail para recuperar o acesso.',
                style: TextStyle(
                  color: BreshopColors.grey600,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 40),

              if (_sent) ...[
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: BreshopColors.success.withAlpha(20),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: BreshopColors.success.withAlpha(60),
                    ),
                  ),
                  child: Column(
                    children: [
                      const Icon(
                        Icons.mark_email_read_outlined,
                        size: 48,
                        color: BreshopColors.success,
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'E-mail enviado!',
                        style: TextStyle(
                          fontWeight: FontWeight.w900,
                          fontSize: 18,
                          color: BreshopColors.foreground,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Verifique sua caixa de entrada em ${_emailController.text.trim()}.',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: BreshopColors.grey600,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                TextButton(
                  onPressed: () => setState(() {
                    _sent = false;
                    _emailController.clear();
                  }),
                  child: const Text('Tentar com outro e-mail'),
                ),
              ] else ...[
                const Text(
                  'E-MAIL',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    color: BreshopColors.grey400,
                    letterSpacing: 1.2,
                  ),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(
                    hintText: 'seu@email.com',
                    prefixIcon: Icon(Icons.email_outlined, size: 20),
                  ),
                  onSubmitted: (_) => _handleSubmit(),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  height: 54,
                  child: ElevatedButton(
                    onPressed: _handleSubmit,
                    child: const Text(
                      'ENVIAR LINK DE RECUPERAÇÃO',
                      style: TextStyle(
                        fontWeight: FontWeight.w900,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                ),
              ],

              const SizedBox(height: 32),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'Lembrou a senha? ',
                    style: TextStyle(color: BreshopColors.grey600),
                  ),
                  TextButton(
                    onPressed: () => context.pop(),
                    style: TextButton.styleFrom(
                      padding: EdgeInsets.zero,
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                    child: const Text(
                      'Voltar para o Login',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: BreshopColors.foreground,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
