import { queryOptions } from '@tanstack/react-query';
import { fetchMapData } from '@/api/mapData';
import { QueryKeyScope } from '@/enums/queryKeyScope';

/** Keys of the queries that are not part of the generated API client. */
export const dashboardQueryKeys = {
  mapData: () => [QueryKeyScope.MAP, QueryKeyScope.DETAIL] as const,
};

/** The map outlines are static files, not API data, so they are fetched by hand. */
export const mapDataQueryOptions = queryOptions({
  queryKey: dashboardQueryKeys.mapData(),
  queryFn: ({ signal }) => fetchMapData(signal),
});
