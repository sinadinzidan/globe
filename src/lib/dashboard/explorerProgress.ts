import { geoDistance } from 'd3-geo';
import { ConnectionDirection } from '@/enums/dashboard/connectionDirection';
import type { Asset } from '@/types/dashboard/assetTypes';
import type { GeographicPoint } from '@/types/dashboard/mapTypes';
import type { Plant } from '@/types/dashboard/plantTypes';

const ASSET_KEY_SEPARATOR = '/';

/** How the API names an inspected asset. */
export const toAssetKey = (plantId: string, assetId: string) =>
  `${plantId}${ASSET_KEY_SEPARATOR}${assetId}`;

const distanceBetween = (first: GeographicPoint, second: GeographicPoint) =>
  geoDistance([first.longitude, first.latitude], [second.longitude, second.latitude]);

/**
 * The plant to go to next: the closest undiscovered one, or, once everything has been
 * discovered, simply the one after the current plant so the tour keeps circling.
 */
export const findNextPlant = (
  plants: Plant[],
  discoveredPlantIds: string[],
  origin: GeographicPoint,
  selectedPlantId: string | null,
) => {
  const undiscovered = plants.filter(
    (plant) => !discoveredPlantIds.includes(plant.id) && plant.id !== selectedPlantId,
  );
  if (undiscovered.length > 0) {
    return undiscovered.toSorted(
      (first, second) => distanceBetween(origin, first) - distanceBetween(origin, second),
    )[0];
  }
  const selectedIndex = plants.findIndex((plant) => plant.id === selectedPlantId);
  return plants.length > 1 || selectedIndex < 0
    ? plants.at((selectedIndex + 1) % Math.max(plants.length, 1))
    : undefined;
};

/**
 * The asset to inspect next. From an asset, the story follows the process: the first downstream
 * asset that has not been inspected. Otherwise, any asset of the plant that has not been.
 */
export const findNextAsset = (
  assets: Asset[],
  inspectedAssetIds: string[],
  currentAsset?: Asset,
) => {
  const isOpen = (asset: Asset) =>
    !inspectedAssetIds.includes(asset.id) && asset.id !== currentAsset?.id;
  const downstreamIds =
    currentAsset?.connections
      .filter((connection) => connection.direction === ConnectionDirection.DOWNSTREAM)
      .map((connection) => connection.assetId) ?? [];
  const downstream = assets.find((asset) => downstreamIds.includes(asset.id) && isOpen(asset));
  return {
    nextAsset: downstream ?? assets.find((asset) => isOpen(asset)),
    isDownstream: Boolean(downstream),
  };
};
