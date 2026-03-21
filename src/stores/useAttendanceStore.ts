import { create } from "zustand";
import type { AttendanceRecord, AttendanceStatus } from "@/types/schemas";

interface AttendanceState {
  records: AttendanceRecord[];
  setAttendance: (groupId: string, sessionDate: string, traineeId: string, status: AttendanceStatus) => void;
  getRecords: (groupId: string, sessionDate: string) => AttendanceRecord[];
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  records: [],
  setAttendance: (groupId, sessionDate, traineeId, status) =>
    set((s) => {
      const existing = s.records.find(
        (r) => r.groupId === groupId && r.sessionDate === sessionDate && r.traineeId === traineeId
      );
      if (existing) {
        return {
          records: s.records.map((r) => (r.id === existing.id ? { ...r, status } : r)),
        };
      }
      return {
        records: [
          ...s.records,
          {
            id: crypto.randomUUID(),
            groupId,
            sessionDate,
            traineeId,
            status,
          },
        ],
      };
    }),
  getRecords: (groupId, sessionDate) =>
    get().records.filter((r) => r.groupId === groupId && r.sessionDate === sessionDate),
}));
