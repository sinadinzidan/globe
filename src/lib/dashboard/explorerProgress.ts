import { geoDistance } from 'd3-geo';
import {
  ACHIEVEMENT_EXPERIENCE,
  DISCOVERY_EXPERIENCE,
  PERCENT,
  PROGRESS_STORAGE_KEY,
  RANKS,
  SECTOR_ACHIEVEMENT,
} from '@/constants/dashboard/explorerConstants';
import { SECTOR_ORDER } from '@/constants/dashboard/plantConstants';
import { AchievementId } from '@/enums/dashboard/achievementId';
import type { StoredProgress } from '@/types/dashboard/dashboardTypes';
import type { AchievementStatus, ExplorerProgress } from '@/types/dashboard/explorerTypes';
import type { GeographicPoint } from '@/types/dashboard/mapTypes';
import type { Plant } from '@/types/dashboard/plantTypes';

const EMPTY_PROGRESS: StoredProgress = { discoveredPlantIds: [], hasOpenedGlobe: false };
const STRING_TYPE = 'string';

const toStatus = (id: AchievementId, current: number, total: number): AchievementStatus => ({
  id,
  current,
  total,
  isUnlocked: total > 0 && current >= total,
});

const evaluateAchievements = (plants: Plant[], progress: StoredProgress) => {
  const discovered = plants.filter((plant) => progress.discoveredPlantIds.includes(plant.id));
  const emirates = new Set(plants.map((plant) => plant.emirate));
  const discoveredEmirates = new Set(discovered.map((plant) => plant.emirate));
  const countSector = (list: Plant[], sector: Plant['sector']) =>
    list.filter((plant) => plant.sector === sector).length;

  return [
    toStatus(AchievementId.FIRST_DISCOVERY, Math.min(discovered.length, 1), 1),
    ...SECTOR_ORDER.map((sector) =>
      toStatus(
        SECTOR_ACHIEVEMENT[sector],
        countSector(discovered, sector),
        countSector(plants, sector),
      ),
    ),
    toStatus(AchievementId.EVERY_EMIRATE, discoveredEmirates.size, emirates.size),
    toStatus(AchievementId.GLOBE_VIEW, Number(progress.hasOpenedGlobe), 1),
    toStatus(AchievementId.FULL_SURVEY, discovered.length, plants.length),
  ];
};

/** Everything the explorer has earned, worked out from what has been discovered. */
export const computeExplorerProgress = (
  plants: Plant[],
  progress: StoredProgress,
): ExplorerProgress => {
  const achievements = evaluateAchievements(plants, progress);
  const unlockedCount = achievements.filter((achievement) => achievement.isUnlocked).length;
  const discoveredCount = achievements.at(-1)?.current ?? 0;
  const experience =
    discoveredCount * DISCOVERY_EXPERIENCE + unlockedCount * ACHIEVEMENT_EXPERIENCE;

  const rankIndex = RANKS.findLastIndex((definition) => experience >= definition.threshold);
  const current = RANKS[Math.max(rankIndex, 0)];
  const next = RANKS.at(rankIndex + 1);
  const isHighestRank = rankIndex === RANKS.length - 1;
  const span = isHighestRank || !next ? 0 : next.threshold - current.threshold;

  return {
    discoveredCount,
    totalCount: plants.length,
    achievements,
    unlockedCount,
    experience,
    rank: current.rank,
    level: rankIndex + 1,
    nextRank: isHighestRank ? undefined : next?.rank,
    experienceToNextRank: span > 0 && next ? next.threshold - experience : 0,
    rankProgressPercent:
      span > 0 ? Math.round(((experience - current.threshold) / span) * PERCENT) : PERCENT,
  };
};

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

/** Reads saved progress, ignoring anything that is missing or not in the expected shape. */
export const loadStoredProgress = (): StoredProgress => {
  try {
    const stored: unknown = JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY) ?? '');
    const candidate = stored as Partial<StoredProgress> | null;
    if (!candidate || !Array.isArray(candidate.discoveredPlantIds)) {
      return EMPTY_PROGRESS;
    }
    return {
      discoveredPlantIds: candidate.discoveredPlantIds.filter(
        (plantId): plantId is string => typeof plantId === STRING_TYPE,
      ),
      hasOpenedGlobe: Boolean(candidate.hasOpenedGlobe),
    };
  } catch {
    return EMPTY_PROGRESS;
  }
};

/** Saves progress. Storage can be unavailable, in which case progress lasts for the visit only. */
export const saveStoredProgress = (progress: StoredProgress) => {
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Nothing to do: the dashboard works the same without saved progress.
  }
};
