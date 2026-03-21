import { useAuthStore } from "@/stores/useAuthStore";
import type { Permission } from "@/types/permissions";

export function usePermissions() {
  const { currentUser, hasPermission } = useAuthStore();

  function canAccess(permission: Permission): boolean {
    return hasPermission(permission);
  }

  function canAccessAny(permissions: Permission[]): boolean {
    return permissions.some((p) => hasPermission(p));
  }

  return { currentUser, canAccess, canAccessAny };
}
