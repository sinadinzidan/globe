import { RoutePath } from '@/enums/routePath';

/** Names of the dynamic segments, as read with `useParams`. */
export const ROUTE_PARAMETER = {
  PLANT_ID: 'plantId',
  ASSET_ID: 'assetId',
} as const;

export const ROUTE_PATH: Record<RoutePath, string> = {
  [RoutePath.ROOT]: '/',
  [RoutePath.FLAT_MAP]: '/map',
  [RoutePath.GLOBE]: '/globe',
  [RoutePath.PLANT]: `/plants/:${ROUTE_PARAMETER.PLANT_ID}`,
  [RoutePath.ASSET]: `/plants/:${ROUTE_PARAMETER.PLANT_ID}/assets/:${ROUTE_PARAMETER.ASSET_ID}`,
  [RoutePath.NOT_FOUND]: '*',
};

/** Query string key that holds the open tab of the asset page. */
export const TAB_SEARCH_PARAMETER = 'tab';
