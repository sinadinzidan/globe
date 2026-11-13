import { ApiError } from '@/api/httpClient';
import { useAuthMe } from '@/api/generated/auth/auth';
import { CURRENT_USER_STALE_TIME_MILLISECONDS, HTTP_STATUS } from '@/constants/authConstants';
import { AuthStatus } from '@/enums/authStatus';
import type { Permission } from '@/enums/permission';
import type { CurrentUser } from '@/types/authTypes';

/**
 * Who is signed in, as the server says. This is the only source of authentication state: it is
 * asked on load and refresh, and kept in the server-data cache.
 */
export const useCurrentUser = () => {
  const {
    data: user,
    error,
    isPending,
    refetch,
  } = useAuthMe<CurrentUser, ApiError>({
    query: { retry: 0, staleTime: CURRENT_USER_STALE_TIME_MILLISECONDS },
  });

  const isSignedOut = error instanceof ApiError && error.status === HTTP_STATUS.UNAUTHORIZED;
  const settledStatus = isSignedOut ? AuthStatus.SIGNED_OUT : AuthStatus.UNAVAILABLE;
  const knownStatus = user ? AuthStatus.SIGNED_IN : settledStatus;
  const status = isPending ? AuthStatus.UNKNOWN : knownStatus;

  /** For showing or hiding parts of the interface. The API checks every request again. */
  const hasPermission = (permission: Permission) => Boolean(user?.permissions.includes(permission));

  return { user, status, hasPermission, retry: refetch };
};
