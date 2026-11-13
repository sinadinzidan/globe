import { useQuery } from '@tanstack/react-query';
import { mapDataQueryOptions } from '@/hooks/dashboard/dashboardQueries';

export const useMapData = () => useQuery(mapDataQueryOptions);
