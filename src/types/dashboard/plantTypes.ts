import type { Emirate } from '@/enums/dashboard/emirate';
import type { PlantModel } from '@/enums/dashboard/plantModel';
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
  /** Which representative 3D layout and asset set the plant is shown with. */
  model: PlantModel;
}
