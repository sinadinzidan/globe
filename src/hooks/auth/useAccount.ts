import { useQueryClient } from '@tanstack/react-query';
import {
  getAuthListSessionsQueryKey,
  useAuthChangePassword,
  useAuthEndSession,
  useAuthListSessions,
} from '@/api/generated/auth/auth';
import type { ApiError } from '@/api/httpClient';

export const useSessions = () => useAuthListSessions();

/** Signs out one of the user's other sessions, then refreshes the list. */
export const useEndSession = () => {
  const queryClient = useQueryClient();

  return useAuthEndSession<ApiError>({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getAuthListSessionsQueryKey() }),
    },
  });
};

/** Changes the password. Every other session ends, so the session list is refreshed. */
export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useAuthChangePassword<ApiError>({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getAuthListSessionsQueryKey() }),
    },
  });
};
