import { usePermissions } from '@/hooks/usePermissions';
import SidebarNavItem from './SidebarNavItem';
import {
  CalendarDays,
  ClipboardList,
  Landmark,
  LayoutDashboard,
  ShieldCheck,
  Users,
  UsersRound,
} from 'lucide-react';

function Sidebar() {
  const { canAccess } = usePermissions();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="border-b border-sidebar-border px-5 py-6">
        <h1 className="text-lg font-bold tracking-tight text-sidebar-primary-foreground">
          <span className="text-sidebar-primary">Ace</span>Club
        </h1>
        <p className="mt-0.5 text-xs text-sidebar-muted">Tennis Club Manager</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <SidebarNavItem to="/" icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
        {canAccess('MANAGE_COURTS') && (
          <SidebarNavItem to="/courts" icon={<Landmark className="h-4 w-4" />} label="Courts" />
        )}
        <SidebarNavItem to="/people" icon={<Users className="h-4 w-4" />} label="People" />
        {canAccess('MANAGE_GROUPS') && (
          <SidebarNavItem to="/groups" icon={<UsersRound className="h-4 w-4" />} label="Groups" />
        )}
        <SidebarNavItem
          to="/calendar"
          icon={<CalendarDays className="h-4 w-4" />}
          label="Calendar"
        />
        {canAccess('APPROVE_BOOKINGS') && (
          <SidebarNavItem
            to="/approvals"
            icon={<ClipboardList className="h-4 w-4" />}
            label="Approvals"
          />
        )}
        {/* {canAccess('MANAGE_USERS') && ( */}
        <SidebarNavItem
          to="/permissions"
          icon={<ShieldCheck className="h-4 w-4" />}
          label="Permissions"
        />
        {/* )} */}
      </nav>
    </aside>
  );
}

export default Sidebar;
