import { Outlet } from 'react-router';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PlantDashboardProvider } from '@/components/dashboard/PlantDashboardProvider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TOAST_DURATION_MILLISECONDS } from '@/constants/dashboard/explorerConstants';
import { useCurrentUser } from '@/hooks/auth/useCurrentUser';

/** The frame shared by every level of the journey: map, plant and asset. */
export const DashboardLayout = () => {
  const { user } = useCurrentUser();

  // The auth guard only renders this layout for a signed-in user.
  if (!user) {
    return null;
  }

  return (
    <PlantDashboardProvider key={user.id} userId={user.id}>
      <TooltipProvider>
        <div className="flex min-h-svh flex-col lg:h-svh">
          <DashboardHeader />
          <Outlet />
        </div>
        <Toaster theme="dark" position="bottom-left" duration={TOAST_DURATION_MILLISECONDS} />
      </TooltipProvider>
    </PlantDashboardProvider>
  );
};
