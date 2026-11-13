import { useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import { SECTOR_ORDER } from '@/constants/dashboard/plantConstants';
import { DashboardActionType } from '@/enums/dashboard/dashboardActionType';
import { MapFocus } from '@/enums/dashboard/mapFocus';
import { PlantDashboardContext } from '@/hooks/dashboard/usePlantDashboard';
import { loadStoredProgress, saveStoredProgress } from '@/lib/dashboard/explorerProgress';
import type { DashboardAction, DashboardState } from '@/types/dashboard/dashboardTypes';

interface PlantDashboardProviderProperties {
  children: ReactNode;
}

/** Actions that leave the map where it is. Every other action asks the map to move. */
const STATIONARY_ACTIONS: readonly DashboardActionType[] = [
  DashboardActionType.SET_ACTIVE_SECTORS,
  DashboardActionType.SET_TOURING,
  DashboardActionType.MARK_GLOBE_OPENED,
  DashboardActionType.RESET_PROGRESS,
];

const createInitialState = (): DashboardState => ({
  ...loadStoredProgress(),
  selectedPlantId: null,
  activeSectors: SECTOR_ORDER,
  focus: MapFocus.WORLD,
  introductionRunCount: 0,
  focusRevision: 0,
  isTouring: false,
});

const reduceDashboard = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case DashboardActionType.SELECT_PLANT: {
      return {
        ...state,
        selectedPlantId: action.plantId,
        focus: MapFocus.PLANT,
        discoveredPlantIds: state.discoveredPlantIds.includes(action.plantId)
          ? state.discoveredPlantIds
          : [...state.discoveredPlantIds, action.plantId],
      };
    }
    case DashboardActionType.CLEAR_SELECTION: {
      return { ...state, selectedPlantId: null, focus: MapFocus.UAE, isTouring: false };
    }
    case DashboardActionType.SET_ACTIVE_SECTORS: {
      return { ...state, activeSectors: action.sectors };
    }
    case DashboardActionType.SET_FOCUS: {
      return { ...state, selectedPlantId: null, focus: action.focus, isTouring: false };
    }
    case DashboardActionType.REPLAY_INTRODUCTION: {
      return {
        ...state,
        selectedPlantId: null,
        focus: MapFocus.WORLD,
        isTouring: false,
        introductionRunCount: state.introductionRunCount + 1,
      };
    }
    case DashboardActionType.SET_TOURING: {
      return { ...state, isTouring: action.isTouring };
    }
    case DashboardActionType.MARK_GLOBE_OPENED: {
      return state.hasOpenedGlobe ? state : { ...state, hasOpenedGlobe: true };
    }
    case DashboardActionType.RESET_PROGRESS: {
      return { ...state, discoveredPlantIds: [], hasOpenedGlobe: false, isTouring: false };
    }
  }
};

const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  const nextState = reduceDashboard(state, action);
  return STATIONARY_ACTIONS.includes(action.type) || nextState === state
    ? nextState
    : { ...nextState, focusRevision: state.focusRevision + 1 };
};

export const PlantDashboardProvider = ({ children }: PlantDashboardProviderProperties) => {
  const [state, dispatch] = useReducer(dashboardReducer, undefined, createInitialState);

  const contextValue = useMemo(() => ({ state, dispatch }), [state]);
  const { discoveredPlantIds, hasOpenedGlobe } = state;

  useEffect(() => {
    saveStoredProgress({ discoveredPlantIds, hasOpenedGlobe });
  }, [discoveredPlantIds, hasOpenedGlobe]);

  return <PlantDashboardContext value={contextValue}>{children}</PlantDashboardContext>;
};
