import type { CalendarViewMode } from "@/hooks/useCalendar";
import type { Court, ClubUser } from "@/types/schemas";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

interface CalendarFiltersProps {
  weekLabel: string;
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
  selectedCourtId: string;
  onCourtChange: (id: string) => void;
  selectedCoachId: string;
  onCoachChange: (id: string) => void;
  courts: Court[];
  coaches: ClubUser[];
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function CalendarFilters({
  weekLabel, viewMode, onViewModeChange,
  selectedCourtId, onCourtChange,
  selectedCoachId, onCoachChange,
  courts, coaches,
  onPrev, onNext, onToday,
}: CalendarFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={onPrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onToday}>
          <CalendarDays className="h-4 w-4 mr-1" /> Today
        </Button>
        <Button variant="outline" size="sm" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <span className="text-sm font-semibold text-foreground min-w-[180px]">{weekLabel}</span>

      <div className="flex items-center gap-2 ml-auto">
        <Select value={viewMode} onValueChange={(v) => onViewModeChange(v as CalendarViewMode)}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="global">Global Schedule</SelectItem>
            <SelectItem value="court">By Court</SelectItem>
            <SelectItem value="coach">By Coach</SelectItem>
          </SelectContent>
        </Select>

        {viewMode === "court" && (
          <Select value={selectedCourtId} onValueChange={onCourtChange}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Select court" /></SelectTrigger>
            <SelectContent>
              {courts.map((c) => (
                <CourtSelectItem key={c.id} id={c.id} name={c.name} />
              ))}
            </SelectContent>
          </Select>
        )}

        {viewMode === "coach" && (
          <Select value={selectedCoachId} onValueChange={onCoachChange}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Select coach" /></SelectTrigger>
            <SelectContent>
              {coaches.map((c) => (
                <CoachSelectItem key={c.id} id={c.id} name={c.name} />
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}

function CourtSelectItem({ id, name }: { id: string; name: string }) {
  return <SelectItem value={id}>{name}</SelectItem>;
}

function CoachSelectItem({ id, name }: { id: string; name: string }) {
  return <SelectItem value={id}>{name}</SelectItem>;
}
