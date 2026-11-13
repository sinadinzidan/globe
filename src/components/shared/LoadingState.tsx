import { LoaderCircle } from 'lucide-react';
import { STATE_MESSAGE } from '@/constants/stateConstants';

interface LoadingStateProperties {
  message?: string;
}

export const LoadingState = ({ message = STATE_MESSAGE.LOADING }: LoadingStateProperties) => (
  <div
    role="status"
    className="flex size-full min-h-40 flex-col items-center justify-center gap-3 p-6 text-center"
  >
    <LoaderCircle aria-hidden="true" className="size-6 animate-spin text-muted-foreground" />
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);
