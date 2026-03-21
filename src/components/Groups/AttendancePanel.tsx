import { useAttendance } from "@/hooks/useAttendance";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import StatusBadge from "@/components/StatusBadge";
import type { AttendanceStatus } from "@/types/schemas";

interface AttendancePanelProps {
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AttendanceRowProps {
  traineeId: string;
  traineeName: string;
  status: AttendanceStatus | undefined;
  onMark: (traineeId: string, status: AttendanceStatus) => void;
}

function AttendanceRow({ traineeId, traineeName, status, onMark }: AttendanceRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <span className="text-sm font-medium">{traineeName}</span>
      <div className="flex items-center gap-3">
        {status && <StatusBadge status={status} />}
        <label className="flex items-center gap-1.5 text-xs">
          <Checkbox
            checked={status === "Present"}
            onCheckedChange={() => onMark(traineeId, "Present")}
          />
          Present
        </label>
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-7"
          onClick={() => onMark(traineeId, "Cancelled_Eligible")}
          disabled={status === "Cancelled_Eligible"}
        >
          Cancel (+ Credit)
        </Button>
      </div>
    </div>
  );
}

export default function AttendancePanel({ groupId, open, onOpenChange }: AttendancePanelProps) {
  const { group, groupTrainees, sessionDate, setSessionDate, getStatus, markAttendance } =
    useAttendance(groupId);

  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Attendance — {group.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input type="date" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} className="max-w-48" />
          <div>
            {groupTrainees.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No trainees in this group.</p>
            ) : (
              groupTrainees.map((t) => (
                <AttendanceRow
                  key={t.id}
                  traineeId={t.id}
                  traineeName={t.name}
                  status={getStatus(t.id)}
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
