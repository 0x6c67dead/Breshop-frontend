import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/order.dart';
import '../../domain/repositories/order_repository.dart';
import '../../infrastructure/repositories/order_repository_impl.dart';
import 'infrastructure_providers.dart';
import 'auth_provider.dart';

final orderRepositoryProvider = Provider<OrderRepository>((ref) {
  return OrderRepositoryImpl(client: ref.watch(httpClientProvider));
});

// --- My Orders (cliente) ---

class MyOrdersState {
  final List<Order> orders;
  final bool isLoading;
  final String? error;

  const MyOrdersState({
    this.orders = const [],
    this.isLoading = false,
    this.error,
  });

  MyOrdersState copyWith({List<Order>? orders, bool? isLoading, String? error, bool clearError = false}) {
    return MyOrdersState(
      orders: orders ?? this.orders,
      isLoading: isLoading ?? this.isLoading,
      error: clearError ? null : error ?? this.error,
    );
  }
}

class MyOrdersNotifier extends StateNotifier<MyOrdersState> {
  final OrderRepository repository;
  final String userId;

  MyOrdersNotifier({required this.repository, required this.userId})
      : super(const MyOrdersState()) {
    fetchOrders();
  }

  Future<void> fetchOrders() async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final orders = await repository.getMyOrders(userId);
      state = state.copyWith(orders: orders, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> reserve(String itemId) async {
    try {
      await repository.reserveItem(userId, itemId);
      await fetchOrders();
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  Future<bool> confirmDelivery(String orderId) async {
    try {
      await repository.confirmDelivery(orderId);
      await fetchOrders();
      return true;
    } catch (e) {
      state = state.copyWith(error: e.toString());
      return false;
    }
  }
}

final myOrdersProvider = StateNotifierProvider<MyOrdersNotifier, MyOrdersState>((ref) {
  final user = ref.watch(authProvider).user;
  final repository = ref.watch(orderRepositoryProvider);
  return MyOrdersNotifier(repository: repository, userId: user?.id ?? '');
});

// --- Brecho Orders (lojista) ---

class BrechoOrdersState {
  final List<Order> orders;
  final bool isLoading;
  final String? error;

  const BrechoOrdersState({
    this.orders = const [],
    this.isLoading = false,
    this.error,
  });

  BrechoOrdersState copyWith({List<Order>? orders, bool? isLoading, String? error, bool clearError = false}) {
    return BrechoOrdersState(
      orders: orders ?? this.orders,
      isLoading: isLoading ?? this.isLoading,
      error: clearError ? null : error ?? this.error,
    );
  }
}

class BrechoOrdersNotifier extends StateNotifier<BrechoOrdersState> {
  final OrderRepository repository;
  final String brechoId;

  BrechoOrdersNotifier({required this.repository, required this.brechoId})
      : super(const BrechoOrdersState()) {
    if (brechoId.isNotEmpty) fetchOrders();
  }

  Future<void> fetchOrders({bool all = false}) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final orders = await repository.getBrechoOrders(brechoId, all: all);
      state = state.copyWith(orders: orders, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<bool> approve(String orderId) async {
    try {
      await repository.approveOrder(orderId);
      await fetchOrders();
      return true;
    } catch (e) {
      state = state.copyWith(error: e.toString());
      return false;
    }
  }

  Future<bool> reject(String orderId, RejectionReason reason, RejectionAction action) async {
    try {
      await repository.rejectOrder(orderId, reason, action);
      await fetchOrders();
      return true;
    } catch (e) {
      state = state.copyWith(error: e.toString());
      return false;
    }
  }

  Future<bool> confirmDelivery(String orderId) async {
    try {
      await repository.confirmDelivery(orderId);
      await fetchOrders();
      return true;
    } catch (e) {
      state = state.copyWith(error: e.toString());
      return false;
    }
  }
}

final brechoOrdersProvider =
    StateNotifierProvider<BrechoOrdersNotifier, BrechoOrdersState>((ref) {
  final user = ref.watch(authProvider).user;
  final repository = ref.watch(orderRepositoryProvider);
  return BrechoOrdersNotifier(
    repository: repository,
    brechoId: user?.brechoId ?? '',
  );
});
