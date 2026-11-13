import type { KeyboardEvent } from 'react';
import { PlantMarkerGlyph } from '@/components/dashboard/PlantMarkerGlyph';
import {
  ACTIVATION_KEYS,
  MARKER,
  MARKER_STAGGER_MILLISECONDS,
} from '@/constants/dashboard/mapConstants';
import { DashboardActionType } from '@/enums/dashboard/dashboardActionType';
import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';
import { cn } from '@/lib/utils';
import type { Plant } from '@/types/dashboard/plantTypes';

interface FlatMapPlantMarkerProperties {
  plant: Plant;
  index: number;
  isSelected: boolean;
  isTarget: boolean;
  transform: string;
}

export const FlatMapPlantMarker = ({
  plant,
  index,
  isSelected,
  isTarget,
  transform,
}: FlatMapPlantMarkerProperties) => {
  const { state, dispatch } = usePlantDashboard();

  const isDiscovered = state.discoveredPlantIds.includes(plant.id);

  const handleSelect = () => {
    dispatch(
      isSelected
        ? { type: DashboardActionType.CLEAR_SELECTION }
        : { type: DashboardActionType.SELECT_PLANT, plantId: plant.id },
    );
  };

  const handleKeyDown = (keyboardEvent: KeyboardEvent<SVGGElement>) => {
    if (ACTIVATION_KEYS.includes(keyboardEvent.key)) {
      keyboardEvent.preventDefault();
      handleSelect();
    }
  };

  return (
    <g transform={transform}>
      <g
        role="button"
        tabIndex={0}
        aria-label={plant.name}
        aria-pressed={isSelected}
        onClick={handleSelect}
        onKeyDown={handleKeyDown}
        className="group cursor-pointer outline-none"
      >
        <circle
          r={MARKER.HIT_RADIUS}
          className="fill-transparent stroke-ring stroke-0 group-focus-visible:stroke-2"
        />
        <g
          style={{ animationDelay: `${String(index * MARKER_STAGGER_MILLISECONDS)}ms` }}
          className="origin-center animate-in duration-500 fill-mode-both fade-in zoom-in-0 [transform-box:fill-box]"
        >
          <PlantMarkerGlyph
            sector={plant.sector}
            isSelected={isSelected}
            isDiscovered={isDiscovered}
            isTarget={isTarget}
          />
        </g>
        <text
          y={-MARKER.LABEL_OFFSET}
          textAnchor="middle"
          className={cn(
            'pointer-events-none fill-foreground stroke-background stroke-3 text-xs font-medium transition-opacity [paint-order:stroke] group-hover:opacity-100 group-focus-visible:opacity-100',
            isSelected ? 'opacity-100' : 'opacity-0',
          )}
        >
          {plant.name}
        </text>
      </g>
    </g>
  );
};
