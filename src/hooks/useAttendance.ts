import { useState } from "react";
import { useAttendanceStore } from "@/stores/useAttendanceStore";
import { useTraineeStore } from "@/stores/useTraineeStore";
import { useGroupStore } from "@/stores/useGroupStore";
import type { AttendanceStatus } from "@/types/schemas";

export function useAttendance(groupId: string) {
  const { groups } = useGroupStore();
  const { trainees, incrementMakeupCredits } = useTraineeStore();
  const { setAttendance, records } = useAttendanceStore();
  const [sessionDate, setSessionDate] = useState(() => new Date().toISOString().split("T")[0]);

  const group = groups.find((g) => g.id === groupId);
  const groupTrainees = trainees.filter((t) => group?.traineeIds.includes(t.id));

  const sessionRecords = records.filter(
    (r) => r.groupId === groupId && r.sessionDate === sessionDate
  );

  function getStatus(traineeId: string): AttendanceStatus | undefined {
    return sessionRecords.find((r) => r.traineeId === traineeId)?.status;
  }

  function markAttendance(traineeId: string, status: AttendanceStatus) {
    const prev = getStatus(traineeId);
    setAttendance(groupId, sessionDate, traineeId, status);
    if (status === "Cancelled_Eligible" && prev !== "Cancelled_Eligible") {
      incrementMakeupCredits(traineeId);
    }
  }

  return {
    group,
    groupTrainees,
    sessionDate,
    setSessionDate,
    getStatus,
    markAttendance,
  };
}
