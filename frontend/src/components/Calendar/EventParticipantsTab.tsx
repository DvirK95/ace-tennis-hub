import { useState, useMemo } from 'react';
import type { CalendarEvent } from '@/types/schemas';
import { usePersonStore } from '@/stores/usePersonStore';
import { useEventStore } from '@/stores/useEventStore';
import { useEventAttendanceStore } from '@/stores/useEventAttendanceStore';
import type { EventAttendanceStatus } from '@/types/schemas';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPlus, UserMinus, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventParticipantsTabProps {
  event: CalendarEvent;
}

const STATUS_COLORS: Record<EventAttendanceStatus, string> = {
  Unknown: 'bg-muted text-muted-foreground',
  Present: 'bg-green-500/15 text-green-700 dark:text-green-400',
  Absent: 'bg-destructive/15 text-destructive',
  Cancelled_Eligible: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
};

const STATUS_OPTIONS: { value: EventAttendanceStatus; label: string }[] = [
  { value: 'Unknown', label: '—' },
  { value: 'Present', label: 'Present' },
  { value: 'Absent', label: 'Absent' },
  { value: 'Cancelled_Eligible', label: 'Cancelled (credit)' },
];

export default function EventParticipantsTab({ event }: EventParticipantsTabProps) {
  const people = usePersonStore((s) => s.people);
  const { incrementMakeupCredits, decrementMakeupCredits } = usePersonStore();
  const updateEvent = useEventStore((s) => s.updateEvent);
  const { setAttendance, getStatusForUser } = useEventAttendanceStore();

  const [addingPerson, setAddingPerson] = useState(false);
  const [personToAdd, setPersonToAdd] = useState('');

  // All people not yet in assigneeIds
  const available = useMemo(
    () => people.filter((p) => !event.assigneeIds.includes(p.id)),
    [people, event.assigneeIds],
  );

  const participants = useMemo(
    () => people.filter((p) => event.assigneeIds.includes(p.id)),
    [people, event.assigneeIds],
  );

  function handleStatusChange(userId: string, status: EventAttendanceStatus) {
    const prev = getStatusForUser(event.id, userId);
    setAttendance(event.id, userId, status);

    // Auto-manage credits for trainees on status change
    const person = people.find((p) => p.id === userId);
    const isTrainee = person?.roles.includes('TRAINEE');

    if (isTrainee) {
      // Gained eligibility → add credit
      if (status === 'Cancelled_Eligible' && prev !== 'Cancelled_Eligible') {
        incrementMakeupCredits(userId);
      }
      // Lost eligibility → remove credit
      if (prev === 'Cancelled_Eligible' && status !== 'Cancelled_Eligible') {
        decrementMakeupCredits(userId);
      }
    }
  }

  function handleManualCredit(userId: string, action: 'add' | 'reduce') {
    if (action === 'add') incrementMakeupCredits(userId);
    else decrementMakeupCredits(userId);
  }

  function addParticipant() {
    if (!personToAdd) return;
    updateEvent(event.id, { assigneeIds: [...event.assigneeIds, personToAdd] });
    setPersonToAdd('');
    setAddingPerson(false);
  }

  function removeParticipant(userId: string) {
    updateEvent(event.id, { assigneeIds: event.assigneeIds.filter((id) => id !== userId) });
  }

  return (
    <div className="space-y-4">
      {/* Header + add person */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {participants.length} participant{participants.length !== 1 ? 's' : ''}
        </p>
        <Button
          size="sm"
          variant="outline"
          icon={<UserPlus className="h-3.5 w-3.5" />}
          onClick={() => setAddingPerson((v) => !v)}
        >
          Add person
        </Button>
      </div>

      {/* Add person row */}
      {addingPerson && (
        <div className="flex items-center gap-2 rounded-md border bg-muted/30 p-2">
          <Select value={personToAdd} onValueChange={setPersonToAdd}>
            <SelectTrigger className="h-8 flex-1 text-sm">
              <SelectValue placeholder="Select person to add…" />
            </SelectTrigger>
            <SelectContent>
              {available.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    ({p.roles.join(', ')})
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={addParticipant} disabled={!personToAdd}>
            Add
          </Button>
          <Button size="sm" variant="outline" onClick={() => setAddingPerson(false)}>
            Cancel
          </Button>
        </div>
      )}

      {/* Participant list */}
      {participants.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No participants assigned yet
        </p>
      ) : (
        <div className="space-y-1.5">
          {participants.map((person) => {
            const status = getStatusForUser(event.id, person.id);
            const isTrainee = person.roles.includes('TRAINEE');
            const credits = person.makeupCredits;

            return (
              <div
                key={person.id}
                className={cn(
                  'flex items-center gap-3 rounded-md border px-3 py-2',
                  STATUS_COLORS[status],
                )}
              >
                {/* Name + role */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{person.name}</p>
                  <div className="flex items-center gap-1">
                    {person.roles.map((r) => (
                      <Badge key={r} variant="outline" className="h-4 px-1 text-[9px]">
                        {r}
                      </Badge>
                    ))}
                    {isTrainee && (
                      <span className="text-[10px] text-muted-foreground">
                        {credits} credit{credits !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status select */}
                <Select
                  value={status}
                  onValueChange={(v) => handleStatusChange(person.id, v as EventAttendanceStatus)}
                >
                  <SelectTrigger className="h-7 w-[150px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value} className="text-xs">
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Manual credit buttons */}
                {isTrainee && (
                  <div className="flex gap-0.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      title="Add credit"
                      className="h-7 w-7 p-0 text-green-600"
                      onClick={() => handleManualCredit(person.id, 'add')}
                    >
                      <CreditCard className="h-3.5 w-3.5" />+
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      title="Reduce credit"
                      className="h-7 w-7 p-0 text-destructive"
                      onClick={() => handleManualCredit(person.id, 'reduce')}
                      disabled={credits === 0}
                    >
                      <CreditCard className="h-3.5 w-3.5" />−
                    </Button>
                  </div>
                )}

                {/* Remove */}
                <Button
                  size="sm"
                  variant="ghost"
                  title="Remove participant"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeParticipant(person.id)}
                >
                  <UserMinus className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
