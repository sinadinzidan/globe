import { Outlet } from 'react-router';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PlantDashboardProvider } from '@/components/dashboard/PlantDashboardProvider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TOAST_DURATION_MILLISECONDS } from '@/constants/dashboard/explorerConstants';

/** The frame shared by every level of the journey: map, plant and asset. */
export const DashboardLayout = () => (
  <PlantDashboardProvider>
    <TooltipProvider>
      <div className="flex min-h-svh flex-col lg:h-svh">
        <DashboardHeader />
        <Outlet />
      </div>
      <Toaster theme="dark" position="bottom-left" duration={TOAST_DURATION_MILLISECONDS} />
    </TooltipProvider>
  </PlantDashboardProvider>
);
