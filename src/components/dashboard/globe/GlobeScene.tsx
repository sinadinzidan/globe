import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import { GlobeCameraRig } from '@/components/dashboard/globe/GlobeCameraRig';
import { GlobeEarth } from '@/components/dashboard/globe/GlobeEarth';
import { GlobeMarkers } from '@/components/dashboard/globe/GlobeMarkers';
import { GlobePinProjector } from '@/components/dashboard/globe/GlobePinProjector';
import { DASHBOARD_COPY } from '@/constants/dashboard/dashboardConstants';
import { GLOBE } from '@/constants/dashboard/globe/globeConstants';
import type { ZoomCommand } from '@/types/dashboard/globe/globeTypes';
import type { MapData } from '@/types/dashboard/mapTypes';

interface GlobeSceneProperties {
  mapData: MapData;
  zoomCommand: ZoomCommand;
}

const CAMERA = {
  fov: GLOBE.FIELD_OF_VIEW,
  near: GLOBE.NEAR_PLANE,
  far: GLOBE.FAR_PLANE,
};

const GlobeScene = ({ mapData, zoomCommand }: GlobeSceneProperties) => {
  const [isRegionVisible, setIsRegionVisible] = useState(false);

  return (
    <>
      <Canvas
        flat
        camera={CAMERA}
        dpr={Math.min(window.devicePixelRatio, GLOBE.MAXIMUM_DEVICE_PIXEL_RATIO)}
        role="group"
        aria-label={DASHBOARD_COPY.GLOBE_LABEL}
        className="cursor-grab touch-none active:cursor-grabbing"
      >
        <GlobeCameraRig
          mapData={mapData}
          zoomCommand={zoomCommand}
          onRegionVisibleChange={setIsRegionVisible}
        />
        <GlobeEarth mapData={mapData} isRegionVisible={isRegionVisible} />
        <GlobePinProjector />
      </Canvas>
      <GlobeMarkers mapData={mapData} isRegionVisible={isRegionVisible} />
    </>
  );
};

export default GlobeScene;
