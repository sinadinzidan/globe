import { DASHBOARD_COPY } from '@/constants/dashboard/dashboardConstants';
import { useVisiblePlants } from '@/hooks/dashboard/useVisiblePlants';

export const SummaryTiles = () => {
  const { visiblePlants } = useVisiblePlants();

  const tiles = [
    { label: DASHBOARD_COPY.SUMMARY_PLANTS, value: visiblePlants.length },
    {
      label: DASHBOARD_COPY.SUMMARY_EMIRATES,
      value: new Set(visiblePlants.map((plant) => plant.emirate)).size,
    },
    {
      label: DASHBOARD_COPY.SUMMARY_OPERATORS,
      value: new Set(visiblePlants.map((plant) => plant.operator)).size,
    },
    {
      label: DASHBOARD_COPY.SUMMARY_SECTORS,
      value: new Set(visiblePlants.map((plant) => plant.sector)).size,
    },
  ];

  return (
    <dl className="grid grid-cols-4 gap-2">
      {tiles.map((tile) => (
        <div key={tile.label} className="flex flex-col-reverse rounded-lg bg-muted/50 px-3 py-2">
          <dt className="text-xs text-muted-foreground">{tile.label}</dt>
          <dd className="text-xl font-semibold tabular-nums">{tile.value}</dd>
        </div>
      ))}
    </dl>
  );
};
