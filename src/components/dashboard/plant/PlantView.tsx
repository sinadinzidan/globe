import { Link } from 'react-router';
import { PlantStage } from '@/components/dashboard/plant/PlantStage';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { Button } from '@/components/ui/button';
import { PLANT_COPY } from '@/constants/dashboard/plant/plantSceneConstants';
import { DEFAULT_SIGNED_IN_PATH } from '@/constants/routeConstants';
import { usePlantJourney } from '@/hooks/dashboard/usePlantJourney';

export const PlantView = () => {
  const { plant, layout, isPending, isError, retry } = usePlantJourney();

  if (isPending) {
    return <LoadingState message={PLANT_COPY.LOADING} />;
  }
  if (isError) {
    return <ErrorState onRetry={retry} />;
  }
  if (!plant || !layout) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6">
        <EmptyState
          title={PLANT_COPY.NOT_FOUND_TITLE}
          description={PLANT_COPY.NOT_FOUND_DESCRIPTION}
        />
        <Button asChild variant="outline">
          <Link to={DEFAULT_SIGNED_IN_PATH}>{PLANT_COPY.BACK_TO_MAP}</Link>
        </Button>
      </div>
    );
  }
  return <PlantStage plant={plant} layout={layout} />;
};
