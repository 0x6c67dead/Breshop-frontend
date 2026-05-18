import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/colors.dart';

class AdminPanelScreen extends ConsumerStatefulWidget {
  const AdminPanelScreen({super.key});

  @override
  ConsumerState<AdminPanelScreen> createState() => _AdminPanelScreenState();
}

class _AdminPanelScreenState extends ConsumerState<AdminPanelScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Mock Data for Admin Operations
  final List<Map<String, dynamic>> _pendingBrechos = [
    {'id': '1', 'name': 'Brechó Vintage Retro', 'owner': 'Mariana Souza', 'email': 'mariana@email.com', 'date': '15/05/2026'},
    {'id': '2', 'name': 'Eco Chic Closet', 'owner': 'Carlos Lima', 'email': 'carlos@email.com', 'date': '17/05/2026'},
  ];

  final List<Map<String, dynamic>> _users = [
    {'id': '101', 'name': 'Amanda Rocha', 'email': 'amanda@email.com', 'role': 'USER', 'wallet': 350},
    {'id': '102', 'name': 'Bruno Alencar', 'email': 'bruno@email.com', 'role': 'BRECHO_OWNER', 'wallet': 1200},
    {'id': '103', 'name': 'Carla Mendes', 'email': 'carla@email.com', 'role': 'ADMIN', 'wallet': 5000},
    {'id': '104', 'name': 'Diego Costa', 'email': 'diego@email.com', 'role': 'USER', 'wallet': 50},
  ];

  final List<String> _tags = ['Vintage', 'Couro', 'Inverno', 'Anos 90', 'Grife', 'Casual', 'Sportswear'];
  final _newTagController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _newTagController.dispose();
    super.dispose();
  }

  void _approveBrecho(String id, String name) {
    setState(() {
      _pendingBrechos.removeWhere((b) => b['id'] == id);
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Brechó "$name" aprovado com sucesso!'),
        backgroundColor: BreshopColors.success,
      ),
    );
  }

  void _rejectBrecho(String id, String name) {
    setState(() {
      _pendingBrechos.removeWhere((b) => b['id'] == id);
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Solicitação de "$name" recusada.'),
        backgroundColor: BreshopColors.error,
      ),
    );
  }

  void _addTag() {
    final text = _newTagController.text.trim();
    if (text.isNotEmpty && !_tags.contains(text)) {
      setState(() {
        _tags.add(text);
      });
      _newTagController.clear();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Tag adicionada com sucesso!'),
          backgroundColor: BreshopColors.success,
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
        title: const Text(
          'PAINEL ADMINISTRATIVO',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w900,
            letterSpacing: 1.0,
          ),
        ),
        centerTitle: true,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: BreshopColors.black,
          labelColor: BreshopColors.black,
          unselectedLabelColor: BreshopColors.grey500,
          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
          tabs: const [
            Tab(text: 'Solicitações'),
            Tab(text: 'Usuários'),
            Tab(text: 'Tags'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildPendingTab(),
          _buildUsersTab(),
          _buildTagsTab(),
        ],
      ),
    );
  }

  // 1. Pending Tab (Aprovar/Recusar novos brechós)
  Widget _buildPendingTab() {
    if (_pendingBrechos.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.check_circle_outline, size: 64, color: BreshopColors.grey400),
            const SizedBox(height: 16),
            Text(
              'Tudo limpo por aqui!',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(fontSize: 20),
            ),
            const SizedBox(height: 4),
            const Text(
              'Nenhum brechó aguardando aprovação.',
              style: TextStyle(color: BreshopColors.grey600),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: _pendingBrechos.length,
      itemBuilder: (context, index) {
        final brecho = _pendingBrechos[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 16),
          color: BreshopColors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(color: BreshopColors.grey200),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        brecho['name'],
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: BreshopColors.warning.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Text(
                        'Pendente',
                        style: TextStyle(
                          color: BreshopColors.warning,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    const Icon(Icons.person_outline, size: 16, color: BreshopColors.grey500),
                    const SizedBox(width: 8),
                    Text('Dono: ${brecho['owner']}', style: const TextStyle(color: BreshopColors.grey700)),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.email_outlined, size: 16, color: BreshopColors.grey500),
                    const SizedBox(width: 8),
                    Text('Email: ${brecho['email']}', style: const TextStyle(color: BreshopColors.grey700)),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.calendar_today_outlined, size: 16, color: BreshopColors.grey500),
                    const SizedBox(width: 8),
                    Text('Solicitado em: ${brecho['date']}', style: const TextStyle(color: BreshopColors.grey700)),
                  ],
                ),
                const SizedBox(height: 20),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => _rejectBrecho(brecho['id'], brecho['name']),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: BreshopColors.error,
                          side: const BorderSide(color: BreshopColors.error),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        child: const Text('RECUSAR'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () => _approveBrecho(brecho['id'], brecho['name']),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: BreshopColors.black,
                          foregroundColor: BreshopColors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        child: const Text('APROVAR'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // 2. Users Tab (Listar usuários com informações e saldos)
  Widget _buildUsersTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: _users.length,
      itemBuilder: (context, index) {
        final user = _users[index];
        final bool isAdmin = user['role'] == 'ADMIN';
        final bool isOwner = user['role'] == 'BRECHO_OWNER';
        
        Color badgeColor = BreshopColors.grey600;
        String badgeText = 'Cliente';
        if (isAdmin) {
          badgeColor = Colors.purple;
          badgeText = 'Admin';
        } else if (isOwner) {
          badgeColor = BreshopColors.black;
          badgeText = 'Lojista';
        }

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
                backgroundColor: badgeColor.withOpacity(0.1),
                child: Text(
                  user['name'][0],
                  style: TextStyle(color: badgeColor, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      user['name'],
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      user['email'],
                      style: const TextStyle(color: BreshopColors.grey500, fontSize: 13),
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: badgeColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            badgeText,
                            style: TextStyle(color: badgeColor, fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Icon(Icons.wallet, size: 14, color: BreshopColors.grey500),
                        const SizedBox(width: 4),
                        Text(
                          '${user['wallet']} Coins',
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: BreshopColors.grey800),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.more_vert, color: BreshopColors.grey500),
                onPressed: () {
                  _showUserActionsBottomSheet(user);
                },
              )
            ],
          ),
        );
      },
    );
  }

  void _showUserActionsBottomSheet(Map<String, dynamic> user) {
    showModalBottomSheet(
      context: context,
      backgroundColor: BreshopColors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  user['name'],
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 4),
                Text(
                  user['email'],
                  style: const TextStyle(color: BreshopColors.grey500),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                ListTile(
                  leading: const Icon(Icons.add_circle_outline, color: BreshopColors.success),
                  title: const Text('Adicionar Coins Bonificados'),
                  onTap: () {
                    context.pop();
                    // Implementação de simulação de bônus
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Coins creditados para ${user['name']}!'),
                        backgroundColor: BreshopColors.success,
                      ),
                    );
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.admin_panel_settings_outlined, color: BreshopColors.black),
                  title: const Text('Alterar Função (Role)'),
                  onTap: () {
                    context.pop();
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Função de usuário atualizada.')),
                    );
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.block, color: BreshopColors.error),
                  title: const Text('Suspender Usuário', style: TextStyle(color: BreshopColors.error)),
                  onTap: () {
                    context.pop();
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Usuário ${user['name']} suspenso.'),
                        backgroundColor: BreshopColors.error,
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // 3. Tags Tab (Adicionar e remover Tags de Produto)
  Widget _buildTagsTab() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _newTagController,
                  decoration: const InputDecoration(
                    hintText: 'Adicionar nova tag...',
                    prefixIcon: Icon(Icons.local_offer_outlined),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              ElevatedButton(
                onPressed: _addTag,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Icon(Icons.add, color: BreshopColors.white),
              )
            ],
          ),
          const SizedBox(height: 24),
          const Text(
            'Tags Ativas no App',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 12),
          Expanded(
            child: SingleChildScrollView(
              child: Wrap(
                spacing: 8,
                runSpacing: 12,
                children: _tags.map((tag) {
                  return Chip(
                    label: Text('#$tag'),
                    backgroundColor: BreshopColors.white,
                    side: const BorderSide(color: BreshopColors.grey300),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    deleteIcon: const Icon(Icons.cancel, size: 16, color: BreshopColors.grey500),
                    onDeleted: () {
                      setState(() {
                        _tags.remove(tag);
                      });
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Tag #$tag deletada.')),
                      );
                    },
                  );
                }).toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
