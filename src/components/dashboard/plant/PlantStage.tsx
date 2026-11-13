import { lazy, Suspense, useEffect, useState } from 'react';
import { PlantAssetPanel } from '@/components/dashboard/plant/PlantAssetPanel';
import { PlantAssetPins } from '@/components/dashboard/plant/PlantAssetPins';
import { PlantAssetPreview } from '@/components/dashboard/plant/PlantAssetPreview';
import { PlantMissionBar } from '@/components/dashboard/plant/PlantMissionBar';
import { PlantSceneControls } from '@/components/dashboard/plant/PlantSceneControls';
import { PlantSummary } from '@/components/dashboard/plant/PlantSummary';
import { LoadingState } from '@/components/shared/LoadingState';
import { PLANT_COPY, PLANT_SCENE } from '@/constants/dashboard/plant/plantSceneConstants';
import { useFocusedAsset } from '@/hooks/dashboard/plant/useFocusedAsset';
import { useExplorerActions, useExplorerProgress } from '@/hooks/dashboard/useExplorerProgress';
import type { PlantLayout } from '@/types/dashboard/assetTypes';
import type { ZoomCommand } from '@/types/dashboard/globe/globeTypes';
import type { Plant } from '@/types/dashboard/plantTypes';

interface PlantStageProperties {
  plant: Plant;
  layout: PlantLayout;
}

// The 3D renderer is large, so it is only downloaded when a 3D view is opened.
const PlantScene = lazy(() => import('@/components/dashboard/plant/PlantScene'));

const INITIAL_ZOOM_COMMAND: ZoomCommand = { factor: 1, sequence: 0 };

/** The plant in 3D with its assets overlaid, and the asset list beside it. */
export const PlantStage = ({ plant, layout }: PlantStageProperties) => {
  const { focusedAsset, focusAsset } = useFocusedAsset(layout.assets);
  const { isReady, discoveredPlantIds } = useExplorerProgress();
  const { discoverPlant } = useExplorerActions();

  const [hoveredAssetId, setHoveredAssetId] = useState<string | null>(null);
  const [zoomCommand, setZoomCommand] = useState(INITIAL_ZOOM_COMMAND);

  const isDiscovered = discoveredPlantIds.includes(plant.id);

  const requestZoom = (factor: number) => {
    setZoomCommand((previous) => ({ factor, sequence: previous.sequence + 1 }));
  };

  const handleZoomIn = () => {
    requestZoom(PLANT_SCENE.BUTTON_ZOOM_FACTOR);
  };

  const handleZoomOut = () => {
    requestZoom(1 / PLANT_SCENE.BUTTON_ZOOM_FACTOR);
  };

  const handleResetView = () => {
    focusAsset(null);
  };

  // Arriving at a plant discovers it, however the user got here.
  useEffect(() => {
    if (isReady && !isDiscovered) {
      discoverPlant({ plantId: plant.id });
    }
  }, [isReady, isDiscovered, plant.id, discoverPlant]);

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <main className="relative h-[70svh] min-w-0 overflow-hidden lg:h-auto lg:flex-1">
        <Suspense fallback={<LoadingState message={PLANT_COPY.LOADING} />}>
          <PlantScene
            layout={layout}
            focusedAsset={focusedAsset}
            hoveredAssetId={hoveredAssetId}
            zoomCommand={zoomCommand}
            onFocusAsset={focusAsset}
            onHoverAsset={setHoveredAssetId}
          />
        </Suspense>
        <PlantAssetPins
          plantId={plant.id}
          assets={layout.assets}
          focusedAssetId={focusedAsset?.id}
          hoveredAssetId={hoveredAssetId}
          onFocusAsset={focusAsset}
          onHoverAsset={setHoveredAssetId}
        />
        {focusedAsset ? (
          <PlantAssetPreview plant={plant} asset={focusedAsset} onClose={handleResetView} />
        ) : (
          <PlantSummary plant={plant} assetCount={layout.assets.length} />
        )}
        <PlantMissionBar
          plantId={plant.id}
          assets={layout.assets}
          focusedAsset={focusedAsset}
          onFocusAsset={focusAsset}
        />
        <PlantSceneControls
          onResetView={handleResetView}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />
      </main>
      <PlantAssetPanel
        plant={plant}
        assets={layout.assets}
        focusedAssetId={focusedAsset?.id}
        onFocusAsset={focusAsset}
        onHoverAsset={setHoveredAssetId}
      />
    </div>
  );
};
