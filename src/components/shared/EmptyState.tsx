import { Inbox } from 'lucide-react';
import { STATE_MESSAGE } from '@/constants/stateConstants';

interface EmptyStateProperties {
  title?: string;
  description?: string;
}

export const EmptyState = ({
  title = STATE_MESSAGE.EMPTY_TITLE,
  description = STATE_MESSAGE.EMPTY_DESCRIPTION,
}: EmptyStateProperties) => (
  <div className="flex size-full min-h-40 flex-col items-center justify-center gap-3 p-6 text-center">
    <Inbox aria-hidden="true" className="size-6 text-muted-foreground" />
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);
