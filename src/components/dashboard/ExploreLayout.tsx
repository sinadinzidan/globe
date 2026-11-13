import { Outlet } from 'react-router';
import { ExplorerEffects } from '@/components/dashboard/ExplorerEffects';
import { ExplorerPanel } from '@/components/dashboard/ExplorerPanel';

/** The map level of the journey: a map view with the explorer panel beside it. */
export const ExploreLayout = () => (
  <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
    <ExplorerEffects />
    <main className="relative h-[70svh] min-w-0 lg:h-auto lg:flex-1">
      <Outlet />
    </main>
    <ExplorerPanel />
  </div>
);
