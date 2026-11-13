import { geoCentroid } from 'd3-geo';
import { useMemo } from 'react';
import { GlobeBeacon } from '@/components/dashboard/globe/GlobeBeacon';
import { GlobePin } from '@/components/dashboard/globe/GlobePin';
import { GlobePlantMarker } from '@/components/dashboard/globe/GlobePlantMarker';
import { GLOBE_OVERLAY_ELEMENT_ID } from '@/constants/dashboard/globe/globeConstants';
import { useNextPlant } from '@/hooks/dashboard/useNextPlant';
import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';
import { useVisiblePlants } from '@/hooks/dashboard/useVisiblePlants';
import type { MapData } from '@/types/dashboard/mapTypes';

interface GlobeMarkersProperties {
  mapData: MapData;
  isRegionVisible: boolean;
}

/** The HTML layer over the canvas: the UAE beacon from afar, the plant markers up close. */
export const GlobeMarkers = ({ mapData, isRegionVisible }: GlobeMarkersProperties) => {
  const { state } = usePlantDashboard();
  const { visiblePlants } = useVisiblePlants();
  const { nextPlant, isNextPlantNew } = useNextPlant();

  const uaeCentre = useMemo(() => {
    const [longitude, latitude] = geoCentroid(mapData.uae);
    return { longitude, latitude };
  }, [mapData.uae]);

  return (
    <div id={GLOBE_OVERLAY_ELEMENT_ID} className="pointer-events-none absolute inset-0">
      {isRegionVisible ? (
        visiblePlants.map((plant, index) => (
          <GlobePin key={plant.id} point={plant}>
            <GlobePlantMarker
              plant={plant}
              index={index}
              isSelected={plant.id === state.selectedPlantId}
              isTarget={isNextPlantNew && plant.id === nextPlant?.id}
            />
          </GlobePin>
        ))
      ) : (
        <GlobePin point={uaeCentre}>
          <GlobeBeacon plantCount={visiblePlants.length} />
        </GlobePin>
      )}
    </div>
  );
};
