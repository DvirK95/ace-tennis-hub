import { create } from 'zustand';
import type { CalendarEvent, EventStatus } from '@/types/schemas';

interface EventState {
  events: CalendarEvent[];
  addEvent: (e: CalendarEvent) => void;
  updateEvent: (id: string, data: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  updateEventStatus: (id: string, status: EventStatus) => void;
}

const SEED: CalendarEvent[] = [
  {
    id: 'ev100000-0000-0000-0000-000000000001',
    title: 'Beginner Group Session',
    eventType: 'SESSION',
    courtId: 'c1000000-0000-0000-0000-000000000001',
    allCourts: false,
    groupId: 'g1000000-0000-0000-0000-000000000001',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:30',
    recurrence: 'WEEKLY',
    status: 'APPROVED',
  },
  {
    id: 'ev100000-0000-0000-0000-000000000002',
    title: 'Private Lesson — Liam',
    eventType: 'PRIVATE',
    courtId: 'c1000000-0000-0000-0000-000000000002',
    allCourts: false,
    assigneeId: 't1000000-0000-0000-0000-000000000002',
    date: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '15:00',
    recurrence: 'NONE',
    status: 'PENDING_APPROVAL',
  },
];

export const useEventStore = create<EventState>((set) => ({
  events: SEED,
  addEvent: (e) => set((s) => ({ events: [...s.events, e] })),
  updateEvent: (id, data) =>
    set((s) => ({ events: s.events.map((e) => (e.id === id ? { ...e, ...data } : e)) })),
  deleteEvent: (id) => set((s) => ({ events: s.events.filter((e) => e.id !== id) })),
  updateEventStatus: (id, status) =>
    set((s) => ({ events: s.events.map((e) => (e.id === id ? { ...e, status } : e)) })),
}));
