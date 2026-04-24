import { useMemo } from 'react';
import { useEventStore } from '@/stores/useEventStore';
import { useCourtStore } from '@/stores/useCourtStore';
import { timeToMinutes } from '@/lib/timeUtils';
import PageHeader from '@/components/Layout/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/Button/Button';
import { Check, X, AlertTriangle } from 'lucide-react';
import type { CalendarEvent } from '@/types/schemas';

/** Find approved events that overlap with the candidate */
function findConflictsFor(approved: CalendarEvent[], candidate: CalendarEvent): CalendarEvent[] {
  const cStart = timeToMinutes(candidate.startTime);
  const cEnd = timeToMinutes(candidate.endTime);

  return approved.filter((e) => {
    if (e.id === candidate.id) return false;
    if (e.date !== candidate.date) return false;
    const courtOverlap =
      candidate.allCourts || !candidate.courtId || e.allCourts || e.courtId === candidate.courtId;
    if (!courtOverlap) return false;
    const eStart = timeToMinutes(e.startTime);
    const eEnd = timeToMinutes(e.endTime);
    return cStart < eEnd && cEnd > eStart;
  });
}

interface ApprovalRowProps {
  event: CalendarEvent;
  courtName: string;
  conflicts: CalendarEvent[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

function ApprovalRow({ event, courtName, conflicts, onApprove, onReject }: ApprovalRowProps) {
  return (
    <div className="border-b px-4 py-3 last:border-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-sm font-medium">{event.title}</p>
            <p className="text-xs text-muted-foreground">
              {event.date} · {event.startTime}–{event.endTime}
            </p>
          </div>
          <span className="text-sm text-muted-foreground">{courtName}</span>
          <StatusBadge status={event.status} />
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => onApprove(event.id)}
            className="gap-1"
            icon={<Check className="h-3.5 w-3.5" />}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReject(event.id)}
            className="gap-1 text-destructive"
            icon={<X className="h-3.5 w-3.5" />}
          >
            Reject
          </Button>
        </div>
      </div>

      {/* Collision warning */}
      {conflicts.length > 0 && (
        <div className="mt-2 flex items-start gap-1.5 rounded-md bg-destructive/10 px-2 py-1.5">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
          <div>
            <p className="text-xs font-semibold text-destructive">
              Conflicts with {conflicts.length} approved event{conflicts.length !== 1 ? 's' : ''}:
            </p>
            {conflicts.map((c) => (
              <p key={c.id} className="text-xs text-destructive/80">
                • {c.title} — {c.startTime}–{c.endTime}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApprovalsPage() {
  const { events, updateEventStatus } = useEventStore();
  const { courts } = useCourtStore();
  const courtMap = useMemo(() => new Map(courts.map((c) => [c.id, c.name])), [courts]);

  const pending = events.filter((e) => e.status === 'PENDING_APPROVAL');
  const approved = events.filter((e) => e.status === 'APPROVED');

  return (
    <div>
      <PageHeader title="Event Approvals" description="Review and approve pending event requests" />
      <div className="animate-fade-in rounded-lg border bg-card shadow-card">
        {pending.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No pending events to review
          </p>
        ) : (
          pending.map((e) => (
            <ApprovalRow
              key={e.id}
              event={e}
              courtName={
                e.courtId ? (courtMap.get(e.courtId) ?? '—') : e.allCourts ? 'All Courts' : '—'
              }
              conflicts={findConflictsFor(approved, e)}
              onApprove={(id) => updateEventStatus(id, 'APPROVED')}
              onReject={(id) => updateEventStatus(id, 'REJECTED')}
            />
          ))
        )}
      </div>
    </div>
  );
}
