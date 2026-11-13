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
import { useExplorerActions, useExplorerProgress } from '@/hooks/dashboard/useExplorerProgress';

export const ResetProgressButton = () => {
  const { discoveredCount, unlockedCount } = useExplorerProgress();
  const { resetProgress } = useExplorerActions();

  const hasProgress = discoveredCount > 0 || unlockedCount > 0;

  const handleReset = () => {
    resetProgress();
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
