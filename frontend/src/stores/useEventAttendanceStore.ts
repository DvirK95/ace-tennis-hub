import { create } from 'zustand';
import type { EventAttendance, EventAttendanceStatus } from '@/types/schemas';

interface EventAttendanceState {
  records: EventAttendance[];
  setAttendance: (
    eventId: string,
    userId: string,
    status: EventAttendanceStatus,
    creditGiven?: boolean,
  ) => void;
  getRecordsForEvent: (eventId: string) => EventAttendance[];
  getStatusForUser: (eventId: string, userId: string) => EventAttendanceStatus;
}

export const useEventAttendanceStore = create<EventAttendanceState>((set, get) => ({
  records: [],

  setAttendance: (eventId, userId, status, creditGiven = false) =>
    set((s) => {
      const existing = s.records.find((r) => r.eventId === eventId && r.userId === userId);
      if (existing) {
        return {
          records: s.records.map((r) =>
            r.id === existing.id ? { ...r, status, creditGiven } : r,
          ),
        };
      }
      return {
        records: [
          ...s.records,
          { id: crypto.randomUUID(), eventId, userId, status, creditGiven },
        ],
      };
    }),

  getRecordsForEvent: (eventId) => get().records.filter((r) => r.eventId === eventId),

  getStatusForUser: (eventId, userId) => {
    const record = get().records.find((r) => r.eventId === eventId && r.userId === userId);
    return record?.status ?? 'Unknown';
  },
}));
