import { useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import { SECTOR_ORDER } from '@/constants/dashboard/plantConstants';
import { DashboardActionType } from '@/enums/dashboard/dashboardActionType';
import { MapFocus } from '@/enums/dashboard/mapFocus';
import { PlantDashboardContext } from '@/hooks/dashboard/usePlantDashboard';
import type { DashboardAction, DashboardState } from '@/types/dashboard/dashboardTypes';

interface PlantDashboardProviderProperties {
  children: ReactNode;
}

/** Actions that leave the map where it is. Every other action asks the map to move. */
const STATIONARY_ACTIONS: readonly DashboardActionType[] = [
  DashboardActionType.SET_ACTIVE_SECTORS,
  DashboardActionType.SET_TOURING,
];

const INITIAL_STATE: DashboardState = {
  selectedPlantId: null,
  activeSectors: SECTOR_ORDER,
  focus: MapFocus.WORLD,
  introductionRunCount: 0,
  focusRevision: 0,
  isTouring: false,
};

const reduceDashboard = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case DashboardActionType.SELECT_PLANT: {
      return { ...state, selectedPlantId: action.plantId, focus: MapFocus.PLANT };
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
  }
};

const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  const nextState = reduceDashboard(state, action);
  return STATIONARY_ACTIONS.includes(action.type) || nextState === state
    ? nextState
    : { ...nextState, focusRevision: state.focusRevision + 1 };
};

export const PlantDashboardProvider = ({ children }: PlantDashboardProviderProperties) => {
  const [state, dispatch] = useReducer(dashboardReducer, INITIAL_STATE);

  const contextValue = useMemo(() => ({ state, dispatch }), [state]);

  return <PlantDashboardContext value={contextValue}>{children}</PlantDashboardContext>;
};
