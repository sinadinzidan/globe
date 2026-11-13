import { Play } from 'lucide-react';
import { ViewSwitcher } from '@/components/dashboard/ViewSwitcher';
import { Button } from '@/components/ui/button';
import { DASHBOARD_COPY } from '@/constants/dashboard/dashboardConstants';
import { DashboardActionType } from '@/enums/dashboard/dashboardActionType';
import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';

export const DashboardHeader = () => {
  const { dispatch } = usePlantDashboard();

  const handleReplay = () => {
    dispatch({ type: DashboardActionType.REPLAY_INTRODUCTION });
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b px-4 py-3">
      <div className="flex min-w-0 flex-col">
        <h1 className="text-base font-semibold">{DASHBOARD_COPY.TITLE}</h1>
        <p className="text-sm text-muted-foreground">{DASHBOARD_COPY.SUBTITLE}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ViewSwitcher />
        <Button variant="outline" size="sm" onClick={handleReplay}>
          <Play aria-hidden="true" />
          {DASHBOARD_COPY.REPLAY_INTRODUCTION}
        </Button>
      </div>
    </header>
  );
};
