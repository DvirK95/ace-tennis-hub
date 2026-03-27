import { usePermissionsMatrix } from "@/hooks/usePermissionsMatrix";
import { PERMISSION_LABELS, type Permission } from "@/types/permissions";
import type { UserRole } from "@/types/schemas";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default function PermissionsMatrix() {
  const { roles, permissions, hasPermission, toggleRolePermission } = usePermissionsMatrix();

  return (
    <div className="rounded-lg border bg-card shadow-card overflow-auto animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Role</TableHead>
            {permissions.map((perm) => (
              <PermissionColumnHeader key={perm} permission={perm} />
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <RolePermissionRow
              key={role}
              role={role}
              permissions={[...permissions]}
              hasPermission={hasPermission}
              onToggle={toggleRolePermission}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface PermissionColumnHeaderProps {
  permission: Permission;
}

function PermissionColumnHeader({ permission }: PermissionColumnHeaderProps) {
  return (
    <TableHead className="text-center font-semibold text-[10px] uppercase tracking-wider min-w-[100px]">
      {PERMISSION_LABELS[permission]}
    </TableHead>
  );
}

interface RolePermissionRowProps {
  role: UserRole;
  permissions: Permission[];
  hasPermission: (role: UserRole, permission: Permission) => boolean;
  onToggle: (role: UserRole, permission: Permission) => void;
}

function RolePermissionRow({ role, permissions, hasPermission, onToggle }: RolePermissionRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium text-sm">{role}</TableCell>
      {permissions.map((perm) => (
        <PermissionCheckboxCell
          key={perm}
          checked={hasPermission(role, perm)}
          onToggle={() => onToggle(role, perm)}
        />
      ))}
    </TableRow>
  );
}

interface PermissionCheckboxCellProps {
  checked: boolean;
  onToggle: () => void;
}

function PermissionCheckboxCell({ checked, onToggle }: PermissionCheckboxCellProps) {
  return (
    <TableCell className="text-center">
      <Checkbox checked={checked} onCheckedChange={onToggle} />
    </TableCell>
  );
}
