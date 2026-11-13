import type { ModelTone } from '@/enums/dashboard/modelTone';
import type { PrimitiveShape } from '@/enums/dashboard/primitiveShape';

export interface Vector {
  x: number;
  y: number;
  z: number;
}

/** One solid of an asset model. Sizes are in metres; a cylinder uses x as its diameter. */
export interface ModelPrimitive {
  shape: PrimitiveShape;
  tone: ModelTone;
  size: Vector;
  position: Vector;
  /** Rotation in degrees about each axis. */
  rotation?: Partial<Vector>;
}

export interface AssetModelDefinition {
  /** Height of the whole model, used to place its label and frame the camera. */
  height: number;
  primitives: ModelPrimitive[];
}

/** Where the plant camera looks from, as an orbit around a point on the ground. */
export interface OrbitPose {
  targetX: number;
  targetZ: number;
  /** Degrees around the vertical axis. */
  azimuth: number;
  /** Degrees above the ground. */
  elevation: number;
  distance: number;
}
