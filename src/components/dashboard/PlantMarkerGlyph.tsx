import { MARKER } from '@/constants/dashboard/mapConstants';
import { SECTOR_PRESENTATION } from '@/constants/dashboard/plantConstants';
import type { PlantSector } from '@/enums/dashboard/plantSector';
import { cn } from '@/lib/utils';

interface PlantMarkerGlyphProperties {
  sector: PlantSector;
  isSelected: boolean;
  /** Undiscovered plants are drawn as an outline, discovered ones filled in. */
  isDiscovered: boolean;
  /** The plant the explorer is sent to next gets a pulse to draw the eye. */
  isTarget: boolean;
}

const ICON_OFFSET = -MARKER.ICON_SIZE / (1 + 1);

/** The marker drawing shared by the flat map and the globe. Drawn around the origin, in pixels. */
export const PlantMarkerGlyph = ({
  sector,
  isSelected,
  isDiscovered,
  isTarget,
}: PlantMarkerGlyphProperties) => {
  const { icon: Icon, fillClassName, strokeClassName, textClassName } = SECTOR_PRESENTATION[sector];

  return (
    <>
      {isSelected && (
        <>
          <circle
            r={MARKER.SELECTED_RING_RADIUS}
            className="origin-center animate-ping fill-none stroke-foreground stroke-2 [transform-box:fill-box] motion-reduce:animate-none"
          />
          <circle
            r={MARKER.SELECTED_RING_RADIUS}
            className="fill-none stroke-foreground stroke-2"
          />
        </>
      )}
      {isTarget && !isSelected && (
        <circle
          r={MARKER.SELECTED_RING_RADIUS}
          className="origin-center animate-ping fill-none stroke-primary stroke-2 [transform-box:fill-box] motion-reduce:animate-none"
        />
      )}
      <circle
        r={MARKER.RADIUS}
        className={cn(
          'stroke-2 transition-[fill,stroke,opacity] duration-500 group-hover:opacity-80',
          isDiscovered
            ? cn('stroke-background', fillClassName)
            : cn('fill-background', strokeClassName),
        )}
      />
      <Icon
        x={ICON_OFFSET}
        y={ICON_OFFSET}
        width={MARKER.ICON_SIZE}
        height={MARKER.ICON_SIZE}
        className={cn(
          'transition-colors duration-500',
          isDiscovered ? 'text-white' : textClassName,
        )}
      />
    </>
  );
};
