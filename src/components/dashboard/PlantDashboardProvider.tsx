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

const INITIAL_STATE: DashboardState = {
  selectedPlantId: null,
  activeSectors: SECTOR_ORDER,
  focus: MapFocus.WORLD,
  introductionRunCount: 0,
  focusRevision: 0,
};

const isFocusAction = (action: DashboardAction) =>
  action.type !== DashboardActionType.SET_ACTIVE_SECTORS;

const reduceDashboard = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case DashboardActionType.SELECT_PLANT: {
      return { ...state, selectedPlantId: action.plantId, focus: MapFocus.PLANT };
    }
    case DashboardActionType.CLEAR_SELECTION: {
      return { ...state, selectedPlantId: null, focus: MapFocus.UAE };
    }
    case DashboardActionType.SET_ACTIVE_SECTORS: {
      return { ...state, activeSectors: action.sectors };
    }
    case DashboardActionType.SET_FOCUS: {
      return { ...state, selectedPlantId: null, focus: action.focus };
    }
    case DashboardActionType.REPLAY_INTRODUCTION: {
      return {
        ...state,
        selectedPlantId: null,
        focus: MapFocus.WORLD,
        introductionRunCount: state.introductionRunCount + 1,
      };
    }
  }
};

const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  const nextState = reduceDashboard(state, action);
  return isFocusAction(action)
    ? { ...nextState, focusRevision: state.focusRevision + 1 }
    : nextState;
};

export const PlantDashboardProvider = ({ children }: PlantDashboardProviderProperties) => {
  const [state, dispatch] = useReducer(dashboardReducer, INITIAL_STATE);

  const contextValue = useMemo(() => ({ state, dispatch }), [state]);

  return <PlantDashboardContext value={contextValue}>{children}</PlantDashboardContext>;
};
