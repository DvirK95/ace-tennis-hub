import { useEventForm } from "@/hooks/useEventForm";
import type { CalendarEvent } from "@/types/schemas";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";

interface EventFormDialogProps {
  open: boolean;
  onClose: () => void;
  selectedSlot: { date: string; time: string } | null;
  editingEvent: CalendarEvent | null;
}

export default function EventFormDialog({
  open, onClose, selectedSlot, editingEvent,
}: EventFormDialogProps) {
  const { form, handleSubmit, courts, people, groups, timeSlots } = useEventForm({
    selectedSlot,
    editingEvent,
    onClose,
  });

  const eventType = form.watch("eventType");
  const allCourts = form.watch("allCourts");

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingEvent ? "Edit Event" : "Add Event"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name="eventType" render={({ field }) => (
              <FormItem><FormLabel>Event Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="SESSION">Session</SelectItem>
                    <SelectItem value="PRIVATE">Private</SelectItem>
                    <SelectItem value="BLOCKOUT">Blockout</SelectItem>
                  </SelectContent>
                </Select><FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="date" render={({ field }) => (
              <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="startTime" render={({ field }) => (
                <FormItem><FormLabel>Start Time</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Start" /></SelectTrigger></FormControl>
                    <SelectContent className="max-h-48">
                      {timeSlots.map((t) => <TimeSlotOption key={`s-${t}`} value={t} />)}
                    </SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="endTime" render={({ field }) => (
                <FormItem><FormLabel>End Time</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="End" /></SelectTrigger></FormControl>
                    <SelectContent className="max-h-48">
                      {timeSlots.map((t) => <TimeSlotOption key={`e-${t}`} value={t} />)}
                    </SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )} />
            </div>

            {eventType === "BLOCKOUT" && (
              <FormField control={form.control} name="allCourts" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel>Block ALL Courts</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />
            )}

            {!allCourts && (
              <FormField control={form.control} name="courtId" render={({ field }) => (
                <FormItem><FormLabel>Court</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select court" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {courts.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )} />
            )}

            {eventType !== "BLOCKOUT" && (
              <>
                <FormField control={form.control} name="groupId" render={({ field }) => (
                  <FormItem><FormLabel>Group (optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                      <FormControl><SelectTrigger><SelectValue placeholder="None" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {groups.map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                      </SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="assigneeId" render={({ field }) => (
                  <FormItem><FormLabel>Assignee (optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                      <FormControl><SelectTrigger><SelectValue placeholder="None" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {people.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                      </SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )} />
              </>
            )}

            <FormField control={form.control} name="recurrence" render={({ field }) => (
              <FormItem><FormLabel>Recurrence</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="NONE">None (Single)</SelectItem>
                    <SelectItem value="DAILY">Daily</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                  </SelectContent>
                </Select><FormMessage />
              </FormItem>
            )} />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{editingEvent ? "Update" : "Create"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function TimeSlotOption({ value }: { value: string }) {
  return <SelectItem value={value}>{value}</SelectItem>;
}
