import type { CalendarEvent, Court } from '@/types/schemas';
import { usePersonStore } from '@/stores/usePersonStore';
import {
  CALENDAR_HOURS,
  HOUR_HEIGHT_PX,
  eventTopPx,
  eventHeightPx,
  formatDate,
} from '@/lib/timeUtils';

interface DayViewProps {
  dayRef: Date;
  events: CalendarEvent[];
  courts: Court[];
  onSlotClick: (date: string, time: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  SESSION: 'bg-primary/90 text-primary-foreground',
  PRIVATE: 'bg-sky-500/90 text-white',
  BLOCKOUT: 'bg-destructive/80 text-destructive-foreground',
};

export default function DayView({
  dayRef,
  events,
  courts,
  onSlotClick,
  onEventClick,
}: DayViewProps) {
  const activeCourts = courts.filter((c) => c.status === 'Active');
  const dateStr = formatDate(dayRef);

  const totalHeight = CALENDAR_HOURS.length * HOUR_HEIGHT_PX;

  return (
    <div className="overflow-auto rounded-lg border bg-card shadow-card">
      <div
        className="grid"
        style={{ gridTemplateColumns: `64px repeat(${activeCourts.length}, minmax(120px, 1fr))` }}
      >
        {/* Header: empty corner + court names */}
        <div className="sticky top-0 z-10 border-b border-r bg-muted/80 p-2" />
        {activeCourts.map((court) => (
          <div
            key={court.id}
            className="sticky top-0 z-10 border-b border-r bg-muted/80 p-2 text-center text-xs font-semibold text-foreground last:border-r-0"
          >
            <p className="truncate">{court.name}</p>
            <p className="truncate text-[10px] text-muted-foreground">{court.surfaceType}</p>
          </div>
        ))}

        {/* Time labels */}
        <div className="relative border-r" style={{ height: `${totalHeight}px` }}>
          {CALENDAR_HOURS.map((hour) => (
            <div
              key={hour}
              className="flex items-start border-b px-1 pt-0.5 text-[10px] text-muted-foreground"
              style={{ height: `${HOUR_HEIGHT_PX}px` }}
            >
              {String(hour).padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Court columns */}
        {activeCourts.map((court) => {
          const courtEvents = events.filter(
            (e) => e.date === dateStr && (e.courtId === court.id || e.allCourts),
          );

          return (
            <CourtColumn
              key={court.id}
              court={court}
              dateStr={dateStr}
              courtEvents={courtEvents}
              totalHeight={totalHeight}
              onSlotClick={onSlotClick}
              onEventClick={onEventClick}
            />
          );
        })}
      </div>
    </div>
  );
}

interface CourtColumnProps {
  court: Court; // used for key in parent; kept for type safety
  dateStr: string;
  courtEvents: CalendarEvent[];
  totalHeight: number;
  onSlotClick: (date: string, time: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

function CourtColumn({
  court: _court,
  dateStr,
  courtEvents,
  totalHeight,
  onSlotClick,
  onEventClick,
}: CourtColumnProps) {
  return (
    <div
      className="relative border-r last:border-r-0"
      style={{ height: `${totalHeight}px` }}
    >
      {/* Hour slot backgrounds */}
      {CALENDAR_HOURS.map((hour) => (
        <div
          key={hour}
          className="cursor-pointer border-b transition-colors hover:bg-primary/5"
          style={{ height: `${HOUR_HEIGHT_PX}px` }}
          onClick={() =>
            onSlotClick(dateStr, `${String(hour).padStart(2, '0')}:00`)
          }
        />
      ))}

      {/* Events */}
      {courtEvents.map((event) => (
        <DayEventBlock key={event.id} event={event} onClick={onEventClick} />
      ))}
    </div>
  );
}

interface DayEventBlockProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
}

function DayEventBlock({ event, onClick }: DayEventBlockProps) {
  const top = eventTopPx(event.startTime);
  const height = eventHeightPx(event.startTime, event.endTime);
  const colorClass = EVENT_TYPE_COLORS[event.eventType] ?? 'bg-muted text-foreground';
  const people = usePersonStore((s) => s.people);

  const participantNames = event.assigneeIds
    .slice(0, 2)
    .map((id) => people.find((p) => p.id === id)?.name.split(' ')[0] ?? '?');
  const extraCount = Math.max(0, event.assigneeIds.length - 2);

  return (
    <div
      className={`absolute inset-x-0.5 cursor-pointer overflow-hidden rounded-md px-1.5 py-0.5 text-[10px] leading-tight shadow-sm transition-shadow hover:shadow-md ${colorClass}`}
      style={{ top: `${top}px`, height: `${height}px` }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(event);
      }}
    >
      <p className="truncate font-semibold">{event.title}</p>
      <p className="opacity-80">
        {event.startTime}–{event.endTime}
      </p>
      {participantNames.length > 0 && height > 40 && (
        <p className="truncate opacity-70">
          {participantNames.join(', ')}
          {extraCount > 0 && ` +${extraCount}`}
        </p>
      )}
    </div>
  );
}
