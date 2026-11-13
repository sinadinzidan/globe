import { QueryClient } from '@tanstack/react-query';
import { QUERY_RETRY_COUNT, QUERY_STALE_TIME_MILLISECONDS } from '@/constants/queryConstants';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME_MILLISECONDS,
      retry: QUERY_RETRY_COUNT,
    },
  },
});
