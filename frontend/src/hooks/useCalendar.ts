import { useState, useMemo, useCallback } from 'react';
import { addDays, addMonths, startOfMonth } from 'date-fns';
import { useEventStore } from '@/stores/useEventStore';
import { useCourtStore } from '@/stores/useCourtStore';
import { usePersonStore } from '@/stores/usePersonStore';
import { getSunday, getWeekDays, formatDate } from '@/lib/timeUtils';
import type { CalendarEvent } from '@/types/schemas';

export type CalendarView = 'month' | 'week' | 'day';
export type CalendarFilterMode = 'global' | 'court' | 'coach';

export function useCalendar() {
  const events = useEventStore((s) => s.events);
  const courts = useCourtStore((s) => s.courts);
  const people = usePersonStore((s) => s.people);
  const coaches = useMemo(() => people.filter((p) => p.roles.includes('COACH')), [people]);

  // Week start: Sunday
  const [weekStart, setWeekStart] = useState(() => getSunday(new Date()));
  // Month reference date
  const [monthRef, setMonthRef] = useState(() => startOfMonth(new Date()));
  // Day view reference date
  const [dayRef, setDayRef] = useState(() => new Date());

  const [calendarView, setCalendarView] = useState<CalendarView>('week');
  const [filterMode, setFilterMode] = useState<CalendarFilterMode>('global');
  const [selectedCourtId, setSelectedCourtId] = useState<string>('');
  const [selectedCoachId, setSelectedCoachId] = useState<string>('');

  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);

  // Navigate: week / month / day
  const navigatePrev = useCallback(() => {
    if (calendarView === 'week') {
      setWeekStart((d) => addDays(d, -7));
    } else if (calendarView === 'month') {
      setMonthRef((d) => addMonths(d, -1));
    } else {
      setDayRef((d) => addDays(d, -1));
    }
  }, [calendarView]);

  const navigateNext = useCallback(() => {
    if (calendarView === 'week') {
      setWeekStart((d) => addDays(d, 7));
    } else if (calendarView === 'month') {
      setMonthRef((d) => addMonths(d, 1));
    } else {
      setDayRef((d) => addDays(d, 1));
    }
  }, [calendarView]);

  const goToToday = useCallback(() => {
    setWeekStart(getSunday(new Date()));
    setMonthRef(startOfMonth(new Date()));
    setDayRef(new Date());
  }, []);

  const filteredEvents = useMemo(() => {
    const approved = events.filter((e) => e.status === 'APPROVED');

    switch (filterMode) {
      case 'court':
        if (!selectedCourtId) return approved;
        return approved.filter((e) => e.courtId === selectedCourtId || e.allCourts);
      case 'coach':
        if (!selectedCoachId) return approved;
        return approved.filter((e) => e.assigneeIds.includes(selectedCoachId));
      default:
        return approved;
    }
  }, [events, filterMode, selectedCourtId, selectedCoachId]);

  // Week-scoped events (used by WeekView)
  const weekEvents = useMemo(() => {
    const weekDates = weekDays.map(formatDate);
    return filteredEvents.filter((e) => weekDates.includes(e.date));
  }, [filteredEvents, weekDays]);

  // Day-scoped events (used by DayView)
  const dayEvents = useMemo(() => {
    const dateStr = formatDate(dayRef);
    return filteredEvents.filter((e) => e.date === dateStr);
  }, [filteredEvents, dayRef]);

  function openSlotForm(date: string, time: string) {
    setSelectedSlot({ date, time });
    setSelectedEvent(null);
    setIsFormOpen(true);
    setFormKey((k) => k + 1);
  }

  function openEventEdit(event: CalendarEvent) {
    setSelectedEvent(event);
    setSelectedSlot(null);
    setIsFormOpen(true);
    setFormKey((k) => k + 1);
  }

  function closeForm() {
    setIsFormOpen(false);
    setSelectedSlot(null);
    setSelectedEvent(null);
  }

  function openCreateForm() {
    setSelectedSlot(null);
    setSelectedEvent(null);
    setIsFormOpen(true);
    setFormKey((k) => k + 1);
  }

  return {
    // view state
    calendarView,
    setCalendarView,
    filterMode,
    setFilterMode,
    // navigation
    weekStart,
    weekDays,
    monthRef,
    dayRef,
    navigatePrev,
    navigateNext,
    goToToday,
    // filters
    selectedCourtId,
    setSelectedCourtId,
    selectedCoachId,
    setSelectedCoachId,
    // data
    filteredEvents,
    weekEvents,
    dayEvents,
    courts,
    coaches,
    // form
    selectedSlot,
    selectedEvent,
    isFormOpen,
    formKey,
    openSlotForm,
    openEventEdit,
    openCreateForm,
    closeForm,
  };
}
