import { TREND_CHART } from '@/constants/dashboard/asset/assetPageConstants';

export interface ChartPoint {
  horizontal: number;
  vertical: number;
  value: number;
}

/** Lays a series out inside a chart of the given width, and summarises it. */
export const layOutTrend = (values: number[], width: number) => {
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const average = values.reduce((total, value) => total + value, 0) / Math.max(values.length, 1);
  const margin = (maximum - minimum || 1) * TREND_CHART.RANGE_MARGIN;
  const floor = minimum - margin;
  const ceiling = maximum + margin;
  const left = TREND_CHART.PADDING_LEFT;
  const right = Math.max(width - TREND_CHART.PADDING_RIGHT, left + 1);
  const top = TREND_CHART.PADDING_TOP;
  const bottom = TREND_CHART.HEIGHT - TREND_CHART.PADDING_BOTTOM;
  const step = (right - left) / Math.max(values.length - 1, 1);

  const toVertical = (value: number) =>
    bottom - ((value - floor) / (ceiling - floor)) * (bottom - top);
  const points: ChartPoint[] = values.map((value, index) => ({
    horizontal: left + index * step,
    vertical: toVertical(value),
    value,
  }));
  const line = points
    .map((point) => `${String(point.horizontal)},${String(point.vertical)}`)
    .join(' ');
  const gridValues = Array.from(
    { length: TREND_CHART.GRID_LINES },
    (_unused, index) =>
      minimum + ((maximum - minimum) * index) / Math.max(TREND_CHART.GRID_LINES - 1, 1),
  );

  return {
    points,
    line,
    area: `${String(left)},${String(bottom)} ${line} ${String(right)},${String(bottom)}`,
    gridLines: gridValues.map((value) => ({ value, vertical: toVertical(value) })),
    frame: { left, right, top, bottom, step },
    summary: { minimum, maximum, average, latest: values.at(-1) ?? 0 },
  };
};

/** Formats a reading with no more decimals than it needs. */
export const formatReading = (value: number) =>
  value.toLocaleString(undefined, { maximumFractionDigits: TREND_CHART.FRACTION_DIGITS });
