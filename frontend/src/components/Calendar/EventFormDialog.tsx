import { useEventForm } from '@/hooks/useEventForm';
import type { CalendarEvent } from '@/types/schemas';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button/Button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FormField from '@/components/forms/FormField';
import EventParticipantsTab from './EventParticipantsTab';
import ConflictWarning from './ConflictWarning';

interface EventFormDialogProps {
  open: boolean;
  onClose: () => void;
  selectedSlot: { date: string; time: string } | null;
  editingEvent: CalendarEvent | null;
}

const EVENT_TYPE_OPTIONS = [
  { id: 'SESSION', name: 'אימון קבוצתי' },
  { id: 'PRIVATE', name: 'שיעור פרטי' },
  { id: 'BLOCKOUT', name: 'חסימה' },
];

const RECURRENCE_OPTIONS = [
  { id: 'NONE', name: 'Single (one-time)' },
  { id: 'DAILY', name: 'Daily' },
  { id: 'WEEKLY', name: 'Weekly' },
  { id: 'MONTHLY', name: 'Monthly' },
];

export default function EventFormDialog({
  open,
  onClose,
  selectedSlot,
  editingEvent,
}: EventFormDialogProps) {
  const {
    form,
    handleSubmit,
    courtOptions,
    peopleOptions,
    groupOptions,
    conflicts,
    handleCancelConflicts,
  } = useEventForm({ selectedSlot, editingEvent, onClose });

  const eventType = form.watch('eventType');
  const allCourts = form.watch('allCourts');

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingEvent ? 'Edit Event' : 'New Event'}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
            <TabsTrigger value="participants" className="flex-1" disabled={!editingEvent}>
              Participants
            </TabsTrigger>
          </TabsList>

          {/* ─── Details Tab ─────────────────────────────── */}
          <TabsContent value="details">
            {/* Conflict warning (shown when blockout/new event overlaps existing) */}
            {conflicts.length > 0 && (
              <ConflictWarning
                conflicts={conflicts}
                onCancelConflicts={handleCancelConflicts}
              />
            )}

            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField form={form} name="title" label="Title" placeholder="e.g. Morning training" isRequired />

              <FormField
                form={form}
                name="eventType"
                field="select"
                label="Event Type"
                options={EVENT_TYPE_OPTIONS}
                placeholder="Select type"
                isRequired
              />

              <FormField form={form} name="date" label="Date" type="date" isRequired />

              <div className="grid grid-cols-2 gap-4">
                <FormField form={form} name="startTime" label="Start Time" type="time" placeholder="07:00" isRequired />
                <FormField form={form} name="endTime" label="End Time" type="time" placeholder="08:00" isRequired />
              </div>

              <FormField
                form={form}
                name="recurrence"
                field="select"
                label="Recurrence"
                options={RECURRENCE_OPTIONS}
                placeholder="Select"
                isRequired
              />

              {eventType === 'BLOCKOUT' && (
                <div className="flex items-center justify-between rounded-md border p-3">
                  <span className="text-sm font-medium">Block ALL courts</span>
                  <Switch
                    checked={form.watch('allCourts')}
                    onCheckedChange={(v) => form.setValue('allCourts', v)}
                  />
                </div>
              )}

              {!allCourts && (
                <FormField
                  form={form}
                  name="courtId"
                  field="select"
                  label="Court"
                  options={courtOptions}
                  placeholder="Select court"
                />
              )}

              {eventType !== 'BLOCKOUT' && (
                <>
                  <FormField
                    form={form}
                    name="groupId"
                    field="select"
                    label="Group (optional)"
                    options={[{ id: 'none', name: 'None' }, ...groupOptions]}
                    placeholder="None"
                  />
                  <FormField
                    form={form}
                    name="assigneeIds"
                    field="multiSelect"
                    label="Participants"
                    options={peopleOptions}
                    placeholder="Select participants…"
                  />
                </>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">{editingEvent ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </TabsContent>

          {/* ─── Participants Tab ─────────────────────────── */}
          <TabsContent value="participants">
            {editingEvent ? (
              <EventParticipantsTab event={editingEvent} />
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Save the event first to manage participants.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
