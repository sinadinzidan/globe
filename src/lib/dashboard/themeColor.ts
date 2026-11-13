import { Color, SRGBColorSpace } from 'three';

const CANVAS_ELEMENT = 'canvas';
const CANVAS_CONTEXT = '2d';
const MAXIMUM_CHANNEL_VALUE = 255;

/** Resolves a theme token to a renderer colour by letting the browser paint one pixel of it. */
export const resolveThemeColor = (token: string) => {
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
