import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { HIDDEN_VISIBILITY, VISIBLE_VISIBILITY } from '@/constants/dashboard/globe/globeConstants';
import {
  PLANT_OVERLAY_ELEMENT_ID,
  PLANT_SCENE,
} from '@/constants/dashboard/plant/plantSceneConstants';

const toPinTransform = (horizontal: number, vertical: number) =>
  `translate(${String(horizontal)}px, ${String(vertical)}px) translate(-50%, -100%)`;

/** Keeps every asset label of the HTML overlay above its asset as the camera moves. */
export const PlantPinProjector = () => {
  useFrame((frame) => {
    const overlay = document.getElementById(PLANT_OVERLAY_ELEMENT_ID);
    if (!overlay) {
      return;
    }
    for (const pin of overlay.children) {
      if (!(pin instanceof HTMLElement)) {
        continue;
      }
      const projected = new Vector3(
        Number(pin.dataset.x),
        Number(pin.dataset.y),
        Number(pin.dataset.z),
      ).project(frame.camera);
      pin.style.transform = toPinTransform(
        (projected.x + 1) * PLANT_SCENE.HALF * frame.size.width,
        (1 - projected.y) * PLANT_SCENE.HALF * frame.size.height,
      );
      pin.style.visibility = projected.z < 1 ? VISIBLE_VISIBILITY : HIDDEN_VISIBILITY;
    }
  });

  return null;
};
