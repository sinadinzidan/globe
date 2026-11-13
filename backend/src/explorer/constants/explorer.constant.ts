import { PlantModel } from '../../plant/enums/plant-model.enum.js';
import { PlantSector } from '../../plant/enums/plant-sector.enum.js';
import { AchievementId } from '../enums/achievement-id.enum.js';
import { ExplorerRank } from '../enums/explorer-rank.enum.js';

/** Experience earned for each thing an explorer does. */
export const EXPERIENCE = {
  PLANT_DISCOVERED: 100,
  ASSET_INSPECTED: 25,
  ACHIEVEMENT_UNLOCKED: 250,
} as const;

/** Ranks in order, with the experience needed to reach each. */
export const RANK_THRESHOLDS: readonly { rank: ExplorerRank; threshold: number }[] = [
  { rank: ExplorerRank.SCOUT, threshold: 0 },
  { rank: ExplorerRank.SURVEYOR, threshold: 500 },
  { rank: ExplorerRank.FIELD_ENGINEER, threshold: 1500 },
  { rank: ExplorerRank.PLANT_MANAGER, threshold: 3500 },
  { rank: ExplorerRank.DIRECTOR, threshold: 6000 },
];

export const SECTOR_ACHIEVEMENT: Record<PlantSector, AchievementId> = {
  [PlantSector.GAS]: AchievementId.GAS_COMPLETE,
  [PlantSector.UPSTREAM]: AchievementId.UPSTREAM_COMPLETE,
  [PlantSector.REFINING_AND_CHEMICALS]: AchievementId.REFINING_AND_CHEMICALS_COMPLETE,
};

/** The stages gas passes through, from the field to the ship. Visiting one of each completes the mission. */
export const GAS_VALUE_CHAIN: readonly PlantModel[] = [
  PlantModel.GAS_PROCESSING_PLANT,
  PlantModel.NGL_FRACTIONATION_PLANT,
  PlantModel.LNG_PLANT,
];

/** Assets to inspect for the "asset specialist" achievement. */
export const ASSET_SPECIALIST_TARGET = 25;
export const LEADERBOARD_SIZE = 10;
export const PERCENT = 100;

/** Separates the plant and the asset in a stored asset key. Neither identifier can contain it. */
export const ASSET_KEY_SEPARATOR = '/';
