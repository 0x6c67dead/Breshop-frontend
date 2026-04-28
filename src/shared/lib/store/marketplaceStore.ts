import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'ADMIN' | 'BRECHO_OWNER' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  brechoId?: string;
}

export interface DbItem {
  id: string;
  title: string;
  price: number;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD_PENDING_DELIVERY' | 'DELIVERED_PENDING_CONFIRMATION' | 'COMPLETED' | 'CANCELLED' | 'RETURNED_TO_STORE' | 'SOLD_OUTSIDE_APP';
  brechoId: string;
  createdAt: string;
  brecho?: { id: string; name: string };
}

export interface DbOrder {
  id: string;
  userId: string;
  itemId: string;
  status: 'RESERVED' | 'APPROVED' | 'REJECTED' | 'AWAITING_DELIVERY' | 'DELIVERED_PENDING_CONFIRMATION' | 'COMPLETED' | 'CANCELLED';
  total: number;
  createdAt: string;
  rejectionReason?: string;
  rejectionAction?: string;
  item?: DbItem & { brecho?: { id: string; name: string } };
  user?: { id: string; name: string; email: string };
}

interface MarketplaceStore {
  // Auth
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;

  // Wallet
  balance: number;
  locked: number;
  fetchWallet: () => Promise<void>;
  addCoins: (amount: number) => Promise<void>;

  // Items/Pieces
  items: DbItem[];
  loadingItems: boolean;
  loadingPiece: Record<string, boolean>;
  fetchItems: () => Promise<void>;

  // Reserve
  reserveItem: (itemId: string) => Promise<void>;

  // Orders
  orders: DbOrder[];
  fetchMyOrders: () => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;

  // Brecho orders (for OWNER)
  brechoOrders: DbOrder[];
  fetchBrechoOrders: () => Promise<void>;
  approveOrder: (orderId: string) => Promise<void>;
  rejectOrder: (orderId: string, reason: string, action: string) => Promise<void>;
  confirmDelivery: (orderId: string) => Promise<void>;

  // Favorites (local only)
  favorites: string[];
  toggleFavorite: (itemId: string) => void;
}

export const useMarketplaceStore = create<MarketplaceStore>()(
  persist(
    (set, get) => ({
      user: null,
      balance: 0,
      locked: 0,
      items: [],
      loadingItems: false,
      loadingPiece: {},
      orders: [],
      brechoOrders: [],
      favorites: [],

      login: async (email, password) => {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? 'Falha no login');
        }
        const userData = await res.json();
        document.cookie = `user-role=${userData.role}; path=/; max-age=86400`;
        set({
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            brechoId: userData.brechoId,
          },
          balance: userData.balance ?? 0,
          locked: userData.locked ?? 0,
        });
      },

      logout: () => {
        document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        set({ user: null, balance: 0, locked: 0, items: [], orders: [], brechoOrders: [] });
      },

      fetchWallet: async () => {
        const { user } = get();
        if (!user) return;
        const res = await fetch(`/api/wallet/topup`, {
          method: 'GET',
        }).catch(() => null);
        // fallback: re-fetch via login data, wallet is part of user session
        const walletRes = await fetch(`/api/orders/mine?userId=${user.id}`).catch(() => null);
        if (!walletRes?.ok) return;
      },

      addCoins: async (amount) => {
        const { user } = get();
        if (!user) return;
        const res = await fetch('/api/wallet/topup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, amount }),
        });
        if (res.ok) {
          set((state) => ({ balance: state.balance + amount }));
        }
      },

      fetchItems: async () => {
        set({ loadingItems: true });
        try {
          const res = await fetch('/api/items');
          if (res.ok) {
            const data = await res.json();
            set({ items: data });
          }
        } finally {
          set({ loadingItems: false });
        }
      },

      reserveItem: async (itemId) => {
        const { user } = get();
        if (!user) throw new Error('Faça login para reservar');

        set((state) => ({ loadingPiece: { ...state.loadingPiece, [itemId]: true } }));

        try {
          // Optimistic update
          set((state) => ({
            items: state.items.map((i) =>
              i.id === itemId ? { ...i, status: 'RESERVED' as const } : i
            ),
          }));

          const res = await fetch('/api/orders/reserve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, itemId }),
          });

          if (!res.ok) {
            // Revert optimistic update on failure
            set((state) => ({
              items: state.items.map((i) =>
                i.id === itemId ? { ...i, status: 'AVAILABLE' as const } : i
              ),
            }));
            const err = await res.json();
            throw new Error(err.error ?? 'Falha ao reservar');
          }

          const order = await res.json();
          set((state) => ({
            orders: [order, ...state.orders],
            balance: state.balance - (get().items.find((i) => i.id === itemId)?.price ?? 0),
          }));
        } finally {
          set((state) => {
            const lp = { ...state.loadingPiece };
            delete lp[itemId];
            return { loadingPiece: lp };
          });
        }
      },

      fetchMyOrders: async () => {
        const { user } = get();
        if (!user) return;
        const res = await fetch(`/api/orders/mine?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          set({ orders: data });
        }
      },

      cancelOrder: async (orderId) => {
        const res = await fetch(`/api/orders/${orderId}/reject`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: 'OTHER', action: 'RETURN_TO_STORE' }),
        });
        if (res.ok) {
          set((state) => ({
            orders: state.orders.map((o) =>
              o.id === orderId ? { ...o, status: 'CANCELLED' as const } : o
            ),
          }));
          // Revert item to AVAILABLE in local state
          const order = get().orders.find((o) => o.id === orderId);
          if (order) {
            set((state) => ({
              items: state.items.map((i) =>
                i.id === order.itemId ? { ...i, status: 'AVAILABLE' as const } : i
              ),
            }));
          }
        }
      },

      fetchBrechoOrders: async () => {
        const { user } = get();
        if (!user?.brechoId) return;
        const res = await fetch(`/api/orders/brecho/${user.brechoId}`);
        if (res.ok) {
          const data = await res.json();
          set({ brechoOrders: data });
        }
      },

      approveOrder: async (orderId) => {
        const res = await fetch(`/api/orders/${orderId}/approve`, { method: 'POST' });
        if (res.ok) {
          set((state) => ({
            brechoOrders: state.brechoOrders.map((o) =>
              o.id === orderId ? { ...o, status: 'APPROVED' as const } : o
            ),
          }));
        }
      },

      rejectOrder: async (orderId, reason, action) => {
        const res = await fetch(`/api/orders/${orderId}/reject`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason, action }),
        });
        if (res.ok) {
          const order = get().brechoOrders.find((o) => o.id === orderId);
          set((state) => ({
            brechoOrders: state.brechoOrders.map((o) =>
              o.id === orderId ? { ...o, status: 'REJECTED' as const } : o
            ),
          }));
          if (order && action === 'RETURN_TO_STORE') {
            set((state) => ({
              items: state.items.map((i) =>
                i.id === order.itemId ? { ...i, status: 'AVAILABLE' as const } : i
              ),
            }));
          }
        }
      },

      confirmDelivery: async (orderId) => {
        const res = await fetch(`/api/orders/${orderId}/confirm`, { method: 'POST' });
        if (res.ok) {
          set((state) => ({
            brechoOrders: state.brechoOrders.map((o) =>
              o.id === orderId ? { ...o, status: 'COMPLETED' as const } : o
            ),
          }));
        }
      },

      toggleFavorite: (itemId) =>
        set((state) => ({
          favorites: state.favorites.includes(itemId)
            ? state.favorites.filter((id) => id !== itemId)
            : [...state.favorites, itemId],
        })),
    }),
    {
      name: 'breshop-storage',
      partialize: (state) => ({
        user: state.user,
        balance: state.balance,
        locked: state.locked,
        favorites: state.favorites,
      }),
    }
  )
);
