import { TrendChart } from '@/components/dashboard/asset/TrendChart';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ASSET_COPY } from '@/constants/dashboard/asset/assetPageConstants';
import type { AssetTrend } from '@/types/dashboard/assetTypes';

interface AssetPerformanceTabProperties {
  trends: AssetTrend[];
}

export const AssetPerformanceTab = ({ trends }: AssetPerformanceTabProperties) => {
  if (trends.length === 0) {
    return (
      <EmptyState
        title={ASSET_COPY.NO_TRENDS_TITLE}
        description={ASSET_COPY.NO_TRENDS_DESCRIPTION}
      />
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {trends.map((trend) => (
        <Card key={trend.id}>
          <CardHeader>
            <CardTitle>
              <h3>
                {trend.label}
                <span className="ml-1 font-normal text-muted-foreground">({trend.unit})</span>
              </h3>
            </CardTitle>
            <CardDescription>{ASSET_COPY.TREND_WINDOW}</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart trend={trend} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
