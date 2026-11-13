import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';
import { usePlants } from '@/hooks/dashboard/usePlants';
import { computeExplorerProgress } from '@/lib/dashboard/explorerProgress';

/** The explorer's experience, rank and achievements. */
export const useExplorerProgress = () => {
  const { state } = usePlantDashboard();
  const { data: plants } = usePlants();

  return { ...computeExplorerProgress(plants ?? [], state), isReady: Boolean(plants) };
};
