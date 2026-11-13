import { UAE_CENTRE } from '@/constants/dashboard/mapConstants';
import { useExplorerProgress } from '@/hooks/dashboard/useExplorerProgress';
import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';
import { useVisiblePlants } from '@/hooks/dashboard/useVisiblePlants';
import { findNextPlant } from '@/lib/dashboard/explorerProgress';

/** The plant the "explore next" action and the guided tour go to. */
export const useNextPlant = () => {
  const { state } = usePlantDashboard();
  const { visiblePlants, selectedPlant } = useVisiblePlants();
  const { discoveredPlantIds } = useExplorerProgress();

  const nextPlant = findNextPlant(
    visiblePlants,
    discoveredPlantIds,
    selectedPlant ?? UAE_CENTRE,
    state.selectedPlantId,
  );
  const isNextPlantNew = Boolean(nextPlant && !discoveredPlantIds.includes(nextPlant.id));

  return { nextPlant, isNextPlantNew };
};
