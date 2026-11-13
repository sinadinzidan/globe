import { Navigation, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { EXPLORER_COPY, TOUR_DWELL_MILLISECONDS } from '@/constants/dashboard/explorerConstants';
import { DashboardActionType } from '@/enums/dashboard/dashboardActionType';
import { useNextPlant } from '@/hooks/dashboard/useNextPlant';
import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';

/** The main action of the dashboard: go to the next plant, or let the tour do it. */
export const MissionBar = () => {
  const { state, dispatch } = usePlantDashboard();
  const { nextPlant, isNextPlantNew } = useNextPlant();

  const hasStarted = state.discoveredPlantIds.length > 0;
  const newPlantLabel = hasStarted ? EXPLORER_COPY.EXPLORE_NEXT : EXPLORER_COPY.START_EXPLORING;
  const actionLabel = isNextPlantNew ? newPlantLabel : EXPLORER_COPY.NEXT_PLANT;
  const tourLabel = state.isTouring ? EXPLORER_COPY.STOP_TOUR : EXPLORER_COPY.START_TOUR;

  const handleExplore = () => {
    if (nextPlant) {
      dispatch({ type: DashboardActionType.SELECT_PLANT, plantId: nextPlant.id });
    }
  };

  const handleToggleTour = () => {
    dispatch({ type: DashboardActionType.SET_TOURING, isTouring: !state.isTouring });
  };

  if (!nextPlant) {
    return null;
  }

  return (
    <div
      role="group"
      aria-label={EXPLORER_COPY.MISSION_LABEL}
      className="absolute inset-x-4 bottom-4 mx-auto flex w-fit max-w-full items-center gap-2 overflow-hidden hud-panel p-2"
    >
      <Button size="lg" onClick={handleExplore} className="h-auto min-w-0 gap-3 py-1.5">
        <Navigation aria-hidden="true" />
        <span className="flex min-w-0 flex-col items-start">
          <span className="text-xs font-normal opacity-80">{actionLabel}</span>
          <span className="max-w-56 truncate">{nextPlant.name}</span>
        </span>
        <kbd className="hidden rounded-sm border border-primary-foreground/30 px-1.5 text-xs font-normal sm:inline">
          {EXPLORER_COPY.SHORTCUT_NEXT}
        </kbd>
      </Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={state.isTouring ? 'secondary' : 'outline'}
            size="icon-lg"
            aria-label={tourLabel}
            aria-pressed={state.isTouring}
            onClick={handleToggleTour}
          >
            {state.isTouring ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tourLabel}</TooltipContent>
      </Tooltip>
      {state.isTouring && state.selectedPlantId && (
        <span
          key={state.selectedPlantId}
          aria-hidden="true"
          style={{ animationDuration: `${String(TOUR_DWELL_MILLISECONDS)}ms` }}
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left animate-tour-progress bg-primary motion-reduce:animate-none"
        />
      )}
    </div>
  );
};
