import type { PlantModel } from '../../plant/enums/plant-model.enum.js';
import type { PlantSector } from '../../plant/enums/plant-sector.enum.js';
import type { AchievementId } from '../enums/achievement-id.enum.js';

/** What the rules need to know about a plant the user can reach. */
export interface ExplorablePlant {
  id: string;
  operator: string;
  sector: PlantSector;
  model: PlantModel;
  assetCount: number;
}

/** What a user has explored. */
export interface ExplorationRecord {
  discoveredPlantIds: string[];
  inspectedAssetKeys: string[];
  hasOpenedGlobe: boolean;
}

export interface AchievementStatus {
  id: AchievementId;
  current: number;
  total: number;
  isUnlocked: boolean;
}
