import { create } from 'zustand';
import type { AuthenticatedUser } from '@/schemas/models';

interface AuthState {
  authUser: AuthenticatedUser | null;
  currentUserId: string;
  setAuthUser: (authUser: AuthenticatedUser | null) => void;
  setCurrentUserId: (id: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  currentUserId: '',
  setAuthUser: (authUser) =>
    set({
      authUser,
      currentUserId: authUser?.sub ?? '',
    }),
  setCurrentUserId: (id) => set({ currentUserId: id }),
}));
