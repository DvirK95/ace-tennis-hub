import { create } from "zustand";
import type { AppUser, Permission } from "@/types/permissions";

interface AuthState {
  currentUser: AppUser;
  setCurrentUser: (user: AppUser) => void;
  hasPermission: (permission: Permission) => boolean;
}

const DEFAULT_ADMIN: AppUser = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Club Admin",
  email: "admin@aceclub.com",
  permissions: [
    "MANAGE_COURTS",
    "MANAGE_USERS",
    "MANAGE_COACHES",
    "MANAGE_GROUPS",
    "APPROVE_BOOKINGS",
    "CREATE_BOOKING",
    "VIEW_ALL_SCHEDULES",
  ],
};

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: DEFAULT_ADMIN,
  setCurrentUser: (user) => set({ currentUser: user }),
  hasPermission: (permission) => get().currentUser.permissions.includes(permission),
}));
