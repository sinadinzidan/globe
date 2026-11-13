import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ASSET_COPY } from '@/constants/dashboard/asset/assetPageConstants';
import { INSPECTION_RESULT_PRESENTATION } from '@/constants/dashboard/assetConstants';
import { describeDayOffset } from '@/lib/dashboard/relativeDays';
import type { Inspection } from '@/types/dashboard/assetTypes';

interface AssetInspectionsTabProperties {
  inspections: Inspection[];
}

const describeNextDue = (nextDueInDays: number) =>
  nextDueInDays < 0
    ? `${ASSET_COPY.OVERDUE_BY} ${String(-nextDueInDays)} ${ASSET_COPY.DAYS}`
    : `${ASSET_COPY.NEXT_DUE} ${describeDayOffset(nextDueInDays).toLowerCase()}`;

export const AssetInspectionsTab = ({ inspections }: AssetInspectionsTabProperties) => {
  if (inspections.length === 0) {
    return (
      <EmptyState
        title={ASSET_COPY.NO_INSPECTIONS_TITLE}
        description={ASSET_COPY.NO_INSPECTIONS_DESCRIPTION}
      />
    );
  }

  return (
    <ol className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {inspections.map((inspection) => (
        <li key={inspection.id}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                <h3>{inspection.title}</h3>
              </CardTitle>
              <CardDescription className="tabular-nums">
                {inspection.id} · {ASSET_COPY.INSPECTED} {describeDayOffset(-inspection.daysAgo)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div>
                <StatusBadge {...INSPECTION_RESULT_PRESENTATION[inspection.result]} />
              </div>
              <p className="text-sm text-muted-foreground">{inspection.finding}</p>
              <p className="text-sm tabular-nums">{describeNextDue(inspection.nextDueInDays)}</p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ol>
  );
};
