import { useFrame } from '@react-three/fiber';
import {
  GLOBE,
  GLOBE_OVERLAY_ELEMENT_ID,
  HIDDEN_VISIBILITY,
  VISIBLE_VISIBILITY,
} from '@/constants/dashboard/globe/globeConstants';
import { toCartesian } from '@/lib/dashboard/globeGeometry';

const toPinTransform = (horizontal: number, vertical: number) =>
  `translate(${String(horizontal)}px, ${String(vertical)}px) translate(-50%, -50%)`;

/** Keeps every pin of the HTML overlay on its point of the globe, and hides pins behind it. */
export const GlobePinProjector = () => {
  useFrame((frame) => {
    const overlay = document.getElementById(GLOBE_OVERLAY_ELEMENT_ID);
    if (!overlay) {
      return;
    }
    const viewDirection = frame.camera.position.clone().normalize();
    for (const pin of overlay.children) {
      if (!(pin instanceof HTMLElement)) {
        continue;
      }
      const position = toCartesian(
        { longitude: Number(pin.dataset.longitude), latitude: Number(pin.dataset.latitude) },
        GLOBE.MARKER_RADIUS,
      );
      const horizon = GLOBE.RADIUS / frame.camera.position.length() + GLOBE.HORIZON_MARGIN;
      const isFacingCamera = position.clone().normalize().dot(viewDirection) > horizon;
      const projected = position.project(frame.camera);
      pin.style.transform = toPinTransform(
        (projected.x + 1) * GLOBE.HALF * frame.size.width,
        (1 - projected.y) * GLOBE.HALF * frame.size.height,
      );
      pin.style.visibility = isFacingCamera ? VISIBLE_VISIBILITY : HIDDEN_VISIBILITY;
    }
  });

  return null;
};
