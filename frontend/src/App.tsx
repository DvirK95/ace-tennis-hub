import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import AppLayout from '@/components/Layout/AppLayout';
import DashboardPage from '@/pages/DashboardPage';
import CourtsPage from '@/pages/CourtsPage';
import PeoplePage from '@/pages/PeoplePage';
import GroupsPage from '@/pages/GroupsPage';
import CalendarPage from '@/pages/CalendarPage';
import ApprovalsPage from '@/pages/ApprovalsPage';
import UsersPage from '@/pages/UsersPage';
import UserProfilePage from '@/pages/UserProfilePage';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/courts" element={<CourtsPage />} />
              <Route path="/people" element={<PeoplePage />} />
              <Route path="/people/:userId" element={<UserProfilePage />} />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/approvals" element={<ApprovalsPage />} />
              <Route path="/permissions" element={<UsersPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
