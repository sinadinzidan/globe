import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/api/httpClient';
import { HTTP_STATUS } from '@/constants/authConstants';
import { QUERY_RETRY_COUNT, QUERY_STALE_TIME_MILLISECONDS } from '@/constants/queryConstants';

/** Retries failures that might pass next time. An answer such as 403 or 404 will not change. */
const shouldRetry = (failureCount: number, error: Error) => {
  const isRefusal = error instanceof ApiError && error.status < HTTP_STATUS.SERVER_ERROR;
  return !isRefusal && failureCount < QUERY_RETRY_COUNT;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME_MILLISECONDS,
      retry: shouldRetry,
    },
  },
});
