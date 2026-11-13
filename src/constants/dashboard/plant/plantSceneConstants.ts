export const PLANT_SCENE = {
  FIELD_OF_VIEW: 40,
  NEAR_PLANE: 0.5,
  FAR_PLANE: 1200,
  MAXIMUM_DEVICE_PIXEL_RATIO: 2,
  /** The overview the camera settles into. */
  OVERVIEW_AZIMUTH: 35,
  OVERVIEW_ELEVATION: 30,
  OVERVIEW_DISTANCE: 165,
  /** Where the camera starts, high above the plant, before it descends. */
  ARRIVAL_ELEVATION: 78,
  ARRIVAL_DISTANCE: 520,
  /** Camera distance from a focused asset: a base plus a multiple of the asset's height. */
  FOCUS_DISTANCE: 36,
  FOCUS_DISTANCE_PER_HEIGHT: 1.6,
  FOCUS_ELEVATION: 22,
  /** Height above the ground the camera looks at. */
  TARGET_HEIGHT: 5,
  MINIMUM_DISTANCE: 22,
  MAXIMUM_DISTANCE: 300,
  MINIMUM_ELEVATION: 6,
  MAXIMUM_ELEVATION: 86,
  CAMERA_DAMPING: 2.4,
  /** Degrees per second the idle overview turns. */
  IDLE_ROTATION_SPEED: 2.5,
  DRAG_SENSITIVITY: 0.25,
  WHEEL_SENSITIVITY: 0.0012,
  BUTTON_ZOOM_FACTOR: 0.75,
  GROUND_SIZE: 1400,
  PAD_SIZE: 150,
  PAD_HEIGHT: 0.2,
  GRID_DIVISIONS: 30,
  GRID_HEIGHT: 0.25,
  PIPE_HEIGHT: 1.4,
  PIPE_THICKNESS: 0.7,
  /** Gap between the top of an asset and its label. */
  LABEL_CLEARANCE: 3,
  /** Delay between two asset labels appearing, and before the first one, as the camera arrives. */
  LABEL_STAGGER_MILLISECONDS: 90,
  FOG_NEAR: 260,
  FOG_FAR: 900,
  AMBIENT_INTENSITY: 1.1,
  SUN_INTENSITY: 2.2,
  SUN_POSITION: { x: 120, y: 180, z: 60 },
  CYLINDER_SEGMENTS: 32,
  SPHERE_SEGMENTS: 32,
  HALF: 0.5,
  HALF_TURN_DEGREES: 180,
  FULL_TURN_DEGREES: 360,
  /** Degrees per second the asset turns on the asset page. */
  TURNTABLE_SPEED: 14,
  TURNTABLE_DISTANCE_PER_HEIGHT: 2.1,
  TURNTABLE_MINIMUM_DISTANCE: 22,
  TURNTABLE_ELEVATION: 18,
} as const;

/** CSS custom properties the plant scene reads its colours from. */
export const PLANT_COLOR_TOKEN = {
  GROUND: '--plant-ground',
  PAD: '--plant-pad',
  GRID: '--plant-grid',
  BODY: '--plant-body',
  ACCENT: '--plant-accent',
  DARK: '--plant-dark',
  PIPE: '--plant-pipe',
  SCENERY: '--plant-scenery',
  HIGHLIGHT: '--primary',
  SKY: '--background',
} as const;

/** The HTML layer over the plant canvas. Its children are pinned to assets on every frame. */
export const PLANT_OVERLAY_ELEMENT_ID = 'plant-asset-overlay';

/** Query string key that holds the asset the plant view is focused on. */
export const FOCUSED_ASSET_SEARCH_PARAMETER = 'asset';

export const PLANT_COPY = {
  SCENE_LABEL: '3D model of the plant with its assets',
  MODEL_NOTE: 'Representative 3D model',
  ASSETS_TITLE: 'Assets',
  ASSET_LIST_LABEL: 'Assets in this plant',
  ASSETS_UNIT: 'assets',
  HINT: 'Select an asset on the model or in the list to look closer.',
  OPEN_ASSET: 'Open asset',
  CLOSE_PREVIEW: 'Close asset preview',
  ENTER_PLANT: 'Enter plant',
  RESET_VIEW: 'Whole plant',
  ZOOM_IN: 'Zoom in',
  ZOOM_OUT: 'Zoom out',
  CONTROLS_LABEL: 'Plant view controls',
  LOADING: 'Loading the plant…',
  NOT_FOUND_TITLE: 'Plant not found',
  NOT_FOUND_DESCRIPTION: 'This plant is not in the data. Go back to the map and pick another.',
  NO_ASSETS_TITLE: 'No assets yet',
  NO_ASSETS_DESCRIPTION: 'There are no assets recorded for this plant.',
  BACK_TO_MAP: 'Back to the map',
  DATA_NOTE:
    'The plant model and all asset data are illustrative samples, not records of the real site.',
} as const;
