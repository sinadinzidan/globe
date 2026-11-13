import { Outlet, useMatches } from 'react-router';
import { PermissionDeniedMessage } from '@/components/general/permission-denied/PermissionDeniedMessage';
import type { Permission } from '@/enums/permission';
import { useCurrentUser } from '@/hooks/auth/useCurrentUser';

/** What a route declares in its `handle` to be put behind a permission. */
export interface PermissionHandle {
  permission: Permission;
}

const isPermissionHandle = (handle: unknown): handle is PermissionHandle =>
  handle instanceof Object && 'permission' in handle;

/**
 * Wraps routes that need a permission, named in the route's `handle`. A signed-in user without
 * it sees the Permission Denied page in place, and is not sent to the login page.
 */
export const PermissionGuard = () => {
  const matches = useMatches();
  const { hasPermission } = useCurrentUser();

  const requiredPermissions = matches.flatMap((match) =>
    isPermissionHandle(match.handle) ? [match.handle.permission] : [],
  );

  if (!requiredPermissions.every((permission) => hasPermission(permission))) {
    return <PermissionDeniedMessage />;
  }
  return <Outlet />;
};
