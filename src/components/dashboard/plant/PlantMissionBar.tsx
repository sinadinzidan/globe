import { CircleCheck, ScanSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EXPLORER_COPY } from '@/constants/dashboard/explorerConstants';
import { usePlantExploration } from '@/hooks/dashboard/plant/usePlantExploration';
import type { Asset } from '@/types/dashboard/assetTypes';

interface PlantMissionBarProperties {
  plantId: string;
  assets: Asset[];
  focusedAsset: Asset | undefined;
  onFocusAsset: (assetId: string) => void;
}

/** The plant's main action: move in on the next asset that has not been inspected. */
export const PlantMissionBar = ({
  plantId,
  assets,
  focusedAsset,
  onFocusAsset,
}: PlantMissionBarProperties) => {
  const { nextAsset, isSurveyed, isReady } = usePlantExploration(plantId, assets, focusedAsset);

  if (!isReady || assets.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-x-4 bottom-4 mx-auto flex w-fit max-w-full items-center gap-2 hud-panel p-2">
      {isSurveyed || !nextAsset ? (
        <p className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary">
          <CircleCheck aria-hidden="true" className="size-4" />
          {EXPLORER_COPY.PLANT_SURVEYED}
        </p>
      ) : (
        <Button
          size="lg"
          className="h-auto min-w-0 gap-3 py-1.5"
          onClick={() => {
            onFocusAsset(nextAsset.id);
          }}
        >
          <ScanSearch aria-hidden="true" />
          <span className="flex min-w-0 flex-col items-start">
            <span className="text-xs font-normal opacity-80">{EXPLORER_COPY.INSPECT_NEXT}</span>
            <span className="max-w-56 truncate">
              {nextAsset.tag} · {nextAsset.name}
            </span>
          </span>
        </Button>
      )}
    </div>
  );
};
