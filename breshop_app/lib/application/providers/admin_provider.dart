import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../infrastructure/http_client/http_client.dart';
import 'infrastructure_providers.dart';

// ─── Models ──────────────────────────────────────────────────────────────────

class AdminUser {
  final String id;
  final String name;
  final String email;
  final String role;
  final int balance;
  final int locked;

  const AdminUser({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.balance,
    required this.locked,
  });

  factory AdminUser.fromJson(Map<String, dynamic> j) {
    final wallet = j['wallet'] as Map<String, dynamic>?;
    return AdminUser(
      id: j['id'] as String,
      name: j['name'] as String,
      email: j['email'] as String,
      role: j['role'] as String,
      balance: wallet?['balance'] as int? ?? 0,
      locked: wallet?['locked'] as int? ?? 0,
    );
  }
}

class AdminTag {
  final String id;
  final String name;

  const AdminTag({required this.id, required this.name});

  factory AdminTag.fromJson(Map<String, dynamic> j) => AdminTag(
        id: j['id'] as String,
        name: j['name'] as String,
      );
}

// ─── Users provider ───────────────────────────────────────────────────────────

class AdminUsersState {
  final List<AdminUser> users;
  final bool isLoading;
  final String? error;

  const AdminUsersState({
    this.users = const [],
    this.isLoading = false,
    this.error,
  });

  AdminUsersState copyWith({
    List<AdminUser>? users,
    bool? isLoading,
    String? error,
    bool clearError = false,
  }) {
    return AdminUsersState(
      users: users ?? this.users,
      isLoading: isLoading ?? this.isLoading,
      error: clearError ? null : error ?? this.error,
    );
  }
}

class AdminUsersNotifier extends StateNotifier<AdminUsersState> {
  final HttpClient client;

  AdminUsersNotifier({required this.client}) : super(const AdminUsersState()) {
    fetchUsers();
  }

  Future<void> fetchUsers() async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final list = await client.getListRequest('/api/admin/users');
      final users = list
          .map((e) => AdminUser.fromJson(e as Map<String, dynamic>))
          .toList();
      state = state.copyWith(users: users, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<bool> topup(String userId, int amount) async {
    try {
      await client.postRequest('/api/wallet/topup', body: {
        'userId': userId,
        'amount': amount,
      });
      await fetchUsers();
      return true;
    } catch (_) {
      return false;
    }
  }
}

final adminUsersProvider =
    StateNotifierProvider<AdminUsersNotifier, AdminUsersState>((ref) {
  return AdminUsersNotifier(client: ref.watch(httpClientProvider));
});

// ─── Tags provider ────────────────────────────────────────────────────────────

class AdminTagsState {
  final List<AdminTag> tags;
  final bool isLoading;
  final String? error;

  const AdminTagsState({
    this.tags = const [],
    this.isLoading = false,
    this.error,
  });

  AdminTagsState copyWith({
    List<AdminTag>? tags,
    bool? isLoading,
    String? error,
    bool clearError = false,
  }) {
    return AdminTagsState(
      tags: tags ?? this.tags,
      isLoading: isLoading ?? this.isLoading,
      error: clearError ? null : error ?? this.error,
    );
  }
}

class AdminTagsNotifier extends StateNotifier<AdminTagsState> {
  final HttpClient client;

  AdminTagsNotifier({required this.client}) : super(const AdminTagsState()) {
    fetchTags();
  }

  Future<void> fetchTags() async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final list = await client.getListRequest('/api/admin/tags');
      final tags = list
          .map((e) => AdminTag.fromJson(e as Map<String, dynamic>))
          .toList();
      state = state.copyWith(tags: tags, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<bool> addTag(String name) async {
    try {
      final data =
          await client.postRequest('/api/admin/tags', body: {'name': name});
      final tag = AdminTag.fromJson(data);
      state = state.copyWith(tags: [...state.tags, tag]
        ..sort((a, b) => a.name.compareTo(b.name)));
      return true;
    } catch (_) {
      return false;
    }
  }

  Future<bool> deleteTag(String id) async {
    try {
      await client.deleteRequest('/api/admin/tags/$id');
      state = state.copyWith(
          tags: state.tags.where((t) => t.id != id).toList());
      return true;
    } catch (_) {
      return false;
    }
  }
}

final adminTagsProvider =
    StateNotifierProvider<AdminTagsNotifier, AdminTagsState>((ref) {
  return AdminTagsNotifier(client: ref.watch(httpClientProvider));
});
