import { useExplorerEffects } from '@/hooks/dashboard/useExplorerEffects';

/** Runs the exploring side effects once, inside the dashboard providers. */
export const ExplorerEffects = () => {
  useExplorerEffects();

  return null;
};
