class CoinWallet {
  final int balance;
  final int locked;
  final int totalEarned;

  const CoinWallet({
    required this.balance,
    required this.locked,
    this.totalEarned = 0,
  });

  factory CoinWallet.fromJson(Map<String, dynamic> json) => CoinWallet(
        balance: (json['balance'] as num?)?.toInt() ?? 0,
        locked: (json['locked'] as num?)?.toInt() ?? 0,
        totalEarned: (json['totalEarned'] as num?)?.toInt() ?? 0,
      );
}
