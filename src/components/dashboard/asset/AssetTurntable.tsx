import { Canvas } from '@react-three/fiber';
import { AssetTurntableModel } from '@/components/dashboard/asset/AssetTurntableModel';
import { ASSET_COPY } from '@/constants/dashboard/asset/assetPageConstants';
import { ASSET_MODEL } from '@/constants/dashboard/plant/assetModelConstants';
import { PLANT_SCENE } from '@/constants/dashboard/plant/plantSceneConstants';
import type { AssetType } from '@/enums/dashboard/assetType';
import { usePlantColors } from '@/hooks/dashboard/plant/usePlantColors';
import { orbitPosition } from '@/lib/dashboard/plantScene';

interface AssetTurntableProperties {
  type: AssetType;
}

const AssetTurntable = ({ type }: AssetTurntableProperties) => {
  const colors = usePlantColors();

  const { height } = ASSET_MODEL[type];
  const cameraPosition = orbitPosition({
    targetX: 0,
    targetZ: 0,
    azimuth: PLANT_SCENE.OVERVIEW_AZIMUTH,
    elevation: PLANT_SCENE.TURNTABLE_ELEVATION,
    distance: Math.max(
      height * PLANT_SCENE.TURNTABLE_DISTANCE_PER_HEIGHT,
      PLANT_SCENE.TURNTABLE_MINIMUM_DISTANCE,
    ),
  });

  return (
    <Canvas
      flat
      camera={{
        fov: PLANT_SCENE.FIELD_OF_VIEW,
        near: PLANT_SCENE.NEAR_PLANE,
        far: PLANT_SCENE.FAR_PLANE,
        position: cameraPosition,
      }}
      dpr={Math.min(window.devicePixelRatio, PLANT_SCENE.MAXIMUM_DEVICE_PIXEL_RATIO)}
      role="img"
      aria-label={ASSET_COPY.MODEL_LABEL}
    >
      <hemisphereLight args={[colors.tone.BODY, colors.ground, PLANT_SCENE.AMBIENT_INTENSITY]} />
      <directionalLight
        intensity={PLANT_SCENE.SUN_INTENSITY}
        position={[
          PLANT_SCENE.SUN_POSITION.x,
          PLANT_SCENE.SUN_POSITION.y,
          PLANT_SCENE.SUN_POSITION.z,
        ]}
      />
      <AssetTurntableModel type={type} />
    </Canvas>
  );
};

export default AssetTurntable;
