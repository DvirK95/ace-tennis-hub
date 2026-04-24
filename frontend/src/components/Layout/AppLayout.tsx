import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Sidebar from './Sidebar';
import { api } from '@/schemas/api';
import { useAuthStore } from '@/stores/useAuthStore';
import { tokenStorage } from '@/lib/tokenStorage';

function AppLayout() {
  const navigate = useNavigate();
  const setAuthUser = useAuthStore((s) => s.setAuthUser);

  const { data, isError } = useQuery({
    queryKey: ['authUser'],
    queryFn: api.auth.getAuthUser,
    retry: false,
    enabled: !!tokenStorage.get(),
  });

  useEffect(() => {
    if (data) {
      setAuthUser(data);
    }
  }, [data, setAuthUser]);

  useEffect(() => {
    if (isError || !tokenStorage.get()) {
      tokenStorage.remove();
      navigate('/login');
    }
  }, [isError, navigate]);

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
