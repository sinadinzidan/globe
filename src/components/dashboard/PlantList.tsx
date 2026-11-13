import { PlantListItem } from '@/components/dashboard/PlantListItem';
import { EmptyState } from '@/components/shared/EmptyState';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DASHBOARD_COPY } from '@/constants/dashboard/dashboardConstants';
import { EMIRATE_LABEL, EMIRATE_ORDER } from '@/constants/dashboard/plantConstants';
import { useVisiblePlants } from '@/hooks/dashboard/useVisiblePlants';

export const PlantList = () => {
  const { visiblePlants } = useVisiblePlants();

  const groups = EMIRATE_ORDER.map((emirate) => ({
    emirate,
    plants: visiblePlants.filter((plant) => plant.emirate === emirate),
  })).filter((group) => group.plants.length > 0);

  if (visiblePlants.length === 0) {
    return (
      <EmptyState
        title={DASHBOARD_COPY.NO_MATCHING_PLANTS_TITLE}
        description={DASHBOARD_COPY.NO_MATCHING_PLANTS_DESCRIPTION}
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
            <div key={group.emirate} className="flex flex-col gap-1">
              <h2 className="flex items-baseline justify-between px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {EMIRATE_LABEL[group.emirate]}
                <span className="tabular-nums">{group.plants.length}</span>
              </h2>
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
