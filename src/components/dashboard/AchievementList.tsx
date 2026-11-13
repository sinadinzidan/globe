import { AchievementItem } from '@/components/dashboard/AchievementItem';
import { ResetProgressButton } from '@/components/dashboard/ResetProgressButton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EXPLORER_COPY } from '@/constants/dashboard/explorerConstants';
import { useExplorerProgress } from '@/hooks/dashboard/useExplorerProgress';

export const AchievementList = () => {
  const { achievements } = useExplorerProgress();

  return (
    <section
      aria-label={EXPLORER_COPY.TAB_ACHIEVEMENTS}
      className="flex flex-col lg:min-h-0 lg:flex-1"
    >
      <ScrollArea className="lg:min-h-0 lg:flex-1">
        <div className="flex flex-col gap-4 p-4">
          <ul className="flex flex-col gap-2">
            {achievements.map((achievement) => (
              <AchievementItem key={achievement.id} achievement={achievement} />
            ))}
          </ul>
          <ResetProgressButton />
        </div>
      </ScrollArea>
    </section>
  );
};
