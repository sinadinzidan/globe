import { Drill, Factory, Flame } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Emirate } from '@/enums/dashboard/emirate';
import { PlantSector } from '@/enums/dashboard/plantSector';

interface SectorPresentation {
  label: string;
  icon: LucideIcon;
  /** Theme token classes. The colour always appears next to the icon, never alone. */
  fillClassName: string;
  strokeClassName: string;
  textClassName: string;
  backgroundClassName: string;
}

export const SECTOR_PRESENTATION: Record<PlantSector, SectorPresentation> = {
  [PlantSector.GAS]: {
    label: 'Gas',
    icon: Flame,
    fillClassName: 'fill-chart-1',
    strokeClassName: 'stroke-chart-1',
    textClassName: 'text-chart-1',
    backgroundClassName: 'bg-chart-1',
  },
  [PlantSector.UPSTREAM]: {
    label: 'Upstream',
    icon: Drill,
    fillClassName: 'fill-chart-2',
    strokeClassName: 'stroke-chart-2',
    textClassName: 'text-chart-2',
    backgroundClassName: 'bg-chart-2',
  },
  [PlantSector.REFINING_AND_CHEMICALS]: {
    label: 'Refining and chemicals',
    icon: Factory,
    fillClassName: 'fill-chart-3',
    strokeClassName: 'stroke-chart-3',
    textClassName: 'text-chart-3',
    backgroundClassName: 'bg-chart-3',
  },
};

export const SECTOR_ORDER = Object.values(PlantSector);

export const EMIRATE_LABEL: Record<Emirate, string> = {
  [Emirate.ABU_DHABI]: 'Abu Dhabi',
  [Emirate.DUBAI]: 'Dubai',
  [Emirate.SHARJAH]: 'Sharjah',
  [Emirate.AJMAN]: 'Ajman',
  [Emirate.UMM_AL_QUWAIN]: 'Umm Al Quwain',
  [Emirate.RAS_AL_KHAIMAH]: 'Ras Al Khaimah',
  [Emirate.FUJAIRAH]: 'Fujairah',
};

export const EMIRATE_ORDER = Object.values(Emirate);

export const COORDINATE_FRACTION_DIGITS = 2;

/** Emirates large enough for their name to fit at the country-wide zoom level. */
export const LARGE_EMIRATES: readonly Emirate[] = [Emirate.ABU_DHABI, Emirate.DUBAI];

/** The company the dashboard is centred on. Its plants are listed first. */
export const FEATURED_OPERATOR = 'ADNOC Gas';
