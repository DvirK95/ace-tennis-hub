import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingFormSchema, type BookingFormValues, type Court, type Trainee } from "@/types/schemas";
import type { AppUser } from "@/types/permissions";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";

interface BookingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: BookingFormValues) => void;
  courts: Court[];
  trainees: Trainee[];
  currentUser: AppUser;
}

const TIME_SLOTS = [
  "08:00–09:00", "09:00–10:00", "10:00–11:00", "11:00–12:00",
  "13:00–14:00", "14:00–15:00", "15:00–16:00", "16:00–17:00", "17:00–18:00",
];

export default function BookingFormDialog({
  open, onOpenChange, onSubmit, courts, trainees, currentUser,
}: BookingFormDialogProps) {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      date: "",
      timeSlot: "",
      courtId: "",
      useMakeupCredit: false,
      traineeId: undefined,
    },
  });

  const selectedTraineeId = form.watch("traineeId");
  const selectedTrainee = trainees.find((t) => t.id === selectedTraineeId);
  const hasMakeupCredits = selectedTrainee && selectedTrainee.makeupCredits > 0;

  function handleFormSubmit(values: BookingFormValues) {
    onSubmit(values);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Request Booking</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField control={form.control} name="date" render={({ field }) => (
              <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="timeSlot" render={({ field }) => (
              <FormItem><FormLabel>Time Slot</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {TIME_SLOTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select><FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="courtId" render={({ field }) => (
              <FormItem><FormLabel>Court</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select court" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {courts.filter((c) => c.status === "Active").map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select><FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="traineeId" render={({ field }) => (
              <FormItem><FormLabel>Trainee (optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select trainee" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {trainees.map((t) => <SelectItem key={t.id} value={t.id}>{t.name} ({t.makeupCredits} credits)</SelectItem>)}
                  </SelectContent>
                </Select><FormMessage />
              </FormItem>
            )} />
            {hasMakeupCredits && (
              <FormField control={form.control} name="useMakeupCredit" render={({ field }) => (
                <FormItem>
                  <label className="flex items-center gap-2 text-sm p-3 rounded-md bg-success/10 border border-success/20">
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    Use Makeup Credit ({selectedTrainee.makeupCredits} available)
                  </label>
                </FormItem>
              )} />
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Submit Request</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
