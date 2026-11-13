import { Progress } from '@/components/ui/progress';
import { EXPLORER_COPY, RANKS } from '@/constants/dashboard/explorerConstants';
import { useExplorerProgress } from '@/hooks/dashboard/useExplorerProgress';

/** A compact rank and experience readout for the header. */
export const ExplorerStatus = () => {
  const progress = useExplorerProgress();

  const definition = RANKS.find((candidate) => candidate.rank === progress.rank);

  if (!progress.isReady || !definition) {
    return null;
  }

  const RankIcon = definition.icon;

  return (
    <div className="hidden items-center gap-3 rounded-lg border bg-card/60 py-1.5 pr-3 pl-1.5 md:flex">
      <span className="flex size-8 items-center justify-center rounded-md bg-primary/15 text-primary">
        <RankIcon aria-hidden="true" className="size-4" />
      </span>
      <div className="flex w-52 flex-col gap-1">
        <p className="flex items-baseline justify-between gap-2 text-xs">
          <span className="truncate font-medium">
            {EXPLORER_COPY.LEVEL} {progress.level} · {definition.label}
          </span>
          <span className="shrink-0 text-muted-foreground tabular-nums">
            {progress.experience} {EXPLORER_COPY.EXPERIENCE_UNIT}
          </span>
        </p>
        <Progress
          aria-label={EXPLORER_COPY.RANK_PROGRESS_LABEL}
          value={progress.rankProgressPercent}
          className="h-1"
        />
      </div>
    </div>
  );
};
