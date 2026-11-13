import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils } from 'three';
import type { Group } from 'three';
import { AssetModel } from '@/components/dashboard/AssetModel';
import { ASSET_MODEL } from '@/constants/dashboard/plant/assetModelConstants';
import { PLANT_SCENE } from '@/constants/dashboard/plant/plantSceneConstants';
import type { AssetType } from '@/enums/dashboard/assetType';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface AssetTurntableModelProperties {
  type: AssetType;
}

/** The asset model, centred on its height and turning slowly. */
export const AssetTurntableModel = ({ type }: AssetTurntableModelProperties) => {
  const shouldReduceMotion = usePrefersReducedMotion();

  const turntable = useRef<Group>(null);

  useFrame((frame, delta) => {
    frame.camera.lookAt(0, 0, 0);
    if (turntable.current && !shouldReduceMotion) {
      turntable.current.rotation.y += MathUtils.degToRad(PLANT_SCENE.TURNTABLE_SPEED) * delta;
    }
  });

  return (
    <group ref={turntable}>
      <group position-y={-ASSET_MODEL[type].height * PLANT_SCENE.HALF}>
        <AssetModel type={type} />
      </group>
    </group>
  );
};
