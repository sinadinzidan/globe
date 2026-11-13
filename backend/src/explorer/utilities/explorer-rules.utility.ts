import {
  ASSET_KEY_SEPARATOR,
  ASSET_SPECIALIST_TARGET,
  EXPERIENCE,
  GAS_VALUE_CHAIN,
  PERCENT,
  RANK_THRESHOLDS,
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
 * Every achievement with how far along it is. Only plants the user can reach count, so a user
 * limited to some plants can still complete everything that is open to them.
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

  return [
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
};

/** Experience earned from discoveries, inspections and unlocked achievements together. */
export const calculateExperience = (plants: ExplorablePlant[], record: ExplorationRecord) => {
  const achievements = evaluateAchievements(plants, record);
  const discoveredCount = plants.filter((plant) =>
    record.discoveredPlantIds.includes(plant.id),
  ).length;
  const inspectedCount = [
    ...countInspectedByPlant(plants, record.inspectedAssetKeys).values(),
  ].reduce((total, count) => total + count, 0);
  return (
    discoveredCount * EXPERIENCE.PLANT_DISCOVERED +
    inspectedCount * EXPERIENCE.ASSET_INSPECTED +
    achievements.filter((achievement) => achievement.isUnlocked).length *
      EXPERIENCE.ACHIEVEMENT_UNLOCKED
  );
};

/** Where an amount of experience puts an explorer among the ranks. */
export const toStanding = (experience: number) => {
  const rankIndex = Math.max(
    RANK_THRESHOLDS.findLastIndex((entry) => experience >= entry.threshold),
    0,
  );
  const current = RANK_THRESHOLDS[rankIndex];
  const next = RANK_THRESHOLDS.at(rankIndex + 1);
  const span = next ? next.threshold - current.threshold : 0;
  return {
    rank: current.rank,
    level: rankIndex + 1,
    nextRank: next?.rank ?? null,
    experienceToNextRank: next ? next.threshold - experience : 0,
    rankProgressPercent:
      span > 0 ? Math.round(((experience - current.threshold) / span) * PERCENT) : PERCENT,
  };
};
