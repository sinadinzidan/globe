import { PlantList } from '@/components/dashboard/PlantList';
import { SectorFilter } from '@/components/dashboard/SectorFilter';
import { SummaryTiles } from '@/components/dashboard/SummaryTiles';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { DASHBOARD_COPY } from '@/constants/dashboard/dashboardConstants';
import { useVisiblePlants } from '@/hooks/dashboard/useVisiblePlants';

export const PlantSidebar = () => {
  const { isPending, isError, refetch, allPlants } = useVisiblePlants();

  const handleRetry = () => {
    void refetch();
  };

  return (
    <aside className="flex min-h-0 flex-col border-t lg:w-96 lg:border-t-0 lg:border-l">
      {isPending && <LoadingState message={DASHBOARD_COPY.LOADING_PLANTS} />}
      {!isPending && isError && <ErrorState onRetry={handleRetry} />}
      {!isPending && !isError && allPlants.length === 0 && (
        <EmptyState
          title={DASHBOARD_COPY.NO_PLANTS_TITLE}
          description={DASHBOARD_COPY.NO_PLANTS_DESCRIPTION}
        />
      )}
      {!isPending && !isError && allPlants.length > 0 && (
        <>
          <div className="flex flex-col gap-4 border-b p-4">
            <SummaryTiles />
            <SectorFilter />
          </div>
          <PlantList />
          <p className="border-t px-4 py-3 text-xs text-muted-foreground">
            {DASHBOARD_COPY.LOCATION_NOTE}
          </p>
        </>
      )}
    </aside>
  );
};
