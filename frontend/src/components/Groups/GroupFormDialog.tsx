import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  groupFormSchema,
  type GroupFormValues,
  type Group,
  type ClubUser,
  type Court,
} from '@/types/schemas';
import { usePersonStore } from '@/stores/usePersonStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useMemo } from 'react';

interface GroupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: GroupFormValues) => void;
  editingGroup: Group | null;
  coaches: ClubUser[];
  courts: Court[];
}

export default function GroupFormDialog({
  open,
  onOpenChange,
  onSubmit,
  editingGroup,
  coaches,
  courts,
}: GroupFormDialogProps) {
  const people = usePersonStore((s) => s.people);
  const members = useMemo(() => people.filter((p) => p.roles.includes('TRAINEE')), [people]);

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: editingGroup
      ? {
          name: editingGroup.name,
          coachId: editingGroup.coachId,
          memberIds: editingGroup.memberIds,
          schedule: editingGroup.schedule,
          courtId: editingGroup.courtId,
        }
      : { name: '', coachId: '', memberIds: [], schedule: '', courtId: '' },
  });

  function handleFormSubmit(values: GroupFormValues) {
    onSubmit(values);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingGroup ? 'Edit Group' : 'Add Group'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coachId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coach</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select coach" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {coaches.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courtId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Court</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select court" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courts
                        .filter((c) => c.status === 'Active')
                        .map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="schedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Mon & Wed 9:00–10:30" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="memberIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Members</FormLabel>
                  <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
                    {members.map((m) => (
                      <MemberCheckboxItem
                        key={m.id}
                        id={m.id}
                        name={m.name}
                        checked={field.value.includes(m.id)}
                        onChange={(checked) => {
                          field.onChange(
                            checked
                              ? [...field.value, m.id]
                              : field.value.filter((id) => id !== m.id)
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingGroup ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface MemberCheckboxItemProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function MemberCheckboxItem({ name, checked, onChange }: MemberCheckboxItemProps) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <Checkbox checked={checked} onCheckedChange={(c) => onChange(c === true)} />
      {name}
    </label>
  );
}
