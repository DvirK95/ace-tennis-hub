import { useMemo } from 'react';
import { useEventStore } from '@/stores/useEventStore';
import { useCourtStore } from '@/stores/useCourtStore';
import PageHeader from '@/components/Layout/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/Button/Button';
import { Check, X } from 'lucide-react';
import type { CalendarEvent } from '@/types/schemas';

interface ApprovalRowProps {
  event: CalendarEvent;
  courtName: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

function ApprovalRow({ event, courtName, onApprove, onReject }: ApprovalRowProps) {
  return (
    <div className="flex items-center justify-between border-b px-4 py-3 last:border-0">
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
        <Button size="sm" onClick={() => onApprove(event.id)} className="gap-1" icon={<Check className="h-3.5 w-3.5" />}>
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
  );
}

export default function ApprovalsPage() {
  const { events, updateEventStatus } = useEventStore();
  const { courts } = useCourtStore();
  const courtMap = useMemo(() => new Map(courts.map((c) => [c.id, c.name])), [courts]);

  const pending = events.filter((e) => e.status === 'PENDING_APPROVAL');

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
              onApprove={(id) => updateEventStatus(id, 'APPROVED')}
              onReject={(id) => updateEventStatus(id, 'REJECTED')}
            />
          ))
        )}
      </div>
    </div>
  );
}
