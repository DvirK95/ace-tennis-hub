import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFormSchema, type EventFormValues, type CalendarEvent } from '@/types/schemas';
import { useEventStore } from '@/stores/useEventStore';
import { useCourtStore } from '@/stores/useCourtStore';
import { usePersonStore } from '@/stores/usePersonStore';
import { useGroupStore } from '@/stores/useGroupStore';
import { usePermissions } from '@/hooks/usePermissions';
import { generateTimeSlots } from '@/lib/timeUtils';

interface UseEventFormParams {
  selectedSlot: { date: string; time: string } | null;
  editingEvent: CalendarEvent | null;
  onClose: () => void;
}

export function useEventForm({ selectedSlot, editingEvent, onClose }: UseEventFormParams) {
  const { addEvent, updateEvent } = useEventStore();
  const allCourts = useCourtStore((s) => s.courts);
  const people = usePersonStore((s) => s.people);
  const groups = useGroupStore((s) => s.groups);
  const { canAccess } = usePermissions();
  const courts = useMemo(() => allCourts.filter((c) => c.status === 'Active'), [allCourts]);
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      eventType: 'SESSION',
      courtId: undefined,
      allCourts: false,
      assigneeId: undefined,
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
        assigneeId: editingEvent.assigneeId ?? undefined,
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
        assigneeId: undefined,
        groupId: undefined,
        date: selectedSlot.date,
        startTime: selectedSlot.time,
        endTime: '',
        recurrence: 'NONE',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingEvent, selectedSlot]);

  function handleSubmit(values: EventFormValues) {
    const isAdmin = canAccess('APPROVE_BOOKINGS');
    if (editingEvent) {
      updateEvent(editingEvent.id, values);
    } else {
      addEvent({
        ...values,
        id: crypto.randomUUID(),
        status: isAdmin ? 'APPROVED' : 'PENDING_APPROVAL',
        courtId: values.allCourts ? undefined : values.courtId,
      });
    }
    form.reset();
    onClose();
  }

  return { form, handleSubmit, courts, people, groups, timeSlots };
}
