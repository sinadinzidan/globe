import { SectorBadge } from '@/components/dashboard/SectorBadge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DASHBOARD_COPY } from '@/constants/dashboard/dashboardConstants';
import { SECTOR_ORDER, SECTOR_PRESENTATION } from '@/constants/dashboard/plantConstants';
import { DashboardActionType } from '@/enums/dashboard/dashboardActionType';
import type { PlantSector } from '@/enums/dashboard/plantSector';
import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';
import { useVisiblePlants } from '@/hooks/dashboard/useVisiblePlants';

export const SectorFilter = () => {
  const { state, dispatch } = usePlantDashboard();
  const { allPlants } = useVisiblePlants();

  const handleSectorsChange = (sectors: string[]) => {
    dispatch({
      type: DashboardActionType.SET_ACTIVE_SECTORS,
      sectors: SECTOR_ORDER.filter((sector) => sectors.includes(sector)),
    });
  };

  const countPlants = (sector: PlantSector) =>
    allPlants.filter((plant) => plant.sector === sector).length;

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium">{DASHBOARD_COPY.SECTOR_FILTER_TITLE}</h2>
      <ToggleGroup
        type="multiple"
        variant="outline"
        size="sm"
        spacing={2}
        aria-label={DASHBOARD_COPY.SECTOR_FILTER_LABEL}
        value={state.activeSectors}
        onValueChange={handleSectorsChange}
        className="w-full flex-wrap"
      >
        {SECTOR_ORDER.map((sector) => (
          <ToggleGroupItem
            key={sector}
            value={sector}
            className="gap-2 text-muted-foreground data-[state=on]:text-foreground"
          >
            <SectorBadge sector={sector} />
            {SECTOR_PRESENTATION[sector].label}
            <span className="tabular-nums text-muted-foreground">{countPlants(sector)}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </section>
  );
};
