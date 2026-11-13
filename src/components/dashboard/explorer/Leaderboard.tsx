import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EXPLORER_COPY } from '@/constants/dashboard/explorerConstants';
import { useLeaderboard } from '@/hooks/dashboard/useExplorerProgress';
import { cn } from '@/lib/utils';

/** The explorers with the most achievements. Only names and standing are shown. */
export const Leaderboard = () => {
  const { data: entries, isPending, isError, refetch } = useLeaderboard();

  const handleRetry = () => {
    void refetch();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h3>{EXPLORER_COPY.LEADERBOARD_TITLE}</h3>
        </CardTitle>
        <CardDescription>{EXPLORER_COPY.LEADERBOARD_DESCRIPTION}</CardDescription>
      </CardHeader>
      <CardContent>
        {isPending && <LoadingState />}
        {!isPending && isError && <ErrorState onRetry={handleRetry} />}
        {entries?.length === 0 && (
          <EmptyState
            title={EXPLORER_COPY.LEADERBOARD_EMPTY_TITLE}
            description={EXPLORER_COPY.LEADERBOARD_EMPTY_DESCRIPTION}
          />
        )}
        {entries && entries.length > 0 && (
          <ol className="flex flex-col gap-1">
            {entries.map((entry) => (
              <li
                key={entry.position}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-2 py-2',
                  entry.isCurrentUser && 'bg-primary/10 ring-1 ring-primary/40',
                )}
              >
                <span className="w-6 text-center text-sm font-semibold text-muted-foreground tabular-nums">
                  {entry.position}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex items-center gap-2 truncate text-sm font-medium">
                    {entry.fullName}
                    {entry.isCurrentUser && <Badge variant="secondary">{EXPLORER_COPY.YOU}</Badge>}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold tabular-nums">
                  {entry.unlockedCount} {EXPLORER_COPY.ACHIEVEMENTS_UNIT}
                </span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
};
