import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFormSchema, type EventFormValues, type CalendarEvent } from '@/types/schemas';
import { useEventStore } from '@/stores/useEventStore';
import { useCourtStore } from '@/stores/useCourtStore';
import { usePersonStore } from '@/stores/usePersonStore';
import { useGroupStore } from '@/stores/useGroupStore';
import { usePermissions } from '@/hooks/usePermissions';
import { timeToMinutes } from '@/lib/timeUtils';

interface UseEventFormParams {
  selectedSlot: { date: string; time: string } | null;
  editingEvent: CalendarEvent | null;
  onClose: () => void;
}

/** Returns events that overlap in date + court + time with the candidate. */
function findConflicts(
  events: CalendarEvent[],
  candidate: { date: string; startTime: string; endTime: string; courtId?: string; allCourts?: boolean },
  excludeId?: string,
): CalendarEvent[] {
  if (!candidate.date || !candidate.startTime || !candidate.endTime) return [];

  const cStart = timeToMinutes(candidate.startTime);
  const cEnd = timeToMinutes(candidate.endTime);
  if (cStart >= cEnd) return [];

  return events.filter((e) => {
    if (e.id === excludeId) return false;
    if (e.status === 'REJECTED' || e.status === 'CANCELLED') return false;
    if (e.date !== candidate.date) return false;

    const courtOverlap =
      candidate.allCourts || !candidate.courtId || e.allCourts || e.courtId === candidate.courtId;
    if (!courtOverlap) return false;

    const eStart = timeToMinutes(e.startTime);
    const eEnd = timeToMinutes(e.endTime);
    return cStart < eEnd && cEnd > eStart;
  });
}

export function useEventForm({ selectedSlot, editingEvent, onClose }: UseEventFormParams) {
  const { addEvent, updateEvent, updateEventStatus, events } = useEventStore();
  const allCourts = useCourtStore((s) => s.courts);
  const people = usePersonStore((s) => s.people);
  const { incrementMakeupCredits } = usePersonStore();
  const groups = useGroupStore((s) => s.groups);
  const { canAccess } = usePermissions();

  const courts = useMemo(() => allCourts.filter((c) => c.status === 'Active'), [allCourts]);

  const courtOptions = useMemo(
    () => courts.map((c) => ({ id: c.id, name: c.name, extraRender: c.surfaceType })),
    [courts],
  );

  const peopleOptions = useMemo(
    () => people.map((p) => ({ id: p.id, name: p.name, extraRender: p.roles.join(', ') })),
    [people],
  );

  const groupOptions = useMemo(() => groups.map((g) => ({ id: g.id, name: g.name })), [groups]);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      eventType: 'SESSION',
      courtId: undefined,
      allCourts: false,
      assigneeIds: [],
      groupId: undefined,
      date: '',
      startTime: '',
      endTime: '',
      recurrence: 'NONE',
    },
  });

  useEffect(() => {
    if (editingEvent) {
      form.reset({
        title: editingEvent.title,
        eventType: editingEvent.eventType,
        courtId: editingEvent.courtId ?? undefined,
        allCourts: editingEvent.allCourts,
        assigneeIds: editingEvent.assigneeIds ?? [],
        groupId: editingEvent.groupId ?? undefined,
        date: editingEvent.date,
        startTime: editingEvent.startTime,
        endTime: editingEvent.endTime,
        recurrence: editingEvent.recurrence,
      });
    } else if (selectedSlot) {
      form.reset({
        title: '',
        eventType: 'SESSION',
        courtId: undefined,
        allCourts: false,
        assigneeIds: [],
        groupId: undefined,
        date: selectedSlot.date,
        startTime: selectedSlot.time,
        endTime: '',
        recurrence: 'NONE',
      });
    } else {
      form.reset({
        title: '',
        eventType: 'SESSION',
        courtId: undefined,
        allCourts: false,
        assigneeIds: [],
        groupId: undefined,
        date: '',
        startTime: '',
        endTime: '',
        recurrence: 'NONE',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingEvent, selectedSlot]);

  // Live conflict detection — watches date/time/court/allCourts
  const watched = form.watch(['date', 'startTime', 'endTime', 'courtId', 'allCourts']);
  const [date, startTime, endTime, courtId, watchAllCourts] = watched;

  const conflicts = useMemo(() => {
    // Only warn for BLOCKOUT events, or any event that has a court selected
    if (!date || !startTime || !endTime) return [];
    return findConflicts(
      events,
      { date, startTime, endTime, courtId, allCourts: watchAllCourts },
      editingEvent?.id,
    );
  }, [date, startTime, endTime, courtId, watchAllCourts, events, editingEvent?.id]);

  function handleCancelConflicts(ids: string[], addCredits: boolean) {
    for (const id of ids) {
      const ev = events.find((e) => e.id === id);
      if (!ev) continue;
      updateEventStatus(id, 'CANCELLED');

      if (addCredits) {
        // Add credit to all trainee participants
        for (const userId of ev.assigneeIds) {
          const person = people.find((p) => p.id === userId);
          if (person?.roles.includes('TRAINEE')) {
            incrementMakeupCredits(userId);
          }
        }
      }
    }
  }

  function handleSubmit(values: EventFormValues) {
    const isAdmin = canAccess('APPROVE_BOOKINGS');
    const groupId = !values.groupId || values.groupId === 'none' ? undefined : values.groupId;
    const courtId = values.allCourts ? undefined : values.courtId;
    const payload = { ...values, groupId, courtId };

    if (editingEvent) {
      updateEvent(editingEvent.id, payload);
    } else {
      addEvent({
        ...payload,
        id: crypto.randomUUID(),
        status: isAdmin ? 'APPROVED' : 'PENDING_APPROVAL',
      });
    }
    form.reset();
    onClose();
  }

  return {
    form,
    handleSubmit,
    courts,
    people,
    groups,
    courtOptions,
    peopleOptions,
    groupOptions,
    conflicts,
    handleCancelConflicts,
  };
}
