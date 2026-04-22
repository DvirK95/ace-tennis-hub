import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { type PropsWithChildren } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 1000 * 60 * 60 * 24, // 24 hours – required for persister to retain data
      refetchOnWindowFocus: true,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

function QueryClientProviderWrapper({ children }: PropsWithChildren) {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      {children}
    </PersistQueryClientProvider>
  );
}

export default QueryClientProviderWrapper;
