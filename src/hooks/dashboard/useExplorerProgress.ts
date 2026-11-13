import { useQueryClient } from '@tanstack/react-query';
import {
  getExplorerGetLeaderboardQueryKey,
  getExplorerGetProgressQueryKey,
  useExplorerDiscoverPlant,
  useExplorerGetLeaderboard,
  useExplorerGetProgress,
  useExplorerInspectAsset,
  useExplorerMarkGlobeOpened,
  useExplorerReset,
} from '@/api/generated/explorer/explorer';
import { ExplorerRank } from '@/enums/dashboard/explorerRank';
import { toAssetKey } from '@/lib/dashboard/explorerProgress';
import type { ExplorerProgress } from '@/types/dashboard/explorerTypes';

/** What is shown until the server has answered: nothing explored yet. */
const EMPTY_PROGRESS: ExplorerProgress = {
  discoveredPlantIds: [],
  inspectedAssetKeys: [],
  hasOpenedGlobe: false,
  discoveredCount: 0,
  totalCount: 0,
  inspectedCount: 0,
  assetCount: 0,
  achievements: [],
  unlockedCount: 0,
  rank: ExplorerRank.SCOUT,
  nextRank: null,
  achievementsToNextRank: 0,
  rankProgressPercent: 0,
};

/** The signed-in user's discoveries, rank and achievements, as the API keeps them. */
export const useExplorerProgress = () => {
  const { data, isSuccess } = useExplorerGetProgress();

  const progress = data ?? EMPTY_PROGRESS;
  const isAssetInspected = (plantId: string, assetId: string) =>
    progress.inspectedAssetKeys.includes(toAssetKey(plantId, assetId));

  return { ...progress, isReady: isSuccess, isAssetInspected };
};

/**
 * Records what the user explores. Every action answers with the new progress, which replaces
 * the cached one, and the leaderboard is refreshed because standings may have changed.
 */
export const useExplorerActions = () => {
  const queryClient = useQueryClient();

  const mutation = {
    onSuccess: (progress: ExplorerProgress) => {
      queryClient.setQueryData(getExplorerGetProgressQueryKey(), progress);
      return queryClient.invalidateQueries({ queryKey: getExplorerGetLeaderboardQueryKey() });
    },
  };
  const { mutate: discoverPlant } = useExplorerDiscoverPlant({ mutation });
  const { mutate: inspectAsset } = useExplorerInspectAsset({ mutation });
  const { mutate: markGlobeOpened } = useExplorerMarkGlobeOpened({ mutation });
  const { mutate: resetProgress } = useExplorerReset({ mutation });

  return { discoverPlant, inspectAsset, markGlobeOpened, resetProgress };
};

export const useLeaderboard = () => useExplorerGetLeaderboard();
