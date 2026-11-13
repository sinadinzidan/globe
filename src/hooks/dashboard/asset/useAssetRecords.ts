import { useQueryClient } from '@tanstack/react-query';
import {
  useAssetFindOne,
  useAssetGetDocuments,
  useAssetGetInspections,
  useAssetGetTrends,
} from '@/api/generated/assets/assets';
import {
  getWorkOrderListForAssetQueryKey,
  useWorkOrderCreate,
  useWorkOrderListForAsset,
  useWorkOrderUpdate,
} from '@/api/generated/work-orders/work-orders';
import type { ApiError } from '@/api/httpClient';

/** One asset with its specifications. */
export const useAssetDetail = (plantId: string, assetId: string) =>
  useAssetFindOne(plantId, assetId);

export const useAssetTrends = (plantId: string, assetId: string) =>
  useAssetGetTrends(plantId, assetId);

export const useAssetInspections = (plantId: string, assetId: string) =>
  useAssetGetInspections(plantId, assetId);

export const useAssetDocuments = (plantId: string, assetId: string) =>
  useAssetGetDocuments(plantId, assetId);

export const useAssetWorkOrders = (plantId: string, assetId: string) =>
  useWorkOrderListForAsset(plantId, assetId);

/** Raises a work order on an asset, then refreshes that asset's list. */
export const useCreateWorkOrder = (plantId: string, assetId: string) => {
  const queryClient = useQueryClient();

  return useWorkOrderCreate<ApiError>({
    mutation: {
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: getWorkOrderListForAssetQueryKey(plantId, assetId),
        }),
    },
  });
};

/** Changes a work order, then refreshes the list of the asset it belongs to. */
export const useUpdateWorkOrder = (plantId: string, assetId: string) => {
  const queryClient = useQueryClient();

  return useWorkOrderUpdate<ApiError>({
    mutation: {
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: getWorkOrderListForAssetQueryKey(plantId, assetId),
        }),
    },
  });
};
