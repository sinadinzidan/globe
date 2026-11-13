export const GLOBE = {
  RADIUS: 1,
  /** Layers sit slightly above the sphere so they never fight it for depth. */
  GRATICULE_RADIUS: 1.0005,
  FILL_RADIUS: 1.001,
  OUTLINE_RADIUS: 1.0015,
  MARKER_RADIUS: 1.002,
  SPHERE_SEGMENTS: 96,
  FIELD_OF_VIEW: 40,
  NEAR_PLANE: 0.01,
  FAR_PLANE: 50,
  MAXIMUM_DEVICE_PIXEL_RATIO: 2,
  WORLD_DISTANCE: 3.4,
  WORLD_LATITUDE: 18,
  UAE_DISTANCE: 1.22,
  PLANT_DISTANCE: 1.07,
  MINIMUM_DISTANCE: 1.03,
  MAXIMUM_DISTANCE: 6,
  MAXIMUM_LATITUDE: 85,
  /** Higher values make the camera reach its target faster. */
  CAMERA_DAMPING: 2.2,
  /** Degrees per second the idle world view turns. */
  IDLE_ROTATION_SPEED: 4,
  /** Degrees of rotation per dragged pixel, at one unit above the surface. */
  DRAG_SENSITIVITY: 0.12,
  WHEEL_SENSITIVITY: 0.0012,
  BUTTON_ZOOM_FACTOR: 0.7,
  /** Plant markers appear once the camera is closer than this and looks at the UAE. */
  REGION_VISIBLE_DISTANCE: 1.75,
  REGION_VISIBLE_ANGLE: 14,
  FULL_TURN_DEGREES: 360,
  HALF_TURN_DEGREES: 180,
  OUTLINE_OPACITY: 0.9,
  GRATICULE_OPACITY: 0.35,
  POSITION_COMPONENTS: 3,
  /** Markers this close to the edge of the visible half of the globe are hidden. */
  HORIZON_MARGIN: 0.05,
  HALF: 0.5,
  ATMOSPHERE_RADIUS: 1.18,
  STAR_COUNT: 1400,
  STAR_DISTANCE: 30,
  STAR_SIZE: 1.6,
  STAR_OPACITY: 0.55,
} as const;

/** CSS custom properties the globe reads its colours from, so it follows the theme. */
export const GLOBE_COLOR_TOKEN = {
  OCEAN: '--map-ocean',
  BORDER: '--map-border',
  GRATICULE: '--map-graticule',
  HIGHLIGHT: '--map-highlight',
  HIGHLIGHT_BORDER: '--map-highlight-border',
  ATMOSPHERE: '--map-atmosphere',
  STAR: '--map-star',
} as const;

/** The HTML layer over the canvas. Its children are pinned to the globe on every frame. */
export const GLOBE_OVERLAY_ELEMENT_ID = 'globe-marker-overlay';
export const HIDDEN_VISIBILITY = 'hidden';
export const VISIBLE_VISIBILITY = 'visible';

/** A soft glow around the globe: brightest at the rim, fading towards the centre. */
export const ATMOSPHERE_VERTEX_SHADER = `
  varying vec3 surfaceNormal;
  void main() {
    surfaceNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const ATMOSPHERE_FRAGMENT_SHADER = `
  uniform vec3 glowColor;
  varying vec3 surfaceNormal;
  void main() {
    float intensity = pow(0.7 - dot(surfaceNormal, vec3(0.0, 0.0, 1.0)), 3.0);
    gl_FragColor = vec4(glowColor, 1.0) * intensity;
  }
`;

/** Constants of the hash that scatters the background stars the same way on every visit. */
export const STAR_HASH = {
  FREQUENCY_FIRST: 12.9898,
  FREQUENCY_SECOND: 78.233,
  AMPLITUDE: 43758.5453,
} as const;
