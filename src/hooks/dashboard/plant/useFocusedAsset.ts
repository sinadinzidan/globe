import { useSearchParams } from 'react-router';
import { FOCUSED_ASSET_SEARCH_PARAMETER } from '@/constants/dashboard/plant/plantSceneConstants';
import type { Asset } from '@/types/dashboard/assetTypes';

/**
 * The asset the plant view is focused on. It is kept in the URL, so coming back from an asset
 * page returns to the same close-up.
 */
export const useFocusedAsset = (assets: Asset[]) => {
  const [searchParameters, setSearchParameters] = useSearchParams();

  const focusedAssetId = searchParameters.get(FOCUSED_ASSET_SEARCH_PARAMETER);
  const focusedAsset = assets.find((asset) => asset.id === focusedAssetId);

  const focusAsset = (assetId: string | null) => {
    setSearchParameters(assetId ? { [FOCUSED_ASSET_SEARCH_PARAMETER]: assetId } : {});
  };

  return { focusedAsset, focusAsset };
};
