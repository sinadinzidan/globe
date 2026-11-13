import {
  Award,
  Compass,
  Crown,
  Earth,
  Factory,
  Flag,
  Flame,
  HardHat,
  MapPinned,
  Sun,
  Telescope,
  Trophy,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AchievementId } from '@/enums/dashboard/achievementId';
import { ExplorerRank } from '@/enums/dashboard/explorerRank';
import { PlantSector } from '@/enums/dashboard/plantSector';

export const PROGRESS_STORAGE_KEY = 'globe.explorer-progress';

export const DISCOVERY_EXPERIENCE = 100;
export const ACHIEVEMENT_EXPERIENCE = 250;
export const PERCENT = 100;

/** How long the tour stays on a plant, including the flight to it. */
export const TOUR_DWELL_MILLISECONDS = 5200;
export const TOAST_DURATION_MILLISECONDS = 4500;

interface RankDefinition {
  rank: ExplorerRank;
  label: string;
  icon: LucideIcon;
  /** Experience needed to reach the rank. */
  threshold: number;
}

/** Ordered from the first rank to the last. */
export const RANKS: readonly RankDefinition[] = [
  { rank: ExplorerRank.SCOUT, label: 'Scout', icon: Compass, threshold: 0 },
  { rank: ExplorerRank.SURVEYOR, label: 'Surveyor', icon: Telescope, threshold: 500 },
  { rank: ExplorerRank.FIELD_ENGINEER, label: 'Field Engineer', icon: HardHat, threshold: 1400 },
  { rank: ExplorerRank.PLANT_MANAGER, label: 'Plant Manager', icon: Award, threshold: 2600 },
  { rank: ExplorerRank.DIRECTOR, label: 'Director', icon: Crown, threshold: 4000 },
];

interface AchievementPresentation {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const ACHIEVEMENT_PRESENTATION: Record<AchievementId, AchievementPresentation> = {
  [AchievementId.FIRST_DISCOVERY]: {
    title: 'First contact',
    description: 'Discover your first plant.',
    icon: Flag,
  },
  [AchievementId.OIL_GAS_AND_CHEMICALS_COMPLETE]: {
    title: 'Hydrocarbon specialist',
    description: 'Discover every oil, gas and chemicals plant.',
    icon: Flame,
  },
  [AchievementId.POWER_AND_WATER_COMPLETE]: {
    title: 'Grid keeper',
    description: 'Discover every power and water plant.',
    icon: Zap,
  },
  [AchievementId.METALS_COMPLETE]: {
    title: 'Metalworker',
    description: 'Discover every metals plant.',
    icon: Factory,
  },
  [AchievementId.CLEAN_ENERGY_COMPLETE]: {
    title: 'Clean sweep',
    description: 'Discover every clean energy plant.',
    icon: Sun,
  },
  [AchievementId.EVERY_EMIRATE]: {
    title: 'Coast to coast',
    description: 'Discover a plant in every emirate on the map.',
    icon: MapPinned,
  },
  [AchievementId.GLOBE_VIEW]: {
    title: 'Orbital view',
    description: 'Open the 3D globe.',
    icon: Earth,
  },
  [AchievementId.FULL_SURVEY]: {
    title: 'Full survey',
    description: 'Discover every plant.',
    icon: Trophy,
  },
};

export const SECTOR_ACHIEVEMENT: Record<PlantSector, AchievementId> = {
  [PlantSector.OIL_GAS_AND_CHEMICALS]: AchievementId.OIL_GAS_AND_CHEMICALS_COMPLETE,
  [PlantSector.POWER_AND_WATER]: AchievementId.POWER_AND_WATER_COMPLETE,
  [PlantSector.METALS]: AchievementId.METALS_COMPLETE,
  [PlantSector.CLEAN_ENERGY]: AchievementId.CLEAN_ENERGY_COMPLETE,
};

/** Geometry of the circular progress indicator, in its own view box units. */
export const PROGRESS_RING = {
  SIZE: 72,
  CENTRE: 36,
  RADIUS: 31,
  VIEW_BOX: '0 0 72 72',
} as const;

export const EXPLORER_COPY = {
  LEVEL: 'Level',
  EXPERIENCE_UNIT: 'XP',
  DISCOVERED: 'discovered',
  DISCOVERED_BADGE: 'Discovered',
  PROGRESS_LABEL: 'Plants discovered',
  RANK_PROGRESS_LABEL: 'Progress to the next rank',
  TO_NEXT_RANK: 'XP to',
  HIGHEST_RANK: 'Highest rank reached',
  TAB_PLANTS: 'Plants',
  TAB_ACHIEVEMENTS: 'Achievements',
  PANEL_LABEL: 'Explorer panel',
  SEARCH_LABEL: 'Search plants',
  SEARCH_PLACEHOLDER: 'Name or operator',
  NO_SEARCH_RESULTS_TITLE: 'No plants found',
  NO_SEARCH_RESULTS_DESCRIPTION: 'Try a different name, or turn on more sectors.',
  EXPLORE_NEXT: 'Explore next',
  START_EXPLORING: 'Start exploring',
  NEXT_PLANT: 'Next plant',
  START_TOUR: 'Start the guided tour',
  STOP_TOUR: 'Stop the guided tour',
  TOURING: 'Touring',
  MISSION_LABEL: 'Exploration controls',
  UNLOCKED: 'Unlocked',
  LOCKED: 'Locked',
  ACHIEVEMENT_UNLOCKED: 'Achievement unlocked',
  RANK_REACHED: 'New rank reached',
  RESET: 'Reset progress',
  RESET_TITLE: 'Reset your progress?',
  RESET_DESCRIPTION:
    'This clears every discovered plant, your experience and your achievements. It cannot be undone.',
  RESET_CONFIRM: 'Reset progress',
  RESET_CANCEL: 'Keep progress',
  SHORTCUT_NEXT: 'N',
} as const;

/** Keyboard shortcuts, compared against `KeyboardEvent.key` in lower case. */
export const SHORTCUT_KEY = {
  NEXT: 'n',
  CLEAR: 'escape',
} as const;

/** Elements that take typed text, where single-key shortcuts must stay out of the way. */
export const TEXT_ENTRY_SELECTOR = 'input, textarea, select, [contenteditable="true"]';
