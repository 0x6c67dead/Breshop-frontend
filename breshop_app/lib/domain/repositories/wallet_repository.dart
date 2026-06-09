import '../entities/coin_wallet.dart';

abstract class WalletRepository {
  Future<CoinWallet> getBrechoBalance(String brechoId);
  Future<void> topup(String userId, int amount);
  Future<void> withdraw(String brechoId, int amount);
}
