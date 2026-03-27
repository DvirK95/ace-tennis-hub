import { useMemo } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePersonStore } from "@/stores/usePersonStore";
import { useRolePermissionStore } from "@/stores/useRolePermissionStore";
import type { Permission } from "@/types/permissions";

export function usePermissions() {
  const currentUserId = useAuthStore((s) => s.currentUserId);
  const person = usePersonStore((s) => s.people.find((p) => p.id === currentUserId));
  const rolePermissions = useRolePermissionStore((s) => s.rolePermissions);

  const permissions = useMemo<Permission[]>(() => {
    if (!person) return [];
    const perms = new Set<Permission>();
    for (const role of person.roles) {
      const rp = rolePermissions[role];
      if (rp) rp.forEach((p) => perms.add(p));
    }
    return [...perms];
  }, [person, rolePermissions]);

  function canAccess(permission: Permission): boolean {
    return permissions.includes(permission);
  }

  function canAccessAny(perms: Permission[]): boolean {
    return perms.some((p) => permissions.includes(p));
  }

  return { currentUser: person, canAccess, canAccessAny };
}
