import { queryOptions } from '@tanstack/react-query';
import { fetchMapData } from '@/api/mapData';
import { fetchPlants } from '@/api/plants';
import { QueryKeyScope } from '@/enums/queryKeyScope';

export const dashboardQueryKeys = {
  plants: () => [QueryKeyScope.PLANT, QueryKeyScope.LIST] as const,
  mapData: () => [QueryKeyScope.MAP, QueryKeyScope.DETAIL] as const,
};

export const plantsQueryOptions = queryOptions({
  queryKey: dashboardQueryKeys.plants(),
  queryFn: ({ signal }) => fetchPlants(signal),
});

export const mapDataQueryOptions = queryOptions({
  queryKey: dashboardQueryKeys.mapData(),
  queryFn: ({ signal }) => fetchMapData(signal),
});
