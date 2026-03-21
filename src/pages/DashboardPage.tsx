import { useCourtStore } from "@/stores/useCourtStore";
import { useTraineeStore } from "@/stores/useTraineeStore";
import { useCoachStore } from "@/stores/useCoachStore";
import { useBookingStore } from "@/stores/useBookingStore";
import { useGroupStore } from "@/stores/useGroupStore";
import { Landmark, Users, GraduationCap, CalendarCheck, UsersRound, AlertCircle } from "lucide-react";
import PageHeader from "@/components/Layout/PageHeader";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: string;
}

function StatCard({ icon, label, value, accent }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg border p-5 shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${accent ?? "bg-primary/10 text-primary"}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const courts = useCourtStore((s) => s.courts);
  const trainees = useTraineeStore((s) => s.trainees);
  const coaches = useCoachStore((s) => s.coaches);
  const bookings = useBookingStore((s) => s.bookings);
  const groups = useGroupStore((s) => s.groups);

  const pending = bookings.filter((b) => b.status === "PENDING_APPROVAL").length;

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your tennis club" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={<Landmark className="h-5 w-5" />} label="Courts" value={courts.length} />
        <StatCard icon={<Users className="h-5 w-5" />} label="Trainees" value={trainees.length} accent="bg-info/10 text-info" />
        <StatCard icon={<GraduationCap className="h-5 w-5" />} label="Coaches" value={coaches.length} accent="bg-accent/10 text-accent" />
        <StatCard icon={<UsersRound className="h-5 w-5" />} label="Groups" value={groups.length} accent="bg-success/10 text-success" />
        <StatCard icon={<CalendarCheck className="h-5 w-5" />} label="Total Bookings" value={bookings.length} accent="bg-primary/10 text-primary" />
        <StatCard icon={<AlertCircle className="h-5 w-5" />} label="Pending Approvals" value={pending} accent="bg-warning/10 text-warning" />
      </div>
    </div>
  );
}
