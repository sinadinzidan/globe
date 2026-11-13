import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';
import { usePlants } from '@/hooks/dashboard/usePlants';

/** The plants query, narrowed to the sectors that are switched on. */
export const useVisiblePlants = () => {
  const { state } = usePlantDashboard();
  const plantsQuery = usePlants();

  const allPlants = plantsQuery.data ?? [];
  const visiblePlants = allPlants.filter((plant) => state.activeSectors.includes(plant.sector));
  const selectedPlant = visiblePlants.find((plant) => plant.id === state.selectedPlantId);

  return { ...plantsQuery, allPlants, visiblePlants, selectedPlant };
};
