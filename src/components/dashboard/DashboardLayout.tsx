import { Outlet } from 'react-router';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ExplorerEffects } from '@/components/dashboard/ExplorerEffects';
import { ExplorerPanel } from '@/components/dashboard/ExplorerPanel';
import { PlantDashboardProvider } from '@/components/dashboard/PlantDashboardProvider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TOAST_DURATION_MILLISECONDS } from '@/constants/dashboard/explorerConstants';

export const DashboardLayout = () => (
  <PlantDashboardProvider>
    <TooltipProvider>
      <ExplorerEffects />
      <div className="flex min-h-svh flex-col lg:h-svh">
        <DashboardHeader />
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <main className="relative h-[70svh] min-w-0 lg:h-auto lg:flex-1">
            <Outlet />
          </main>
          <ExplorerPanel />
        </div>
      </div>
      <Toaster theme="dark" position="bottom-left" duration={TOAST_DURATION_MILLISECONDS} />
    </TooltipProvider>
  </PlantDashboardProvider>
);
