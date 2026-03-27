import { useCalendar } from "@/hooks/useCalendar";
import WeekView from "@/components/Calendar/WeekView";
import CalendarFilters from "@/components/Calendar/CalendarFilters";
import EventFormDialog from "@/components/Calendar/EventFormDialog";
import PageHeader from "@/components/Layout/PageHeader";
import { formatDayLabel } from "@/lib/timeUtils";

export default function CalendarPage() {
  const {
    weekDays, navigateWeek, goToToday,
    viewMode, setViewMode,
    selectedCourtId, setSelectedCourtId,
    selectedCoachId, setSelectedCoachId,
    filteredEvents, courts, coaches,
    selectedSlot, selectedEvent, isFormOpen,
    openSlotForm, openEventEdit, closeForm,
  } = useCalendar();

  const weekLabel = weekDays.length >= 2
    ? `${formatDayLabel(weekDays[0])} — ${formatDayLabel(weekDays[6])}`
    : "";

  return (
    <div>
      <PageHeader title="Calendar" description="Club schedule command center" />
      <CalendarFilters
        weekLabel={weekLabel}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedCourtId={selectedCourtId}
        onCourtChange={setSelectedCourtId}
        selectedCoachId={selectedCoachId}
        onCoachChange={setSelectedCoachId}
        courts={courts}
        coaches={coaches}
        onPrev={() => navigateWeek(-1)}
        onNext={() => navigateWeek(1)}
        onToday={goToToday}
      />
      <WeekView
        weekDays={weekDays}
        events={filteredEvents}
        onSlotClick={openSlotForm}
        onEventClick={openEventEdit}
      />
      <EventFormDialog
        open={isFormOpen}
        onClose={closeForm}
        selectedSlot={selectedSlot}
        editingEvent={selectedEvent}
      />
    </div>
  );
}
