import { AssetHeader } from '@/components/dashboard/asset/AssetHeader';
import { AssetHero } from '@/components/dashboard/asset/AssetHero';
import { AssetTabs } from '@/components/dashboard/asset/AssetTabs';
import type { Asset } from '@/types/dashboard/assetTypes';
import type { Plant } from '@/types/dashboard/plantTypes';

interface AssetPageProperties {
  plant: Plant;
  assets: Asset[];
  asset: Asset;
}

/** The last level of the journey: everything about one asset. */
export const AssetPage = ({ plant, assets, asset }: AssetPageProperties) => (
  <main className="flex min-h-0 flex-1 animate-in flex-col gap-6 overflow-y-auto p-4 duration-500 fade-in *:shrink-0 md:p-6">
    <AssetHeader plant={plant} asset={asset} />
    <AssetHero asset={asset} />
    <AssetTabs plant={plant} assets={assets} asset={asset} />
  </main>
);
