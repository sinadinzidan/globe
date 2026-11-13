import { Earth, LocateFixed, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DASHBOARD_COPY } from '@/constants/dashboard/dashboardConstants';
import { DashboardActionType } from '@/enums/dashboard/dashboardActionType';
import { MapFocus } from '@/enums/dashboard/mapFocus';
import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';

interface MapControlsProperties {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

/** Zoom and focus buttons shown over the top corner of both map views. */
export const MapControls = ({ onZoomIn, onZoomOut }: MapControlsProperties) => {
  const { dispatch } = usePlantDashboard();

  const handleFocusWorld = () => {
    dispatch({ type: DashboardActionType.SET_FOCUS, focus: MapFocus.WORLD });
  };

  const handleFocusUae = () => {
    dispatch({ type: DashboardActionType.SET_FOCUS, focus: MapFocus.UAE });
  };

  const controls = [
    { label: DASHBOARD_COPY.FOCUS_UAE, icon: LocateFixed, onClick: handleFocusUae },
    { label: DASHBOARD_COPY.FOCUS_WORLD, icon: Earth, onClick: handleFocusWorld },
    { label: DASHBOARD_COPY.ZOOM_IN, icon: Plus, onClick: onZoomIn },
    { label: DASHBOARD_COPY.ZOOM_OUT, icon: Minus, onClick: onZoomOut },
  ];

  return (
    <div
      role="group"
      aria-label={DASHBOARD_COPY.MAP_CONTROLS_LABEL}
      className="absolute top-4 right-4 flex flex-col gap-1 rounded-lg border bg-card p-1 shadow-sm"
    >
      {controls.map(({ label, icon: Icon, onClick }) => (
        <Tooltip key={label}>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={label} onClick={onClick}>
              <Icon aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">{label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};
