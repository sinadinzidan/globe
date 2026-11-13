import { useSyncExternalStore } from 'react';
import { REDUCED_MOTION_QUERY } from '@/constants/dashboard/dashboardConstants';

const CHANGE_EVENT = 'change';

const subscribe = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    mediaQuery.removeEventListener(CHANGE_EVENT, onChange);
  };
};

const getSnapshot = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;

export const usePrefersReducedMotion = () => useSyncExternalStore(subscribe, getSnapshot);
