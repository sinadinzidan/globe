import { createBrowserRouter, redirect } from 'react-router';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ROUTE_PATH } from '@/constants/routeConstants';
import { RoutePath } from '@/enums/routePath';
import FlatMap from '@/pages/dashboard/FlatMap';
import Globe from '@/pages/dashboard/Globe';
import NotFound from '@/pages/general/NotFound';

export const appRouter = createBrowserRouter([
  {
    Component: DashboardLayout,
    children: [
      { path: ROUTE_PATH[RoutePath.ROOT], loader: () => redirect(ROUTE_PATH[RoutePath.FLAT_MAP]) },
      { path: ROUTE_PATH[RoutePath.FLAT_MAP], Component: FlatMap },
      { path: ROUTE_PATH[RoutePath.GLOBE], Component: Globe },
    ],
  },
  { path: ROUTE_PATH[RoutePath.NOT_FOUND], Component: NotFound },
]);
