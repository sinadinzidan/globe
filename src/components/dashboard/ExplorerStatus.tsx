import { Link } from 'react-router';
import { Progress } from '@/components/ui/progress';
import { EXPLORER_COPY, RANK_PRESENTATION } from '@/constants/dashboard/explorerConstants';
import { ROUTE_PATH } from '@/constants/routeConstants';
import { RoutePath } from '@/enums/routePath';
import { useExplorerProgress } from '@/hooks/dashboard/useExplorerProgress';

/** A compact rank and achievements readout for the header. Leads to the explorer profile. */
export const ExplorerStatus = () => {
  const progress = useExplorerProgress();

  const { icon: RankIcon, label } = RANK_PRESENTATION[progress.rank];

  if (!progress.isReady) {
    return null;
  }

  return (
    <Link
      to={ROUTE_PATH[RoutePath.EXPLORER]}
      aria-label={EXPLORER_COPY.PROFILE_LINK_LABEL}
      className="hidden items-center gap-3 rounded-lg border bg-card/60 py-1.5 pr-3 pl-1.5 outline-none transition-colors hover:border-primary/60 focus-visible:ring-3 focus-visible:ring-ring/50 md:flex"
    >
      <span className="flex size-8 items-center justify-center rounded-md bg-primary/15 text-primary">
        <RankIcon aria-hidden="true" className="size-4" />
      </span>
      <span className="flex w-52 flex-col gap-1">
        <span className="flex items-baseline justify-between gap-2 text-xs">
          <span className="truncate font-medium">{label}</span>
          <span className="shrink-0 text-muted-foreground tabular-nums">
            {progress.unlockedCount}/{progress.achievements.length}{' '}
            {EXPLORER_COPY.ACHIEVEMENTS_UNIT}
          </span>
        </span>
        <Progress
          aria-label={EXPLORER_COPY.RANK_PROGRESS_LABEL}
          value={progress.rankProgressPercent}
          className="h-1"
        />
      </span>
    </Link>
  );
};
