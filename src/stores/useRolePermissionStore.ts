import { create } from "zustand";
import type { Permission } from "@/types/permissions";
import type { UserRole } from "@/types/schemas";

type RolePermissionMap = Record<UserRole, Permission[]>;

interface RolePermissionState {
  rolePermissions: RolePermissionMap;
  toggleRolePermission: (role: UserRole, permission: Permission) => void;
}

const DEFAULT_MAP: RolePermissionMap = {
  ADMIN: [
    "MANAGE_COURTS",
    "MANAGE_USERS",
    "MANAGE_CALENDAR",
    "MANAGE_GROUPS",
    "APPROVE_BOOKINGS",
    "CREATE_BOOKING",
    "VIEW_ALL_SCHEDULES",
  ],
  COACH: [
    "MANAGE_GROUPS",
    "VIEW_ALL_SCHEDULES",
    "CREATE_BOOKING",
    "APPROVE_BOOKINGS",
  ],
  TRAINEE: [
    "CREATE_BOOKING",
    "VIEW_ALL_SCHEDULES",
  ],
};

export const useRolePermissionStore = create<RolePermissionState>((set) => ({
  rolePermissions: DEFAULT_MAP,
  toggleRolePermission: (role, permission) =>
    set((s) => {
      const current = s.rolePermissions[role];
      const has = current.includes(permission);
      return {
        rolePermissions: {
          ...s.rolePermissions,
          [role]: has ? current.filter((p) => p !== permission) : [...current, permission],
        },
      };
    }),
}));
