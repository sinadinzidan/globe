import { AchievementItem } from '@/components/dashboard/AchievementItem';
import { Leaderboard } from '@/components/dashboard/explorer/Leaderboard';
import { ExplorerSummary } from '@/components/dashboard/ExplorerSummary';
import { ResetProgressButton } from '@/components/dashboard/ResetProgressButton';
import { PageHeading } from '@/components/shared/PageHeading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EXPLORER_COPY } from '@/constants/dashboard/explorerConstants';
import { useExplorerProgress } from '@/hooks/dashboard/useExplorerProgress';

/** The explorer's own page: standing, achievements and the leaderboard. */
export const ExplorerProfile = () => {
  const { achievements, unlockedCount } = useExplorerProgress();

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4 *:shrink-0 md:p-6">
      <PageHeading
        title={EXPLORER_COPY.PROFILE_TITLE}
        description={EXPLORER_COPY.PROFILE_DESCRIPTION}
        action={<ResetProgressButton />}
      />
      <div className="grid items-start gap-4 xl:grid-cols-3">
        <div className="flex flex-col gap-4 xl:col-span-2">
          <Card className="py-0">
            <ExplorerSummary />
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className="flex items-baseline justify-between gap-2">
                  {EXPLORER_COPY.ACHIEVEMENTS_TITLE}
                  <span className="text-sm font-normal text-muted-foreground tabular-nums">
                    {unlockedCount}/{achievements.length}
                  </span>
                </h3>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 md:grid-cols-2">
                {achievements.map((achievement) => (
                  <AchievementItem key={achievement.id} achievement={achievement} />
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <Leaderboard />
      </div>
    </main>
  );
};
