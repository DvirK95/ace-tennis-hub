import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Landmark,
  Users,
  UsersRound,
  CalendarDays,
  ShieldCheck,
  ClipboardList,
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import Sidebar from './Sidebar';

function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1">
        <div className="max-w-7xl p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
export default AppLayout;
