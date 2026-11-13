import type { AchievementId } from '@/enums/dashboard/achievementId';
import type { ExplorerRank } from '@/enums/dashboard/explorerRank';

export interface AchievementStatus {
  id: AchievementId;
  current: number;
  total: number;
  isUnlocked: boolean;
}

export interface ExplorerProgress {
  discoveredCount: number;
  totalCount: number;
  achievements: AchievementStatus[];
  unlockedCount: number;
  experience: number;
  rank: ExplorerRank;
  /** One-based position of the rank, shown as the explorer's level. */
  level: number;
  /** Missing when the highest rank has been reached. */
  nextRank?: ExplorerRank;
  experienceToNextRank: number;
  /** Progress through the current rank, from 0 to 100. */
  rankProgressPercent: number;
}
