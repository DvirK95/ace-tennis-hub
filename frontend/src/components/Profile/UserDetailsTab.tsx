import type { ClubUser } from '@/types/schemas';
import { Badge } from '@/components/ui/badge';

interface UserDetailsTabProps {
  person: ClubUser;
}

export default function UserDetailsTab({ person }: UserDetailsTabProps) {
  return (
    <div className="space-y-6">
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
        {person.specializations && (
          <DetailField label="Specializations" value={person.specializations} />
        )}
        {person.hourlyRate !== undefined && (
          <DetailField label="Hourly Rate" value={`$${person.hourlyRate}`} />
        )}
      </div>
      {person.notes && (
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">Notes</p>
          <p className="rounded-md bg-muted/50 p-3 text-sm">{person.notes}</p>
        </div>
      )}
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
