import { Navigate, Outlet, useLocation } from 'react-router';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { AUTH_COPY } from '@/constants/authConstants';
import { AuthStatus } from '@/enums/authStatus';
import { useCurrentUser } from '@/hooks/auth/useCurrentUser';
import { toLoginPath } from '@/lib/auth/returnPath';

/**
 * Wraps every route that needs a signed-in user. Nothing protected is shown, and nobody is
 * redirected, until the server has said who the user is.
 */
export const AuthGuard = () => {
  const location = useLocation();
  const { status, retry } = useCurrentUser();

  const handleRetry = () => {
    void retry();
  };

  switch (status) {
    case AuthStatus.UNKNOWN: {
      return (
        <div className="flex min-h-svh">
          <LoadingState message={AUTH_COPY.RESTORING_SESSION} />
        </div>
      );
    }
    case AuthStatus.UNAVAILABLE: {
      return (
        <div className="flex min-h-svh">
          <ErrorState
            title={AUTH_COPY.SERVER_UNAVAILABLE_TITLE}
            description={AUTH_COPY.SERVER_UNAVAILABLE_DESCRIPTION}
            onRetry={handleRetry}
          />
        </div>
      );
    }
    case AuthStatus.SIGNED_OUT: {
      const requestedPath = `${location.pathname}${location.search}${location.hash}`;
      return <Navigate to={toLoginPath(requestedPath)} replace />;
    }
    case AuthStatus.SIGNED_IN: {
      return <Outlet />;
    }
  }
};
