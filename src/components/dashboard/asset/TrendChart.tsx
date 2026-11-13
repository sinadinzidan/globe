import { useState } from 'react';
import type { PointerEvent } from 'react';
import { ASSET_COPY, TREND_CHART } from '@/constants/dashboard/asset/assetPageConstants';
import { useElementSize } from '@/hooks/useElementSize';
import { formatReading, layOutTrend } from '@/lib/dashboard/trendChart';
import type { AssetTrend } from '@/types/dashboard/assetTypes';

interface TrendChartProperties {
  trend: AssetTrend;
}

/** A single-series line chart with a hover readout, and the figures behind it as text. */
export const TrendChart = ({ trend }: TrendChartProperties) => {
  const { attach, size } = useElementSize();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chart = layOutTrend(trend.values, size.width);
  const lastIndex = chart.points.length - 1;
  const activeIndex = hoveredIndex ?? lastIndex;
  const activePoint = chart.points.at(activeIndex);
  const hoursAgo = lastIndex - activeIndex;
  const summary = [
    { label: ASSET_COPY.LATEST, value: chart.summary.latest },
    { label: ASSET_COPY.MINIMUM, value: chart.summary.minimum },
    { label: ASSET_COPY.AVERAGE, value: chart.summary.average },
    { label: ASSET_COPY.MAXIMUM, value: chart.summary.maximum },
  ];
  const chartLabel = `${trend.label} ${ASSET_COPY.CHART_LABEL_JOIN} ${formatReading(chart.summary.latest)} ${trend.unit}`;

  const handlePointerMove = (pointerEvent: PointerEvent<SVGSVGElement>) => {
    const { left } = pointerEvent.currentTarget.getBoundingClientRect();
    const index = Math.round((pointerEvent.clientX - left - chart.frame.left) / chart.frame.step);
    setHoveredIndex(Math.min(Math.max(index, 0), lastIndex));
  };

  const handlePointerLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div className="flex flex-col gap-3">
      <div ref={attach}>
        {size.width > 0 && activePoint && (
          <svg
            width={size.width}
            height={TREND_CHART.HEIGHT}
            role="img"
            aria-label={chartLabel}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="block touch-pan-y"
          >
            {chart.gridLines.map((gridLine) => (
              <g key={gridLine.value}>
                <line
                  x1={chart.frame.left}
                  x2={chart.frame.right}
                  y1={gridLine.vertical}
                  y2={gridLine.vertical}
                  className="stroke-border"
                />
                <text
                  x={chart.frame.left - TREND_CHART.LABEL_OFFSET}
                  y={gridLine.vertical}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-muted-foreground text-xs tabular-nums"
                >
                  {formatReading(gridLine.value)}
                </text>
              </g>
            ))}
            <polygon points={chart.area} className="fill-chart-2/15" />
            <polyline
              points={chart.line}
              strokeLinejoin="round"
              strokeLinecap="round"
              className="fill-none stroke-chart-2 stroke-2"
            />
            <line
              x1={activePoint.horizontal}
              x2={activePoint.horizontal}
              y1={chart.frame.top}
              y2={chart.frame.bottom}
              className="stroke-muted-foreground/60"
            />
            <circle
              cx={activePoint.horizontal}
              cy={activePoint.vertical}
              r={TREND_CHART.POINT_RADIUS}
              className="fill-chart-2 stroke-card stroke-2"
            />
            <text
              x={chart.frame.left}
              y={chart.frame.bottom + TREND_CHART.AXIS_LABEL_OFFSET}
              className="fill-muted-foreground text-xs"
            >
              {lastIndex} {ASSET_COPY.HOURS_AGO}
            </text>
            <text
              x={chart.frame.right}
              y={chart.frame.bottom + TREND_CHART.AXIS_LABEL_OFFSET}
              textAnchor="end"
              className="fill-muted-foreground text-xs"
            >
              {ASSET_COPY.NOW}
            </text>
          </svg>
        )}
      </div>
      <p aria-live="polite" className="text-sm">
        <span className="font-semibold tabular-nums">
          {formatReading(activePoint?.value ?? 0)} {trend.unit}
        </span>
        <span className="ml-2 text-muted-foreground">
          {hoursAgo === 0 ? ASSET_COPY.NOW : `${String(hoursAgo)} ${ASSET_COPY.HOURS_AGO}`}
        </span>
      </p>
      <dl className="grid grid-cols-4 gap-2 border-t pt-3">
        {summary.map((item) => (
          <div key={item.label} className="flex flex-col-reverse">
            <dt className="text-xs text-muted-foreground">{item.label}</dt>
            <dd className="text-sm font-medium tabular-nums">{formatReading(item.value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
