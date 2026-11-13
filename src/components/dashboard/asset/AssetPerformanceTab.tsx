import { TrendChart } from '@/components/dashboard/asset/TrendChart';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ASSET_COPY } from '@/constants/dashboard/asset/assetPageConstants';
import { useAssetTrends } from '@/hooks/dashboard/asset/useAssetRecords';

interface AssetPerformanceTabProperties {
  plantId: string;
  assetId: string;
}

export const AssetPerformanceTab = ({ plantId, assetId }: AssetPerformanceTabProperties) => {
  const { data: trends, isPending, isError, refetch } = useAssetTrends(plantId, assetId);

  const handleRetry = () => {
    void refetch();
  };

  if (isPending) {
    return <LoadingState />;
  }
  if (isError) {
    return <ErrorState onRetry={handleRetry} />;
  }
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
