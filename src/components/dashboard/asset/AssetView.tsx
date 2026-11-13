import { Link } from 'react-router';
import { AssetPage } from '@/components/dashboard/asset/AssetPage';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { Button } from '@/components/ui/button';
import { ASSET_COPY } from '@/constants/dashboard/asset/assetPageConstants';
import { DEFAULT_SIGNED_IN_PATH } from '@/constants/routeConstants';
import { usePlantJourney } from '@/hooks/dashboard/usePlantJourney';
import { buildPlantPath } from '@/lib/routePaths';

export const AssetView = () => {
  const { plant, layout, asset, isPending, isError, retry } = usePlantJourney();

  if (isPending) {
    return <LoadingState message={ASSET_COPY.LOADING} />;
  }
  if (isError) {
    return <ErrorState onRetry={retry} />;
  }
  if (!plant || !layout || !asset) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6">
        <EmptyState
          title={ASSET_COPY.NOT_FOUND_TITLE}
          description={ASSET_COPY.NOT_FOUND_DESCRIPTION}
        />
        <Button asChild variant="outline">
          <Link to={plant ? buildPlantPath(plant.id) : DEFAULT_SIGNED_IN_PATH}>
            {ASSET_COPY.BACK_TO_PLANT}
          </Link>
        </Button>
      </div>
    );
  }
  return <AssetPage plant={plant} assets={layout.assets} asset={asset} />;
};
