import { useParams } from 'react-router';
import { usePlantLayout } from '@/hooks/dashboard/usePlantLayout';
import { usePlants } from '@/hooks/dashboard/usePlants';

/**
 * Everything the drill-down pages need, resolved from the URL: the plant, its layout and, on the
 * asset page, the asset. Loading and failure cover both requests together.
 */
export const usePlantJourney = () => {
  const { plantId, assetId } = useParams();
  const plantsQuery = usePlants();

  const plant = plantsQuery.data?.find((candidate) => candidate.id === plantId);

  const layoutQuery = usePlantLayout(plant?.model);

  const layout = layoutQuery.data;
  const asset = layout?.assets.find((candidate) => candidate.id === assetId);
  const isPending = plantsQuery.isPending || (Boolean(plant) && layoutQuery.isPending);
  const isError = plantsQuery.isError || layoutQuery.isError;

  const retry = () => {
    void plantsQuery.refetch();
    void layoutQuery.refetch();
  };

  return { plantId, assetId, plant, layout, asset, isPending, isError, retry };
};
