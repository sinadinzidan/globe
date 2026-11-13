import {
  ASSET_KEY_SEPARATOR,
  ASSET_SPECIALIST_TARGET,
  GAS_VALUE_CHAIN,
  PERCENT,
  RANK_SHARES,
  SECTOR_ACHIEVEMENT,
} from '../constants/explorer.constant.js';
import { AchievementId } from '../enums/achievement-id.enum.js';
import type {
  AchievementStatus,
  ExplorablePlant,
  ExplorationRecord,
} from '../types/explorer.type.js';
import { PlantSector } from '../../plant/enums/plant-sector.enum.js';

export const toAssetKey = (plantId: string, assetCode: string) =>
  `${plantId}${ASSET_KEY_SEPARATOR}${assetCode}`;

const toStatus = (id: AchievementId, current: number, total: number): AchievementStatus => ({
  id,
  current: Math.min(current, total),
  total,
  isUnlocked: total > 0 && current >= total,
});

const countDistinct = <Item>(items: Item[], pick: (item: Item) => string) =>
  new Set(items.map(pick)).size;

/** Inspected assets per plant, counting only plants the user can still reach. */
const countInspectedByPlant = (plants: ExplorablePlant[], inspectedAssetKeys: string[]) =>
  new Map(
    plants.map((plant) => [
      plant.id,
      inspectedAssetKeys.filter((key) => key.startsWith(`${plant.id}${ASSET_KEY_SEPARATOR}`))
        .length,
    ]),
  );

/**
 * The achievements open to a user, with how far along each is. Only plants the user can reach
 * count, and achievements they could never complete are left out.
 */
export const evaluateAchievements = (
  plants: ExplorablePlant[],
  record: ExplorationRecord,
): AchievementStatus[] => {
  const discovered = plants.filter((plant) => record.discoveredPlantIds.includes(plant.id));
  const inspectedByPlant = countInspectedByPlant(plants, record.inspectedAssetKeys);
  const inspectedCount = [...inspectedByPlant.values()].reduce((total, count) => total + count, 0);
  const assetCount = plants.reduce((total, plant) => total + plant.assetCount, 0);
  const isSurveyed = (plant: ExplorablePlant) =>
    plant.assetCount > 0 && (inspectedByPlant.get(plant.id) ?? 0) >= plant.assetCount;
  const inSector = (list: ExplorablePlant[], sector: PlantSector) =>
    list.filter((plant) => plant.sector === sector).length;
  const stagesAvailable = GAS_VALUE_CHAIN.filter((model) =>
    plants.some((plant) => plant.model === model),
  );
  const stagesVisited = stagesAvailable.filter((model) =>
    discovered.some((plant) => plant.model === model),
  );

  const statuses = [
    toStatus(AchievementId.FIRST_DISCOVERY, discovered.length, Math.min(plants.length, 1)),
    ...Object.values(PlantSector).map((sector) =>
      toStatus(SECTOR_ACHIEVEMENT[sector], inSector(discovered, sector), inSector(plants, sector)),
    ),
    toStatus(
      AchievementId.EVERY_COMPANY,
      countDistinct(discovered, (plant) => plant.operator),
      countDistinct(plants, (plant) => plant.operator),
    ),
    toStatus(AchievementId.GAS_VALUE_CHAIN, stagesVisited.length, stagesAvailable.length),
    toStatus(AchievementId.FIRST_INSPECTION, inspectedCount, Math.min(assetCount, 1)),
    toStatus(
      AchievementId.PLANT_SURVEYED,
      plants.filter(isSurveyed).length,
      Math.min(plants.length, 1),
    ),
    toStatus(
      AchievementId.ASSET_SPECIALIST,
      inspectedCount,
      Math.min(assetCount, ASSET_SPECIALIST_TARGET),
    ),
    toStatus(AchievementId.GLOBE_VIEW, Number(record.hasOpenedGlobe), 1),
    toStatus(AchievementId.FULL_SURVEY, discovered.length, plants.length),
  ];
  // An achievement with nothing to do, such as a sector the user has no plants in, is left out.
  return statuses.filter((status) => status.total > 0);
};

/** Where a user stands among the ranks, given how many of the achievements open to them are unlocked. */
export const toStanding = (unlockedCount: number, availableCount: number) => {
  const thresholds = RANK_SHARES.map((entry) => ({
    rank: entry.rank,
    threshold: Math.ceil(entry.share * availableCount),
  }));
  const rankIndex = Math.max(
    thresholds.findLastIndex((entry) => unlockedCount >= entry.threshold),
    0,
  );
  const current = thresholds[rankIndex];
  const next = thresholds.at(rankIndex + 1);
  const span = next ? next.threshold - current.threshold : 0;
  return {
    rank: current.rank,
    nextRank: next?.rank ?? null,
    achievementsToNextRank: next ? next.threshold - unlockedCount : 0,
    rankProgressPercent:
      span > 0 ? Math.round(((unlockedCount - current.threshold) / span) * PERCENT) : PERCENT,
  };
};

/** How many achievements a record unlocks. */
export const countUnlocked = (plants: ExplorablePlant[], record: ExplorationRecord) =>
  evaluateAchievements(plants, record).filter((achievement) => achievement.isUnlocked).length;
