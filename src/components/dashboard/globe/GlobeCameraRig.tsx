import { useFrame, useThree } from '@react-three/fiber';
import { geoCentroid } from 'd3-geo';
import { useEffect, useMemo, useRef } from 'react';
import { MathUtils } from 'three';
import { GLOBE } from '@/constants/dashboard/globe/globeConstants';
import { MapFocus } from '@/enums/dashboard/mapFocus';
import { usePlantDashboard } from '@/hooks/dashboard/usePlantDashboard';
import { useVisiblePlants } from '@/hooks/dashboard/useVisiblePlants';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { longitudeDifference, toCartesian } from '@/lib/dashboard/globeGeometry';
import type { CameraPose, ZoomCommand } from '@/types/dashboard/globe/globeTypes';
import type { MapData } from '@/types/dashboard/mapTypes';

interface GlobeCameraRigProperties {
  mapData: MapData;
  zoomCommand: ZoomCommand;
  onRegionVisibleChange: (isRegionVisible: boolean) => void;
}

const POINTER_DOWN_EVENT = 'pointerdown';
const POINTER_MOVE_EVENT = 'pointermove';
const POINTER_UP_EVENT = 'pointerup';
const POINTER_CANCEL_EVENT = 'pointercancel';
const WHEEL_EVENT = 'wheel';

const clampDistance = (distance: number) =>
  MathUtils.clamp(distance, GLOBE.MINIMUM_DISTANCE, GLOBE.MAXIMUM_DISTANCE);

const clampLatitude = (latitude: number) =>
  MathUtils.clamp(latitude, -GLOBE.MAXIMUM_LATITUDE, GLOBE.MAXIMUM_LATITUDE);

/**
 * Moves the camera. The dashboard focus sets a target pose, dragging and the wheel adjust it,
 * and every frame the camera eases towards it.
 */
export const GlobeCameraRig = ({
  mapData,
  zoomCommand,
  onRegionVisibleChange,
}: GlobeCameraRigProperties) => {
  const canvasElement = useThree((three) => three.gl.domElement);
  const { state } = usePlantDashboard();
  const { selectedPlant } = useVisiblePlants();
  const shouldReduceMotion = usePrefersReducedMotion();

  const uaeCentre = useMemo(() => {
    const [longitude, latitude] = geoCentroid(mapData.uae);
    return { longitude, latitude };
  }, [mapData.uae]);
  const focusPose = useMemo<CameraPose>(() => {
    if (state.focus === MapFocus.WORLD) {
      return {
        longitude: uaeCentre.longitude,
        latitude: GLOBE.WORLD_LATITUDE,
        distance: GLOBE.WORLD_DISTANCE,
      };
    }
    if (state.focus === MapFocus.PLANT && selectedPlant) {
      return {
        longitude: selectedPlant.longitude,
        latitude: selectedPlant.latitude,
        distance: GLOBE.PLANT_DISTANCE,
      };
    }
    return { ...uaeCentre, distance: GLOBE.UAE_DISTANCE };
  }, [state.focus, selectedPlant, uaeCentre]);
  const isIdleRotating = state.focus === MapFocus.WORLD && !shouldReduceMotion;

  const targetPose = useRef<CameraPose>({ ...focusPose });
  const currentPose = useRef<CameraPose>({ ...focusPose });
  const isDragging = useRef(false);
  const wasRegionVisible = useRef(false);
  const shouldJump = useRef(true);

  useFrame((frame, delta) => {
    const target = targetPose.current;
    const current = currentPose.current;
    if (isIdleRotating && !isDragging.current) {
      target.longitude += GLOBE.IDLE_ROTATION_SPEED * delta;
    }
    const progress =
      shouldJump.current || shouldReduceMotion ? 1 : 1 - Math.exp(-GLOBE.CAMERA_DAMPING * delta);
    shouldJump.current = false;
    current.longitude += longitudeDifference(current.longitude, target.longitude) * progress;
    current.latitude += (target.latitude - current.latitude) * progress;
    current.distance += (target.distance - current.distance) * progress;
    frame.camera.position.copy(toCartesian(current, current.distance));
    frame.camera.lookAt(0, 0, 0);

    const angle = Math.hypot(
      longitudeDifference(current.longitude, uaeCentre.longitude),
      current.latitude - uaeCentre.latitude,
    );
    const isRegionVisible =
      current.distance < GLOBE.REGION_VISIBLE_DISTANCE && angle < GLOBE.REGION_VISIBLE_ANGLE;
    if (isRegionVisible !== wasRegionVisible.current) {
      wasRegionVisible.current = isRegionVisible;
      onRegionVisibleChange(isRegionVisible);
    }
  });

  useEffect(() => {
    targetPose.current = { ...focusPose };
  }, [focusPose, state.focusRevision]);

  useEffect(() => {
    if (zoomCommand.sequence === 0) {
      return;
    }
    const target = targetPose.current;
    const height = (target.distance - GLOBE.RADIUS) * zoomCommand.factor;
    target.distance = clampDistance(GLOBE.RADIUS + height);
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
      const target = targetPose.current;
      const sensitivity = GLOBE.DRAG_SENSITIVITY * (target.distance - GLOBE.RADIUS);
      target.longitude -= pointerEvent.movementX * sensitivity;
      target.latitude = clampLatitude(target.latitude + pointerEvent.movementY * sensitivity);
    };
    const handlePointerUp = () => {
      isDragging.current = false;
    };
    const handleWheel = (wheelEvent: WheelEvent) => {
      wheelEvent.preventDefault();
      const target = targetPose.current;
      const height =
        (target.distance - GLOBE.RADIUS) * Math.exp(wheelEvent.deltaY * GLOBE.WHEEL_SENSITIVITY);
      target.distance = clampDistance(GLOBE.RADIUS + height);
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
