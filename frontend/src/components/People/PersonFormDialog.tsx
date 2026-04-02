import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  clubUserFormSchema,
  type ClubUserFormValues,
  type ClubUser,
  USER_ROLES,
} from '@/types/schemas';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useEffect } from 'react';

interface PersonFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ClubUserFormValues) => void;
  editingPerson: ClubUser | null;
}

export default function PersonFormDialog({
  open,
  onOpenChange,
  onSubmit,
  editingPerson,
}: PersonFormDialogProps) {
  const form = useForm<ClubUserFormValues>({
    resolver: zodResolver(clubUserFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      birthdate: '',
      roles: [],
      membershipStartDate: '',
      membershipEndDate: '',
      notes: '',
      specializations: '',
      hourlyRate: undefined,
    },
  });

  useEffect(() => {
    if (editingPerson) {
      form.reset({
        name: editingPerson.name,
        email: editingPerson.email,
        phone: editingPerson.phone,
        birthdate: editingPerson.birthdate ?? '',
        roles: editingPerson.roles,
        membershipStartDate: editingPerson.membershipStartDate ?? '',
        membershipEndDate: editingPerson.membershipEndDate ?? '',
        notes: editingPerson.notes ?? '',
        specializations: editingPerson.specializations ?? '',
        hourlyRate: editingPerson.hourlyRate,
      });
    } else {
      form.reset({
        name: '',
        email: '',
        phone: '',
        birthdate: '',
        roles: [],
        membershipStartDate: '',
        membershipEndDate: '',
        notes: '',
        specializations: '',
        hourlyRate: undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingPerson]);

  function handleFormSubmit(values: ClubUserFormValues) {
    onSubmit(values);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingPerson ? 'Edit Person' : 'Add Person'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birthdate</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <div className="flex gap-4">
                    {USER_ROLES.map((role) => (
                      <RoleCheckboxItem
                        key={role}
                        role={role}
                        checked={field.value?.includes(role) ?? false}
                        onChange={(checked) => {
                          const current = field.value ?? [];
                          field.onChange(
                            checked ? [...current, role] : current.filter((r) => r !== role)
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="membershipStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Membership Start</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="membershipEndDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Membership End</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="specializations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specializations (Coach)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Serve & Volley" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hourly Rate (Coach)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value ? Number(e.target.value) : undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingPerson ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface RoleCheckboxItemProps {
  role: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function RoleCheckboxItem({ role, checked, onChange }: RoleCheckboxItemProps) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <Checkbox checked={checked} onCheckedChange={(c) => onChange(c === true)} />
      {role}
    </label>
  );
}
