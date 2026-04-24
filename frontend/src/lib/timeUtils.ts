import {
  startOfWeek,
  addDays,
  format,
  startOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfDay,
} from 'date-fns';

// Week starts on Sunday (weekStartsOn: 0) — matches US/IL timezone convention
export function getSunday(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 0 });
}

/** @deprecated use getSunday */
export function getMonday(date: Date): Date {
  return getSunday(date);
}

export function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDayLabel(date: Date): string {
  return format(date, 'EEE, d MMM');
}

export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy');
}

// Returns a 6-row × 7-col grid of dates for a month calendar
export function getMonthGrid(month: Date): Date[][] {
  const firstDay = startOfMonth(month);
  const gridStart = startOfWeek(firstDay, { weekStartsOn: 0 });
  const allDays = eachDayOfInterval({ start: gridStart, end: addDays(gridStart, 41) });

  const rows: Date[][] = [];
  for (let i = 0; i < 6; i++) {
    rows.push(allDays.slice(i * 7, i * 7 + 7));
  }
  return rows;
}

export function isCurrentMonth(date: Date, month: Date): boolean {
  return isSameMonth(date, month);
}

export function isToday(date: Date): boolean {
  return isSameDay(date, startOfDay(new Date()));
}

export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 6; h <= 22; h++) {
    for (let m = 0; m < 60; m += 5) {
      if (h === 22 && m > 0) break;
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return slots;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

const HOUR_START = 6;
const HOUR_END = 22;
export const CALENDAR_HOURS = Array.from(
  { length: HOUR_END - HOUR_START },
  (_, i) => HOUR_START + i,
);
export const HOUR_HEIGHT_PX = 64;

export function eventTopPx(startTime: string): number {
  const mins = timeToMinutes(startTime);
  return ((mins - HOUR_START * 60) / 60) * HOUR_HEIGHT_PX;
}

export function eventHeightPx(startTime: string, endTime: string): number {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  return Math.max(((end - start) / 60) * HOUR_HEIGHT_PX, 20);
}

export const WEEKDAY_LABELS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];
