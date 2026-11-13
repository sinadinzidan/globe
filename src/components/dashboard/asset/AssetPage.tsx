import { AssetHeader } from '@/components/dashboard/asset/AssetHeader';
import { AssetHero } from '@/components/dashboard/asset/AssetHero';
import { AssetTabs } from '@/components/dashboard/asset/AssetTabs';
import { useEffect } from 'react';
import { useExplorerActions, useExplorerProgress } from '@/hooks/dashboard/useExplorerProgress';
import type { Asset } from '@/types/dashboard/assetTypes';
import type { Plant } from '@/types/dashboard/plantTypes';

interface AssetPageProperties {
  plant: Plant;
  assets: Asset[];
  asset: Asset;
}

/** The last level of the journey: everything about one asset. */
export const AssetPage = ({ plant, assets, asset }: AssetPageProperties) => {
  const { isReady, isAssetInspected } = useExplorerProgress();
  const { inspectAsset } = useExplorerActions();

  const isInspected = isAssetInspected(plant.id, asset.id);

  // Opening an asset's page is what inspects it.
  useEffect(() => {
    if (isReady && !isInspected) {
      inspectAsset({ plantId: plant.id, assetId: asset.id });
    }
  }, [isReady, isInspected, plant.id, asset.id, inspectAsset]);

  return (
    <main className="flex min-h-0 flex-1 animate-in flex-col gap-6 overflow-y-auto p-4 duration-500 fade-in *:shrink-0 md:p-6">
      <AssetHeader plant={plant} assets={assets} asset={asset} />
      <AssetHero asset={asset} />
      <AssetTabs plant={plant} assets={assets} asset={asset} />
    </main>
  );
};
