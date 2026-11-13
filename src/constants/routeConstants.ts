import { RoutePath } from '@/enums/routePath';

export const ROUTE_PATH: Record<RoutePath, string> = {
  [RoutePath.ROOT]: '/',
  [RoutePath.FLAT_MAP]: '/map',
  [RoutePath.GLOBE]: '/globe',
  [RoutePath.NOT_FOUND]: '*',
};
