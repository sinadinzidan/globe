import type { QueryClient } from '@tanstack/react-query';
import { getAuthMeQueryKey } from '@/api/generated/auth/auth';

const CURRENT_USER_KEY = JSON.stringify(getAuthMeQueryKey());

/**
 * Drops everything cached for whoever was signed in, then asks the server who is signed in now.
 * The route guards react to that answer, so no page of the previous user stays on screen and
 * the next user never sees their data.
 */
export const resetSessionCache = async (queryClient: QueryClient) => {
  await queryClient.cancelQueries();
  queryClient.removeQueries({
    predicate: (query) => JSON.stringify(query.queryKey) !== CURRENT_USER_KEY,
  });
  queryClient.getMutationCache().clear();
  await queryClient.resetQueries({ queryKey: getAuthMeQueryKey() });
};
