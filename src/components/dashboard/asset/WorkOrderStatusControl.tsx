import { StatusBadge } from '@/components/dashboard/StatusBadge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ASSET_COPY } from '@/constants/dashboard/asset/assetPageConstants';
import { WORK_ORDER_STATUS_PRESENTATION } from '@/constants/dashboard/assetConstants';
import { WorkOrderStatus } from '@/enums/dashboard/workOrderStatus';
import { useUpdateWorkOrder } from '@/hooks/dashboard/asset/useAssetRecords';
import { findEnumValue } from '@/lib/enumValue';
import type { WorkOrder } from '@/types/dashboard/assetTypes';

interface WorkOrderStatusControlProperties {
  plantId: string;
  assetId: string;
  workOrder: WorkOrder;
}

const STATUS_ORDER = Object.values(WorkOrderStatus);

/**
 * A work order's status. Users who may change this work order get a selector; everyone else
 * sees the status as a badge. The API decides which, and checks again on every change.
 */
export const WorkOrderStatusControl = ({
  plantId,
  assetId,
  workOrder,
}: WorkOrderStatusControlProperties) => {
  const updateWorkOrder = useUpdateWorkOrder(plantId, assetId);

  const handleStatusChange = (value: string) => {
    const status = findEnumValue(STATUS_ORDER, value);
    if (status) {
      updateWorkOrder.mutate({ workOrderId: workOrder.id, data: { status } });
    }
  };

  if (!workOrder.canUpdate) {
    return <StatusBadge {...WORK_ORDER_STATUS_PRESENTATION[workOrder.status]} />;
  }

  return (
    <div className="flex flex-col gap-1">
      <Select
        value={workOrder.status}
        disabled={updateWorkOrder.isPending}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger
          size="sm"
          aria-label={`${ASSET_COPY.CHANGE_STATUS_LABEL} ${workOrder.number}`}
          className="w-40"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_ORDER.map((status) => (
            <SelectItem key={status} value={status}>
              {WORK_ORDER_STATUS_PRESENTATION[status].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {updateWorkOrder.isError && (
        <p role="alert" className="text-xs text-destructive">
          {ASSET_COPY.UPDATE_FAILED}
        </p>
      )}
    </div>
  );
};
