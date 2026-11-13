import type { ReactNode } from 'react';
import type { GeographicPoint } from '@/types/dashboard/mapTypes';

interface GlobePinProperties {
  point: GeographicPoint;
  children: ReactNode;
}

/** Holds content at a point on the globe. `GlobePinProjector` moves it on every frame. */
export const GlobePin = ({ point, children }: GlobePinProperties) => (
  <div
    data-longitude={point.longitude}
    data-latitude={point.latitude}
    className="pointer-events-auto invisible absolute top-0 left-0"
  >
    {children}
  </div>
);
