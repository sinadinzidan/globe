/** A position on the plant's ground, in metres from its centre. */
export interface GroundPosition {
  east: number;
  south: number;
}

/** A building of the 3D model that is not an asset. */
export interface SceneryBuilding {
  position: GroundPosition;
  width: number;
  depth: number;
  height: number;
}
