import { lazy, Suspense, useEffect, useState } from 'react';
import { MapHud } from '@/components/dashboard/MapHud';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { DASHBOARD_COPY } from '@/constants/dashboard/dashboardConstants';
import { GLOBE } from '@/constants/dashboard/globe/globeConstants';
import { useIntroduction } from '@/hooks/dashboard/useIntroduction';
import { useMapData } from '@/hooks/dashboard/useMapData';
import { useExplorerActions, useExplorerProgress } from '@/hooks/dashboard/useExplorerProgress';
import type { ZoomCommand } from '@/types/dashboard/globe/globeTypes';

// The 3D renderer is large, so it is only downloaded when the globe is opened.
const GlobeScene = lazy(() => import('@/components/dashboard/globe/GlobeScene'));

const INITIAL_ZOOM_COMMAND: ZoomCommand = { factor: 1, sequence: 0 };

export const GlobeView = () => {
  const { data: mapData, isPending, isError, refetch } = useMapData();
  const { isReady, hasOpenedGlobe } = useExplorerProgress();
  const { markGlobeOpened } = useExplorerActions();

  const [zoomCommand, setZoomCommand] = useState(INITIAL_ZOOM_COMMAND);

  const requestZoom = (factor: number) => {
    setZoomCommand((previous) => ({ factor, sequence: previous.sequence + 1 }));
  };

  const handleZoomIn = () => {
    requestZoom(GLOBE.BUTTON_ZOOM_FACTOR);
  };

  const handleZoomOut = () => {
    requestZoom(1 / GLOBE.BUTTON_ZOOM_FACTOR);
  };

  const handleRetry = () => {
    void refetch();
  };

  useIntroduction(Boolean(mapData));

  useEffect(() => {
    if (isReady && !hasOpenedGlobe) {
      markGlobeOpened();
    }
  }, [isReady, hasOpenedGlobe, markGlobeOpened]);

  if (isPending) {
    return <LoadingState message={DASHBOARD_COPY.LOADING_MAP} />;
  }
  if (isError) {
    return <ErrorState onRetry={handleRetry} />;
  }
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Suspense fallback={<LoadingState message={DASHBOARD_COPY.LOADING_MAP} />}>
        <GlobeScene mapData={mapData} zoomCommand={zoomCommand} />
      </Suspense>
      <MapHud onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
    </div>
  );
};
