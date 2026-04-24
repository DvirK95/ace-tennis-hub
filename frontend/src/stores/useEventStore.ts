import { create } from 'zustand';
import { format, addDays, startOfWeek } from 'date-fns';
import type { CalendarEvent, EventStatus } from '@/types/schemas';

function today(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

function weekDay(offset: number): string {
  const sun = startOfWeek(new Date(), { weekStartsOn: 0 });
  return format(addDays(sun, offset), 'yyyy-MM-dd');
}

const SEED: CalendarEvent[] = [
  // ─── שבוע נוכחי ─────────────────────────────────────────
  {
    id: 'ev100000-0000-0000-0000-000000000001',
    title: 'קבוצת מתחילים',
    eventType: 'SESSION',
    courtId: 'c1000000-0000-0000-0000-000000000001',
    allCourts: false,
    assigneeIds: ['co100000-0000-0000-0000-000000000001'],
    groupId: 'g1000000-0000-0000-0000-000000000001',
    date: weekDay(0),
    startTime: '09:00',
    endTime: '10:30',
    recurrence: 'WEEKLY',
    status: 'APPROVED',
  },
  {
    id: 'ev100000-0000-0000-0000-000000000002',
    title: 'שיעור פרטי — יוסי',
    eventType: 'PRIVATE',
    courtId: 'c1000000-0000-0000-0000-000000000002',
    allCourts: false,
    assigneeIds: ['t1000000-0000-0000-0000-000000000001', 'co100000-0000-0000-0000-000000000001'],
    date: today(),
    startTime: '14:00',
    endTime: '15:00',
    recurrence: 'NONE',
    status: 'APPROVED',
  },
  {
    id: 'ev100000-0000-0000-0000-000000000003',
    title: 'קבוצת מתקדמים',
    eventType: 'SESSION',
    courtId: 'c1000000-0000-0000-0000-000000000003',
    allCourts: false,
    assigneeIds: ['co100000-0000-0000-0000-000000000002'],
    groupId: 'g1000000-0000-0000-0000-000000000002',
    date: weekDay(1),
    startTime: '17:00',
    endTime: '18:30',
    recurrence: 'WEEKLY',
    status: 'APPROVED',
  },
  {
    id: 'ev100000-0000-0000-0000-000000000004',
    title: 'אימון ג׳וניורים',
    eventType: 'SESSION',
    courtId: 'c1000000-0000-0000-0000-000000000004',
    allCourts: false,
    assigneeIds: ['co100000-0000-0000-0000-000000000002', 'co100000-0000-0000-0000-000000000003'],
    date: weekDay(2),
    startTime: '16:00',
    endTime: '17:30',
    recurrence: 'WEEKLY',
    status: 'APPROVED',
  },
  {
    id: 'ev100000-0000-0000-0000-000000000005',
    title: 'שיעור פרטי — מיכל',
    eventType: 'PRIVATE',
    courtId: 'c1000000-0000-0000-0000-000000000005',
    allCourts: false,
    assigneeIds: ['t1000000-0000-0000-0000-000000000002', 'co100000-0000-0000-0000-000000000001'],
    date: weekDay(3),
    startTime: '10:00',
    endTime: '11:00',
    recurrence: 'NONE',
    status: 'APPROVED',
  },
  {
    id: 'ev100000-0000-0000-0000-000000000006',
    title: 'תחזוקת מגרשים',
    eventType: 'BLOCKOUT',
    courtId: 'c1000000-0000-0000-0000-000000000003',
    allCourts: false,
    assigneeIds: [],
    date: weekDay(4),
    startTime: '08:00',
    endTime: '12:00',
    recurrence: 'NONE',
    status: 'APPROVED',
  },
  {
    id: 'ev100000-0000-0000-0000-000000000007',
    title: 'אימון כפולים',
    eventType: 'SESSION',
    courtId: 'c1000000-0000-0000-0000-000000000001',
    allCourts: false,
    assigneeIds: [
      'co100000-0000-0000-0000-000000000003',
      't1000000-0000-0000-0000-000000000004',
      't1000000-0000-0000-0000-000000000005',
    ],
    date: weekDay(5),
    startTime: '07:00',
    endTime: '08:30',
    recurrence: 'WEEKLY',
    status: 'APPROVED',
  },
  {
    id: 'ev100000-0000-0000-0000-000000000008',
    title: 'שיעור פרטי — שירה',
    eventType: 'PRIVATE',
    courtId: 'c1000000-0000-0000-0000-000000000002',
    allCourts: false,
    assigneeIds: ['t1000000-0000-0000-0000-000000000004', 'co100000-0000-0000-0000-000000000001'],
    date: weekDay(6),
    startTime: '11:00',
    endTime: '12:00',
    recurrence: 'WEEKLY',
    status: 'PENDING_APPROVAL',
  },
  {
    id: 'ev100000-0000-0000-0000-000000000009',
    title: 'קבוצת בוגרים',
    eventType: 'SESSION',
    courtId: 'c1000000-0000-0000-0000-000000000006',
    allCourts: false,
    assigneeIds: ['co100000-0000-0000-0000-000000000001'],
    date: today(),
    startTime: '19:00',
    endTime: '20:30',
    recurrence: 'WEEKLY',
    status: 'APPROVED',
  },
  {
    id: 'ev100000-0000-0000-0000-000000000010',
    title: 'חסימה כללית — אירוע מועדון',
    eventType: 'BLOCKOUT',
    allCourts: true,
    assigneeIds: [],
    date: weekDay(6),
    startTime: '13:00',
    endTime: '18:00',
    recurrence: 'NONE',
    status: 'APPROVED',
  },
  {
    id: 'ev100000-0000-0000-0000-000000000011',
    title: 'שיעור פרטי — אורן',
    eventType: 'PRIVATE',
    courtId: 'c1000000-0000-0000-0000-000000000004',
    allCourts: false,
    assigneeIds: ['t1000000-0000-0000-0000-000000000006', 'co100000-0000-0000-0000-000000000002'],
    date: weekDay(1),
    startTime: '08:00',
    endTime: '09:00',
    recurrence: 'NONE',
    status: 'APPROVED',
  },
  {
    id: 'ev100000-0000-0000-0000-000000000012',
    title: 'אימון תחרותי — לירון',
    eventType: 'PRIVATE',
    courtId: 'c1000000-0000-0000-0000-000000000001',
    allCourts: false,
    assigneeIds: ['t1000000-0000-0000-0000-000000000007', 'co100000-0000-0000-0000-000000000003'],
    date: weekDay(3),
    startTime: '15:00',
    endTime: '17:00',
    recurrence: 'WEEKLY',
    status: 'APPROVED',
  },
];

interface EventState {
  events: CalendarEvent[];
  addEvent: (e: CalendarEvent) => void;
  updateEvent: (id: string, data: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  updateEventStatus: (id: string, status: EventStatus) => void;
}

export const useEventStore = create<EventState>((set) => ({
  events: SEED,
  addEvent: (e) => set((s) => ({ events: [...s.events, e] })),
  updateEvent: (id, data) =>
    set((s) => ({ events: s.events.map((e) => (e.id === id ? { ...e, ...data } : e)) })),
  deleteEvent: (id) => set((s) => ({ events: s.events.filter((e) => e.id !== id) })),
  updateEventStatus: (id, status) =>
    set((s) => ({ events: s.events.map((e) => (e.id === id ? { ...e, status } : e)) })),
}));
