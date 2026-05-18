import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/colors.dart';

class ShopDashboardScreen extends ConsumerStatefulWidget {
  const ShopDashboardScreen({super.key});

  @override
  ConsumerState<ShopDashboardScreen> createState() => _ShopDashboardScreenState();
}

class _ShopDashboardScreenState extends ConsumerState<ShopDashboardScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<Map<String, dynamic>> _myProducts = [
    {'id': '1', 'name': 'Jaqueta Jeans Vintage', 'price': 150.0, 'status': 'Disponível'},
    {'id': '2', 'name': 'Calça de Alfaiataria', 'price': 80.0, 'status': 'Reservado'},
    {'id': '3', 'name': 'Bota de Couro', 'price': 200.0, 'status': 'Vendido'},
  ];

  final List<Map<String, dynamic>> _incomingOrders = [
    {'id': 'order1', 'product': 'Calça de Alfaiataria', 'buyer': 'Amanda Rocha', 'date': 'Hoje, 14:30', 'amount': 80.0},
  ];

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

  void _approveOrder(String orderId) {
    setState(() {
      _incomingOrders.removeWhere((o) => o['id'] == orderId);
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Reserva confirmada! Combine a entrega com o comprador.'),
        backgroundColor: BreshopColors.success,
      ),
    );
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
          'MEU BRECHÓ',
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
            Tab(text: 'Inventário'),
            Tab(text: 'Reservas Recebidas'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildInventoryTab(),
          _buildOrdersTab(),
        ],
      ),
    );
  }

  Widget _buildInventoryTab() {
    return Column(
      children: [
        // Resumo Stats
        Padding(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              Expanded(
                child: _buildStatCard(
                  title: 'Disponíveis',
                  value: '12',
                  icon: Icons.checkroom_outlined,
                  color: BreshopColors.black,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard(
                  title: 'Vendas Totais',
                  value: '450',
                  icon: Icons.wallet,
                  color: BreshopColors.success,
                  suffix: ' C',
                ),
              ),
            ],
          ),
        ),
        
        const Divider(height: 1, color: BreshopColors.grey200),
        
        // Add Button
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: ElevatedButton.icon(
            onPressed: () {
              // TODO: Navigate to create product form
            },
            icon: const Icon(Icons.add, color: BreshopColors.white),
            label: const Text('CADASTRAR NOVO PRODUTO'),
            style: ElevatedButton.styleFrom(
              minimumSize: const Size(double.infinity, 50),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ),

        // List
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            itemCount: _myProducts.length,
            itemBuilder: (context, index) {
              final product = _myProducts[index];
              final isAvailable = product['status'] == 'Disponível';
              
              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: BreshopColors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: BreshopColors.grey200),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        color: BreshopColors.grey100,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.image_not_supported_outlined, color: BreshopColors.grey400),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            product['name'],
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'C ${product['price'].toStringAsFixed(0)}',
                            style: const TextStyle(fontWeight: FontWeight.bold, color: BreshopColors.grey700),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: isAvailable ? BreshopColors.success.withOpacity(0.1) : BreshopColors.grey200,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        product['status'],
                        style: TextStyle(
                          color: isAvailable ? BreshopColors.success : BreshopColors.grey600,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildOrdersTab() {
    if (_incomingOrders.isEmpty) {
      return const Center(
        child: Text(
          'Nenhuma reserva recebida ainda.',
          style: TextStyle(color: BreshopColors.grey600),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: _incomingOrders.length,
      itemBuilder: (context, index) {
        final order = _incomingOrders[index];
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
                    const Text(
                      'Nova Reserva',
                      style: TextStyle(
                        color: BreshopColors.success,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                    Text(
                      order['date'],
                      style: const TextStyle(color: BreshopColors.grey500, fontSize: 12),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  order['product'],
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(Icons.person_outline, size: 16, color: BreshopColors.grey500),
                    const SizedBox(width: 8),
                    Text('Comprador: ${order['buyer']}', style: const TextStyle(color: BreshopColors.grey700)),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.wallet, size: 16, color: BreshopColors.grey500),
                    const SizedBox(width: 8),
                    Text('Valor: C ${order['amount'].toStringAsFixed(0)}', style: const TextStyle(fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => _approveOrder(order['id']),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    child: const Text('CONFIRMAR RESERVA'),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildStatCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
    String suffix = '',
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: BreshopColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: BreshopColors.grey200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: BreshopColors.grey500),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(color: BreshopColors.grey600, fontSize: 12, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            '$value$suffix',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w900,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}
