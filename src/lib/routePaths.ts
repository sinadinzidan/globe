import { generatePath } from 'react-router';
import { ROUTE_PATH } from '@/constants/routeConstants';
import { RoutePath } from '@/enums/routePath';

export const buildPlantPath = (plantId: string) =>
  generatePath(ROUTE_PATH[RoutePath.PLANT], { plantId });

export const buildAssetPath = (plantId: string, assetId: string) =>
  generatePath(ROUTE_PATH[RoutePath.ASSET], { plantId, assetId });
