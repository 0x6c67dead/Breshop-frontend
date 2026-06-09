import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/colors.dart';
import '../../../application/providers/admin_provider.dart';
import '../../../domain/entities/user.dart';

class AdminPanelScreen extends ConsumerStatefulWidget {
  const AdminPanelScreen({super.key});

  @override
  ConsumerState<AdminPanelScreen> createState() => _AdminPanelScreenState();
}

class _AdminPanelScreenState extends ConsumerState<AdminPanelScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
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
          'PAINEL ADMIN.',
          style: Theme.of(context)
              .textTheme
              .titleLarge
              ?.copyWith(fontSize: 20, letterSpacing: -0.5),
        ),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: BreshopColors.foreground,
          labelColor: BreshopColors.foreground,
          unselectedLabelColor: BreshopColors.grey400,
          labelStyle: const TextStyle(
            fontWeight: FontWeight.w900,
            fontSize: 12,
            letterSpacing: 0.5,
          ),
          tabs: const [
            Tab(text: 'USUÁRIOS'),
            Tab(text: 'TAGS'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _UsersTab(),
          _TagsTab(),
        ],
      ),
    );
  }
}

// ─── Users Tab ────────────────────────────────────────────────────────────────

class _UsersTab extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(adminUsersProvider);

    if (state.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state.error != null && state.users.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.wifi_off_outlined, size: 48, color: BreshopColors.grey400),
            const SizedBox(height: 12),
            const Text('Sem conexão com a API',
                style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () => ref.read(adminUsersProvider.notifier).fetchUsers(),
              child: const Text('Tentar novamente'),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () => ref.read(adminUsersProvider.notifier).fetchUsers(),
      child: ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: state.users.length,
        itemBuilder: (context, index) =>
            _UserCard(user: state.users[index]),
      ),
    );
  }
}

class _UserCard extends ConsumerWidget {
  final AdminUser user;

  const _UserCard({required this.user});

  Color get _roleColor => switch (user.role) {
        'ADMIN' => Colors.purple,
        'BRECHO_OWNER' => BreshopColors.foreground,
        _ => BreshopColors.grey500,
      };

  String get _roleLabel => switch (user.role) {
        'ADMIN' => 'Admin',
        'BRECHO_OWNER' => 'Lojista',
        _ => 'Cliente',
      };

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: BreshopColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: BreshopColors.grey200),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: _roleColor.withAlpha(25),
            child: Text(
              user.name.isNotEmpty ? user.name[0].toUpperCase() : '?',
              style: TextStyle(color: _roleColor, fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(user.name,
                    style: const TextStyle(
                        fontWeight: FontWeight.bold, fontSize: 15)),
                const SizedBox(height: 2),
                Text(user.email,
                    style: const TextStyle(
                        color: BreshopColors.grey500, fontSize: 12)),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: _roleColor.withAlpha(25),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        _roleLabel,
                        style: TextStyle(
                            color: _roleColor,
                            fontSize: 10,
                            fontWeight: FontWeight.bold),
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Icon(Icons.wallet,
                        size: 14, color: BreshopColors.grey500),
                    const SizedBox(width: 4),
                    Text(
                      '${user.balance} Coins',
                      style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: BreshopColors.grey700),
                    ),
                  ],
                ),
              ],
            ),
          ),
          if (user.role == UserRole.user.name.toUpperCase() ||
              user.role == 'USER')
            IconButton(
              icon: const Icon(Icons.add_circle_outline,
                  color: BreshopColors.success),
              tooltip: 'Adicionar Coins',
              onPressed: () => _showTopupDialog(context, ref),
            ),
        ],
      ),
    );
  }

  void _showTopupDialog(BuildContext context, WidgetRef ref) {
    final ctrl = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Adicionar Coins — ${user.name}'),
        content: TextField(
          controller: ctrl,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(
            labelText: 'Quantidade de Coins',
            prefixIcon: Icon(Icons.wallet),
          ),
          autofocus: true,
        ),
        actions: [
          TextButton(
            onPressed: () => ctx.pop(),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () async {
              final amount = int.tryParse(ctrl.text.trim());
              if (amount == null || amount <= 0) return;
              ctx.pop();
              final ok = await ref
                  .read(adminUsersProvider.notifier)
                  .topup(user.id, amount);
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                  content: Text(ok
                      ? '$amount Coins adicionados para ${user.name}!'
                      : 'Erro ao adicionar Coins.'),
                  backgroundColor:
                      ok ? BreshopColors.success : BreshopColors.error,
                ));
              }
            },
            child: const Text('ADICIONAR'),
          ),
        ],
      ),
    );
  }
}

// ─── Tags Tab ─────────────────────────────────────────────────────────────────

class _TagsTab extends ConsumerStatefulWidget {
  @override
  ConsumerState<_TagsTab> createState() => _TagsTabState();
}

class _TagsTabState extends ConsumerState<_TagsTab> {
  final _ctrl = TextEditingController();

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(adminTagsProvider);

    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Input
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _ctrl,
                  textCapitalization: TextCapitalization.words,
                  decoration: const InputDecoration(
                    hintText: 'Nova tag...',
                    prefixIcon: Icon(Icons.local_offer_outlined),
                  ),
                  onSubmitted: (_) => _addTag(),
                ),
              ),
              const SizedBox(width: 12),
              ElevatedButton(
                onPressed: state.isLoading ? null : _addTag,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 16),
                ),
                child: const Icon(Icons.add, size: 20),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Label
          Text(
            'TAGS ATIVAS — ${state.tags.length}',
            style: const TextStyle(
              fontSize: 9,
              fontWeight: FontWeight.w900,
              color: BreshopColors.grey400,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 12),

          // Tags
          if (state.isLoading)
            const Center(child: CircularProgressIndicator())
          else if (state.error != null && state.tags.isEmpty)
            Center(
              child: TextButton(
                onPressed: () =>
                    ref.read(adminTagsProvider.notifier).fetchTags(),
                child: const Text('Tentar novamente'),
              ),
            )
          else
            Expanded(
              child: SingleChildScrollView(
                child: Wrap(
                  spacing: 8,
                  runSpacing: 10,
                  children: state.tags.map((tag) {
                    return Chip(
                      label: Text(
                        '#${tag.name}',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: BreshopColors.foreground,
                        ),
                      ),
                      backgroundColor: BreshopColors.white,
                      side: const BorderSide(color: BreshopColors.grey300),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20)),
                      deleteIcon: const Icon(Icons.cancel,
                          size: 16, color: BreshopColors.grey500),
                      onDeleted: () => _deleteTag(tag.id, tag.name),
                    );
                  }).toList(),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Future<void> _addTag() async {
    final name = _ctrl.text.trim();
    if (name.isEmpty) return;
    _ctrl.clear();
    final ok = await ref.read(adminTagsProvider.notifier).addTag(name);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(ok ? 'Tag "$name" criada!' : 'Erro ao criar tag.'),
        backgroundColor: ok ? BreshopColors.success : BreshopColors.error,
      ));
    }
  }

  Future<void> _deleteTag(String id, String name) async {
    final ok = await ref.read(adminTagsProvider.notifier).deleteTag(id);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content:
            Text(ok ? 'Tag "#$name" removida.' : 'Erro ao remover tag.'),
        backgroundColor: ok ? BreshopColors.grey700 : BreshopColors.error,
      ));
    }
  }
}
