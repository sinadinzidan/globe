import type { GeoProjection } from 'd3-geo';
import { useMemo } from 'react';
import { FlatMapBeacon } from '@/components/dashboard/flat-map/FlatMapBeacon';
import { FlatMapPlantMarker } from '@/components/dashboard/flat-map/FlatMapPlantMarker';
import { EMIRATE_LABEL, EMIRATE_ORDER, LARGE_EMIRATES } from '@/constants/dashboard/plantConstants';
import { useNextPlant } from '@/hooks/dashboard/useNextPlant';
import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';
import { useVisiblePlants } from '@/hooks/dashboard/useVisiblePlants';
import { projectCentroid, projectPoint, toPinnedTransform } from '@/lib/dashboard/flatMapGeometry';
import type { MapData } from '@/types/dashboard/mapTypes';

interface FlatMapOverlayProperties {
  mapData: MapData;
  projection: GeoProjection;
  scale: number;
  isRegionVisible: boolean;
  hasEmirateLabels: boolean;
  hasSmallEmirateLabels: boolean;
}

/** Everything that keeps its pixel size while the map zooms: labels, the beacon and markers. */
export const FlatMapOverlay = ({
  mapData,
  projection,
  scale,
  isRegionVisible,
  hasEmirateLabels,
  hasSmallEmirateLabels,
}: FlatMapOverlayProperties) => {
  const { state } = usePlantDashboard();
  const { visiblePlants } = useVisiblePlants();
  const { nextPlant, isNextPlantNew } = useNextPlant();

  const emirateLabels = useMemo(
    () =>
      EMIRATE_ORDER.flatMap((emirate) => {
        const shape = mapData.emirates.find((candidate) => candidate.id === emirate);
        return shape ? [{ emirate, point: projectCentroid(projection, shape) }] : [];
      }),
    [mapData.emirates, projection],
  );
  const beaconPoint = useMemo(
    () => projectCentroid(projection, mapData.uae),
    [mapData.uae, projection],
  );
  const visibleLabels = emirateLabels.filter(
    (label) =>
      hasSmallEmirateLabels || (hasEmirateLabels && LARGE_EMIRATES.includes(label.emirate)),
  );
  const markers = visiblePlants
    .map((plant, index) => ({
      plant,
      index,
      isSelected: plant.id === state.selectedPlantId,
      point: projectPoint(projection, plant),
    }))
    .toSorted((first, second) => Number(first.isSelected) - Number(second.isSelected));

  if (!isRegionVisible) {
    return (
      <FlatMapBeacon
        transform={toPinnedTransform(beaconPoint, scale)}
        plantCount={visiblePlants.length}
      />
    );
  }

  return (
    <>
      {visibleLabels.map((label) => (
        <text
          key={label.emirate}
          transform={toPinnedTransform(label.point, scale)}
          textAnchor="middle"
          className="pointer-events-none animate-in fill-muted-foreground text-xs tracking-wide uppercase fade-in"
        >
          {EMIRATE_LABEL[label.emirate]}
        </text>
      ))}
      {markers.map((marker) => (
        <FlatMapPlantMarker
          key={marker.plant.id}
          plant={marker.plant}
          index={marker.index}
          isSelected={marker.isSelected}
          isTarget={isNextPlantNew && marker.plant.id === nextPlant?.id}
          transform={toPinnedTransform(marker.point, scale)}
        />
      ))}
    </>
  );
};
