import { Lock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  ACHIEVEMENT_EXPERIENCE,
  ACHIEVEMENT_PRESENTATION,
  EXPLORER_COPY,
  PERCENT,
} from '@/constants/dashboard/explorerConstants';
import { cn } from '@/lib/utils';
import type { AchievementStatus } from '@/types/dashboard/explorerTypes';

interface AchievementItemProperties {
  achievement: AchievementStatus;
}

export const AchievementItem = ({ achievement }: AchievementItemProperties) => {
  const { title, description, icon: Icon } = ACHIEVEMENT_PRESENTATION[achievement.id];
  const StatusIcon = achievement.isUnlocked ? Icon : Lock;
  const percent = achievement.total > 0 ? (achievement.current / achievement.total) * PERCENT : 0;

  return (
    <li
      className={cn(
        'flex items-start gap-3 rounded-lg border p-3',
        achievement.isUnlocked ? 'border-primary/40 bg-primary/5' : 'bg-muted/30',
      )}
    >
      <span
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-full',
          achievement.isUnlocked
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground',
        )}
      >
        <StatusIcon aria-hidden="true" className="size-4" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate text-sm font-medium">{title}</h3>
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            +{ACHIEVEMENT_EXPERIENCE} {EXPLORER_COPY.EXPERIENCE_UNIT}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="flex items-center gap-2">
          <Progress aria-label={title} value={percent} className="flex-1" />
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            {achievement.isUnlocked
              ? EXPLORER_COPY.UNLOCKED
              : `${String(achievement.current)}/${String(achievement.total)}`}
          </span>
        </div>
      </div>
    </li>
  );
};
