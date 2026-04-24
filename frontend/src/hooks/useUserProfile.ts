import { useMemo } from 'react';
import { usePersonStore } from '@/stores/usePersonStore';
import { useGroupStore } from '@/stores/useGroupStore';
import { useAttendanceStore } from '@/stores/useAttendanceStore';
import { useTaskStore } from '@/stores/useTaskStore';
import type { ClubUser } from '@/types/schemas';

export function useUserProfile(userId: string) {
  const person = usePersonStore((s) => s.people.find((p) => p.id === userId));
  const groups = useGroupStore((s) => s.groups);
  const attendanceRecords = useAttendanceStore((s) => s.records);
  const tasks = useTaskStore((s) => s.tasks);

  const userGroups = useMemo(
    () => groups.filter((g) => g.memberIds.includes(userId) || g.coachIds.includes(userId)),
    [groups, userId]
  );

  const userAttendance = useMemo(
    () => attendanceRecords.filter((r) => r.userId === userId),
    [attendanceRecords, userId]
  );

  const absences = useMemo(
    () => userAttendance.filter((r) => r.status === 'Absent' || r.status === 'Cancelled_Eligible'),
    [userAttendance]
  );

  const userTasks = useMemo(() => tasks.filter((t) => t.userId === userId), [tasks, userId]);

  return {
    person: person as ClubUser | undefined,
    userGroups,
    userAttendance,
    absences,
    userTasks,
  };
}
