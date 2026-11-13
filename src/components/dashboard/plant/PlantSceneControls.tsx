import { Minus, Plus, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PLANT_COPY } from '@/constants/dashboard/plant/plantSceneConstants';

interface PlantSceneControlsProperties {
  onResetView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

/** View buttons over the top corner of the plant, matching the map controls. */
export const PlantSceneControls = ({
  onResetView,
  onZoomIn,
  onZoomOut,
}: PlantSceneControlsProperties) => {
  const controls = [
    { label: PLANT_COPY.RESET_VIEW, icon: Scan, onClick: onResetView },
    { label: PLANT_COPY.ZOOM_IN, icon: Plus, onClick: onZoomIn },
    { label: PLANT_COPY.ZOOM_OUT, icon: Minus, onClick: onZoomOut },
  ];

  return (
    <div
      role="group"
      aria-label={PLANT_COPY.CONTROLS_LABEL}
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
