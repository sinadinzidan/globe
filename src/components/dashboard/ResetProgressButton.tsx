import { RotateCcw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { EXPLORER_COPY } from '@/constants/dashboard/explorerConstants';
import { DashboardActionType } from '@/enums/dashboard/dashboardActionType';
import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';

export const ResetProgressButton = () => {
  const { state, dispatch } = usePlantDashboard();

  const hasProgress = state.discoveredPlantIds.length > 0 || state.hasOpenedGlobe;

  const handleReset = () => {
    dispatch({ type: DashboardActionType.RESET_PROGRESS });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" disabled={!hasProgress} className="self-start">
          <RotateCcw aria-hidden="true" />
          {EXPLORER_COPY.RESET}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{EXPLORER_COPY.RESET_TITLE}</AlertDialogTitle>
          <AlertDialogDescription>{EXPLORER_COPY.RESET_DESCRIPTION}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{EXPLORER_COPY.RESET_CANCEL}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleReset}>
            {EXPLORER_COPY.RESET_CONFIRM}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
