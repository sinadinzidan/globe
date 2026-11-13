import { PlantAssetListItem } from '@/components/dashboard/plant/PlantAssetListItem';
import { EmptyState } from '@/components/shared/EmptyState';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { EXPLORER_COPY, PERCENT } from '@/constants/dashboard/explorerConstants';
import { PLANT_COPY } from '@/constants/dashboard/plant/plantSceneConstants';
import { usePlantExploration } from '@/hooks/dashboard/plant/usePlantExploration';
import type { Asset } from '@/types/dashboard/assetTypes';
import type { Plant } from '@/types/dashboard/plantTypes';

interface PlantAssetPanelProperties {
  plant: Plant;
  assets: Asset[];
  focusedAssetId: string | undefined;
  onFocusAsset: (assetId: string) => void;
  onHoverAsset: (assetId: string | null) => void;
}

/** The plant's assets as a list, grouped by plant area. */
export const PlantAssetPanel = ({
  plant,
  assets,
  focusedAssetId,
  onFocusAsset,
  onHoverAsset,
}: PlantAssetPanelProperties) => {
  const { inspectedCount, inspectedAssetIds } = usePlantExploration(plant.id, assets);

  const areas = [...new Set(assets.map((asset) => asset.area))].map((area) => ({
    area,
    assets: assets.filter((asset) => asset.area === area),
  }));

  return (
    <aside
      aria-label={PLANT_COPY.ASSET_LIST_LABEL}
      className="flex min-h-0 flex-col border-t bg-card/40 lg:w-96 lg:border-t-0 lg:border-l"
    >
      <div className="flex flex-col gap-2 border-b p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-base font-semibold">{PLANT_COPY.ASSETS_TITLE}</h2>
          <span className="text-sm text-muted-foreground tabular-nums">
            {inspectedCount}/{assets.length} {EXPLORER_COPY.INSPECTED}
          </span>
        </div>
        <Progress
          aria-label={EXPLORER_COPY.ASSETS_PROGRESS_LABEL}
          value={assets.length > 0 ? (inspectedCount / assets.length) * PERCENT : 0}
        />
      </div>
      {assets.length === 0 ? (
        <EmptyState
          title={PLANT_COPY.NO_ASSETS_TITLE}
          description={PLANT_COPY.NO_ASSETS_DESCRIPTION}
        />
      ) : (
        <ScrollArea className="lg:min-h-0 lg:flex-1">
          <div className="flex flex-col gap-4 p-4">
            {areas.map((group) => (
              <div key={group.area} className="flex flex-col gap-1">
                <h3 className="px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {group.area}
                </h3>
                <ul className="flex flex-col">
                  {group.assets.map((asset) => (
                    <PlantAssetListItem
                      key={asset.id}
                      plantId={plant.id}
                      asset={asset}
                      isFocused={asset.id === focusedAssetId}
                      isInspected={inspectedAssetIds.includes(asset.id)}
                      onFocus={onFocusAsset}
                      onHover={onHoverAsset}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
      <p className="border-t px-4 py-3 text-xs text-muted-foreground">{PLANT_COPY.DATA_NOTE}</p>
    </aside>
  );
};
