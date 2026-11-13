import { Outlet } from 'react-router';
import { useAuthSessionEffects } from '@/hooks/auth/useAuthSessionEffects';

/** The root of every route. Watches the session for the whole application. */
export const RootLayout = () => {
  useAuthSessionEffects();

  return <Outlet />;
};
