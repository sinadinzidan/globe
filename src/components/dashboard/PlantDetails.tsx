import { ArrowRight, CircleCheck, X } from 'lucide-react';
import { Link } from 'react-router';
import { SectorBadge } from '@/components/dashboard/SectorBadge';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DASHBOARD_COPY } from '@/constants/dashboard/dashboardConstants';
import { EXPLORER_COPY } from '@/constants/dashboard/explorerConstants';
import {
  COORDINATE_FRACTION_DIGITS,
  EMIRATE_LABEL,
  PLANT_STATUS_PRESENTATION,
  SECTOR_PRESENTATION,
} from '@/constants/dashboard/plantConstants';
import { PLANT_COPY } from '@/constants/dashboard/plant/plantSceneConstants';
import { DashboardActionType } from '@/enums/dashboard/dashboardActionType';
import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';
import { useVisiblePlants } from '@/hooks/dashboard/useVisiblePlants';
import { buildPlantPath } from '@/lib/routePaths';

/** Details of the selected plant, shown over the top corner of the map. */
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
  const status = PLANT_STATUS_PRESENTATION[selectedPlant.status];
  const details = [
    { label: DASHBOARD_COPY.DETAIL_OPERATOR, value: selectedPlant.operator },
    { label: DASHBOARD_COPY.DETAIL_EMIRATE, value: EMIRATE_LABEL[selectedPlant.emirate] },
    { label: DASHBOARD_COPY.DETAIL_LOCATION, value: location },
  ];

  return (
    <Card
      size="sm"
      key={selectedPlant.id}
      className="absolute top-4 right-16 left-4 animate-in bg-card/85 backdrop-blur-md fade-in slide-in-from-top-2 sm:right-auto sm:w-96"
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
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={status.label} icon={status.icon} tone={status.tone} />
          <Badge variant="outline" className="border-primary/40 text-primary">
            <CircleCheck aria-hidden="true" />
            {EXPLORER_COPY.DISCOVERED_BADGE}
          </Badge>
        </div>
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
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={buildPlantPath(selectedPlant.id)}>
            {PLANT_COPY.ENTER_PLANT}
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
