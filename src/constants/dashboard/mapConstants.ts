export const WORLD_COUNTRIES_URL = '/data/world-countries.json';
export const REGION_DETAIL_URL = '/data/uae-region-detail.json';

/** ISO 3166-1 numeric identifier of the United Arab Emirates. */
export const UAE_COUNTRY_IDENTIFIER = '784';

/** Edges that only exist because polygons are cut at the antimeridian or the south pole. */
export const ANTIMERIDIAN_LONGITUDE = 179.99;
export const POLAR_CAP_LATITUDE = 89.9;

/** Marker geometry in screen pixels. Markers keep this size at every zoom level. */
export const MARKER = {
  RADIUS: 11,
  ICON_SIZE: 12,
  SELECTED_RING_RADIUS: 17,
  HIT_RADIUS: 18,
  LABEL_OFFSET: 24,
  BEACON_RADIUS: 6,
  BEACON_PULSE_RADIUS: 14,
  BEACON_LABEL_OFFSET: 26,
  BEACON_COUNT_OFFSET: 42,
  VIEW_BOX_SIZE: 40,
} as const;

/** Delay between two markers appearing, so they drop in one after another. */
export const MARKER_STAGGER_MILLISECONDS = 55;

/** Keys that activate a focused marker, matching native button behaviour. */
export const ACTIVATION_KEYS: readonly string[] = ['Enter', ' '];

/** View box that puts the origin at the centre of a marker drawn in its own SVG. */
export const MARKER_VIEW_BOX = '-20 -20 40 40';
