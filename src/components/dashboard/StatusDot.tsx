import { STATUS_TONE_DOT_CLASS_NAME } from '@/constants/dashboard/assetConstants';
import type { StatusTone } from '@/enums/dashboard/statusTone';
import { cn } from '@/lib/utils';

interface StatusDotProperties {
  tone: StatusTone;
}

/** A small status colour mark. Only used next to text that already names the status. */
export const StatusDot = ({ tone }: StatusDotProperties) => (
  <span
    aria-hidden="true"
    className={cn('size-2 shrink-0 rounded-full', STATUS_TONE_DOT_CLASS_NAME[tone])}
  />
);
