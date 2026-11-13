import { useParams } from 'react-router';
import { HTTP_STATUS } from '@/constants/authConstants';
import { usePlantLayout } from '@/hooks/dashboard/usePlantLayout';
import { usePlants } from '@/hooks/dashboard/usePlants';

/**
 * Everything the drill-down pages need, resolved from the URL: the plant, its layout and, on the
 * asset page, the asset. Loading and failure cover both requests together.
 */
export const usePlantJourney = () => {
  const { plantId = '', assetId } = useParams();
  const plantsQuery = usePlants();
  const layoutQuery = usePlantLayout(plantId);

  const plant = plantsQuery.data?.find((candidate) => candidate.id === plantId);
  const layout = layoutQuery.data;
  const asset = layout?.assets.find((candidate) => candidate.id === assetId);
  // A plant that does not exist, or that the user may not see, is "not found", not a failure.
  const isLayoutMissing = layoutQuery.error?.status === HTTP_STATUS.NOT_FOUND;
  const isPending = plantsQuery.isPending || layoutQuery.isPending;
  const isError = plantsQuery.isError || (layoutQuery.isError && !isLayoutMissing);

  const retry = () => {
    void plantsQuery.refetch();
    void layoutQuery.refetch();
  };

  return { plantId, assetId, plant, layout, asset, isPending, isError, retry };
};
