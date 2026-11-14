import { SectorBadge } from '@/components/dashboard/SectorBadge';
import { Progress } from '@/components/ui/progress';
import {
  COMMAND_CENTER_COPY,
  STREAM_DESCRIPTION,
} from '@/constants/dashboard/commandCenterConstants';
import { PERCENT } from '@/constants/dashboard/explorerConstants';
import { SECTOR_ORDER, SECTOR_PRESENTATION } from '@/constants/dashboard/plantConstants';
import { DashboardActionType } from '@/enums/dashboard/dashboardActionType';
import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';
import { cn } from '@/lib/utils';
import type { StreamSummary } from '@/types/dashboard/operationTypes';

interface StreamCardProperties {
  stream: StreamSummary;
  hasWorkOrderCounts: boolean;
}

/** One stream of the value chain. Selecting it shows only that stream's sites on the map. */
export const StreamCard = ({ stream, hasWorkOrderCounts }: StreamCardProperties) => {
  const { state, dispatch } = usePlantDashboard();

  const isIsolated = state.activeSectors.length === 1 && state.activeSectors[0] === stream.sector;
  const hasAssets = stream.assetCount > 0;
  const runningPercent = hasAssets
    ? Math.round((stream.runningAssetCount / stream.assetCount) * PERCENT)
    : 0;
  const figures = [
    {
      label: COMMAND_CENTER_COPY.SITES,
      value: stream.plantCount,
      note: `${String(stream.operatingPlantCount)} ${COMMAND_CENTER_COPY.OPERATING}`,
    },
    {
      label: COMMAND_CENTER_COPY.ASSETS,
      value: stream.assetCount,
      note: `${String(stream.runningAssetCount)} ${COMMAND_CENTER_COPY.RUNNING}`,
    },
    { label: COMMAND_CENTER_COPY.MAINTENANCE, value: stream.maintenanceAssetCount },
    ...(hasWorkOrderCounts
      ? [{ label: COMMAND_CENTER_COPY.WORK_ORDERS, value: stream.openWorkOrderCount }]
      : []),
  ];

  const handleToggle = () => {
    dispatch({
      type: DashboardActionType.SET_ACTIVE_SECTORS,
      sectors: isIsolated ? SECTOR_ORDER : [stream.sector],
    });
  };

  return (
    <li>
      <button
        type="button"
        aria-pressed={isIsolated}
        onClick={handleToggle}
        className={cn(
          'flex w-full flex-col gap-3 rounded-xl border bg-card/60 p-3 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50',
          isIsolated && 'bg-muted ring-1 ring-primary/50',
        )}
      >
        <span className="flex items-center gap-3">
          <SectorBadge sector={stream.sector} />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="text-sm font-semibold">
              {SECTOR_PRESENTATION[stream.sector].label}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {STREAM_DESCRIPTION[stream.sector]}
            </span>
          </span>
          <span className="shrink-0 text-sm font-semibold tabular-nums">
            {hasAssets ? `${String(runningPercent)}%` : '–'}
          </span>
        </span>
        <Progress aria-label={COMMAND_CENTER_COPY.AVAILABILITY_LABEL} value={runningPercent} />
        <span className="grid grid-cols-2 gap-x-4 gap-y-2">
          {figures.map((figure) => (
            <span key={figure.label} className="flex flex-col">
              <span className="text-xs text-muted-foreground">{figure.label}</span>
              <span className="flex items-baseline gap-2">
                <span className="text-base font-semibold tabular-nums">{figure.value}</span>
                {figure.note && (
                  <span className="truncate text-xs text-muted-foreground tabular-nums">
                    {figure.note}
                  </span>
                )}
              </span>
            </span>
          ))}
        </span>
      </button>
    </li>
  );
};
