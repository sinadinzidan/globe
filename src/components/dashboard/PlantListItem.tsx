import { CircleCheck } from 'lucide-react';
import { SectorBadge } from '@/components/dashboard/SectorBadge';
import {
  PLANT_STATUS_PRESENTATION,
  SECTOR_PRESENTATION,
} from '@/constants/dashboard/plantConstants';
import { PlantStatus } from '@/enums/dashboard/plantStatus';
import { EXPLORER_COPY } from '@/constants/dashboard/explorerConstants';
import { DashboardActionType } from '@/enums/dashboard/dashboardActionType';
import { useExplorerProgress } from '@/hooks/dashboard/useExplorerProgress';
import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';
import { cn } from '@/lib/utils';
import type { Plant } from '@/types/dashboard/plantTypes';

interface PlantListItemProperties {
  plant: Plant;
}

export const PlantListItem = ({ plant }: PlantListItemProperties) => {
  const { state, dispatch } = usePlantDashboard();
  const { discoveredPlantIds } = useExplorerProgress();

  const isSelected = state.selectedPlantId === plant.id;
  const isDiscovered = discoveredPlantIds.includes(plant.id);
  const isOperating = plant.status === PlantStatus.OPERATING;

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
          isSelected && 'bg-muted ring-1 ring-primary/50',
        )}
      >
        <SectorBadge sector={plant.sector} isMuted={!isDiscovered} />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium">{plant.name}</span>
          <span className="truncate text-xs text-muted-foreground">
            {SECTOR_PRESENTATION[plant.sector].label}
            {!isOperating && ` · ${PLANT_STATUS_PRESENTATION[plant.status].label}`}
          </span>
        </span>
        {isDiscovered && (
          <CircleCheck
            role="img"
            aria-label={EXPLORER_COPY.DISCOVERED_BADGE}
            className="size-4 shrink-0 text-primary"
          />
        )}
      </button>
    </li>
  );
};
