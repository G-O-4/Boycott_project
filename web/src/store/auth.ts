import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username?: string;
  email: string;
  displayName?: string;
  displayNameAr?: string;
  avatar?: string;
  city?: string;
  language?: string;
  role?: string;
  reputationLevel?: number;
  scoreTotal?: number;

  createdAt?: string;

}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) set({ user: { ...currentUser, ...updates } });
      },
    }),
    { name: 'auth-storage' }
  )
);
