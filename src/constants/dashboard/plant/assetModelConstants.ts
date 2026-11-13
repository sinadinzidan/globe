import { AssetType } from '@/enums/dashboard/assetType';
import { ModelTone } from '@/enums/dashboard/modelTone';
import { PrimitiveShape } from '@/enums/dashboard/primitiveShape';
import type { AssetModelDefinition } from '@/types/dashboard/plant/plantSceneTypes';

/**
 * Simplified models of each asset type, built from a few solids. They are representative shapes,
 * not drawings of real equipment. Sizes are in metres before the asset's own scale is applied.
 */
export const ASSET_MODEL: Record<AssetType, AssetModelDefinition> = {
  [AssetType.STORAGE_TANK]: {
    height: 9,
    primitives: [
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.BODY,
        size: { x: 16, y: 8, z: 16 },
        position: { x: 0, y: 4, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.ACCENT,
        size: { x: 16.4, y: 0.5, z: 16.4 },
        position: { x: 0, y: 8.2, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.DARK,
        size: { x: 16.6, y: 0.4, z: 16.6 },
        position: { x: 0, y: 0.2, z: 0 },
      },
    ],
  },
  [AssetType.SPHERE_TANK]: {
    height: 11,
    primitives: [
      {
        shape: PrimitiveShape.SPHERE,
        tone: ModelTone.BODY,
        size: { x: 9, y: 9, z: 9 },
        position: { x: 0, y: 6.5, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.ACCENT,
        size: { x: 9.3, y: 0.4, z: 9.3 },
        position: { x: 0, y: 6.5, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.DARK,
        size: { x: 0.5, y: 6, z: 0.5 },
        position: { x: -3, y: 3, z: -3 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.DARK,
        size: { x: 0.5, y: 6, z: 0.5 },
        position: { x: -3, y: 3, z: 3 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.DARK,
        size: { x: 0.5, y: 6, z: 0.5 },
        position: { x: 3, y: 3, z: -3 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.DARK,
        size: { x: 0.5, y: 6, z: 0.5 },
        position: { x: 3, y: 3, z: 3 },
      },
    ],
  },
  [AssetType.PUMP]: {
    height: 3.4,
    primitives: [
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.DARK,
        size: { x: 5, y: 0.5, z: 2.2 },
        position: { x: 0, y: 0.25, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.ACCENT,
        size: { x: 1.6, y: 2.4, z: 1.6 },
        position: { x: 1.2, y: 1.4, z: 0 },
        rotation: { x: 0, z: 90 },
      },
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.BODY,
        size: { x: 1.6, y: 1.8, z: 1.6 },
        position: { x: -1.2, y: 1.4, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.BODY,
        size: { x: 0.5, y: 1.6, z: 0.5 },
        position: { x: -1.2, y: 2.6, z: 0 },
      },
    ],
  },
  [AssetType.COMPRESSOR]: {
    height: 5,
    primitives: [
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.DARK,
        size: { x: 9, y: 0.6, z: 4 },
        position: { x: 0, y: 0.3, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.BODY,
        size: { x: 2.6, y: 4, z: 2.6 },
        position: { x: -1.5, y: 2.2, z: 0 },
        rotation: { x: 0, z: 90 },
      },
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.ACCENT,
        size: { x: 2.6, y: 2.6, z: 2.6 },
        position: { x: 2.6, y: 1.9, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.BODY,
        size: { x: 0.8, y: 2, z: 0.8 },
        position: { x: -1.5, y: 4, z: 0 },
      },
    ],
  },
  [AssetType.HEAT_EXCHANGER]: {
    height: 4,
    primitives: [
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.BODY,
        size: { x: 2.4, y: 9, z: 2.4 },
        position: { x: 0, y: 2.4, z: 0 },
        rotation: { x: 0, z: 90 },
      },
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.DARK,
        size: { x: 0.6, y: 1.4, z: 2.2 },
        position: { x: -2.6, y: 0.7, z: 0 },
      },
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.DARK,
        size: { x: 0.6, y: 1.4, z: 2.2 },
        position: { x: 2.6, y: 0.7, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.ACCENT,
        size: { x: 2.8, y: 0.5, z: 2.8 },
        position: { x: 4.3, y: 2.4, z: 0 },
        rotation: { x: 0, z: 90 },
      },
    ],
  },
  [AssetType.FURNACE]: {
    height: 18,
    primitives: [
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.BODY,
        size: { x: 8, y: 8, z: 6 },
        position: { x: 0, y: 4, z: 0 },
      },
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.BODY,
        size: { x: 5, y: 3, z: 4 },
        position: { x: 0, y: 9.5, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.DARK,
        size: { x: 1.6, y: 7, z: 1.6 },
        position: { x: 0, y: 14.5, z: 0 },
      },
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.ACCENT,
        size: { x: 8.2, y: 0.5, z: 6.2 },
        position: { x: 0, y: 6, z: 0 },
      },
    ],
  },
  [AssetType.COLUMN]: {
    height: 26,
    primitives: [
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.BODY,
        size: { x: 3.4, y: 24, z: 3.4 },
        position: { x: 0, y: 12, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.ACCENT,
        size: { x: 4.6, y: 0.3, z: 4.6 },
        position: { x: 0, y: 8, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.ACCENT,
        size: { x: 4.6, y: 0.3, z: 4.6 },
        position: { x: 0, y: 14, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.ACCENT,
        size: { x: 4.6, y: 0.3, z: 4.6 },
        position: { x: 0, y: 20, z: 0 },
      },
      {
        shape: PrimitiveShape.CONE,
        tone: ModelTone.BODY,
        size: { x: 3.4, y: 2, z: 3.4 },
        position: { x: 0, y: 25, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.DARK,
        size: { x: 3.8, y: 1.5, z: 3.8 },
        position: { x: 0, y: 0.75, z: 0 },
      },
    ],
  },
  [AssetType.STACK]: {
    height: 34,
    primitives: [
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.BODY,
        size: { x: 1.2, y: 32, z: 1.2 },
        position: { x: 0, y: 16, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.DARK,
        size: { x: 3, y: 1, z: 3 },
        position: { x: 0, y: 0.5, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.ACCENT,
        size: { x: 1.8, y: 1.5, z: 1.8 },
        position: { x: 0, y: 32.5, z: 0 },
      },
    ],
  },
  [AssetType.TURBINE]: {
    height: 7,
    primitives: [
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.DARK,
        size: { x: 16, y: 0.6, z: 6 },
        position: { x: 0, y: 0.3, z: 0 },
      },
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.BODY,
        size: { x: 9, y: 4.5, z: 4.5 },
        position: { x: -2, y: 2.8, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.ACCENT,
        size: { x: 3.2, y: 4, z: 3.2 },
        position: { x: 4.5, y: 2.6, z: 0 },
        rotation: { x: 0, z: 90 },
      },
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.BODY,
        size: { x: 3, y: 6, z: 3 },
        position: { x: -5.5, y: 3.5, z: 0 },
      },
    ],
  },
  [AssetType.GENERATOR]: {
    height: 5.2,
    primitives: [
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.DARK,
        size: { x: 9, y: 0.6, z: 5 },
        position: { x: 0, y: 0.3, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.BODY,
        size: { x: 3.6, y: 7, z: 3.6 },
        position: { x: 0, y: 2.5, z: 0 },
        rotation: { x: 0, z: 90 },
      },
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.ACCENT,
        size: { x: 2, y: 1.2, z: 2 },
        position: { x: 0, y: 4.6, z: 0 },
      },
    ],
  },
  [AssetType.SLUG_CATCHER]: {
    height: 4.5,
    primitives: [
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.DARK,
        size: { x: 1.6, y: 14, z: 1.6 },
        position: { x: -9, y: 3.4, z: 0 },
        rotation: { x: 90, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.BODY,
        size: { x: 1.4, y: 20, z: 1.4 },
        position: { x: 0, y: 1.4, z: -5.25 },
        rotation: { x: 0, z: 90 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.BODY,
        size: { x: 1.4, y: 20, z: 1.4 },
        position: { x: 0, y: 1.4, z: -3.75 },
        rotation: { x: 0, z: 90 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.BODY,
        size: { x: 1.4, y: 20, z: 1.4 },
        position: { x: 0, y: 1.4, z: -2.25 },
        rotation: { x: 0, z: 90 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.BODY,
        size: { x: 1.4, y: 20, z: 1.4 },
        position: { x: 0, y: 1.4, z: -0.75 },
        rotation: { x: 0, z: 90 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.BODY,
        size: { x: 1.4, y: 20, z: 1.4 },
        position: { x: 0, y: 1.4, z: 0.75 },
        rotation: { x: 0, z: 90 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.BODY,
        size: { x: 1.4, y: 20, z: 1.4 },
        position: { x: 0, y: 1.4, z: 2.25 },
        rotation: { x: 0, z: 90 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.BODY,
        size: { x: 1.4, y: 20, z: 1.4 },
        position: { x: 0, y: 1.4, z: 3.75 },
        rotation: { x: 0, z: 90 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.BODY,
        size: { x: 1.4, y: 20, z: 1.4 },
        position: { x: 0, y: 1.4, z: 5.25 },
        rotation: { x: 0, z: 90 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.ACCENT,
        size: { x: 1.2, y: 14, z: 1.2 },
        position: { x: 9, y: 1.2, z: 0 },
        rotation: { x: 90, z: 0 },
      },
    ],
  },
  [AssetType.SEPARATOR]: {
    height: 5.5,
    primitives: [
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.BODY,
        size: { x: 3.6, y: 12, z: 3.6 },
        position: { x: 0, y: 3.2, z: 0 },
        rotation: { x: 0, z: 90 },
      },
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.DARK,
        size: { x: 0.8, y: 1.6, z: 3 },
        position: { x: -3.5, y: 0.8, z: 0 },
      },
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.DARK,
        size: { x: 0.8, y: 1.6, z: 3 },
        position: { x: 3.5, y: 0.8, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.ACCENT,
        size: { x: 0.8, y: 1.6, z: 0.8 },
        position: { x: -3, y: 5.4, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.ACCENT,
        size: { x: 0.8, y: 1.6, z: 0.8 },
        position: { x: 3, y: 5.4, z: 0 },
      },
    ],
  },
  [AssetType.SULPHUR_RECOVERY_UNIT]: {
    height: 24,
    primitives: [
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.BODY,
        size: { x: 3.4, y: 10, z: 3.4 },
        position: { x: -6, y: 3, z: 0 },
        rotation: { x: 0, z: 90 },
      },
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.BODY,
        size: { x: 7, y: 5, z: 6 },
        position: { x: 3, y: 2.5, z: 0 },
      },
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.ACCENT,
        size: { x: 7.2, y: 0.4, z: 6.2 },
        position: { x: 3, y: 4, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.DARK,
        size: { x: 1.8, y: 22, z: 1.8 },
        position: { x: 9.5, y: 11, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.ACCENT,
        size: { x: 2.4, y: 1, z: 2.4 },
        position: { x: 9.5, y: 22.5, z: 0 },
      },
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.DARK,
        size: { x: 18, y: 0.4, z: 8 },
        position: { x: 1, y: 0.2, z: 0 },
      },
    ],
  },
  [AssetType.CRYOGENIC_EXCHANGER]: {
    height: 30,
    primitives: [
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.BODY,
        size: { x: 5, y: 26, z: 5 },
        position: { x: 0, y: 14, z: 0 },
      },
      {
        shape: PrimitiveShape.CONE,
        tone: ModelTone.BODY,
        size: { x: 5, y: 2.5, z: 5 },
        position: { x: 0, y: 28.2, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.ACCENT,
        size: { x: 5.4, y: 0.5, z: 5.4 },
        position: { x: 0, y: 9, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.ACCENT,
        size: { x: 5.4, y: 0.5, z: 5.4 },
        position: { x: 0, y: 18, z: 0 },
      },
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.DARK,
        size: { x: 7, y: 1, z: 7 },
        position: { x: 0, y: 0.5, z: 0 },
      },
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.DARK,
        size: { x: 1.2, y: 26, z: 1.2 },
        position: { x: 3.4, y: 13, z: 0 },
      },
    ],
  },
  [AssetType.LNG_TANK]: {
    height: 17,
    primitives: [
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.BODY,
        size: { x: 22, y: 12, z: 22 },
        position: { x: 0, y: 6, z: 0 },
      },
      {
        shape: PrimitiveShape.SPHERE,
        tone: ModelTone.BODY,
        size: { x: 22, y: 9, z: 22 },
        position: { x: 0, y: 12, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.ACCENT,
        size: { x: 22.5, y: 0.6, z: 22.5 },
        position: { x: 0, y: 11.5, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.DARK,
        size: { x: 23, y: 0.5, z: 23 },
        position: { x: 0, y: 0.25, z: 0 },
      },
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.DARK,
        size: { x: 1.4, y: 14, z: 1.4 },
        position: { x: 11.4, y: 7, z: 0 },
      },
    ],
  },
  [AssetType.LOADING_JETTY]: {
    height: 9,
    primitives: [
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.DARK,
        size: { x: 34, y: 0.8, z: 5 },
        position: { x: 0, y: 1.6, z: 0 },
      },
      {
        shape: PrimitiveShape.BOX,
        tone: ModelTone.BODY,
        size: { x: 8, y: 1, z: 9 },
        position: { x: 15, y: 2.2, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.DARK,
        size: { x: 0.8, y: 2.4, z: 0.8 },
        position: { x: -14, y: 0.6, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.DARK,
        size: { x: 0.8, y: 2.4, z: 0.8 },
        position: { x: -7, y: 0.6, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.DARK,
        size: { x: 0.8, y: 2.4, z: 0.8 },
        position: { x: 0, y: 0.6, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.DARK,
        size: { x: 0.8, y: 2.4, z: 0.8 },
        position: { x: 7, y: 0.6, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.DARK,
        size: { x: 0.8, y: 2.4, z: 0.8 },
        position: { x: 14, y: 0.6, z: 0 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.ACCENT,
        size: { x: 0.6, y: 6, z: 0.6 },
        position: { x: 15, y: 5.5, z: -3 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.ACCENT,
        size: { x: 0.6, y: 6, z: 0.6 },
        position: { x: 15, y: 5.5, z: -1 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.ACCENT,
        size: { x: 0.6, y: 6, z: 0.6 },
        position: { x: 15, y: 5.5, z: 1 },
      },
      {
        shape: PrimitiveShape.CYLINDER,
        tone: ModelTone.ACCENT,
        size: { x: 0.6, y: 6, z: 0.6 },
        position: { x: 15, y: 5.5, z: 3 },
      },
    ],
  },
};
