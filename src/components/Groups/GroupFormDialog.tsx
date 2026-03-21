import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { groupFormSchema, type GroupFormValues, type Group, type Coach, type Court } from "@/types/schemas";
import { useTraineeStore } from "@/stores/useTraineeStore";
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

interface GroupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: GroupFormValues) => void;
  editingGroup: Group | null;
  coaches: Coach[];
  courts: Court[];
}

export default function GroupFormDialog({
  open, onOpenChange, onSubmit, editingGroup, coaches, courts,
}: GroupFormDialogProps) {
  const { trainees } = useTraineeStore();

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: editingGroup
      ? { name: editingGroup.name, coachId: editingGroup.coachId, traineeIds: editingGroup.traineeIds, schedule: editingGroup.schedule, courtId: editingGroup.courtId }
      : { name: "", coachId: "", traineeIds: [], schedule: "", courtId: "" },
  });

  function handleFormSubmit(values: GroupFormValues) {
    onSubmit(values);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{editingGroup ? "Edit Group" : "Add Group"}</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Group Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="coachId" render={({ field }) => (
              <FormItem><FormLabel>Coach</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select coach" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {coaches.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
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
            <FormField control={form.control} name="schedule" render={({ field }) => (
              <FormItem><FormLabel>Schedule</FormLabel><FormControl><Input placeholder="e.g. Mon & Wed 9:00–10:30" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="traineeIds" render={({ field }) => (
              <FormItem>
                <FormLabel>Members</FormLabel>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                  {trainees.map((t) => (
                    <label key={t.id} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={field.value.includes(t.id)}
                        onCheckedChange={(checked) => {
                          field.onChange(
                            checked
                              ? [...field.value, t.id]
                              : field.value.filter((id: string) => id !== t.id)
                          );
                        }}
                      />
                      {t.name}
                    </label>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">{editingGroup ? "Update" : "Create"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
