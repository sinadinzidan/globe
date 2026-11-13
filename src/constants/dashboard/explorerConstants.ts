import {
  Award,
  ClipboardCheck,
  Compass,
  Crown,
  Drill,
  Earth,
  Factory,
  Flag,
  Flame,
  HardHat,
  Network,
  ScanSearch,
  Telescope,
  Trophy,
  Waypoints,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AchievementId } from '@/enums/dashboard/achievementId';
import { ExplorerRank } from '@/enums/dashboard/explorerRank';

export const PERCENT = 100;

/** How long the tour stays on a plant, including the flight to it. */
export const TOUR_DWELL_MILLISECONDS = 5200;
export const TOAST_DURATION_MILLISECONDS = 4500;

interface RankPresentation {
  label: string;
  icon: LucideIcon;
}

export const RANK_PRESENTATION: Record<ExplorerRank, RankPresentation> = {
  [ExplorerRank.SCOUT]: { label: 'Scout', icon: Compass },
  [ExplorerRank.SURVEYOR]: { label: 'Surveyor', icon: Telescope },
  [ExplorerRank.FIELD_ENGINEER]: { label: 'Field Engineer', icon: HardHat },
  [ExplorerRank.PLANT_MANAGER]: { label: 'Plant Manager', icon: Award },
  [ExplorerRank.DIRECTOR]: { label: 'Director', icon: Crown },
};

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
  [AchievementId.GAS_COMPLETE]: {
    title: 'Gas master',
    description: 'Discover every gas plant.',
    icon: Flame,
  },
  [AchievementId.UPSTREAM_COMPLETE]: {
    title: 'Wellhead to terminal',
    description: 'Discover every upstream site.',
    icon: Drill,
  },
  [AchievementId.REFINING_AND_CHEMICALS_COMPLETE]: {
    title: 'Downstream specialist',
    description: 'Discover every refining and chemicals plant.',
    icon: Factory,
  },
  [AchievementId.EVERY_COMPANY]: {
    title: 'One group',
    description: 'Discover a plant of every company in the group.',
    icon: Network,
  },
  [AchievementId.GAS_VALUE_CHAIN]: {
    title: 'Follow the gas',
    description: 'Visit each stage of the gas value chain: processing, NGL fractionation and LNG.',
    icon: Waypoints,
  },
  [AchievementId.FIRST_INSPECTION]: {
    title: 'Hands on',
    description: 'Inspect your first asset.',
    icon: ScanSearch,
  },
  [AchievementId.PLANT_SURVEYED]: {
    title: 'Plant surveyed',
    description: 'Inspect every asset of one plant.',
    icon: ClipboardCheck,
  },
  [AchievementId.ASSET_SPECIALIST]: {
    title: 'Asset specialist',
    description: 'Inspect 25 assets.',
    icon: HardHat,
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

/** Geometry of the circular progress indicator, in its own view box units. */
export const PROGRESS_RING = {
  SIZE: 72,
  CENTRE: 36,
  RADIUS: 31,
  VIEW_BOX: '0 0 72 72',
} as const;

export const EXPLORER_COPY = {
  DISCOVERED: 'discovered',
  DISCOVERED_BADGE: 'Discovered',
  PROGRESS_LABEL: 'Plants discovered',
  RANK_PROGRESS_LABEL: 'Progress to the next rank',
  ACHIEVEMENTS_UNIT: 'achievements',
  MORE_TO_REACH: 'more to reach',
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
    'This clears every discovered plant, every inspected asset and your achievements. It cannot be undone.',
  RESET_CONFIRM: 'Reset progress',
  RESET_CANCEL: 'Keep progress',
  SHORTCUT_NEXT: 'N',
  INSPECTED: 'inspected',
  INSPECTED_BADGE: 'Inspected',
  ASSETS_PROGRESS_LABEL: 'Assets inspected in this plant',
  INSPECT_NEXT: 'Inspect next',
  CONTINUE_PROCESS: 'Next in the process',
  NEXT_ASSET: 'Next asset',
  PLANT_SURVEYED: 'Every asset inspected',
  PROFILE_TITLE: 'Explorer profile',
  PROFILE_DESCRIPTION: 'Your rank, your achievements and how you compare.',
  PROFILE_LINK_LABEL: 'Open your explorer profile',
  ACHIEVEMENTS_TITLE: 'Achievements',
  LEADERBOARD_TITLE: 'Leaderboard',
  LEADERBOARD_DESCRIPTION: 'The explorers with the most achievements.',
  LEADERBOARD_EMPTY_TITLE: 'Nobody on the board yet',
  LEADERBOARD_EMPTY_DESCRIPTION: 'Discover a plant to be the first.',
  YOU: 'You',
} as const;

/** Keyboard shortcuts, compared against `KeyboardEvent.key` in lower case. */
export const SHORTCUT_KEY = {
  NEXT: 'n',
  CLEAR: 'escape',
} as const;

/** Elements that take typed text, where single-key shortcuts must stay out of the way. */
export const TEXT_ENTRY_SELECTOR = 'input, textarea, select, [contenteditable="true"]';
