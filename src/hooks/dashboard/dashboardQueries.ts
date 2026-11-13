import { queryOptions } from '@tanstack/react-query';
import { fetchMapData } from '@/api/mapData';
import { fetchPlantLayout } from '@/api/plantLayouts';
import { fetchPlants } from '@/api/plants';
import type { PlantModel } from '@/enums/dashboard/plantModel';
import { QueryKeyScope } from '@/enums/queryKeyScope';

export const dashboardQueryKeys = {
  plants: () => [QueryKeyScope.PLANT, QueryKeyScope.LIST] as const,
  mapData: () => [QueryKeyScope.MAP, QueryKeyScope.DETAIL] as const,
  plantLayout: (model: PlantModel) =>
    [QueryKeyScope.PLANT_LAYOUT, QueryKeyScope.DETAIL, model] as const,
};

export const plantsQueryOptions = queryOptions({
  queryKey: dashboardQueryKeys.plants(),
  queryFn: ({ signal }) => fetchPlants(signal),
});

export const mapDataQueryOptions = queryOptions({
  queryKey: dashboardQueryKeys.mapData(),
  queryFn: ({ signal }) => fetchMapData(signal),
});

export const plantLayoutQueryOptions = (model: PlantModel) =>
  queryOptions({
    queryKey: dashboardQueryKeys.plantLayout(model),
    queryFn: ({ signal }) => fetchPlantLayout(model, signal),
  });
