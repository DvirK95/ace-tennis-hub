import { useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
          coachIds: editingGroup.coachIds,
          memberIds: editingGroup.memberIds,
          schedule: editingGroup.schedule,
          courtId: editingGroup.courtId,
        }
      : { name: '', coachIds: [], memberIds: [], schedule: '', courtId: '' },
  });

  useEffect(() => {
    if (editingGroup) {
      form.reset({
        name: editingGroup.name,
        coachIds: editingGroup.coachIds,
        memberIds: editingGroup.memberIds,
        schedule: editingGroup.schedule,
        courtId: editingGroup.courtId,
      });
    } else {
      form.reset({ name: '', coachIds: [], memberIds: [], schedule: '', courtId: '' });
    }
  }, [editingGroup, form]);

  function handleFormSubmit(values: GroupFormValues) {
    onSubmit(values);
    form.reset();
  }

  const { register, handleSubmit, setValue, watch, formState: { errors } } = form;
  const coachIds = watch('coachIds');
  const memberIds = watch('memberIds');
  const courtId = watch('courtId');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingGroup ? 'Edit Group' : 'Add Group'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <Label className="text-sm">Group Name</Label>
            <Input {...register('name')} className="mt-1" />
            {errors.name && <p className="mt-0.5 text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* Coaches — multi-check */}
          <div>
            <Label className="text-sm">Coaches</Label>
            {errors.coachIds && <p className="text-xs text-destructive">{errors.coachIds.message}</p>}
            <div className="mt-1 max-h-36 space-y-2 overflow-y-auto rounded-md border p-3">
              {coaches.map((c) => (
                <label key={c.id} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox
                    checked={coachIds.includes(c.id)}
                    onCheckedChange={(checked) => {
                      setValue(
                        'coachIds',
                        checked ? [...coachIds, c.id] : coachIds.filter((id) => id !== c.id),
                      );
                    }}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>

          {/* Court */}
          <div>
            <Label className="text-sm">Court</Label>
            <Select value={courtId} onValueChange={(v) => setValue('courtId', v)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select court" />
              </SelectTrigger>
              <SelectContent>
                {courts.filter((c) => c.status === 'Active').map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.courtId && <p className="mt-0.5 text-xs text-destructive">{errors.courtId.message}</p>}
          </div>

          {/* Schedule */}
          <div>
            <Label className="text-sm">Schedule</Label>
            <Input {...register('schedule')} placeholder="e.g. Mon & Wed 9:00–10:30" className="mt-1" />
            {errors.schedule && <p className="mt-0.5 text-xs text-destructive">{errors.schedule.message}</p>}
          </div>

          {/* Members */}
          <div>
            <Label className="text-sm">Members</Label>
            <div className="mt-1 max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
              {members.map((m) => (
                <label key={m.id} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox
                    checked={memberIds.includes(m.id)}
                    onCheckedChange={(checked) => {
                      setValue(
                        'memberIds',
                        checked ? [...memberIds, m.id] : memberIds.filter((id) => id !== m.id),
                      );
                    }}
                  />
                  {m.name}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingGroup ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
