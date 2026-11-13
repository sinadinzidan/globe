import { createBrowserRouter, redirect } from 'react-router';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ExploreLayout } from '@/components/dashboard/ExploreLayout';
import { ROUTE_PATH } from '@/constants/routeConstants';
import { RoutePath } from '@/enums/routePath';
import Asset from '@/pages/dashboard/Asset';
import FlatMap from '@/pages/dashboard/FlatMap';
import Globe from '@/pages/dashboard/Globe';
import Plant from '@/pages/dashboard/Plant';
import NotFound from '@/pages/general/NotFound';

export const appRouter = createBrowserRouter([
  {
    Component: DashboardLayout,
    children: [
      {
        Component: ExploreLayout,
        children: [
          {
            path: ROUTE_PATH[RoutePath.ROOT],
            loader: () => redirect(ROUTE_PATH[RoutePath.FLAT_MAP]),
          },
          { path: ROUTE_PATH[RoutePath.FLAT_MAP], Component: FlatMap },
          { path: ROUTE_PATH[RoutePath.GLOBE], Component: Globe },
        ],
      },
      { path: ROUTE_PATH[RoutePath.PLANT], Component: Plant },
      { path: ROUTE_PATH[RoutePath.ASSET], Component: Asset },
    ],
  },
  { path: ROUTE_PATH[RoutePath.NOT_FOUND], Component: NotFound },
]);
