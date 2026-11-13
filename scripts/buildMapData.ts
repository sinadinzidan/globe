// Builds the static map data served from public/data.
// Sources: world-atlas (Natural Earth, public domain) and Natural Earth admin-1 boundaries.
// Run with: npm run build:map-data

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Feature, FeatureCollection, Geometry, Position } from 'geojson';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..');
const WORLD_ATLAS_DIRECTORY = path.join(PROJECT_ROOT, 'node_modules', 'world-atlas');
const OUTPUT_DIRECTORY = path.join(PROJECT_ROOT, 'public', 'data');
const WORLD_SOURCE_FILE = 'countries-50m.json';
const DETAIL_SOURCE_FILE = 'countries-10m.json';
const WORLD_OUTPUT_FILE = 'world-countries.json';
const DETAIL_OUTPUT_FILE = 'uae-region-detail.json';
const ADMIN_BOUNDARIES_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson';
const UAE_COUNTRY_CODE = 'AE';
const COORDINATE_PRECISION = 1000;
const FEATURE_COLLECTION_TYPE = 'FeatureCollection';
const GEOMETRY_COLLECTION_TYPE = 'GeometryCollection';
const NUMBER_TYPE = 'number';

// ISO 3166-1 numeric identifiers of the countries drawn in high detail around the UAE.
const DETAIL_COUNTRY_IDENTIFIERS = new Set(['784', '512', '682', '634', '048', '414', '364']);

// ISO 3166-2 codes of the seven emirates, mapped to the Emirate enum keys used by the application.
const EMIRATE_KEYS_BY_CODE = new Map([
  ['AE-AZ', 'ABU_DHABI'],
  ['AE-DU', 'DUBAI'],
  ['AE-SH', 'SHARJAH'],
  ['AE-AJ', 'AJMAN'],
  ['AE-UQ', 'UMM_AL_QUWAIN'],
  ['AE-RK', 'RAS_AL_KHAIMAH'],
  ['AE-FU', 'FUJAIRAH'],
]);

interface CountryProperties {
  name: string;
}

interface AdminBoundaryProperties {
  iso_a2: string;
  iso_3166_2: string;
}

type CountryTopology = Topology<{ countries: GeometryCollection<CountryProperties> }>;

const roundCoordinate = (coordinate: number) =>
  Math.round(coordinate * COORDINATE_PRECISION) / COORDINATE_PRECISION;

const roundPositions = (positions: unknown): unknown => {
  if (!Array.isArray(positions)) {
    return positions;
  }
  if (typeof positions[0] === NUMBER_TYPE) {
    return (positions as Position).map((coordinate) => roundCoordinate(coordinate));
  }
  return positions.map((nested) => roundPositions(nested));
};

const roundGeometry = (geometry: Geometry): Geometry => {
  if (geometry.type === GEOMETRY_COLLECTION_TYPE) {
    return geometry;
  }
  return { ...geometry, coordinates: roundPositions(geometry.coordinates) } as Geometry;
};

const readJson = async <Result>(filePath: string) =>
  JSON.parse(await readFile(filePath, 'utf8')) as Result;

const buildDetailCountries = async (): Promise<Feature[]> => {
  const topology = await readJson<CountryTopology>(
    path.join(WORLD_ATLAS_DIRECTORY, DETAIL_SOURCE_FILE),
  );
  const countries = feature(topology, topology.objects.countries);
  return countries.features
    .filter((country) => DETAIL_COUNTRY_IDENTIFIERS.has(String(country.id)))
    .map((country) => ({
      type: country.type,
      id: String(country.id),
      properties: { name: country.properties.name },
      geometry: roundGeometry(country.geometry),
    }));
};

const buildEmirates = async (): Promise<Feature[]> => {
  const response = await fetch(ADMIN_BOUNDARIES_URL);
  if (!response.ok) {
    throw new Error(`Could not download admin boundaries: ${String(response.status)}`);
  }
  const boundaries = (await response.json()) as FeatureCollection<
    Geometry,
    AdminBoundaryProperties
  >;
  return boundaries.features
    .filter(
      (boundary) =>
        boundary.properties.iso_a2 === UAE_COUNTRY_CODE &&
        EMIRATE_KEYS_BY_CODE.has(boundary.properties.iso_3166_2),
    )
    .map((boundary) => ({
      type: boundary.type,
      id: EMIRATE_KEYS_BY_CODE.get(boundary.properties.iso_3166_2),
      properties: {},
      geometry: roundGeometry(boundary.geometry),
    }));
};

const toFeatureCollection = (features: Feature[]): FeatureCollection => ({
  type: FEATURE_COLLECTION_TYPE,
  features,
});

const writeJson = async (fileName: string, content: unknown) => {
  await writeFile(path.join(OUTPUT_DIRECTORY, fileName), JSON.stringify(content));
};

const world = await readJson<CountryTopology>(path.join(WORLD_ATLAS_DIRECTORY, WORLD_SOURCE_FILE));
await writeJson(WORLD_OUTPUT_FILE, world);
await writeJson(DETAIL_OUTPUT_FILE, {
  countries: toFeatureCollection(await buildDetailCountries()),
  emirates: toFeatureCollection(await buildEmirates()),
});
