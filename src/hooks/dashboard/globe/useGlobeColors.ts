import { useMemo } from 'react';
import { resolveThemeColor } from '@/lib/dashboard/themeColor';
import { GLOBE_COLOR_TOKEN } from '@/constants/dashboard/globe/globeConstants';

/** The globe's colours, read from the same theme tokens the flat map uses. */
export const useGlobeColors = () =>
  useMemo(
    () => ({
      ocean: resolveThemeColor(GLOBE_COLOR_TOKEN.OCEAN),
      border: resolveThemeColor(GLOBE_COLOR_TOKEN.BORDER),
      graticule: resolveThemeColor(GLOBE_COLOR_TOKEN.GRATICULE),
      highlight: resolveThemeColor(GLOBE_COLOR_TOKEN.HIGHLIGHT),
      highlightBorder: resolveThemeColor(GLOBE_COLOR_TOKEN.HIGHLIGHT_BORDER),
      atmosphere: resolveThemeColor(GLOBE_COLOR_TOKEN.ATMOSPHERE),
      star: resolveThemeColor(GLOBE_COLOR_TOKEN.STAR),
    }),
    [],
  );
