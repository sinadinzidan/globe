import type { Color } from 'three';
import { ASSET_MODEL } from '@/constants/dashboard/plant/assetModelConstants';
import { PLANT_SCENE } from '@/constants/dashboard/plant/plantSceneConstants';
import type { AssetType } from '@/enums/dashboard/assetType';
import { PrimitiveShape } from '@/enums/dashboard/primitiveShape';
import { usePlantColors } from '@/hooks/dashboard/plant/usePlantColors';
import { toRadians } from '@/lib/dashboard/plantScene';
import type { ModelPrimitive } from '@/types/dashboard/plant/plantSceneTypes';

interface AssetModelProperties {
  type: AssetType;
  /** Tints the whole model, to mark it as hovered or focused. */
  highlightColor?: Color;
}

interface PrimitiveGeometryProperties {
  shape: ModelPrimitive['shape'];
  size: ModelPrimitive['size'];
}

const PrimitiveGeometry = ({ shape, size }: PrimitiveGeometryProperties) => {
  const radius = size.x * PLANT_SCENE.HALF;
  switch (shape) {
    case PrimitiveShape.BOX: {
      return <boxGeometry args={[size.x, size.y, size.z]} />;
    }
    case PrimitiveShape.CYLINDER: {
      return <cylinderGeometry args={[radius, radius, size.y, PLANT_SCENE.CYLINDER_SEGMENTS]} />;
    }
    case PrimitiveShape.CONE: {
      return <coneGeometry args={[radius, size.y, PLANT_SCENE.CYLINDER_SEGMENTS]} />;
    }
    case PrimitiveShape.SPHERE: {
      return (
        <sphereGeometry args={[radius, PLANT_SCENE.SPHERE_SEGMENTS, PLANT_SCENE.SPHERE_SEGMENTS]} />
      );
    }
  }
};

/** A representative model of an asset type, standing on the origin. Used by every 3D view. */
export const AssetModel = ({ type, highlightColor }: AssetModelProperties) => {
  const colors = usePlantColors();

  return ASSET_MODEL[type].primitives.map((primitive, index) => (
    <mesh
      key={index}
      position={[primitive.position.x, primitive.position.y, primitive.position.z]}
      rotation={toRadians(primitive.rotation)}
    >
      <PrimitiveGeometry shape={primitive.shape} size={primitive.size} />
      <meshStandardMaterial
        color={colors.tone[primitive.tone]}
        emissive={highlightColor ?? colors.sky}
        emissiveIntensity={highlightColor ? PLANT_SCENE.HALF : 0}
        roughness={1}
      />
    </mesh>
  ));
};
