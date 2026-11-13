import { PlantModel } from '../../plant/enums/plant-model.enum.js';
import { PlantSector } from '../../plant/enums/plant-sector.enum.js';
import { AchievementId } from '../enums/achievement-id.enum.js';
import { ExplorerRank } from '../enums/explorer-rank.enum.js';

/**
 * Ranks in order, with the share of the achievements open to a user that reaches each. A share,
 * not a count, so a user who can only reach some plants can still reach the highest rank.
 */
export const RANK_SHARES: readonly { rank: ExplorerRank; share: number }[] = [
  { rank: ExplorerRank.SCOUT, share: 0 },
  { rank: ExplorerRank.SURVEYOR, share: 0.2 },
  { rank: ExplorerRank.FIELD_ENGINEER, share: 0.4 },
  { rank: ExplorerRank.PLANT_MANAGER, share: 0.65 },
  { rank: ExplorerRank.DIRECTOR, share: 0.9 },
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
