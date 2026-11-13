import { useQuery } from '@tanstack/react-query';
import { plantsQueryOptions } from '@/hooks/dashboard/dashboardQueries';

export const usePlants = () => useQuery(plantsQueryOptions);
