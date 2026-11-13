import type { Dispatch } from 'react';
import type { DashboardActionType } from '@/enums/dashboard/dashboardActionType';
import type { MapFocus } from '@/enums/dashboard/mapFocus';
import type { PlantSector } from '@/enums/dashboard/plantSector';

export interface DashboardState {
  selectedPlantId: string | null;
  activeSectors: PlantSector[];
  focus: MapFocus;
  introductionRunCount: number;
  /** Rises on every focus request, so asking for the same focus again still moves the map. */
  focusRevision: number;
  /** While touring, the map moves on to the next plant by itself. */
  isTouring: boolean;
}

export type DashboardAction =
  | { type: DashboardActionType.SELECT_PLANT; plantId: string }
  | { type: DashboardActionType.CLEAR_SELECTION }
  | { type: DashboardActionType.SET_ACTIVE_SECTORS; sectors: PlantSector[] }
  | { type: DashboardActionType.SET_FOCUS; focus: MapFocus.WORLD | MapFocus.UAE }
  | { type: DashboardActionType.REPLAY_INTRODUCTION }
  | { type: DashboardActionType.SET_TOURING; isTouring: boolean };

export interface DashboardContextValue {
  state: DashboardState;
  dispatch: Dispatch<DashboardAction>;
}
