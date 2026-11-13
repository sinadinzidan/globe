import { PlantListItem } from '@/components/dashboard/PlantListItem';
import { EmptyState } from '@/components/shared/EmptyState';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DASHBOARD_COPY } from '@/constants/dashboard/dashboardConstants';
import { EXPLORER_COPY } from '@/constants/dashboard/explorerConstants';
import { FEATURED_OPERATOR } from '@/constants/dashboard/plantConstants';
import { useVisiblePlants } from '@/hooks/dashboard/useVisiblePlants';

interface PlantListProperties {
  searchText: string;
}

export const PlantList = ({ searchText }: PlantListProperties) => {
  const { visiblePlants } = useVisiblePlants();

  const query = searchText.trim().toLowerCase();
  const matchingPlants = visiblePlants.filter(
    (plant) =>
      plant.name.toLowerCase().includes(query) || plant.operator.toLowerCase().includes(query),
  );
  const operators = [...new Set(matchingPlants.map((plant) => plant.operator))].toSorted(
    (first, second) =>
      Number(second === FEATURED_OPERATOR) - Number(first === FEATURED_OPERATOR) ||
      first.localeCompare(second),
  );
  const groups = operators.map((operator) => ({
    operator,
    plants: matchingPlants.filter((plant) => plant.operator === operator),
  }));

  if (visiblePlants.length === 0) {
    return (
      <EmptyState
        title={DASHBOARD_COPY.NO_MATCHING_PLANTS_TITLE}
        description={DASHBOARD_COPY.NO_MATCHING_PLANTS_DESCRIPTION}
      />
    );
  }
  if (matchingPlants.length === 0) {
    return (
      <EmptyState
        title={EXPLORER_COPY.NO_SEARCH_RESULTS_TITLE}
        description={EXPLORER_COPY.NO_SEARCH_RESULTS_DESCRIPTION}
      />
    );
  }

  return (
    <section
      aria-label={DASHBOARD_COPY.PLANT_LIST_LABEL}
      className="flex flex-col lg:min-h-0 lg:flex-1"
    >
      <ScrollArea className="lg:min-h-0 lg:flex-1">
        <div className="flex flex-col gap-4 p-4">
          {groups.map((group) => (
            <div key={group.operator} className="flex flex-col gap-1">
              <h3 className="flex items-baseline justify-between px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {group.operator}
                <span className="tabular-nums">{group.plants.length}</span>
              </h3>
              <ul className="flex flex-col">
                {group.plants.map((plant) => (
                  <PlantListItem key={plant.id} plant={plant} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
};
