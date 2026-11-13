import { MARKER } from '@/constants/dashboard/mapConstants';
import { SECTOR_PRESENTATION } from '@/constants/dashboard/plantConstants';
import type { PlantSector } from '@/enums/dashboard/plantSector';
import { cn } from '@/lib/utils';

interface PlantMarkerGlyphProperties {
  sector: PlantSector;
  isSelected: boolean;
}

const ICON_OFFSET = -MARKER.ICON_SIZE / (1 + 1);

/** The marker drawing shared by the flat map and the globe. Drawn around the origin, in pixels. */
export const PlantMarkerGlyph = ({ sector, isSelected }: PlantMarkerGlyphProperties) => {
  const { icon: Icon, fillClassName } = SECTOR_PRESENTATION[sector];

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
      <circle
        r={MARKER.RADIUS}
        className={cn(
          'stroke-background stroke-2 transition-opacity group-hover:opacity-80',
          fillClassName,
        )}
      />
      <Icon
        x={ICON_OFFSET}
        y={ICON_OFFSET}
        width={MARKER.ICON_SIZE}
        height={MARKER.ICON_SIZE}
        className="text-white"
      />
    </>
  );
};
