import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/Layout/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import CourtsPage from "@/pages/CourtsPage";
import TraineesPage from "@/pages/TraineesPage";
import CoachesPage from "@/pages/CoachesPage";
import GroupsPage from "@/pages/GroupsPage";
import BookingsPage from "@/pages/BookingsPage";
import ApprovalsPage from "@/pages/ApprovalsPage";
import UsersPage from "@/pages/UsersPage";
import NotFound from "@/pages/NotFound";

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
              <Route path="/trainees" element={<TraineesPage />} />
              <Route path="/coaches" element={<CoachesPage />} />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/approvals" element={<ApprovalsPage />} />
              <Route path="/users" element={<UsersPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
