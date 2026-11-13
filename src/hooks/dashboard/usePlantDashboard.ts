import { createContext, useContext } from 'react';
import type { DashboardContextValue } from '@/types/dashboard/dashboardTypes';

const MISSING_PROVIDER_MESSAGE = 'usePlantDashboard must be used inside PlantDashboardProvider.';

export const PlantDashboardContext = createContext<DashboardContextValue | null>(null);

/** Shared dashboard state: the selected plant, the sector filter and where the map looks. */
export const usePlantDashboard = () => {
  const context = useContext(PlantDashboardContext);
  if (!context) {
    throw new Error(MISSING_PROVIDER_MESSAGE);
  }
  return context;
};
