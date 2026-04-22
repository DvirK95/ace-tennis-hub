import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren } from 'react';

function QueryClientProviderWrapper({ children }: PropsWithChildren) {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default QueryClientProviderWrapper;
