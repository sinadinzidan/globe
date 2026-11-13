import { CircleCheck } from 'lucide-react';
import { StatusDot } from '@/components/dashboard/StatusDot';
import {
  ASSET_STATUS_PRESENTATION,
  ASSET_TYPE_PRESENTATION,
} from '@/constants/dashboard/assetConstants';
import { EXPLORER_COPY } from '@/constants/dashboard/explorerConstants';
import {
  PLANT_OVERLAY_ELEMENT_ID,
  PLANT_SCENE,
} from '@/constants/dashboard/plant/plantSceneConstants';
import { useExplorerProgress } from '@/hooks/dashboard/useExplorerProgress';
import { assetHeight } from '@/lib/dashboard/plantScene';
import { cn } from '@/lib/utils';
import type { Asset } from '@/types/dashboard/assetTypes';

interface PlantAssetPinsProperties {
  plantId: string;
  assets: Asset[];
  focusedAssetId: string | undefined;
  hoveredAssetId: string | null;
  onFocusAsset: (assetId: string) => void;
  onHoverAsset: (assetId: string | null) => void;
}

/** The labels overlaid on the 3D model, one per asset. `PlantPinProjector` positions them. */
export const PlantAssetPins = ({
  plantId,
  assets,
  focusedAssetId,
  hoveredAssetId,
  onFocusAsset,
  onHoverAsset,
}: PlantAssetPinsProperties) => {
  const { isAssetInspected } = useExplorerProgress();

  return (
    <div id={PLANT_OVERLAY_ELEMENT_ID} className="pointer-events-none absolute inset-0">
      {assets.map((asset, index) => {
        const { icon: Icon } = ASSET_TYPE_PRESENTATION[asset.type];
        const isActive = asset.id === focusedAssetId || asset.id === hoveredAssetId;
        return (
          <div
            key={asset.id}
            data-x={asset.position.east}
            data-y={assetHeight(asset) + PLANT_SCENE.LABEL_CLEARANCE}
            data-z={asset.position.south}
            className={cn(
              'pointer-events-auto invisible absolute top-0 left-0',
              isActive && 'z-10',
            )}
          >
            <button
              type="button"
              aria-label={`${asset.tag}, ${asset.name}, ${ASSET_STATUS_PRESENTATION[asset.status].label}`}
              aria-pressed={asset.id === focusedAssetId}
              onClick={() => {
                onFocusAsset(asset.id);
              }}
              onPointerEnter={() => {
                onHoverAsset(asset.id);
              }}
              onPointerLeave={() => {
                onHoverAsset(null);
              }}
              style={{
                animationDelay: `${String(index * PLANT_SCENE.LABEL_STAGGER_MILLISECONDS)}ms`,
              }}
              className={cn(
                'flex animate-in cursor-pointer items-center gap-1.5 rounded-full border bg-card/85 py-1 pr-2.5 pl-1.5 text-xs font-medium whitespace-nowrap shadow-md backdrop-blur-sm transition-colors outline-none duration-500 fill-mode-both fade-in slide-in-from-bottom-2 hover:border-primary focus-visible:ring-3 focus-visible:ring-ring/50',
                isActive && 'border-primary bg-primary text-primary-foreground',
              )}
            >
              <Icon aria-hidden="true" className="size-3.5" />
              {asset.tag}
              {isAssetInspected(plantId, asset.id) && (
                <CircleCheck
                  role="img"
                  aria-label={EXPLORER_COPY.INSPECTED_BADGE}
                  className="size-3.5"
                />
              )}
              <StatusDot tone={ASSET_STATUS_PRESENTATION[asset.status].tone} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
