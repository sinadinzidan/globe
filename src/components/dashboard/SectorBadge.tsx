import { SECTOR_PRESENTATION } from '@/constants/dashboard/plantConstants';
import type { PlantSector } from '@/enums/dashboard/plantSector';
import { cn } from '@/lib/utils';

interface SectorBadgeProperties {
  sector: PlantSector;
  /** Draws the badge as an outline, the way undiscovered plants appear on the map. */
  isMuted?: boolean;
}

/** The sector's colour and icon together, so a sector is never identified by colour alone. */
export const SectorBadge = ({ sector, isMuted = false }: SectorBadgeProperties) => {
  const { icon: Icon, backgroundClassName, textClassName } = SECTOR_PRESENTATION[sector];

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-5 shrink-0 items-center justify-center rounded-full',
        isMuted
          ? cn('bg-background ring-2 ring-current ring-inset', textClassName)
          : cn('text-white', backgroundClassName),
      )}
    >
      <Icon className="size-3" />
    </span>
  );
};
