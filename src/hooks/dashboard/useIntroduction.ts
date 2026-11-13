import { useEffect } from 'react';
import { INTRODUCTION_DELAY_MILLISECONDS } from '@/constants/dashboard/dashboardConstants';
import { DashboardActionType } from '@/enums/dashboard/dashboardActionType';
import { MapFocus } from '@/enums/dashboard/mapFocus';
import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';

/** Holds the world view for a moment, then sends the map to the UAE. Runs again on replay. */
export const useIntroduction = (isReady: boolean) => {
  const { state, dispatch } = usePlantDashboard();

  const { introductionRunCount } = state;

  useEffect(() => {
    if (!isReady) {
      return;
    }
    const timeout = window.setTimeout(() => {
      dispatch({ type: DashboardActionType.SET_FOCUS, focus: MapFocus.UAE });
    }, INTRODUCTION_DELAY_MILLISECONDS);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [isReady, introductionRunCount, dispatch]);
};
