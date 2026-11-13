import { MapControls } from '@/components/dashboard/MapControls';
import { MissionBar } from '@/components/dashboard/MissionBar';
import { PlantDetails } from '@/components/dashboard/PlantDetails';

interface MapHudProperties {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

/** Everything that floats over a map view. Both views use it, so they behave the same. */
export const MapHud = ({ onZoomIn, onZoomOut }: MapHudProperties) => (
  <>
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-radial from-transparent from-55% to-background/70"
    />
    <MapControls onZoomIn={onZoomIn} onZoomOut={onZoomOut} />
    <PlantDetails />
    <MissionBar />
  </>
);
