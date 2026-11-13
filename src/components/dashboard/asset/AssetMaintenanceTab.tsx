import { Plus } from 'lucide-react';
import { useState } from 'react';
import { RaiseWorkOrderDialog } from '@/components/dashboard/asset/RaiseWorkOrderDialog';
import { WorkOrderStatusControl } from '@/components/dashboard/asset/WorkOrderStatusControl';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ASSET_COPY } from '@/constants/dashboard/asset/assetPageConstants';
import { WORK_ORDER_TYPE_LABEL } from '@/constants/dashboard/assetConstants';
import { Permission } from '@/enums/permission';
import { useCurrentUser } from '@/hooks/auth/useCurrentUser';
import { useAssetWorkOrders } from '@/hooks/dashboard/asset/useAssetRecords';

interface AssetMaintenanceTabProperties {
  plantId: string;
  assetId: string;
}

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString(undefined, { dateStyle: 'medium' })
    : ASSET_COPY.NO_DUE_DATE;

/** The asset's work orders. Raising and changing them is offered to the roles that may. */
export const AssetMaintenanceTab = ({ plantId, assetId }: AssetMaintenanceTabProperties) => {
  const { hasPermission } = useCurrentUser();
  const { data: workOrders, isPending, isError, refetch } = useAssetWorkOrders(plantId, assetId);

  const [isRaising, setIsRaising] = useState(false);

  const handleRetry = () => {
    void refetch();
  };

  if (isPending) {
    return <LoadingState />;
  }
  if (isError) {
    return <ErrorState onRetry={handleRetry} />;
  }

  return (
    <div className="flex flex-col gap-4">
      {hasPermission(Permission.WORK_ORDER_CREATE) && (
        <Button
          className="self-end"
          onClick={() => {
            setIsRaising(true);
          }}
        >
          <Plus aria-hidden="true" />
          {ASSET_COPY.RAISE_WORK_ORDER}
        </Button>
      )}
      {workOrders.length === 0 ? (
        <EmptyState
          title={ASSET_COPY.NO_WORK_ORDERS_TITLE}
          description={ASSET_COPY.NO_WORK_ORDERS_DESCRIPTION}
        />
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{ASSET_COPY.WORK_ORDER_COLUMN}</TableHead>
                  <TableHead>{ASSET_COPY.TASK_COLUMN}</TableHead>
                  <TableHead>{ASSET_COPY.TYPE_COLUMN}</TableHead>
                  <TableHead>{ASSET_COPY.RAISED_BY_COLUMN}</TableHead>
                  <TableHead>{ASSET_COPY.DUE_COLUMN}</TableHead>
                  <TableHead>{ASSET_COPY.STATUS_COLUMN}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workOrders.map((workOrder) => (
                  <TableRow key={workOrder.id}>
                    <TableCell className="font-medium tabular-nums">{workOrder.number}</TableCell>
                    <TableCell>{workOrder.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {WORK_ORDER_TYPE_LABEL[workOrder.type]}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {workOrder.createdByName ?? ASSET_COPY.IMPORTED}
                    </TableCell>
                    <TableCell className="text-muted-foreground tabular-nums">
                      {formatDate(workOrder.dueDate)}
                    </TableCell>
                    <TableCell>
                      <WorkOrderStatusControl
                        plantId={plantId}
                        assetId={assetId}
                        workOrder={workOrder}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      {isRaising && (
        <RaiseWorkOrderDialog
          plantId={plantId}
          assetId={assetId}
          onClose={() => {
            setIsRaising(false);
          }}
        />
      )}
    </div>
  );
};
