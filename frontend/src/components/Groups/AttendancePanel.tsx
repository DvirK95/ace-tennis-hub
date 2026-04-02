import { useAttendance } from '@/hooks/useAttendance';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import StatusBadge from '@/components/StatusBadge';
import type { AttendanceStatus } from '@/types/schemas';

interface AttendancePanelProps {
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AttendanceRowProps {
  userId: string;
  userName: string;
  status: AttendanceStatus | undefined;
  onMark: (userId: string, status: AttendanceStatus) => void;
}

function AttendanceRow({ userId, userName, status, onMark }: AttendanceRowProps) {
  return (
    <div className="flex items-center justify-between border-b py-2 last:border-0">
      <span className="text-sm font-medium">{userName}</span>
      <div className="flex items-center gap-3">
        {status && <StatusBadge status={status} />}
        <label className="flex items-center gap-1.5 text-xs">
          <Checkbox
            checked={status === 'Present'}
            onCheckedChange={() => onMark(userId, 'Present')}
          />
          Present
        </label>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => onMark(userId, 'Cancelled_Eligible')}
          disabled={status === 'Cancelled_Eligible'}
        >
          Cancel (+ Credit)
        </Button>
      </div>
    </div>
  );
}

export default function AttendancePanel({ groupId, open, onOpenChange }: AttendancePanelProps) {
  const { group, groupMembers, sessionDate, setSessionDate, getStatus, markAttendance } =
    useAttendance(groupId);

  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Attendance — {group.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
            className="max-w-48"
          />
          <div>
            {groupMembers.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">No members in this group.</p>
            ) : (
              groupMembers.map((m) => (
                <AttendanceRow
                  key={m.id}
                  userId={m.id}
                  userName={m.name}
                  status={getStatus(m.id)}
                  onMark={markAttendance}
                />
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
