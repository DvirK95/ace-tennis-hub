import { create } from 'zustand';

interface AuthState {
  currentUserId: string;
  setCurrentUserId: (id: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUserId: '00000000-0000-0000-0000-000000000001',
  setCurrentUserId: (id) => set({ currentUserId: id }),
}));
