import { FlatMapStage } from '@/components/dashboard/flat-map/FlatMapStage';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { DASHBOARD_COPY } from '@/constants/dashboard/dashboardConstants';
import { useMapData } from '@/hooks/dashboard/useMapData';

export const FlatMapView = () => {
  const { data: mapData, isPending, isError, refetch } = useMapData();

  const handleRetry = () => {
    void refetch();
  };

  if (isPending) {
    return <LoadingState message={DASHBOARD_COPY.LOADING_MAP} />;
  }
  if (isError) {
    return <ErrorState onRetry={handleRetry} />;
  }
  return <FlatMapStage mapData={mapData} />;
};
