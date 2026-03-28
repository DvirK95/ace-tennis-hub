import { useCourtStore } from '@/stores/useCourtStore';
import { usePersonStore } from '@/stores/usePersonStore';
import { useEventStore } from '@/stores/useEventStore';
import { useGroupStore } from '@/stores/useGroupStore';
import { Landmark, Users, CalendarCheck, UsersRound, AlertCircle, ListTodo } from 'lucide-react';
import PageHeader from '@/components/Layout/PageHeader';
import GlobalTasksWidget from '@/components/Dashboard/GlobalTasksWidget';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: string;
}

function StatCard({ icon, label, value, accent }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${accent ?? 'bg-primary/10 text-primary'}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const courts = useCourtStore((s) => s.courts);
  const people = usePersonStore((s) => s.people);
  const events = useEventStore((s) => s.events);
  const groups = useGroupStore((s) => s.groups);

  const coaches = people.filter((p) => p.roles.includes('COACH')).length;
  const trainees = people.filter((p) => p.roles.includes('TRAINEE')).length;
  const pending = events.filter((e) => e.status === 'PENDING_APPROVAL').length;

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="Overview of your tennis club" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={<Landmark className="h-5 w-5" />} label="Courts" value={courts.length} />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="People"
          value={people.length}
          accent="bg-info/10 text-info"
        />
        <StatCard
          icon={<UsersRound className="h-5 w-5" />}
          label="Groups"
          value={groups.length}
          accent="bg-success/10 text-success"
        />
        <StatCard
          icon={<CalendarCheck className="h-5 w-5" />}
          label="Events"
          value={events.length}
          accent="bg-primary/10 text-primary"
        />
        <StatCard
          icon={<AlertCircle className="h-5 w-5" />}
          label="Pending Approvals"
          value={pending}
          accent="bg-warning/10 text-warning"
        />
      </div>
      <GlobalTasksWidget />
    </div>
  );
}
