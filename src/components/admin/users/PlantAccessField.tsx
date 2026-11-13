import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ADMIN_COPY } from '@/constants/admin/adminConstants';
import { usePlants } from '@/hooks/dashboard/usePlants';

interface PlantAccessFieldProperties {
  selectedPlantIds: string[];
  /** Roles that reach every plant have nothing to assign. */
  hasAllPlantAccess: boolean;
  onChange: (plantIds: string[]) => void;
}

const FIELD_ID_PREFIX = 'plant-access-';

/** The plants a user is assigned to, as a list of tick boxes. */
export const PlantAccessField = ({
  selectedPlantIds,
  hasAllPlantAccess,
  onChange,
}: PlantAccessFieldProperties) => {
  const { data: plants, isPending, isError, refetch } = usePlants();

  const handleRetry = () => {
    void refetch();
  };

  const handleToggle = (plantId: string, isChecked: boolean) => {
    onChange(
      isChecked
        ? [...selectedPlantIds, plantId]
        : selectedPlantIds.filter((selected) => selected !== plantId),
    );
  };

  return (
    <fieldset className="flex min-w-0 flex-col gap-2">
      <legend className="text-sm font-medium">{ADMIN_COPY.PLANTS_LABEL}</legend>
      <p className="text-xs text-muted-foreground">
        {hasAllPlantAccess ? ADMIN_COPY.PLANTS_HINT_ALL : ADMIN_COPY.PLANTS_HINT_SCOPED}
      </p>
      {isPending && <LoadingState />}
      {!isPending && isError && <ErrorState onRetry={handleRetry} />}
      {plants && !hasAllPlantAccess && (
        <ul className="grid gap-2 rounded-lg border p-3 sm:grid-cols-2">
          {plants.map((plant) => (
            <li key={plant.id} className="flex items-center gap-2">
              <Checkbox
                id={`${FIELD_ID_PREFIX}${plant.id}`}
                checked={selectedPlantIds.includes(plant.id)}
                onCheckedChange={(checkedState) => {
                  handleToggle(plant.id, checkedState === true);
                }}
              />
              <Label htmlFor={`${FIELD_ID_PREFIX}${plant.id}`} className="font-normal">
                {plant.name}
              </Label>
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  );
};
