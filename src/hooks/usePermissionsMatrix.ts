import { useRolePermissionStore } from '@/stores/useRolePermissionStore';
import { PERMISSIONS, type Permission } from '@/types/permissions';
import { USER_ROLES, type UserRole } from '@/types/schemas';

export function usePermissionsMatrix() {
  const { rolePermissions, toggleRolePermission } = useRolePermissionStore();

  function hasPermission(role: UserRole, permission: Permission): boolean {
    return rolePermissions[role]?.includes(permission) ?? false;
  }

  return {
    roles: USER_ROLES,
    permissions: PERMISSIONS,
    hasPermission,
    toggleRolePermission,
  };
}
