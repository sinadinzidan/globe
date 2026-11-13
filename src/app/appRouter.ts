import { createBrowserRouter, redirect } from 'react-router';
import { AuthGuard } from '@/app/guards/AuthGuard';
import { GuestGuard } from '@/app/guards/GuestGuard';
import { PermissionGuard, type PermissionHandle } from '@/app/guards/PermissionGuard';
import { RootLayout } from '@/app/guards/RootLayout';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ExploreLayout } from '@/components/dashboard/ExploreLayout';
import { DEFAULT_SIGNED_IN_PATH, ROUTE_PATH } from '@/constants/routeConstants';
import { Permission } from '@/enums/permission';
import { RoutePath } from '@/enums/routePath';
import Roles from '@/pages/admin/Roles';
import Users from '@/pages/admin/Users';
import Account from '@/pages/dashboard/Account';
import Asset from '@/pages/dashboard/Asset';
import FlatMap from '@/pages/dashboard/FlatMap';
import Globe from '@/pages/dashboard/Globe';
import Plant from '@/pages/dashboard/Plant';
import Login from '@/pages/general/Login';
import NotFound from '@/pages/general/NotFound';

const requires = (permission: Permission): PermissionHandle => ({ permission });

export const appRouter = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        // Signed-out visitors only.
        Component: GuestGuard,
        children: [{ path: ROUTE_PATH[RoutePath.LOGIN], Component: Login }],
      },
      {
        // Everything below needs a signed-in user.
        Component: AuthGuard,
        children: [
          {
            Component: DashboardLayout,
            children: [
              {
                Component: ExploreLayout,
                children: [
                  {
                    path: ROUTE_PATH[RoutePath.ROOT],
                    loader: () => redirect(DEFAULT_SIGNED_IN_PATH),
                  },
                  { path: ROUTE_PATH[RoutePath.FLAT_MAP], Component: FlatMap },
                  { path: ROUTE_PATH[RoutePath.GLOBE], Component: Globe },
                ],
              },
              { path: ROUTE_PATH[RoutePath.PLANT], Component: Plant },
              { path: ROUTE_PATH[RoutePath.ASSET], Component: Asset },
              { path: ROUTE_PATH[RoutePath.ACCOUNT], Component: Account },
              {
                // Signed in, and holding the permission each route names.
                Component: PermissionGuard,
                children: [
                  {
                    path: ROUTE_PATH[RoutePath.USERS],
                    Component: Users,
                    handle: requires(Permission.USER_READ),
                  },
                  {
                    path: ROUTE_PATH[RoutePath.ROLES],
                    Component: Roles,
                    handle: requires(Permission.ROLE_READ),
                  },
                ],
              },
            ],
          },
        ],
      },
      { path: ROUTE_PATH[RoutePath.NOT_FOUND], Component: NotFound },
    ],
  },
]);
