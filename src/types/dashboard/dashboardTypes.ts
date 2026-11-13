import type { Dispatch } from 'react';
import type { DashboardActionType } from '@/enums/dashboard/dashboardActionType';
import type { MapFocus } from '@/enums/dashboard/mapFocus';
import type { PlantSector } from '@/enums/dashboard/plantSector';

/** The part of the state that is kept between visits. */
export interface StoredProgress {
  discoveredPlantIds: string[];
  hasOpenedGlobe: boolean;
}

export interface DashboardState extends StoredProgress {
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
  | { type: DashboardActionType.SET_TOURING; isTouring: boolean }
  | { type: DashboardActionType.MARK_GLOBE_OPENED }
  | { type: DashboardActionType.RESET_PROGRESS };

export interface DashboardContextValue {
  state: DashboardState;
  dispatch: Dispatch<DashboardAction>;
}
