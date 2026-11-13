import { useMemo } from 'react';
import { PLANT_COLOR_TOKEN } from '@/constants/dashboard/plant/plantSceneConstants';
import { ModelTone } from '@/enums/dashboard/modelTone';
import { resolveThemeColor } from '@/lib/dashboard/themeColor';

/** The plant scene's colours, read from theme tokens. */
export const usePlantColors = () =>
  useMemo(
    () => ({
      ground: resolveThemeColor(PLANT_COLOR_TOKEN.GROUND),
      pad: resolveThemeColor(PLANT_COLOR_TOKEN.PAD),
      grid: resolveThemeColor(PLANT_COLOR_TOKEN.GRID),
      pipe: resolveThemeColor(PLANT_COLOR_TOKEN.PIPE),
      scenery: resolveThemeColor(PLANT_COLOR_TOKEN.SCENERY),
      highlight: resolveThemeColor(PLANT_COLOR_TOKEN.HIGHLIGHT),
      sky: resolveThemeColor(PLANT_COLOR_TOKEN.SKY),
      tone: {
        [ModelTone.BODY]: resolveThemeColor(PLANT_COLOR_TOKEN.BODY),
        [ModelTone.ACCENT]: resolveThemeColor(PLANT_COLOR_TOKEN.ACCENT),
        [ModelTone.DARK]: resolveThemeColor(PLANT_COLOR_TOKEN.DARK),
      },
    }),
    [],
  );
