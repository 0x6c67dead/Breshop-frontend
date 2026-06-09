import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/coin_wallet.dart';
import '../../domain/repositories/wallet_repository.dart';
import '../../infrastructure/repositories/wallet_repository_impl.dart';
import 'infrastructure_providers.dart';
import 'auth_provider.dart';

final walletRepositoryProvider = Provider<WalletRepository>((ref) {
  return WalletRepositoryImpl(client: ref.watch(httpClientProvider));
});

class WalletState {
  final CoinWallet? wallet;
  final bool isLoading;
  final String? error;

  const WalletState({this.wallet, this.isLoading = false, this.error});

  WalletState copyWith({CoinWallet? wallet, bool? isLoading, String? error, bool clearError = false}) {
    return WalletState(
      wallet: wallet ?? this.wallet,
      isLoading: isLoading ?? this.isLoading,
      error: clearError ? null : error ?? this.error,
    );
  }
}

class WalletNotifier extends StateNotifier<WalletState> {
  final WalletRepository repository;
  final String? brechoId;
  final String? userId;

  WalletNotifier({required this.repository, this.brechoId, this.userId})
      : super(const WalletState()) {
    if (brechoId != null && brechoId!.isNotEmpty) fetchBalance();
  }

  Future<void> fetchBalance() async {
    if (brechoId == null || brechoId!.isEmpty) return;
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final wallet = await repository.getBrechoBalance(brechoId!);
      state = state.copyWith(wallet: wallet, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<bool> topup(int amount) async {
    if (userId == null) return false;
    try {
      await repository.topup(userId!, amount);
      return true;
    } catch (e) {
      state = state.copyWith(error: e.toString());
      return false;
    }
  }

  Future<bool> withdraw(int amount) async {
    if (brechoId == null || brechoId!.isEmpty) return false;
    try {
      await repository.withdraw(brechoId!, amount);
      await fetchBalance();
      return true;
    } catch (e) {
      state = state.copyWith(error: e.toString());
      return false;
    }
  }
}

final walletProvider = StateNotifierProvider<WalletNotifier, WalletState>((ref) {
  final user = ref.watch(authProvider).user;
  final repository = ref.watch(walletRepositoryProvider);
  return WalletNotifier(
    repository: repository,
    brechoId: user?.brechoId,
    userId: user?.id,
  );
});
