import { X } from 'lucide-react';
import { SectorBadge } from '@/components/dashboard/SectorBadge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DASHBOARD_COPY } from '@/constants/dashboard/dashboardConstants';
import {
  COORDINATE_FRACTION_DIGITS,
  EMIRATE_LABEL,
  SECTOR_PRESENTATION,
} from '@/constants/dashboard/plantConstants';
import { DashboardActionType } from '@/enums/dashboard/dashboardActionType';
import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';
import { useVisiblePlants } from '@/hooks/dashboard/useVisiblePlants';

/** Details of the selected plant, shown over the bottom corner of the map. */
export const PlantDetails = () => {
  const { dispatch } = usePlantDashboard();
  const { selectedPlant } = useVisiblePlants();

  const handleClose = () => {
    dispatch({ type: DashboardActionType.CLEAR_SELECTION });
  };

  if (!selectedPlant) {
    return null;
  }

  const location = `${selectedPlant.latitude.toFixed(COORDINATE_FRACTION_DIGITS)}${DASHBOARD_COPY.LATITUDE_SUFFIX}, ${selectedPlant.longitude.toFixed(COORDINATE_FRACTION_DIGITS)}${DASHBOARD_COPY.LONGITUDE_SUFFIX}`;
  const details = [
    { label: DASHBOARD_COPY.DETAIL_OPERATOR, value: selectedPlant.operator },
    { label: DASHBOARD_COPY.DETAIL_EMIRATE, value: EMIRATE_LABEL[selectedPlant.emirate] },
    { label: DASHBOARD_COPY.DETAIL_LOCATION, value: location },
  ];

  return (
    <Card
      size="sm"
      className="absolute inset-x-4 bottom-4 animate-in fade-in slide-in-from-bottom-2 sm:right-auto sm:w-96"
    >
      <CardHeader>
        <CardTitle>{selectedPlant.name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <SectorBadge sector={selectedPlant.sector} />
          {SECTOR_PRESENTATION[selectedPlant.sector].label}
        </CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={DASHBOARD_COPY.DETAIL_CLOSE}
            onClick={handleClose}
          >
            <X aria-hidden="true" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">{selectedPlant.description}</p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          {details.map((detail) => (
            <div key={detail.label} className="contents">
              <dt className="text-muted-foreground">{detail.label}</dt>
              <dd>{detail.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
};
