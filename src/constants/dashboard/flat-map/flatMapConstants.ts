export const FLAT_MAP = {
  /** Space kept free around the world outline, in pixels. */
  WORLD_PADDING: 24,
  MINIMUM_SCALE: 1,
  MAXIMUM_SCALE: 600,
  /** Share of the viewport the UAE fills when the map is focused on it. */
  UAE_VIEWPORT_SHARE: 0.62,
  /** Zoom applied on top of the UAE view when a single plant is selected. */
  PLANT_SCALE_MULTIPLIER: 3.5,
  /** Markers and emirate borders appear once the zoom passes this share of the UAE view. */
  REGION_VISIBLE_SCALE_SHARE: 0.4,
  /** Names of the large emirates appear once the zoom passes this share of the UAE view. */
  LABEL_VISIBLE_SCALE_SHARE: 0.9,
  /** Names of the small northern emirates need more zoom before they stop overlapping. */
  SMALL_LABEL_VISIBLE_SCALE_SHARE: 3,
  FLIGHT_DURATION_MILLISECONDS: 2800,
  STEP_DURATION_MILLISECONDS: 350,
  BUTTON_ZOOM_FACTOR: 1.8,
  HALF: 0.5,
} as const;
