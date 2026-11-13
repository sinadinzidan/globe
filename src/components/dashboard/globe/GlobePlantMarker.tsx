import { PlantMarkerGlyph } from '@/components/dashboard/PlantMarkerGlyph';
import { MARKER_STAGGER_MILLISECONDS, MARKER_VIEW_BOX } from '@/constants/dashboard/mapConstants';
import { DashboardActionType } from '@/enums/dashboard/dashboardActionType';
import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';
import { cn } from '@/lib/utils';
import type { Plant } from '@/types/dashboard/plantTypes';

interface GlobePlantMarkerProperties {
  plant: Plant;
  index: number;
  isSelected: boolean;
}

export const GlobePlantMarker = ({ plant, index, isSelected }: GlobePlantMarkerProperties) => {
  const { dispatch } = usePlantDashboard();

  const handleClick = () => {
    dispatch(
      isSelected
        ? { type: DashboardActionType.CLEAR_SELECTION }
        : { type: DashboardActionType.SELECT_PLANT, plantId: plant.id },
    );
  };

  return (
    <button
      type="button"
      aria-label={plant.name}
      aria-pressed={isSelected}
      onClick={handleClick}
      className="group relative flex size-10 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring"
    >
      <svg
        viewBox={MARKER_VIEW_BOX}
        aria-hidden="true"
        style={{ animationDelay: `${String(index * MARKER_STAGGER_MILLISECONDS)}ms` }}
        className="size-10 animate-in overflow-visible duration-500 fill-mode-both fade-in zoom-in-0"
      >
        <PlantMarkerGlyph sector={plant.sector} isSelected={isSelected} />
      </svg>
      <span
        className={cn(
          'pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 rounded-md bg-background/80 px-1.5 py-0.5 text-xs font-medium whitespace-nowrap text-foreground transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100',
          isSelected ? 'opacity-100' : 'opacity-0',
        )}
      >
        {plant.name}
      </span>
    </button>
  );
};
