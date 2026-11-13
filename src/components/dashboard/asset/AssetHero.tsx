import { lazy, Suspense } from 'react';
import { LoadingState } from '@/components/shared/LoadingState';
import { ASSET_COPY } from '@/constants/dashboard/asset/assetPageConstants';
import type { Asset } from '@/types/dashboard/assetTypes';

interface AssetHeroProperties {
  asset: Asset;
}

// The 3D renderer is large, so it is only downloaded when a 3D view is opened.
const AssetTurntable = lazy(() => import('@/components/dashboard/asset/AssetTurntable'));

/** The asset at a glance: its model turning slowly, beside its key figures. */
export const AssetHero = ({ asset }: AssetHeroProperties) => (
  <section className="grid gap-4 lg:grid-cols-2">
    <div className="relative h-72 overflow-hidden rounded-xl border bg-card/40">
      <Suspense fallback={<LoadingState />}>
        <AssetTurntable type={asset.type} />
      </Suspense>
    </div>
    <dl aria-label={ASSET_COPY.KEY_FIGURES_LABEL} className="grid grid-cols-2 gap-4">
      {asset.indicators.map((indicator) => (
        <div
          key={indicator.label}
          className="flex flex-col-reverse justify-end gap-1 rounded-xl border bg-card/40 p-4"
        >
          <dt className="text-sm text-muted-foreground">{indicator.label}</dt>
          <dd className="text-3xl font-semibold tabular-nums">
            {indicator.value}
            <span className="ml-1 text-base font-normal text-muted-foreground">
              {indicator.unit}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  </section>
);
