import type { CalendarView, CalendarFilterMode } from '@/hooks/useCalendar';
import type { Court, ClubUser } from '@/types/schemas';
import { Button } from '@/components/ui/Button/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, CalendarDays, Plus, CalendarRange, Calendar, Grid3x3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarFiltersProps {
  periodLabel: string;
  calendarView: CalendarView;
  onViewChange: (view: CalendarView) => void;
  filterMode: CalendarFilterMode;
  onFilterModeChange: (mode: CalendarFilterMode) => void;
  selectedCourtId: string;
  onCourtChange: (id: string) => void;
  selectedCoachId: string;
  onCoachChange: (id: string) => void;
  courts: Court[];
  coaches: ClubUser[];
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onCreateEvent: () => void;
}

const VIEW_BUTTONS: { value: CalendarView; label: string; icon: React.ReactNode }[] = [
  { value: 'month', label: 'Month', icon: <Calendar className="h-3.5 w-3.5" /> },
  { value: 'week', label: 'Week', icon: <CalendarRange className="h-3.5 w-3.5" /> },
  { value: 'day', label: 'Day', icon: <Grid3x3 className="h-3.5 w-3.5" /> },
];

export default function CalendarFilters({
  periodLabel,
  calendarView,
  onViewChange,
  filterMode,
  onFilterModeChange,
  selectedCourtId,
  onCourtChange,
  selectedCoachId,
  onCoachChange,
  courts,
  coaches,
  onPrev,
  onNext,
  onToday,
  onCreateEvent,
}: CalendarFiltersProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      {/* Navigation */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          icon={<ChevronLeft className="h-4 w-4" />}
          aria-label="Previous"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          icon={<CalendarDays className="h-4 w-4" />}
        >
          Today
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          icon={<ChevronRight className="h-4 w-4" />}
          aria-label="Next"
        />
      </div>

      {/* Period label */}
      <span className="min-w-[200px] text-sm font-semibold text-foreground">{periodLabel}</span>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        {/* View toggle */}
        <div className="flex rounded-md border">
          {VIEW_BUTTONS.map(({ value, label, icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => onViewChange(value)}
              className={cn(
                'flex items-center gap-1.5 border-r px-3 py-1.5 text-xs font-medium last:border-r-0 transition-colors',
                calendarView === value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:bg-muted',
              )}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Filter mode */}
        <Select value={filterMode} onValueChange={(v) => onFilterModeChange(v as CalendarFilterMode)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
          <SelectItem value="global">All Courts</SelectItem>
          <SelectItem value="court">By Court</SelectItem>
          <SelectItem value="coach">By Coach</SelectItem>
          </SelectContent>
        </Select>

        {filterMode === 'court' && (
          <Select value={selectedCourtId} onValueChange={onCourtChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select court" />
            </SelectTrigger>
            <SelectContent>
              {courts.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {filterMode === 'coach' && (
          <Select value={selectedCoachId} onValueChange={onCoachChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select coach" />
            </SelectTrigger>
            <SelectContent>
              {coaches.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Create event button */}
        <Button
          size="sm"
          onClick={onCreateEvent}
          icon={<Plus className="h-4 w-4" />}
        >
          New Event
        </Button>
      </div>
    </div>
  );
}
