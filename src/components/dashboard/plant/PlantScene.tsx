import { Canvas } from '@react-three/fiber';
import { PlantAssetNode } from '@/components/dashboard/plant/PlantAssetNode';
import { PlantCameraRig } from '@/components/dashboard/plant/PlantCameraRig';
import { PlantGround } from '@/components/dashboard/plant/PlantGround';
import { PlantPinProjector } from '@/components/dashboard/plant/PlantPinProjector';
import { PlantPipes } from '@/components/dashboard/plant/PlantPipes';
import { PLANT_COPY, PLANT_SCENE } from '@/constants/dashboard/plant/plantSceneConstants';
import { usePlantColors } from '@/hooks/dashboard/plant/usePlantColors';
import type { Asset, PlantLayout } from '@/types/dashboard/assetTypes';
import type { ZoomCommand } from '@/types/dashboard/globe/globeTypes';

interface PlantSceneProperties {
  layout: PlantLayout;
  focusedAsset: Asset | undefined;
  hoveredAssetId: string | null;
  zoomCommand: ZoomCommand;
  onFocusAsset: (assetId: string | null) => void;
  onHoverAsset: (assetId: string | null) => void;
}

const CAMERA = {
  fov: PLANT_SCENE.FIELD_OF_VIEW,
  near: PLANT_SCENE.NEAR_PLANE,
  far: PLANT_SCENE.FAR_PLANE,
};

const PlantScene = ({
  layout,
  focusedAsset,
  hoveredAssetId,
  zoomCommand,
  onFocusAsset,
  onHoverAsset,
}: PlantSceneProperties) => {
  const colors = usePlantColors();

  return (
    <Canvas
      flat
      camera={CAMERA}
      dpr={Math.min(window.devicePixelRatio, PLANT_SCENE.MAXIMUM_DEVICE_PIXEL_RATIO)}
      role="group"
      aria-label={PLANT_COPY.SCENE_LABEL}
      className="cursor-grab touch-none active:cursor-grabbing"
    >
      <color attach="background" args={[colors.sky]} />
      <fog attach="fog" args={[colors.sky, PLANT_SCENE.FOG_NEAR, PLANT_SCENE.FOG_FAR]} />
      <hemisphereLight args={[colors.tone.BODY, colors.ground, PLANT_SCENE.AMBIENT_INTENSITY]} />
      <directionalLight
        intensity={PLANT_SCENE.SUN_INTENSITY}
        position={[
          PLANT_SCENE.SUN_POSITION.x,
          PLANT_SCENE.SUN_POSITION.y,
          PLANT_SCENE.SUN_POSITION.z,
        ]}
      />
      <PlantCameraRig
        focusedAsset={focusedAsset}
        zoomCommand={zoomCommand}
        isPaused={hoveredAssetId !== null}
      />
      <PlantGround scenery={layout.scenery} />
      <PlantPipes assets={layout.assets} />
      {layout.assets.map((asset) => (
        <PlantAssetNode
          key={asset.id}
          asset={asset}
          isHighlighted={asset.id === hoveredAssetId || asset.id === focusedAsset?.id}
          onFocus={onFocusAsset}
          onHover={onHoverAsset}
        />
      ))}
      <PlantPinProjector />
    </Canvas>
  );
};

export default PlantScene;
