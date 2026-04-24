import type { CalendarEvent } from '@/types/schemas';
import { formatDate, getMonthGrid, isCurrentMonth, isToday, WEEKDAY_LABELS } from '@/lib/timeUtils';

interface MonthViewProps {
  monthRef: Date;
  events: CalendarEvent[];
  onDayClick: (date: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  SESSION: 'bg-primary/80 text-primary-foreground',
  PRIVATE: 'bg-sky-500/80 text-white',
  BLOCKOUT: 'bg-destructive/80 text-destructive-foreground',
};

export default function MonthView({
  monthRef,
  events,
  onDayClick,
  onEventClick,
}: MonthViewProps) {
  const grid = getMonthGrid(monthRef);

  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-card">
      {/* Weekday header */}
      <div className="grid grid-cols-7 border-b">
        {WEEKDAY_LABELS.map((label, i) => (
          <div
            key={i}
            className="border-r p-2 text-center text-xs font-semibold text-muted-foreground last:border-r-0"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div>
        {grid.map((week, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-7 border-b last:border-b-0">
            {week.map((day) => {
              const dateStr = formatDate(day);
              const dayEvents = events.filter((e) => e.date === dateStr);
              const inMonth = isCurrentMonth(day, monthRef);
              const today = isToday(day);

              return (
                <DayCell
                  key={dateStr}
                  day={day}
                  dateStr={dateStr}
                  events={dayEvents}
                  inMonth={inMonth}
                  isToday={today}
                  onDayClick={onDayClick}
                  onEventClick={onEventClick}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

interface DayCellProps {
  day: Date;
  dateStr: string;
  events: CalendarEvent[];
  inMonth: boolean;
  isToday: boolean;
  onDayClick: (date: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

function DayCell({
  day,
  dateStr,
  events,
  inMonth,
  isToday,
  onDayClick,
  onEventClick,
}: DayCellProps) {
  const MAX_VISIBLE = 3;
  const visible = events.slice(0, MAX_VISIBLE);
  const overflow = events.length - MAX_VISIBLE;

  return (
    <div
      className={`min-h-[110px] cursor-pointer border-r p-1.5 last:border-r-0 transition-colors hover:bg-muted/40 ${
        inMonth ? '' : 'bg-muted/20'
      }`}
      onClick={() => onDayClick(dateStr)}
    >
      {/* Day number */}
      <div className="mb-1 flex justify-end">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
            isToday
              ? 'bg-primary text-primary-foreground'
              : inMonth
                ? 'text-foreground'
                : 'text-muted-foreground'
          }`}
        >
          {day.getDate()}
        </span>
      </div>

      {/* Events */}
      <div className="space-y-0.5">
        {visible.map((event) => (
          <EventPill
            key={event.id}
            event={event}
            onClick={onEventClick}
          />
        ))}
        {overflow > 0 && (
          <p className="px-1 text-[10px] text-muted-foreground">+{overflow} נוספים</p>
        )}
      </div>
    </div>
  );
}

interface EventPillProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
}

function EventPill({ event, onClick }: EventPillProps) {
  const colorClass = EVENT_TYPE_COLORS[event.eventType] ?? 'bg-muted text-foreground';

  return (
    <div
      className={`truncate rounded px-1.5 py-0.5 text-[10px] font-medium leading-tight ${colorClass} cursor-pointer hover:opacity-90`}
      onClick={(e) => {
        e.stopPropagation();
        onClick(event);
      }}
      title={`${event.title} ${event.startTime}–${event.endTime}`}
    >
      <span className="opacity-75">{event.startTime}</span> {event.title}
    </div>
  );
}
