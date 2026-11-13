import type { KeyboardEvent } from 'react';
import { DASHBOARD_COPY } from '@/constants/dashboard/dashboardConstants';
import { ACTIVATION_KEYS, MARKER } from '@/constants/dashboard/mapConstants';
import { DashboardActionType } from '@/enums/dashboard/dashboardActionType';
import { MapFocus } from '@/enums/dashboard/mapFocus';
import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';

interface FlatMapBeaconProperties {
  transform: string;
  plantCount: number;
}

const LABEL_CLASS_NAME =
  'pointer-events-none stroke-background stroke-3 [paint-order:stroke] text-xs';

/** Marks the UAE on the world view, where individual plants would sit on top of each other. */
export const FlatMapBeacon = ({ transform, plantCount }: FlatMapBeaconProperties) => {
  const { dispatch } = usePlantDashboard();

  const handleFocus = () => {
    dispatch({ type: DashboardActionType.SET_FOCUS, focus: MapFocus.UAE });
  };

  const handleKeyDown = (keyboardEvent: KeyboardEvent<SVGGElement>) => {
    if (ACTIVATION_KEYS.includes(keyboardEvent.key)) {
      keyboardEvent.preventDefault();
      handleFocus();
    }
  };

  return (
    <g transform={transform}>
      <g
        role="button"
        tabIndex={0}
        aria-label={DASHBOARD_COPY.BEACON_LABEL}
        onClick={handleFocus}
        onKeyDown={handleKeyDown}
        className="group cursor-pointer outline-none"
      >
        <circle
          r={MARKER.HIT_RADIUS}
          className="fill-transparent stroke-ring stroke-0 group-focus-visible:stroke-2"
        />
        <circle
          r={MARKER.BEACON_PULSE_RADIUS}
          className="origin-center animate-ping fill-foreground/40 [transform-box:fill-box] motion-reduce:animate-none"
        />
        <circle r={MARKER.BEACON_RADIUS} className="fill-foreground stroke-background stroke-2" />
        <text
          y={MARKER.BEACON_LABEL_OFFSET}
          textAnchor="middle"
          className={`${LABEL_CLASS_NAME} fill-foreground font-medium`}
        >
          {DASHBOARD_COPY.COUNTRY_NAME}
        </text>
        <text
          y={MARKER.BEACON_COUNT_OFFSET}
          textAnchor="middle"
          className={`${LABEL_CLASS_NAME} fill-muted-foreground`}
        >
          {plantCount} {DASHBOARD_COPY.PLANTS_UNIT}
        </text>
      </g>
    </g>
  );
};
