import { PERMISSIONS, PERMISSION_LABELS, type Permission } from "@/types/permissions";
import type { AppUser } from "@/types/permissions";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface UserPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AppUser | null;
  onToggle: (userId: string, permission: Permission) => void;
}

export default function UserPermissionsDialog({
  open, onOpenChange, user, onToggle,
}: UserPermissionsDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Permissions — {user.name}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          {PERMISSIONS.map((perm) => (
            <div key={perm} className="flex items-center justify-between">
              <Label htmlFor={perm} className="text-sm">{PERMISSION_LABELS[perm]}</Label>
              <Switch
                id={perm}
                checked={user.permissions.includes(perm)}
                onCheckedChange={() => onToggle(user.id, perm)}
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
