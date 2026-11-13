import { feature, mesh } from 'topojson-client';
import { fetchJson } from '@/api/fetchJson';
import {
  REGION_DETAIL_URL,
  UAE_COUNTRY_IDENTIFIER,
  WORLD_COUNTRIES_URL,
} from '@/constants/dashboard/mapConstants';
import type {
  AreaFeature,
  MapData,
  RegionDetailResponse,
  WorldTopology,
} from '@/types/dashboard/mapTypes';

const MISSING_UAE_MESSAGE = 'The map data does not contain the United Arab Emirates.';

/** Loads the world outline and swaps the countries around the UAE for their detailed shapes. */
export const fetchMapData = async (signal?: AbortSignal): Promise<MapData> => {
  const [topology, detail] = await Promise.all([
    fetchJson<WorldTopology>(WORLD_COUNTRIES_URL, signal),
    fetchJson<RegionDetailResponse>(REGION_DETAIL_URL, signal),
  ]);
  const detailIdentifiers = new Set(detail.countries.features.map((country) => String(country.id)));
  const isDetailed = (identifier: string | number | undefined) =>
    detailIdentifiers.has(String(identifier));
  const uae = detail.countries.features.find(
    (country) => String(country.id) === UAE_COUNTRY_IDENTIFIER,
  );
  if (!uae) {
    throw new Error(MISSING_UAE_MESSAGE);
  }

  return {
    // World countries are all polygons, which the topology types cannot express.
    countries: (feature(topology, topology.objects.countries).features as AreaFeature[]).filter(
      (country) => !isDetailed(country.id),
    ),
    detailCountries: detail.countries.features,
    borders: mesh(
      topology,
      topology.objects.countries,
      (first, second) => !isDetailed(first.id) && !isDetailed(second.id),
    ),
    uae,
    emirates: detail.emirates.features,
  };
};
