import { SectorBadge } from '@/components/dashboard/SectorBadge';
import { DashboardActionType } from '@/enums/dashboard/dashboardActionType';
import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';
import { cn } from '@/lib/utils';
import type { Plant } from '@/types/dashboard/plantTypes';

interface PlantListItemProperties {
  plant: Plant;
}

export const PlantListItem = ({ plant }: PlantListItemProperties) => {
  const { state, dispatch } = usePlantDashboard();

  const isSelected = state.selectedPlantId === plant.id;

  const handleSelect = () => {
    dispatch(
      isSelected
        ? { type: DashboardActionType.CLEAR_SELECTION }
        : { type: DashboardActionType.SELECT_PLANT, plantId: plant.id },
    );
  };

  return (
    <li>
      <button
        type="button"
        aria-pressed={isSelected}
        onClick={handleSelect}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50',
          isSelected && 'bg-muted',
        )}
      >
        <SectorBadge sector={plant.sector} />
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium">{plant.name}</span>
          <span className="truncate text-xs text-muted-foreground">{plant.operator}</span>
        </span>
      </button>
    </li>
  );
};
