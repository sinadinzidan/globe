import { DashboardActionType } from '@/enums/dashboard/dashboardActionType';
import { MapFocus } from '@/enums/dashboard/mapFocus';
import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';
import { DASHBOARD_COPY } from '@/constants/dashboard/dashboardConstants';

interface GlobeBeaconProperties {
  plantCount: number;
}

/** Marks the UAE while the globe is too far out to tell the plants apart. */
export const GlobeBeacon = ({ plantCount }: GlobeBeaconProperties) => {
  const { dispatch } = usePlantDashboard();

  const handleFocus = () => {
    dispatch({ type: DashboardActionType.SET_FOCUS, focus: MapFocus.UAE });
  };

  return (
    <button
      type="button"
      aria-label={DASHBOARD_COPY.BEACON_LABEL}
      onClick={handleFocus}
      className="group relative flex size-10 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring"
    >
      <span className="absolute size-7 animate-ping rounded-full bg-foreground/40 motion-reduce:animate-none" />
      <span className="size-3 rounded-full border-2 border-background bg-foreground" />
      <span className="pointer-events-none absolute top-full left-1/2 flex -translate-x-1/2 flex-col items-center text-xs whitespace-nowrap">
        <span className="font-medium text-foreground">{DASHBOARD_COPY.COUNTRY_NAME}</span>
        <span className="text-muted-foreground">
          {plantCount} {DASHBOARD_COPY.PLANTS_UNIT}
        </span>
      </span>
    </button>
  );
};
