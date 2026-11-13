import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import {
  ACHIEVEMENT_EXPERIENCE,
  ACHIEVEMENT_PRESENTATION,
  EXPLORER_COPY,
  RANK_PRESENTATION,
  SHORTCUT_KEY,
  TEXT_ENTRY_SELECTOR,
  TOUR_DWELL_MILLISECONDS,
} from '@/constants/dashboard/explorerConstants';
import { AchievementId } from '@/enums/dashboard/achievementId';
import { DashboardActionType } from '@/enums/dashboard/dashboardActionType';
import { useExplorerActions, useExplorerProgress } from '@/hooks/dashboard/useExplorerProgress';
import { useNextPlant } from '@/hooks/dashboard/useNextPlant';
import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';

const KEY_DOWN_EVENT = 'keydown';

interface EarnedSnapshot {
  unlockedIds: string[];
  level: number;
}

/**
 * The side effects of exploring: announcing new achievements and ranks, advancing the guided
 * tour, and the keyboard shortcuts. Mounted once for the whole dashboard.
 */
export const useExplorerEffects = () => {
  const { state, dispatch } = usePlantDashboard();
  const { achievements, level, rank, isReady, discoveredPlantIds } = useExplorerProgress();
  const { discoverPlant } = useExplorerActions();
  const { nextPlant } = useNextPlant();

  const earnedSnapshot = useRef<EarnedSnapshot | null>(null);

  const unlockedKey = achievements
    .filter((achievement) => achievement.isUnlocked)
    .map((achievement) => achievement.id)
    .join();
  const nextPlantId = nextPlant?.id;
  const { isTouring, selectedPlantId } = state;

  useEffect(() => {
    if (!isReady) {
      return;
    }
    const unlockedIds = unlockedKey ? unlockedKey.split(',') : [];
    const previous = earnedSnapshot.current;
    earnedSnapshot.current = { unlockedIds, level };
    if (!previous) {
      return;
    }
    const newlyUnlocked = Object.values(AchievementId).filter(
      (id) => unlockedIds.includes(id) && !previous.unlockedIds.includes(id),
    );
    for (const id of newlyUnlocked) {
      toast.success(EXPLORER_COPY.ACHIEVEMENT_UNLOCKED, {
        description: `${ACHIEVEMENT_PRESENTATION[id].title} · +${String(ACHIEVEMENT_EXPERIENCE)} ${EXPLORER_COPY.EXPERIENCE_UNIT}`,
      });
    }
    if (level > previous.level) {
      const { label } = RANK_PRESENTATION[rank];
      toast.success(EXPLORER_COPY.RANK_REACHED, {
        description: `${EXPLORER_COPY.LEVEL} ${String(level)} · ${label}`,
      });
    }
  }, [isReady, unlockedKey, level, rank]);

  const isSelectedPlantNew =
    isReady && selectedPlantId !== null && !discoveredPlantIds.includes(selectedPlantId);

  useEffect(() => {
    if (isSelectedPlantNew && selectedPlantId) {
      discoverPlant({ plantId: selectedPlantId });
    }
  }, [isSelectedPlantNew, selectedPlantId, discoverPlant]);

  useEffect(() => {
    if (!isTouring || !nextPlantId) {
      return;
    }
    const timeout = window.setTimeout(
      () => {
        dispatch({ type: DashboardActionType.SELECT_PLANT, plantId: nextPlantId });
      },
      selectedPlantId ? TOUR_DWELL_MILLISECONDS : 0,
    );
    return () => {
      window.clearTimeout(timeout);
    };
  }, [isTouring, nextPlantId, selectedPlantId, dispatch]);

  useEffect(() => {
    const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
      const isTyping =
        keyboardEvent.target instanceof Element &&
        Boolean(keyboardEvent.target.closest(TEXT_ENTRY_SELECTOR));
      if (isTyping || keyboardEvent.metaKey || keyboardEvent.ctrlKey || keyboardEvent.altKey) {
        return;
      }
      const key = keyboardEvent.key.toLowerCase();
      if (key === SHORTCUT_KEY.NEXT && nextPlantId) {
        dispatch({ type: DashboardActionType.SELECT_PLANT, plantId: nextPlantId });
      }
      if (key === SHORTCUT_KEY.CLEAR && selectedPlantId) {
        dispatch({ type: DashboardActionType.CLEAR_SELECTION });
      }
    };
    window.addEventListener(KEY_DOWN_EVENT, handleKeyDown);
    return () => {
      window.removeEventListener(KEY_DOWN_EVENT, handleKeyDown);
    };
  }, [nextPlantId, selectedPlantId, dispatch]);
};
