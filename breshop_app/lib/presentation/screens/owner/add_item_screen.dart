import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/colors.dart';
import '../../../application/providers/items_provider.dart';
import '../../../application/providers/auth_provider.dart';

class AddItemScreen extends ConsumerStatefulWidget {
  const AddItemScreen({super.key});

  @override
  ConsumerState<AddItemScreen> createState() => _AddItemScreenState();
}

class _AddItemScreenState extends ConsumerState<AddItemScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _priceController = TextEditingController();
  final _tagInputController = TextEditingController();
  final List<String> _tags = [];
  bool _loading = false;

  @override
  void dispose() {
    _titleController.dispose();
    _priceController.dispose();
    _tagInputController.dispose();
    super.dispose();
  }

  void _addTag() {
    final tag = _tagInputController.text.trim();
    if (tag.isNotEmpty && !_tags.contains(tag)) {
      setState(() => _tags.add(tag));
      _tagInputController.clear();
    }
  }

  void _removeTag(String tag) => setState(() => _tags.remove(tag));

  Future<void> _handleSubmit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;

    final user = ref.read(authProvider).user;
    if (user?.brechoId == null) return;

    final title = _titleController.text.trim();
    final price = int.parse(_priceController.text.trim());

    setState(() => _loading = true);
    final ok = await ref.read(itemsProvider.notifier).addItem(
          title: title,
          price: price,
          brechoId: user!.brechoId!,
          tagNames: _tags.isEmpty ? null : List.of(_tags),
        );
    setState(() => _loading = false);

    if (!mounted) return;

    if (ok) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Peça adicionada com sucesso!'),
          backgroundColor: BreshopColors.success,
        ),
      );
      context.pop();
    } else {
      final error = ref.read(itemsProvider).error;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(error ?? 'Erro ao adicionar peça.'),
          backgroundColor: BreshopColors.error,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: BreshopColors.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'NOVA PEÇA.',
          style: Theme.of(context)
              .textTheme
              .titleLarge
              ?.copyWith(fontSize: 22, letterSpacing: -0.5),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'Adicione uma peça ao inventário',
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: BreshopColors.grey500,
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(height: 28),

              // Título
              _FieldLabel('NOME DA PEÇA'),
              const SizedBox(height: 8),
              TextFormField(
                controller: _titleController,
                textCapitalization: TextCapitalization.words,
                decoration: const InputDecoration(
                  hintText: 'Ex: Jaqueta Vintage Nike',
                ),
                validator: (v) {
                  if (v == null || v.trim().isEmpty) return 'Informe o nome da peça';
                  if (v.trim().length < 3) return 'Nome muito curto';
                  return null;
                },
              ),
              const SizedBox(height: 20),

              // Preço
              _FieldLabel('PREÇO (COINS)'),
              const SizedBox(height: 8),
              TextFormField(
                controller: _priceController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  hintText: '0',
                  prefixText: 'C\$ ',
                ),
                validator: (v) {
                  if (v == null || v.trim().isEmpty) return 'Informe o preço';
                  final n = int.tryParse(v.trim());
                  if (n == null || n <= 0) return 'Preço inválido';
                  return null;
                },
              ),
              const SizedBox(height: 20),

              // Tags
              _FieldLabel('CATEGORIAS (OPCIONAL)'),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _tagInputController,
                      textCapitalization: TextCapitalization.words,
                      decoration: const InputDecoration(
                        hintText: 'Ex: Vintage, Couro, Anos 90',
                      ),
                      onSubmitted: (_) => _addTag(),
                    ),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton(
                    onPressed: _addTag,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 16,
                      ),
                    ),
                    child: const Icon(Icons.add, size: 20),
                  ),
                ],
              ),
              if (_tags.isNotEmpty) ...[
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: _tags.map((tag) {
                    return Chip(
                      label: Text(
                        tag.toUpperCase(),
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: BreshopColors.foreground,
                        ),
                      ),
                      backgroundColor: BreshopColors.accentLime,
                      side: BorderSide.none,
                      deleteIcon: const Icon(
                        Icons.close,
                        size: 14,
                        color: BreshopColors.foreground,
                      ),
                      onDeleted: () => _removeTag(tag),
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                    );
                  }).toList(),
                ),
              ],

              const SizedBox(height: 40),

              // Botão
              SizedBox(
                height: 54,
                child: ElevatedButton(
                  onPressed: _loading ? null : _handleSubmit,
                  child: _loading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: BreshopColors.white,
                          ),
                        )
                      : const Text(
                          'SALVAR PEÇA',
                          style: TextStyle(
                            fontWeight: FontWeight.w900,
                            letterSpacing: 0.5,
                          ),
                        ),
                ),
              ),
              const SizedBox(height: 12),
              TextButton(
                onPressed: () => context.pop(),
                child: const Text('Cancelar'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _FieldLabel extends StatelessWidget {
  final String text;
  const _FieldLabel(this.text);

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(
        fontSize: 9,
        fontWeight: FontWeight.w900,
        color: BreshopColors.grey400,
        letterSpacing: 1.2,
      ),
    );
  }
}
