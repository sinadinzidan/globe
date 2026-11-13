import type { Emirate } from '@/enums/dashboard/emirate';
import type { PlantSector } from '@/enums/dashboard/plantSector';

export interface Plant {
  id: string;
  name: string;
  operator: string;
  sector: PlantSector;
  emirate: Emirate;
  longitude: number;
  latitude: number;
  description: string;
}
