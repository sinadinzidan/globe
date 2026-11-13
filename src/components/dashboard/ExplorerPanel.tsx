import { AchievementList } from '@/components/dashboard/AchievementList';
import { ExplorerSummary } from '@/components/dashboard/ExplorerSummary';
import { PlantBrowser } from '@/components/dashboard/PlantBrowser';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DASHBOARD_COPY } from '@/constants/dashboard/dashboardConstants';
import { EXPLORER_COPY } from '@/constants/dashboard/explorerConstants';
import { ExplorerTab } from '@/enums/dashboard/explorerTab';
import { useExplorerProgress } from '@/hooks/dashboard/useExplorerProgress';
import { useVisiblePlants } from '@/hooks/dashboard/useVisiblePlants';

const TAB_CONTENT_CLASS_NAME = 'flex-col data-[state=active]:flex lg:min-h-0 lg:flex-1';

export const ExplorerPanel = () => {
  const { isPending, isError, refetch, allPlants } = useVisiblePlants();
  const { achievements, unlockedCount } = useExplorerProgress();

  const handleRetry = () => {
    void refetch();
  };

  return (
    <aside
      aria-label={EXPLORER_COPY.PANEL_LABEL}
      className="flex min-h-0 flex-col border-t bg-card/40 lg:w-96 lg:border-t-0 lg:border-l"
    >
      {isPending && <LoadingState message={DASHBOARD_COPY.LOADING_PLANTS} />}
      {!isPending && isError && <ErrorState onRetry={handleRetry} />}
      {!isPending && !isError && allPlants.length === 0 && (
        <EmptyState
          title={DASHBOARD_COPY.NO_PLANTS_TITLE}
          description={DASHBOARD_COPY.NO_PLANTS_DESCRIPTION}
        />
      )}
      {!isPending && !isError && allPlants.length > 0 && (
        <>
          <ExplorerSummary />
          <Tabs defaultValue={ExplorerTab.PLANTS} className="gap-0 lg:min-h-0 lg:flex-1">
            <div className="px-4 pt-4">
              <TabsList className="w-full">
                <TabsTrigger value={ExplorerTab.PLANTS}>{EXPLORER_COPY.TAB_PLANTS}</TabsTrigger>
                <TabsTrigger value={ExplorerTab.ACHIEVEMENTS}>
                  {EXPLORER_COPY.TAB_ACHIEVEMENTS}
                  <span className="text-muted-foreground tabular-nums">
                    {unlockedCount}/{achievements.length}
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value={ExplorerTab.PLANTS} className={TAB_CONTENT_CLASS_NAME}>
              <PlantBrowser />
            </TabsContent>
            <TabsContent value={ExplorerTab.ACHIEVEMENTS} className={TAB_CONTENT_CLASS_NAME}>
              <AchievementList />
            </TabsContent>
          </Tabs>
          <p className="border-t px-4 py-3 text-xs text-muted-foreground">
            {DASHBOARD_COPY.LOCATION_NOTE}
          </p>
        </>
      )}
    </aside>
  );
};
