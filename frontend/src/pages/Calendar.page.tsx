import { useCalendar } from '@/hooks/useCalendar';
import WeekView from '@/components/Calendar/WeekView';
import MonthView from '@/components/Calendar/MonthView';
import DayView from '@/components/Calendar/DayView';
import CalendarFilters from '@/components/Calendar/CalendarFilters';
import EventFormDialog from '@/components/Calendar/EventFormDialog';
import PageHeader from '@/components/Layout/PageHeader';
import { formatDayLabel, formatMonthYear } from '@/lib/timeUtils';
import { format } from 'date-fns';

export default function CalendarPage() {
  const {
    calendarView,
    setCalendarView,
    filterMode,
    setFilterMode,
    weekDays,
    monthRef,
    dayRef,
    navigatePrev,
    navigateNext,
    goToToday,
    selectedCourtId,
    setSelectedCourtId,
    selectedCoachId,
    setSelectedCoachId,
    filteredEvents,
    weekEvents,
    dayEvents,
    courts,
    coaches,
    selectedSlot,
    selectedEvent,
    isFormOpen,
    formKey,
    openSlotForm,
    openEventEdit,
    openCreateForm,
    closeForm,
  } = useCalendar();

  function getPeriodLabel(): string {
    if (calendarView === 'month') return formatMonthYear(monthRef);
    if (calendarView === 'day') return formatDayLabel(dayRef);
    if (weekDays.length >= 7) {
      return `${formatDayLabel(weekDays[0])} — ${formatDayLabel(weekDays[6])}`;
    }
    return '';
  }

  function handleDayClick(dateStr: string) {
    // Switch to day view for that date
    openSlotForm(dateStr, format(new Date(), 'HH:00'));
  }

  return (
    <div>
      <PageHeader title="Calendar" description="Club schedule command center" />
      <CalendarFilters
        periodLabel={getPeriodLabel()}
        calendarView={calendarView}
        onViewChange={setCalendarView}
        filterMode={filterMode}
        onFilterModeChange={setFilterMode}
        selectedCourtId={selectedCourtId}
        onCourtChange={setSelectedCourtId}
        selectedCoachId={selectedCoachId}
        onCoachChange={setSelectedCoachId}
        courts={courts}
        coaches={coaches}
        onPrev={navigatePrev}
        onNext={navigateNext}
        onToday={goToToday}
        onCreateEvent={openCreateForm}
      />

      {calendarView === 'month' && (
        <MonthView
          monthRef={monthRef}
          events={filteredEvents}
          onDayClick={handleDayClick}
          onEventClick={openEventEdit}
        />
      )}

      {calendarView === 'week' && (
        <WeekView
          weekDays={weekDays}
          events={weekEvents}
          onSlotClick={openSlotForm}
          onEventClick={openEventEdit}
        />
      )}

      {calendarView === 'day' && (
        <DayView
          dayRef={dayRef}
          events={dayEvents}
          courts={courts}
          onSlotClick={openSlotForm}
          onEventClick={openEventEdit}
        />
      )}

      <EventFormDialog
        key={formKey}
        open={isFormOpen}
        onClose={closeForm}
        selectedSlot={selectedSlot}
        editingEvent={selectedEvent}
      />
    </div>
  );
}
