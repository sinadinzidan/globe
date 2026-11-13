import { useMemo } from 'react';
import { Color, SRGBColorSpace } from 'three';
import { GLOBE_COLOR_TOKEN } from '@/constants/dashboard/globe/globeConstants';

const CANVAS_ELEMENT = 'canvas';
const CANVAS_CONTEXT = '2d';
const MAXIMUM_CHANNEL_VALUE = 255;

/** Resolves a theme token to a renderer colour by letting the browser paint one pixel of it. */
const resolveToken = (token: string) => {
  const canvas = document.createElement(CANVAS_ELEMENT);
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext(CANVAS_CONTEXT);
  if (!context) {
    return new Color();
  }
  context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(token);
  context.fillRect(0, 0, 1, 1);
  const [red = 0, green = 0, blue = 0] = context.getImageData(0, 0, 1, 1).data;
  return new Color().setRGB(
    red / MAXIMUM_CHANNEL_VALUE,
    green / MAXIMUM_CHANNEL_VALUE,
    blue / MAXIMUM_CHANNEL_VALUE,
    SRGBColorSpace,
  );
};

/** The globe's colours, read from the same theme tokens the flat map uses. */
export const useGlobeColors = () =>
  useMemo(
    () => ({
      ocean: resolveToken(GLOBE_COLOR_TOKEN.OCEAN),
      border: resolveToken(GLOBE_COLOR_TOKEN.BORDER),
      graticule: resolveToken(GLOBE_COLOR_TOKEN.GRATICULE),
      highlight: resolveToken(GLOBE_COLOR_TOKEN.HIGHLIGHT),
      highlightBorder: resolveToken(GLOBE_COLOR_TOKEN.HIGHLIGHT_BORDER),
      atmosphere: resolveToken(GLOBE_COLOR_TOKEN.ATMOSPHERE),
      star: resolveToken(GLOBE_COLOR_TOKEN.STAR),
    }),
    [],
  );
