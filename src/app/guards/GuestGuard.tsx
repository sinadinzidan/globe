import { Navigate, Outlet, useSearchParams } from 'react-router';
import { LoadingState } from '@/components/shared/LoadingState';
import { AUTH_COPY } from '@/constants/authConstants';
import { RETURN_TO_SEARCH_PARAMETER } from '@/constants/routeConstants';
import { AuthStatus } from '@/enums/authStatus';
import { useCurrentUser } from '@/hooks/auth/useCurrentUser';
import { toSafeReturnPath } from '@/lib/auth/returnPath';

/**
 * Wraps the routes for signed-out visitors, such as the login page. A signed-in user is sent
 * on to where they were going. If the server cannot be reached, the page is still shown.
 */
export const GuestGuard = () => {
  const [searchParameters] = useSearchParams();
  const { status } = useCurrentUser();

  if (status === AuthStatus.UNKNOWN) {
    return (
      <div className="flex min-h-svh">
        <LoadingState message={AUTH_COPY.RESTORING_SESSION} />
      </div>
    );
  }
  if (status === AuthStatus.SIGNED_IN) {
    return (
      <Navigate to={toSafeReturnPath(searchParameters.get(RETURN_TO_SEARCH_PARAMETER))} replace />
    );
  }
  return <Outlet />;
};
