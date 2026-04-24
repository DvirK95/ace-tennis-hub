import { useState } from 'react';
import type { ClubUser, ClubUserFormValues } from '@/types/schemas';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button/Button';
import { Pencil } from 'lucide-react';
import { usePersonStore } from '@/stores/usePersonStore';
import PersonFormDialog from '@/components/People/PersonFormDialog';

interface UserDetailsTabProps {
  person: ClubUser;
}

export default function UserDetailsTab({ person }: UserDetailsTabProps) {
  const [editOpen, setEditOpen] = useState(false);
  const updatePerson = usePersonStore((s) => s.updatePerson);

  function handleSave(values: ClubUserFormValues) {
    updatePerson(person.id, values);
    setEditOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">Personal Details</h3>
        <Button
          variant="outline"
          size="sm"
          icon={<Pencil className="h-3.5 w-3.5" />}
          onClick={() => setEditOpen(true)}
        >
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <DetailField label="Email" value={person.email} />
        <DetailField label="Phone" value={person.phone} />
        <DetailField label="Birthdate" value={person.birthdate ?? '—'} />
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">Roles</p>
          <div className="flex gap-1">
            {person.roles.map((role) => (
              <RoleBadge key={role} role={role} />
            ))}
          </div>
        </div>
        <DetailField label="Membership Start" value={person.membershipStartDate ?? '—'} />
        <DetailField label="Membership End" value={person.membershipEndDate ?? '—'} />
        <DetailField label="Makeup Credits" value={String(person.makeupCredits)} />
        {person.specializations && (
          <DetailField label="Specializations" value={person.specializations} />
        )}
        {person.hourlyRate !== undefined && (
          <DetailField label="Hourly Rate" value={`₪${person.hourlyRate}`} />
        )}
      </div>

      {person.notes && (
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">Notes</p>
          <p className="rounded-md bg-muted/50 p-3 text-sm">{person.notes}</p>
        </div>
      )}

      <PersonFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleSave}
        editingPerson={person}
      />
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-0.5 text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  return <Badge variant="secondary">{role}</Badge>;
}
