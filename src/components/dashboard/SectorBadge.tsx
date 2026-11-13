import { SECTOR_PRESENTATION } from '@/constants/dashboard/plantConstants';
import type { PlantSector } from '@/enums/dashboard/plantSector';
import { cn } from '@/lib/utils';

interface SectorBadgeProperties {
  sector: PlantSector;
}

/** The sector's colour and icon together, so a sector is never identified by colour alone. */
export const SectorBadge = ({ sector }: SectorBadgeProperties) => {
  const { icon: Icon, backgroundClassName } = SECTOR_PRESENTATION[sector];

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-5 shrink-0 items-center justify-center rounded-full text-white',
        backgroundClassName,
      )}
    >
      <Icon className="size-3" />
    </span>
  );
};
