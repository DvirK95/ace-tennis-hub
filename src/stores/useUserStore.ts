import { create } from "zustand";
import type { AppUser, Permission } from "@/types/permissions";

interface UserState {
  users: AppUser[];
  togglePermission: (userId: string, permission: Permission) => void;
}

const SEED: AppUser[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Club Admin",
    email: "admin@aceclub.com",
    permissions: ["MANAGE_COURTS", "MANAGE_USERS", "MANAGE_COACHES", "MANAGE_GROUPS", "APPROVE_BOOKINGS", "CREATE_BOOKING", "VIEW_ALL_SCHEDULES"],
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Front Desk",
    email: "desk@aceclub.com",
    permissions: ["CREATE_BOOKING", "VIEW_ALL_SCHEDULES"],
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "Head Coach",
    email: "headcoach@aceclub.com",
    permissions: ["MANAGE_GROUPS", "VIEW_ALL_SCHEDULES", "APPROVE_BOOKINGS"],
  },
];

export const useUserStore = create<UserState>((set) => ({
  users: SEED,
  togglePermission: (userId, permission) =>
    set((s) => ({
      users: s.users.map((u) => {
        if (u.id !== userId) return u;
        const has = u.permissions.includes(permission);
        return {
          ...u,
          permissions: has
            ? u.permissions.filter((p) => p !== permission)
            : [...u.permissions, permission],
        };
      }),
    })),
}));
