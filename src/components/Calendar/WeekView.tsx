import type { CalendarEvent } from "@/types/schemas";
import { formatDate, formatDayLabel, CALENDAR_HOURS, HOUR_HEIGHT_PX, eventTopPx, eventHeightPx } from "@/lib/timeUtils";

interface WeekViewProps {
  weekDays: Date[];
  events: CalendarEvent[];
  onSlotClick: (date: string, time: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export default function WeekView({ weekDays, events, onSlotClick, onEventClick }: WeekViewProps) {
  return (
    <div className="border rounded-lg bg-card overflow-auto shadow-card">
      <div className="grid" style={{ gridTemplateColumns: "60px repeat(7, 1fr)" }}>
        {/* Header row */}
        <div className="border-b border-r bg-muted/50 p-2" />
        {weekDays.map((day) => (
          <DayHeader key={day.toISOString()} day={day} />
        ))}

        {/* Time grid */}
        <div className="relative">
          {CALENDAR_HOURS.map((hour) => (
            <TimeLabel key={hour} hour={hour} />
          ))}
        </div>

        {weekDays.map((day) => {
          const dateStr = formatDate(day);
          const dayEvents = events.filter((e) => e.date === dateStr);
          return (
            <DayColumn
              key={dateStr}
              dateStr={dateStr}
              dayEvents={dayEvents}
              onSlotClick={onSlotClick}
              onEventClick={onEventClick}
            />
          );
        })}
      </div>
    </div>
  );
}

interface DayHeaderProps {
  day: Date;
}

function DayHeader({ day }: DayHeaderProps) {
  const isToday = formatDate(day) === formatDate(new Date());
  return (
    <div
      className={`border-b border-r p-2 text-center text-xs font-semibold ${
        isToday ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground"
      }`}
    >
      {formatDayLabel(day)}
    </div>
  );
}

interface TimeLabelProps {
  hour: number;
}

function TimeLabel({ hour }: TimeLabelProps) {
  return (
    <div
      className="border-b border-r text-[10px] text-muted-foreground px-1 flex items-start pt-0.5"
      style={{ height: `${HOUR_HEIGHT_PX}px` }}
    >
      {String(hour).padStart(2, "0")}:00
    </div>
  );
}

interface DayColumnProps {
  dateStr: string;
  dayEvents: CalendarEvent[];
  onSlotClick: (date: string, time: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

function DayColumn({ dateStr, dayEvents, onSlotClick, onEventClick }: DayColumnProps) {
  return (
    <div className="relative border-r" style={{ height: `${CALENDAR_HOURS.length * HOUR_HEIGHT_PX}px` }}>
      {CALENDAR_HOURS.map((hour) => (
        <HourSlot
          key={hour}
          hour={hour}
          dateStr={dateStr}
          onClick={onSlotClick}
        />
      ))}
      {dayEvents.map((event) => (
        <EventBlock key={event.id} event={event} onClick={onEventClick} />
      ))}
    </div>
  );
}

interface HourSlotProps {
  hour: number;
  dateStr: string;
  onClick: (date: string, time: string) => void;
}

function HourSlot({ hour, dateStr, onClick }: HourSlotProps) {
  return (
    <div
      className="border-b hover:bg-primary/5 cursor-pointer transition-colors"
      style={{ height: `${HOUR_HEIGHT_PX}px` }}
      onClick={() => onClick(dateStr, `${String(hour).padStart(2, "0")}:00`)}
    />
  );
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  SESSION: "bg-primary/90 text-primary-foreground",
  PRIVATE: "bg-info/90 text-info-foreground",
  BLOCKOUT: "bg-destructive/80 text-destructive-foreground",
};

interface EventBlockProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
}

function EventBlock({ event, onClick }: EventBlockProps) {
  const top = eventTopPx(event.startTime);
  const height = Math.max(eventHeightPx(event.startTime, event.endTime), 20);
  const colorClass = EVENT_TYPE_COLORS[event.eventType] ?? "bg-muted text-foreground";

  return (
    <div
      className={`absolute left-0.5 right-0.5 rounded-md px-1.5 py-0.5 text-[10px] leading-tight cursor-pointer overflow-hidden shadow-sm hover:shadow-md transition-shadow ${colorClass}`}
      style={{ top: `${top}px`, height: `${height}px` }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(event);
      }}
    >
      <p className="font-semibold truncate">{event.title}</p>
      <p className="opacity-80">{event.startTime}–{event.endTime}</p>
    </div>
  );
}
