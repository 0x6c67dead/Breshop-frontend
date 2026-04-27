import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'ADMIN' | 'OWNER' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  shopId?: string;
}

interface MarketplaceStore {
  user: User | null;
  balance: number;
  favorites: string[];
  pieces: any[]; // Using any for now to match current mock structure
  
  // Auth
  login: (role: UserRole) => void;
  logout: () => void;
  
  // Wallet
  addCoins: (amount: number) => void;
  
  // Favorites
  toggleFavorite: (productId: string) => void;
  
  // Transactions
  buyProduct: (productId: string) => void;
  confirmSale: (productId: string) => void;
}

export const useMarketplaceStore = create<MarketplaceStore>()(
  persist(
    (set) => ({
      user: null,
      balance: 1000, // Initial mock balance
      favorites: [],
      pieces: [],

      login: (role) => {
        const mockUsers: Record<UserRole, User> = {
          ADMIN: { id: 'usr-admin', name: 'Breshop Admin', email: 'admin@breshop.com', role: 'ADMIN' },
          OWNER: { id: 'usr-owner', name: 'Carlos Curador', email: 'carlos@acervo90s.com', role: 'OWNER', shopId: 'shop-1' },
          USER: { id: 'usr-common', name: 'Clara Vintage', email: 'clara@gmail.com', role: 'USER' }
        };
        // Set cookie for middleware
        document.cookie = `user-role=${role}; path=/; max-age=86400`;
        set({ user: mockUsers[role] });
      },

      logout: () => {
        document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        set({ user: null });
      },

      addCoins: (amount) => set((state) => ({ balance: state.balance + amount })),

      toggleFavorite: (productId) => set((state) => ({
        favorites: state.favorites.includes(productId)
          ? state.favorites.filter(id => id !== productId)
          : [...state.favorites, productId]
      })),

      buyProduct: (productId) => set((state) => ({
        // In a real app, we'd deduct balance and update product status
        // For MVP mock, we just alert and simulate
        balance: state.balance - 100 // Mock deduction
      })),

      confirmSale: (productId) => {
        // Logic for owner to confirm and receive coins
        console.log("Confirming sale for:", productId);
      }
    }),
    {
      name: 'breshop-storage',
    }
  )
);
