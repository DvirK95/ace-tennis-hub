import { useState, useMemo, useCallback } from 'react';
import { useEventStore } from '@/stores/useEventStore';
import { useCourtStore } from '@/stores/useCourtStore';
import { usePersonStore } from '@/stores/usePersonStore';
import { getMonday, getWeekDays, formatDate } from '@/lib/timeUtils';
import type { CalendarEvent } from '@/types/schemas';

export type CalendarViewMode = 'global' | 'court' | 'coach';

export function useCalendar() {
  const events = useEventStore((s) => s.events);
  const courts = useCourtStore((s) => s.courts);
  const people = usePersonStore((s) => s.people);
  const coaches = useMemo(() => people.filter((p) => p.roles.includes('COACH')), [people]);

  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [viewMode, setViewMode] = useState<CalendarViewMode>('global');
  const [selectedCourtId, setSelectedCourtId] = useState<string>('');
  const [selectedCoachId, setSelectedCoachId] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);

  const navigateWeek = useCallback((direction: 1 | -1) => {
    setWeekStart((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + direction * 7);
      return next;
    });
  }, []);

  const goToToday = useCallback(() => {
    setWeekStart(getMonday(new Date()));
  }, []);

  const filteredEvents = useMemo(() => {
    const approved = events.filter((e) => e.status === 'APPROVED');
    const weekDates = weekDays.map(formatDate);

    const inWeek = approved.filter((e) => weekDates.includes(e.date));

    switch (viewMode) {
      case 'court':
        if (!selectedCourtId) return inWeek;
        return inWeek.filter((e) => e.courtId === selectedCourtId || e.allCourts);
      case 'coach': {
        if (!selectedCoachId) return inWeek;
        return inWeek.filter((e) => e.assigneeId === selectedCoachId || e.groupId !== undefined);
      }
      default:
        return inWeek;
    }
  }, [events, weekDays, viewMode, selectedCourtId, selectedCoachId]);

  function openSlotForm(date: string, time: string) {
    setSelectedSlot({ date, time });
    setSelectedEvent(null);
    setIsFormOpen(true);
  }

  function openEventEdit(event: CalendarEvent) {
    setSelectedEvent(event);
    setSelectedSlot(null);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setSelectedSlot(null);
    setSelectedEvent(null);
  }

  return {
    weekStart,
    weekDays,
    navigateWeek,
    goToToday,
    viewMode,
    setViewMode,
    selectedCourtId,
    setSelectedCourtId,
    selectedCoachId,
    setSelectedCoachId,
    filteredEvents,
    courts,
    coaches,
    selectedSlot,
    selectedEvent,
    isFormOpen,
    openSlotForm,
    openEventEdit,
    closeForm,
  };
}
