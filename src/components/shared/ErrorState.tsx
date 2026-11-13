import { RotateCw, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { STATE_MESSAGE } from '@/constants/stateConstants';

interface ErrorStateProperties {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState = ({
  title = STATE_MESSAGE.ERROR_TITLE,
  description = STATE_MESSAGE.ERROR_DESCRIPTION,
  onRetry,
}: ErrorStateProperties) => (
  <div
    role="alert"
    className="flex size-full min-h-40 flex-col items-center justify-center gap-3 p-6 text-center"
  >
    <TriangleAlert aria-hidden="true" className="size-6 text-destructive" />
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    {onRetry && (
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RotateCw aria-hidden="true" />
        {STATE_MESSAGE.RETRY}
      </Button>
    )}
  </div>
);
