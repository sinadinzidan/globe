import { useExplorerProgress } from '@/hooks/dashboard/useExplorerProgress';
import { findNextAsset } from '@/lib/dashboard/explorerProgress';
import type { Asset } from '@/types/dashboard/assetTypes';

/** How far the user has explored one plant, and where the story goes next. */
export const usePlantExploration = (plantId: string, assets: Asset[], currentAsset?: Asset) => {
  const { isAssetInspected, isReady } = useExplorerProgress();

  const inspectedAssetIds = assets
    .filter((asset) => isAssetInspected(plantId, asset.id))
    .map((asset) => asset.id);
  const { nextAsset, isDownstream } = findNextAsset(assets, inspectedAssetIds, currentAsset);

  return {
    isReady,
    inspectedAssetIds,
    inspectedCount: inspectedAssetIds.length,
    isSurveyed: assets.length > 0 && inspectedAssetIds.length === assets.length,
    nextAsset,
    isNextDownstream: isDownstream,
  };
};
