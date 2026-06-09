import '../../domain/entities/coin_wallet.dart';
import '../../domain/repositories/wallet_repository.dart';
import '../http_client/http_client.dart';

class WalletRepositoryImpl implements WalletRepository {
  final HttpClient client;

  WalletRepositoryImpl({required this.client});

  @override
  Future<CoinWallet> getBrechoBalance(String brechoId) async {
    final data = await client.getRequest('/api/wallet/balance?brechoId=$brechoId');
    return CoinWallet.fromJson(data);
  }

  @override
  Future<void> topup(String userId, int amount) async {
    await client.postRequest('/api/wallet/topup', body: {
      'userId': userId,
      'amount': amount,
    });
  }

  @override
  Future<void> withdraw(String brechoId, int amount) async {
    await client.postRequest('/api/wallet/withdraw', body: {
      'brechoId': brechoId,
      'amount': amount,
    });
  }
}
