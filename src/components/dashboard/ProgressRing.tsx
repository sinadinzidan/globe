import type { ReactNode } from 'react';
import { PERCENT, PROGRESS_RING } from '@/constants/dashboard/explorerConstants';

interface ProgressRingProperties {
  label: string;
  current: number;
  total: number;
  children: ReactNode;
}

const CIRCUMFERENCE = (1 + 1) * Math.PI * PROGRESS_RING.RADIUS;

/** A circular progress indicator with content in its centre. */
export const ProgressRing = ({ label, current, total, children }: ProgressRingProperties) => {
  const fraction = total > 0 ? current / total : 0;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-valuetext={`${String(Math.round(fraction * PERCENT))}%`}
      className="relative flex size-18 shrink-0 items-center justify-center"
    >
      <svg
        viewBox={PROGRESS_RING.VIEW_BOX}
        aria-hidden="true"
        className="absolute inset-0 -rotate-90"
      >
        <circle
          cx={PROGRESS_RING.CENTRE}
          cy={PROGRESS_RING.CENTRE}
          r={PROGRESS_RING.RADIUS}
          className="fill-none stroke-muted stroke-[6]"
        />
        <circle
          cx={PROGRESS_RING.CENTRE}
          cy={PROGRESS_RING.CENTRE}
          r={PROGRESS_RING.RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
          strokeLinecap="round"
          className="fill-none stroke-primary stroke-[6] transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      {children}
    </div>
  );
};
