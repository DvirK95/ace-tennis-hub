import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { coachFormSchema, type CoachFormValues, type Coach } from "@/types/schemas";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";

interface CoachFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CoachFormValues) => void;
  editingCoach: Coach | null;
}

export default function CoachFormDialog({
  open, onOpenChange, onSubmit, editingCoach,
}: CoachFormDialogProps) {
  const form = useForm<CoachFormValues>({
    resolver: zodResolver(coachFormSchema),
    defaultValues: editingCoach
      ? { name: editingCoach.name, email: editingCoach.email, phone: editingCoach.phone, specializations: editingCoach.specializations, hourlyRate: editingCoach.hourlyRate }
      : { name: "", email: "", phone: "", specializations: "", hourlyRate: 0 },
  });

  function handleFormSubmit(values: CoachFormValues) {
    onSubmit(values);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{editingCoach ? "Edit Coach" : "Add Coach"}</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="specializations" render={({ field }) => (
              <FormItem><FormLabel>Specializations</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="hourlyRate" render={({ field }) => (
              <FormItem><FormLabel>Hourly Rate ($)</FormLabel><FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">{editingCoach ? "Update" : "Create"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
