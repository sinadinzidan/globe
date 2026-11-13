import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { MathUtils } from 'three';
import { PLANT_SCENE } from '@/constants/dashboard/plant/plantSceneConstants';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
  angleDifference,
  ARRIVAL_POSE,
  focusPoseFor,
  orbitPosition,
  orbitTarget,
  OVERVIEW_POSE,
} from '@/lib/dashboard/plantScene';
import type { Asset } from '@/types/dashboard/assetTypes';
import type { ZoomCommand } from '@/types/dashboard/globe/globeTypes';
import type { OrbitPose } from '@/types/dashboard/plant/plantSceneTypes';

interface PlantCameraRigProperties {
  focusedAsset: Asset | undefined;
  zoomCommand: ZoomCommand;
  /** Holds the idle rotation still, so a label under the pointer does not drift away. */
  isPaused: boolean;
}

const POINTER_DOWN_EVENT = 'pointerdown';
const POINTER_MOVE_EVENT = 'pointermove';
const POINTER_UP_EVENT = 'pointerup';
const POINTER_CANCEL_EVENT = 'pointercancel';
const WHEEL_EVENT = 'wheel';

const clampDistance = (distance: number) =>
  MathUtils.clamp(distance, PLANT_SCENE.MINIMUM_DISTANCE, PLANT_SCENE.MAXIMUM_DISTANCE);

/**
 * Orbits the camera around the plant. It arrives from high above, eases to the overview or to
 * the focused asset, and follows dragging and the wheel.
 */
export const PlantCameraRig = ({
  focusedAsset,
  zoomCommand,
  isPaused,
}: PlantCameraRigProperties) => {
  const canvasElement = useThree((three) => three.gl.domElement);
  const shouldReduceMotion = usePrefersReducedMotion();

  const targetPose = useRef<OrbitPose>({ ...OVERVIEW_POSE });
  const currentPose = useRef<OrbitPose>({ ...ARRIVAL_POSE });
  const isDragging = useRef(false);
  const hasInteracted = useRef(false);

  const isIdleRotating = !focusedAsset && !isPaused && !shouldReduceMotion;

  useFrame((frame, delta) => {
    const target = targetPose.current;
    const current = currentPose.current;
    if (isIdleRotating && !hasInteracted.current) {
      target.azimuth += PLANT_SCENE.IDLE_ROTATION_SPEED * delta;
    }
    const progress = shouldReduceMotion ? 1 : 1 - Math.exp(-PLANT_SCENE.CAMERA_DAMPING * delta);
    current.targetX += (target.targetX - current.targetX) * progress;
    current.targetZ += (target.targetZ - current.targetZ) * progress;
    current.azimuth += angleDifference(current.azimuth, target.azimuth) * progress;
    current.elevation += (target.elevation - current.elevation) * progress;
    current.distance += (target.distance - current.distance) * progress;
    frame.camera.position.copy(orbitPosition(current));
    frame.camera.lookAt(orbitTarget(current));
  });

  useEffect(() => {
    hasInteracted.current = false;
    targetPose.current = focusedAsset
      ? focusPoseFor(focusedAsset, targetPose.current.azimuth)
      : { ...OVERVIEW_POSE, azimuth: targetPose.current.azimuth };
  }, [focusedAsset]);

  useEffect(() => {
    if (zoomCommand.sequence === 0) {
      return;
    }
    targetPose.current.distance = clampDistance(targetPose.current.distance * zoomCommand.factor);
  }, [zoomCommand]);

  useEffect(() => {
    const handlePointerDown = (pointerEvent: PointerEvent) => {
      isDragging.current = true;
      canvasElement.setPointerCapture(pointerEvent.pointerId);
    };
    const handlePointerMove = (pointerEvent: PointerEvent) => {
      if (!isDragging.current) {
        return;
      }
      hasInteracted.current = true;
      const target = targetPose.current;
      target.azimuth -= pointerEvent.movementX * PLANT_SCENE.DRAG_SENSITIVITY;
      target.elevation = MathUtils.clamp(
        target.elevation + pointerEvent.movementY * PLANT_SCENE.DRAG_SENSITIVITY,
        PLANT_SCENE.MINIMUM_ELEVATION,
        PLANT_SCENE.MAXIMUM_ELEVATION,
      );
    };
    const handlePointerUp = () => {
      isDragging.current = false;
    };
    const handleWheel = (wheelEvent: WheelEvent) => {
      wheelEvent.preventDefault();
      hasInteracted.current = true;
      targetPose.current.distance = clampDistance(
        targetPose.current.distance * Math.exp(wheelEvent.deltaY * PLANT_SCENE.WHEEL_SENSITIVITY),
      );
    };
    canvasElement.addEventListener(POINTER_DOWN_EVENT, handlePointerDown);
    canvasElement.addEventListener(POINTER_MOVE_EVENT, handlePointerMove);
    canvasElement.addEventListener(POINTER_UP_EVENT, handlePointerUp);
    canvasElement.addEventListener(POINTER_CANCEL_EVENT, handlePointerUp);
    canvasElement.addEventListener(WHEEL_EVENT, handleWheel);
    return () => {
      canvasElement.removeEventListener(POINTER_DOWN_EVENT, handlePointerDown);
      canvasElement.removeEventListener(POINTER_MOVE_EVENT, handlePointerMove);
      canvasElement.removeEventListener(POINTER_UP_EVENT, handlePointerUp);
      canvasElement.removeEventListener(POINTER_CANCEL_EVENT, handlePointerUp);
      canvasElement.removeEventListener(WHEEL_EVENT, handleWheel);
    };
  }, [canvasElement]);

  return null;
};
