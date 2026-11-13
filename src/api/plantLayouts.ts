import { fetchJson } from '@/api/fetchJson';
import { PLANT_LAYOUT_URL } from '@/constants/dashboard/assetConstants';
import type { PlantModel } from '@/enums/dashboard/plantModel';
import type { PlantLayout } from '@/types/dashboard/assetTypes';

export const fetchPlantLayout = (model: PlantModel, signal?: AbortSignal) =>
  fetchJson<PlantLayout>(PLANT_LAYOUT_URL[model], signal);
