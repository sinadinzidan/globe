import { geoPath } from 'd3-geo';
import { useMemo } from 'react';
import { FlatMapLand } from '@/components/dashboard/flat-map/FlatMapLand';
import { FlatMapOverlay } from '@/components/dashboard/flat-map/FlatMapOverlay';
import { MapHud } from '@/components/dashboard/MapHud';
import { DASHBOARD_COPY } from '@/constants/dashboard/dashboardConstants';
import { FLAT_MAP } from '@/constants/dashboard/flat-map/flatMapConstants';
import { MapFocus } from '@/enums/dashboard/mapFocus';
import { useFlatMapZoom, WORLD_TRANSFORM } from '@/hooks/dashboard/flat-map/useFlatMapZoom';
import { useIntroduction } from '@/hooks/dashboard/useIntroduction';
import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';
import { useVisiblePlants } from '@/hooks/dashboard/useVisiblePlants';
import { useElementSize } from '@/hooks/useElementSize';
import {
  centreOn,
  createWorldProjection,
  fitFeature,
  projectPoint,
  toGroupTransform,
} from '@/lib/dashboard/flatMapGeometry';
import type { MapData } from '@/types/dashboard/mapTypes';

interface FlatMapStageProperties {
  mapData: MapData;
}

export const FlatMapStage = ({ mapData }: FlatMapStageProperties) => {
  const { state } = usePlantDashboard();
  const { selectedPlant } = useVisiblePlants();
  const { attach, size } = useElementSize();

  const hasSize = size.width > 0 && size.height > 0;
  const projection = useMemo(() => createWorldProjection(size), [size]);
  const pathGenerator = useMemo(() => geoPath(projection), [projection]);
  const uaeFit = useMemo(
    () => fitFeature(size, projection, mapData.uae),
    [size, projection, mapData.uae],
  );
  const target = useMemo(() => {
    if (state.focus === MapFocus.WORLD) {
      return WORLD_TRANSFORM;
    }
    if (state.focus === MapFocus.PLANT && selectedPlant) {
      return centreOn(
        size,
        projectPoint(projection, selectedPlant),
        uaeFit.scale * FLAT_MAP.PLANT_SCALE_MULTIPLIER,
      );
    }
    return uaeFit.transform;
  }, [state.focus, selectedPlant, size, projection, uaeFit]);

  const { svgReference, transform, zoomIn, zoomOut } = useFlatMapZoom({
    size,
    target,
    revision: state.focusRevision,
  });
  useIntroduction(hasSize);

  const isRegionVisible = transform.scale >= uaeFit.scale * FLAT_MAP.REGION_VISIBLE_SCALE_SHARE;
  const hasEmirateLabels = transform.scale >= uaeFit.scale * FLAT_MAP.LABEL_VISIBLE_SCALE_SHARE;
  const hasSmallEmirateLabels =
    transform.scale >= uaeFit.scale * FLAT_MAP.SMALL_LABEL_VISIBLE_SCALE_SHARE;

  return (
    <div ref={attach} className="absolute inset-0 overflow-hidden">
      {hasSize && (
        <svg
          ref={svgReference}
          width={size.width}
          height={size.height}
          role="group"
          aria-label={DASHBOARD_COPY.FLAT_MAP_LABEL}
          className="block cursor-grab touch-none select-none active:cursor-grabbing"
        >
          <g
            transform={toGroupTransform(
              transform.scale,
              transform.translateX,
              transform.translateY,
            )}
          >
            <FlatMapLand
              mapData={mapData}
              pathGenerator={pathGenerator}
              isRegionVisible={isRegionVisible}
            />
            <FlatMapOverlay
              mapData={mapData}
              projection={projection}
              scale={transform.scale}
              isRegionVisible={isRegionVisible}
              hasEmirateLabels={hasEmirateLabels}
              hasSmallEmirateLabels={hasSmallEmirateLabels}
            />
          </g>
        </svg>
      )}
      <MapHud onZoomIn={zoomIn} onZoomOut={zoomOut} />
    </div>
  );
};
