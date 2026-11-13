import { useAssetGetLayout } from '@/api/generated/assets/assets';
import type { ApiError } from '@/api/httpClient';
import type { PlantLayout } from '@/types/dashboard/assetTypes';

/** The 3D layout and assets of a plant. */
export const usePlantLayout = (plantId: string) =>
  useAssetGetLayout<PlantLayout, ApiError>(plantId);
