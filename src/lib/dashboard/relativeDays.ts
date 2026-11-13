import { ASSET_COPY } from '@/constants/dashboard/asset/assetPageConstants';

/** Describes a day offset from today in words: past, today or future. */
export const describeDayOffset = (dayOffset: number) => {
  if (dayOffset === 0) {
    return ASSET_COPY.TODAY;
  }
  return dayOffset < 0
    ? `${String(-dayOffset)} ${ASSET_COPY.DAYS_AGO}`
    : `${ASSET_COPY.IN_DAYS_PREFIX} ${String(dayOffset)} ${ASSET_COPY.DAYS}`;
};
