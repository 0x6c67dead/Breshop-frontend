import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../core/theme/colors.dart';
import '../../../domain/entities/product.dart';

class ReservationsScreen extends ConsumerStatefulWidget {
  const ReservationsScreen({super.key});

  @override
  ConsumerState<ReservationsScreen> createState() => _ReservationsScreenState();
}

class _ReservationsScreenState extends ConsumerState<ReservationsScreen> {
  // Simulando banco de dados de reservas do usuário logado
  final List<Map<String, dynamic>> _mockReservations = [
    {
      'id': 'res_1',
      'product': Product(
        id: '1',
        name: 'Camiseta Vintage 90s',
        description: 'Camiseta em ótimo estado, algodão premium.',
        price: 89.90,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'],
        category: 'Camisetas',
        size: 'G',
        status: ProductStatus.disponivel,
        condition: ProductCondition.semiNovo,
        brechoId: 'brecho_1',
        createdAt: DateTime.now(),
      ),
      'shopName': 'Brechó Vintage Sp',
      'reservationDate': '18/05/2026',
      'status': 'Aguardando Retirada',
      'code': 'BRS-8892',
    },
    {
      'id': 'res_2',
      'product': Product(
        id: '2',
        name: 'Calça Jeans Levi\'s 501',
        description: 'Clássica Levi\'s 501, leve desgaste natural.',
        price: 159.00,
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80'],
        category: 'Calças',
        size: '42',
        status: ProductStatus.disponivel,
        condition: ProductCondition.usado,
        brechoId: 'brecho_1',
        createdAt: DateTime.now(),
      ),
      'shopName': 'Retro Style Brechó',
      'reservationDate': '17/05/2026',
      'status': 'Retirado',
      'code': 'BRS-1043',
    }
  ];

  void _cancelReservation(String id) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cancelar Reserva?'),
        content: const Text('Tem certeza que deseja cancelar esta reserva? Os coins serão estornados em sua conta.'),
        actions: [
          TextButton(
            onPressed: () => context.pop(),
            child: const Text('NÃO'),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _mockReservations.removeWhere((res) => res['id'] == id);
              });
              context.pop();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Reserva cancelada e saldo reembolsado!'),
                  backgroundColor: BreshopColors.success,
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: BreshopColors.error),
            child: const Text('CANCELAR RESERVA'),
          ),
        ],
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
          'MINHAS RESERVAS',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w900,
            letterSpacing: 1.0,
          ),
        ),
        centerTitle: true,
      ),
      body: _mockReservations.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.shopping_bag_outlined,
                    size: 80,
                    color: BreshopColors.grey400,
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Nenhuma reserva ativa',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: BreshopColors.grey600,
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextButton(
                    onPressed: () => context.pop(),
                    child: const Text('Explorar Marketplace'),
                  ),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(24),
              itemCount: _mockReservations.length,
              itemBuilder: (context, index) {
                final res = _mockReservations[index];
                final Product product = res['product'];
                final bool isPending = res['status'] == 'Aguardando Retirada';

                return Container(
                  margin: const EdgeInsets.only(bottom: 20),
                  decoration: BoxDecoration(

                    color: BreshopColors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: BreshopColors.grey200),
                    boxShadow: [
                      BoxShadow(
                        color: BreshopColors.black.withAlpha(5),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      )
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Status Bar on Card
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: isPending ? BreshopColors.accentLime.withAlpha(50) : BreshopColors.grey100,
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'CÓDIGO: ${res['code']}',
                              style: const TextStyle(
                                fontWeight: FontWeight.w900,
                                fontSize: 11,
                                letterSpacing: 0.5,
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: isPending ? BreshopColors.black : BreshopColors.grey300,
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                res['status'].toString().toUpperCase(),
                                style: TextStyle(
                                  color: isPending ? BreshopColors.accentLime : BreshopColors.grey700,
                                  fontSize: 9,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Product Details Info Row
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: CachedNetworkImage(
                                imageUrl: product.images.first,
                                width: 80,
                                height: 80,
                                fit: BoxFit.cover,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    product.name,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Loja: ${res['shopName']}',
                                    style: const TextStyle(
                                      color: BreshopColors.grey600,
                                      fontSize: 13,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        'R\$ ${product.price.toStringAsFixed(2).replaceAll('.', ',')}',
                                        style: const TextStyle(
                                          fontWeight: FontWeight.w900,
                                          fontSize: 15,
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: BreshopColors.grey100,
                                          borderRadius: BorderRadius.circular(4),
                                        ),
                                        child: Text(
                                          'TAM. ${product.size}',
                                          style: const TextStyle(
                                            fontSize: 10,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Divider & Bottom Actions
                      const Divider(color: BreshopColors.grey200, height: 1),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Reservado em: ${res['reservationDate']}',
                              style: const TextStyle(color: BreshopColors.grey500, fontSize: 11),
                            ),
                            if (isPending)
                              TextButton(
                                onPressed: () => _cancelReservation(res['id']),
                                style: TextButton.styleFrom(
                                  foregroundColor: BreshopColors.error,
                                  padding: EdgeInsets.zero,
                                  minimumSize: Size.zero,
                                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                ),
                                child: const Text(
                                  'Cancelar Reserva',
                                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                                ),
                              ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
