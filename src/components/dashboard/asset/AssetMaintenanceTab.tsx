import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
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
import {
  WORK_ORDER_STATUS_PRESENTATION,
  WORK_ORDER_TYPE_LABEL,
} from '@/constants/dashboard/assetConstants';
import { describeDayOffset } from '@/lib/dashboard/relativeDays';
import type { WorkOrder } from '@/types/dashboard/assetTypes';

interface AssetMaintenanceTabProperties {
  workOrders: WorkOrder[];
}

export const AssetMaintenanceTab = ({ workOrders }: AssetMaintenanceTabProperties) => {
  if (workOrders.length === 0) {
    return (
      <EmptyState
        title={ASSET_COPY.NO_WORK_ORDERS_TITLE}
        description={ASSET_COPY.NO_WORK_ORDERS_DESCRIPTION}
      />
    );
  }

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{ASSET_COPY.WORK_ORDER_COLUMN}</TableHead>
              <TableHead>{ASSET_COPY.TASK_COLUMN}</TableHead>
              <TableHead>{ASSET_COPY.TYPE_COLUMN}</TableHead>
              <TableHead>{ASSET_COPY.STATUS_COLUMN}</TableHead>
              <TableHead className="text-right">{ASSET_COPY.WHEN_COLUMN}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workOrders.map((workOrder) => (
              <TableRow key={workOrder.id}>
                <TableCell className="font-medium tabular-nums">{workOrder.id}</TableCell>
                <TableCell>{workOrder.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {WORK_ORDER_TYPE_LABEL[workOrder.type]}
                </TableCell>
                <TableCell>
                  <StatusBadge {...WORK_ORDER_STATUS_PRESENTATION[workOrder.status]} />
                </TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">
                  {describeDayOffset(workOrder.dayOffset)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
