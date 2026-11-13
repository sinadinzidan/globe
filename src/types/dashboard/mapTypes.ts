import type { Feature, FeatureCollection, MultiLineString, MultiPolygon, Polygon } from 'geojson';
import type { GeometryCollection, Topology } from 'topojson-specification';

export interface CountryProperties {
  name: string;
}

export type AreaFeature<Properties = CountryProperties> = Feature<
  Polygon | MultiPolygon,
  Properties
>;

export type WorldTopology = Topology<{ countries: GeometryCollection<CountryProperties> }>;

export interface RegionDetailResponse {
  countries: FeatureCollection<Polygon | MultiPolygon, CountryProperties>;
  emirates: FeatureCollection<Polygon | MultiPolygon, Record<string, never>>;
}

export interface MapData {
  /** Countries at world resolution, without the ones drawn in high detail. */
  countries: AreaFeature[];
  /** Countries around the UAE at high resolution, including the UAE itself. */
  detailCountries: AreaFeature[];
  /** Borders and coastlines of the world-resolution countries, each drawn once. */
  borders: MultiLineString;
  uae: AreaFeature;
  emirates: AreaFeature<Record<string, never>>[];
}

export interface GeographicPoint {
  longitude: number;
  latitude: number;
}
