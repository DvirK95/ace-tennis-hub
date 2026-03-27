import type { Group, AttendanceRecord, ClubUser } from "@/types/schemas";
import { Badge } from "@/components/ui/badge";

interface UserActivityTabProps {
  person: ClubUser;
  userGroups: Group[];
  absences: AttendanceRecord[];
}

export default function UserActivityTab({ person, userGroups, absences }: UserActivityTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <StatBox label="Makeup Credits" value={String(person.makeupCredits)} />
        <StatBox label="Total Absences" value={String(absences.length)} />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Active Groups</h3>
        {userGroups.length === 0 ? (
          <p className="text-sm text-muted-foreground">Not assigned to any groups.</p>
        ) : (
          <div className="space-y-2">
            {userGroups.map((g) => (
              <GroupCard key={g.id} group={g} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Recent Absences / Cancellations</h3>
        {absences.length === 0 ? (
          <p className="text-sm text-muted-foreground">No absences recorded.</p>
        ) : (
          <div className="space-y-1">
            {absences.slice(0, 10).map((a) => (
              <AbsenceRow key={a.id} record={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/50 rounded-lg p-4 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
    </div>
  );
}

function GroupCard({ group }: { group: Group }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <span className="text-sm font-medium">{group.name}</span>
      <Badge variant="outline">{group.schedule}</Badge>
    </div>
  );
}

function AbsenceRow({ record }: { record: AttendanceRecord }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b last:border-0 text-sm">
      <span>{record.sessionDate}</span>
      <Badge variant={record.status === "Cancelled_Eligible" ? "secondary" : "destructive"}>
        {record.status.replace("_", " ")}
      </Badge>
    </div>
  );
}
