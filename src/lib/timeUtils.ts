export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 6; h <= 22; h++) {
    for (let m = 0; m < 60; m += 5) {
      if (h === 22 && m > 0) break;
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function formatDayLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

const HOUR_START = 6;
const HOUR_END = 22;
export const CALENDAR_HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);
export const HOUR_HEIGHT_PX = 60;

export function eventTopPx(startTime: string): number {
  const mins = timeToMinutes(startTime);
  return ((mins - HOUR_START * 60) / 60) * HOUR_HEIGHT_PX;
}

export function eventHeightPx(startTime: string, endTime: string): number {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  return ((end - start) / 60) * HOUR_HEIGHT_PX;
}
