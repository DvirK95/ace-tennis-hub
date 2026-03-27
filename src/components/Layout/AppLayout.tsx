import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Landmark, Users, UsersRound,
  CalendarDays, ShieldCheck, ClipboardList,
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

function SidebarNavItem({ to, icon, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

export default function AppLayout() {
  const { canAccess } = usePermissions();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col fixed inset-y-0 left-0 z-30">
        <div className="px-5 py-6 border-b border-sidebar-border">
          <h1 className="text-lg font-bold text-sidebar-primary-foreground tracking-tight">
            <span className="text-sidebar-primary">Ace</span>Club
          </h1>
          <p className="text-xs text-sidebar-muted mt-0.5">Tennis Club Manager</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <SidebarNavItem to="/" icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
          {canAccess("MANAGE_COURTS") && (
            <SidebarNavItem to="/courts" icon={<Landmark className="h-4 w-4" />} label="Courts" />
          )}
          <SidebarNavItem to="/people" icon={<Users className="h-4 w-4" />} label="People" />
          {canAccess("MANAGE_GROUPS") && (
            <SidebarNavItem to="/groups" icon={<UsersRound className="h-4 w-4" />} label="Groups" />
          )}
          <SidebarNavItem to="/calendar" icon={<CalendarDays className="h-4 w-4" />} label="Calendar" />
          {canAccess("APPROVE_BOOKINGS") && (
            <SidebarNavItem to="/approvals" icon={<ClipboardList className="h-4 w-4" />} label="Approvals" />
          )}
          {canAccess("MANAGE_USERS") && (
            <SidebarNavItem to="/permissions" icon={<ShieldCheck className="h-4 w-4" />} label="Permissions" />
          )}
        </nav>
      </aside>
      <main className="flex-1 ml-64">
        <div className="p-8 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
