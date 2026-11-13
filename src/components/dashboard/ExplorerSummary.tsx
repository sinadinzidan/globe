import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { Progress } from '@/components/ui/progress';
import { EXPLORER_COPY, RANK_PRESENTATION } from '@/constants/dashboard/explorerConstants';
import { useExplorerProgress } from '@/hooks/dashboard/useExplorerProgress';

/** The explorer's standing at a glance: plants discovered, rank and progress to the next one. */
export const ExplorerSummary = () => {
  const progress = useExplorerProgress();

  const rankLabel = RANK_PRESENTATION[progress.rank].label;
  const nextRankLabel = progress.nextRank ? RANK_PRESENTATION[progress.nextRank].label : undefined;

  return (
    <section className="flex items-center gap-4 border-b p-4">
      <ProgressRing
        label={EXPLORER_COPY.PROGRESS_LABEL}
        current={progress.discoveredCount}
        total={progress.totalCount}
      >
        <span className="flex flex-col items-center leading-none">
          <span className="text-lg font-semibold tabular-nums">{progress.discoveredCount}</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            / {progress.totalCount}
          </span>
        </span>
      </ProgressRing>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="truncate text-base font-semibold">{rankLabel}</h2>
          <span className="shrink-0 text-xs font-medium text-primary">
            {EXPLORER_COPY.LEVEL} {progress.level}
          </span>
        </div>
        <Progress
          aria-label={EXPLORER_COPY.RANK_PROGRESS_LABEL}
          value={progress.rankProgressPercent}
        />
        <p className="flex justify-between gap-2 text-xs text-muted-foreground tabular-nums">
          <span>
            {progress.experience} {EXPLORER_COPY.EXPERIENCE_UNIT}
          </span>
          <span className="truncate">
            {nextRankLabel
              ? `${String(progress.experienceToNextRank)} ${EXPLORER_COPY.TO_NEXT_RANK} ${nextRankLabel}`
              : EXPLORER_COPY.HIGHEST_RANK}
          </span>
        </p>
      </div>
    </section>
  );
};
