import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router/dom';
import { appRouter } from '@/app/appRouter';
import { queryClient } from '@/app/queryClient';

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={appRouter} />
  </QueryClientProvider>
);
