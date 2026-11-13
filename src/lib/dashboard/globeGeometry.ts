import type { MultiLineString, Position } from 'geojson';
import { BufferAttribute, BufferGeometry, MathUtils, ShapeUtils, Vector2, Vector3 } from 'three';
import { GLOBE } from '@/constants/dashboard/globe/globeConstants';
import { ANTIMERIDIAN_LONGITUDE, POLAR_CAP_LATITUDE } from '@/constants/dashboard/mapConstants';
import type { AreaFeature, GeographicPoint } from '@/types/dashboard/mapTypes';

const POSITION_ATTRIBUTE = 'position';
const POLYGON_TYPE = 'Polygon';

/** Longitude 0, latitude 0 faces +Z, north is +Y. The camera uses the same convention. */
export const toCartesian = (point: GeographicPoint, radius: number) => {
  const longitude = MathUtils.degToRad(point.longitude);
  const latitude = MathUtils.degToRad(point.latitude);
  return new Vector3(
    radius * Math.cos(latitude) * Math.sin(longitude),
    radius * Math.sin(latitude),
    radius * Math.cos(latitude) * Math.cos(longitude),
  );
};

const toPoint = ([longitude = 0, latitude = 0]: Position): GeographicPoint => ({
  longitude,
  latitude,
});

/** Edges that exist only because a polygon was cut at the antimeridian or closed at a pole. */
const isCutEdge = (start: GeographicPoint, end: GeographicPoint) =>
  (Math.abs(start.longitude) > ANTIMERIDIAN_LONGITUDE &&
    Math.abs(end.longitude) > ANTIMERIDIAN_LONGITUDE) ||
  (Math.abs(start.latitude) > POLAR_CAP_LATITUDE && Math.abs(end.latitude) > POLAR_CAP_LATITUDE);

const polygonsOf = (area: AreaFeature<unknown>) =>
  area.geometry.type === POLYGON_TYPE ? [area.geometry.coordinates] : area.geometry.coordinates;

/** Every outline ring of the given areas, as plain lines. */
export const ringsOf = (areas: AreaFeature<unknown>[]) =>
  areas.flatMap((area) => polygonsOf(area).flat());

/** Line segments on the sphere, ready for a `lineSegments` object. */
export const buildLineGeometry = (lines: MultiLineString['coordinates'], radius: number) => {
  const positions: number[] = [];
  for (const line of lines) {
    const points = line.map((position) => toPoint(position));
    for (const [index, end] of points.entries()) {
      const start = points[index - 1];
      if (index === 0 || isCutEdge(start, end)) {
        continue;
      }
      positions.push(
        ...toCartesian(start, radius).toArray(),
        ...toCartesian(end, radius).toArray(),
      );
    }
  }
  return new BufferGeometry().setAttribute(
    POSITION_ATTRIBUTE,
    new BufferAttribute(new Float32Array(positions), GLOBE.POSITION_COMPONENTS),
  );
};

const toFlatRing = (ring: Position[]) =>
  ring.slice(0, -1).map(([longitude = 0, latitude = 0]) => new Vector2(longitude, latitude));

/**
 * A filled surface for a small area. The area is triangulated in longitude and latitude and the
 * corners are lifted onto the sphere, which only holds for areas a few degrees across.
 */
export const buildFillGeometry = (area: AreaFeature<unknown>, radius: number) => {
  const positions: number[] = [];
  const indices: number[] = [];
  for (const [outline = [], ...holes] of polygonsOf(area)) {
    const contour = toFlatRing(outline);
    const flatHoles = holes.map((hole) => toFlatRing(hole));
    const offset = positions.length / GLOBE.POSITION_COMPONENTS;
    for (const corner of [contour, ...flatHoles].flat()) {
      positions.push(...toCartesian({ longitude: corner.x, latitude: corner.y }, radius).toArray());
    }
    for (const triangle of ShapeUtils.triangulateShape(contour, flatHoles)) {
      indices.push(...triangle.map((corner) => corner + offset));
    }
  }
  const geometry = new BufferGeometry().setAttribute(
    POSITION_ATTRIBUTE,
    new BufferAttribute(new Float32Array(positions), GLOBE.POSITION_COMPONENTS),
  );
  geometry.setIndex(indices);
  return geometry;
};

/** The shortest signed turn, in degrees, from one longitude to another. */
export const longitudeDifference = (from: number, to: number) =>
  MathUtils.euclideanModulo(to - from + GLOBE.HALF_TURN_DEGREES, GLOBE.FULL_TURN_DEGREES) -
  GLOBE.HALF_TURN_DEGREES;
