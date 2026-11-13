import { MathUtils, Vector3 } from 'three';
import { ASSET_MODEL } from '@/constants/dashboard/plant/assetModelConstants';
import { PLANT_SCENE } from '@/constants/dashboard/plant/plantSceneConstants';
import type { Asset } from '@/types/dashboard/assetTypes';
import type { OrbitPose, Vector } from '@/types/dashboard/plant/plantSceneTypes';

export const OVERVIEW_POSE: OrbitPose = {
  targetX: 0,
  targetZ: 0,
  azimuth: PLANT_SCENE.OVERVIEW_AZIMUTH,
  elevation: PLANT_SCENE.OVERVIEW_ELEVATION,
  distance: PLANT_SCENE.OVERVIEW_DISTANCE,
};

export const ARRIVAL_POSE: OrbitPose = {
  ...OVERVIEW_POSE,
  elevation: PLANT_SCENE.ARRIVAL_ELEVATION,
  distance: PLANT_SCENE.ARRIVAL_DISTANCE,
};

/** Height of an asset's model once its own scale is applied. */
export const assetHeight = (asset: Asset) => ASSET_MODEL[asset.type].height * asset.scale;

/** A close-up of one asset, keeping the direction the camera already looks from. */
export const focusPoseFor = (asset: Asset, azimuth: number): OrbitPose => ({
  targetX: asset.position.x,
  targetZ: asset.position.z,
  azimuth,
  elevation: PLANT_SCENE.FOCUS_ELEVATION,
  distance: PLANT_SCENE.FOCUS_DISTANCE + assetHeight(asset) * PLANT_SCENE.FOCUS_DISTANCE_PER_HEIGHT,
});

/** The point the camera looks at for a pose. */
export const orbitTarget = (pose: OrbitPose) =>
  new Vector3(pose.targetX, PLANT_SCENE.TARGET_HEIGHT, pose.targetZ);

/** Where the camera sits for a pose. */
export const orbitPosition = (pose: OrbitPose) => {
  const azimuth = MathUtils.degToRad(pose.azimuth);
  const elevation = MathUtils.degToRad(pose.elevation);
  return orbitTarget(pose).add(
    new Vector3(
      Math.cos(elevation) * Math.sin(azimuth),
      Math.sin(elevation),
      Math.cos(elevation) * Math.cos(azimuth),
    ).multiplyScalar(pose.distance),
  );
};

export const toRadians = (rotation: Partial<Vector> | undefined) =>
  [
    MathUtils.degToRad(rotation?.x ?? 0),
    MathUtils.degToRad(rotation?.y ?? 0),
    MathUtils.degToRad(rotation?.z ?? 0),
  ] as const;

/** The shortest signed turn, in degrees, from one angle to another. */
export const angleDifference = (from: number, to: number) =>
  MathUtils.euclideanModulo(
    to - from + PLANT_SCENE.HALF_TURN_DEGREES,
    PLANT_SCENE.FULL_TURN_DEGREES,
  ) - PLANT_SCENE.HALF_TURN_DEGREES;
