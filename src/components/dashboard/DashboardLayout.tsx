import { Outlet } from 'react-router';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PlantDashboardProvider } from '@/components/dashboard/PlantDashboardProvider';
import { PlantSidebar } from '@/components/dashboard/PlantSidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

export const DashboardLayout = () => (
  <PlantDashboardProvider>
    <TooltipProvider>
      <div className="flex min-h-svh flex-col lg:h-svh">
        <DashboardHeader />
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <main className="relative h-[70svh] min-w-0 lg:h-auto lg:flex-1">
            <Outlet />
          </main>
          <PlantSidebar />
        </div>
      </div>
    </TooltipProvider>
  </PlantDashboardProvider>
);
