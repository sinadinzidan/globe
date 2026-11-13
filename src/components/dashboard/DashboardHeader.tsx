import { Earth, RotateCcw } from 'lucide-react';
import { Link, useMatch, useParams } from 'react-router';
import { ExplorerStatus } from '@/components/dashboard/ExplorerStatus';
import { JourneyTrail } from '@/components/dashboard/JourneyTrail';
import { UserMenu } from '@/components/dashboard/UserMenu';
import { ViewSwitcher } from '@/components/dashboard/ViewSwitcher';
import { Button } from '@/components/ui/button';
import { DASHBOARD_COPY } from '@/constants/dashboard/dashboardConstants';
import { DEFAULT_SIGNED_IN_PATH, ROUTE_PATH } from '@/constants/routeConstants';
import { DashboardActionType } from '@/enums/dashboard/dashboardActionType';
import { RoutePath } from '@/enums/routePath';
import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';

export const DashboardHeader = () => {
  const { dispatch } = usePlantDashboard();
  const isOnFlatMap = useMatch(ROUTE_PATH[RoutePath.FLAT_MAP]);
  const isOnGlobe = useMatch(ROUTE_PATH[RoutePath.GLOBE]);
  const { plantId } = useParams();

  const isExploring = Boolean(isOnFlatMap ?? isOnGlobe);

  const handleReplay = () => {
    dispatch({ type: DashboardActionType.REPLAY_INTRODUCTION });
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b bg-card/40 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          to={DEFAULT_SIGNED_IN_PATH}
          aria-label={DASHBOARD_COPY.JOURNEY_MAP}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Earth aria-hidden="true" className="size-5" />
        </Link>
        <div className="flex min-w-0 flex-col">
          <h1 className="text-base leading-tight font-semibold">{DASHBOARD_COPY.TITLE}</h1>
          {plantId ? (
            <JourneyTrail />
          ) : (
            <p className="text-sm text-muted-foreground">{DASHBOARD_COPY.SUBTITLE}</p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ExplorerStatus />
        {isExploring && (
          <>
            <ViewSwitcher />
            <Button variant="outline" size="sm" onClick={handleReplay}>
              <RotateCcw aria-hidden="true" />
              {DASHBOARD_COPY.REPLAY_INTRODUCTION}
            </Button>
          </>
        )}
        <UserMenu />
      </div>
    </header>
  );
};
