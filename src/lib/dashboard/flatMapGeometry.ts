import { geoCentroid, geoNaturalEarth1, geoPath } from 'd3-geo';
import type { GeoPath, GeoProjection } from 'd3-geo';
import { zoomIdentity } from 'd3-zoom';
import type { ZoomTransform } from 'd3-zoom';
import type { Feature } from 'geojson';
import { FLAT_MAP } from '@/constants/dashboard/flat-map/flatMapConstants';
import type { ScreenPoint } from '@/types/dashboard/flat-map/flatMapTypes';
import type { GeographicPoint } from '@/types/dashboard/mapTypes';
import type { ElementSize } from '@/hooks/useElementSize';

const SPHERE = { type: 'Sphere' } as const;
const OFF_SCREEN: ScreenPoint = { horizontal: 0, vertical: 0 };

/** A world projection that fits the whole globe inside the given size. */
export const createWorldProjection = (size: ElementSize) =>
  geoNaturalEarth1().fitExtent(
    [
      [FLAT_MAP.WORLD_PADDING, FLAT_MAP.WORLD_PADDING],
      [size.width - FLAT_MAP.WORLD_PADDING, size.height - FLAT_MAP.WORLD_PADDING],
    ],
    SPHERE,
  );

export const projectPoint = (projection: GeoProjection, point: GeographicPoint): ScreenPoint => {
  const projected = projection([point.longitude, point.latitude]);
  if (!projected) {
    return OFF_SCREEN;
  }
  const [horizontal, vertical] = projected;
  return { horizontal, vertical };
};

export const projectCentroid = (projection: GeoProjection, feature: Feature): ScreenPoint => {
  const [longitude, latitude] = geoCentroid(feature);
  return projectPoint(projection, { longitude, latitude });
};

/** The zoom that centres a screen point at the given scale. */
export const centreOn = (size: ElementSize, point: ScreenPoint, scale: number): ZoomTransform =>
  zoomIdentity
    .translate(
      size.width * FLAT_MAP.HALF - scale * point.horizontal,
      size.height * FLAT_MAP.HALF - scale * point.vertical,
    )
    .scale(scale);

/** The zoom at which a feature fills the configured share of the viewport. */
export const fitFeature = (size: ElementSize, projection: GeoProjection, feature: Feature) => {
  const [[left, top], [right, bottom]] = geoPath(projection).bounds(feature);
  const scale =
    FLAT_MAP.UAE_VIEWPORT_SHARE *
    Math.min(size.width / (right - left), size.height / (bottom - top));
  const centre: ScreenPoint = {
    horizontal: (left + right) * FLAT_MAP.HALF,
    vertical: (top + bottom) * FLAT_MAP.HALF,
  };
  return { scale, transform: centreOn(size, centre, scale) };
};

export const toPathData = (pathGenerator: GeoPath, shape: Parameters<GeoPath>[0]) =>
  pathGenerator(shape) ?? undefined;

/** Places an element at a map position while cancelling the zoom, so it keeps its pixel size. */
export const toPinnedTransform = (point: ScreenPoint, scale: number) =>
  `translate(${String(point.horizontal)} ${String(point.vertical)}) scale(${String(1 / scale)})`;

export const toGroupTransform = (scale: number, translateX: number, translateY: number) =>
  `translate(${String(translateX)} ${String(translateY)}) scale(${String(scale)})`;
