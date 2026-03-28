import { useState } from 'react';
import { useAttendanceStore } from '@/stores/useAttendanceStore';
import { usePersonStore } from '@/stores/usePersonStore';
import { useGroupStore } from '@/stores/useGroupStore';
import type { AttendanceStatus } from '@/types/schemas';

export function useAttendance(groupId: string) {
  const { groups } = useGroupStore();
  const { people, incrementMakeupCredits } = usePersonStore();
  const { setAttendance, records } = useAttendanceStore();
  const [sessionDate, setSessionDate] = useState(() => new Date().toISOString().split('T')[0]);

  const group = groups.find((g) => g.id === groupId);
  const groupMembers = people.filter((p) => group?.memberIds.includes(p.id));

  const sessionRecords = records.filter(
    (r) => r.groupId === groupId && r.sessionDate === sessionDate
  );

  function getStatus(userId: string): AttendanceStatus | undefined {
    return sessionRecords.find((r) => r.userId === userId)?.status;
  }

  function markAttendance(userId: string, status: AttendanceStatus) {
    const prev = getStatus(userId);
    setAttendance(groupId, sessionDate, userId, status);
    if (status === 'Cancelled_Eligible' && prev !== 'Cancelled_Eligible') {
      incrementMakeupCredits(userId);
    }
  }

  return {
    group,
    groupMembers,
    sessionDate,
    setSessionDate,
    getStatus,
    markAttendance,
  };
}
