import { select } from 'd3-selection';
import 'd3-transition';
import { zoom, zoomIdentity } from 'd3-zoom';
import type { D3ZoomEvent, ZoomBehavior, ZoomTransform } from 'd3-zoom';
import { useEffect, useRef, useState } from 'react';
import { FLAT_MAP } from '@/constants/dashboard/flat-map/flatMapConstants';
import type { ElementSize } from '@/hooks/useElementSize';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { ViewTransform } from '@/types/dashboard/flat-map/flatMapTypes';

const ZOOM_EVENT = 'zoom';
const ZOOM_EVENT_NAMESPACE = '.zoom';

const INITIAL_TRANSFORM: ViewTransform = { scale: 1, translateX: 0, translateY: 0 };

interface FlatMapZoomOptions {
  size: ElementSize;
  /** Where the map should fly to. A new object, or a new revision, starts a flight. */
  target: ZoomTransform;
  revision: number;
}

/** Pan and zoom for the flat map: drag, wheel and pinch by hand, animated flights by target. */
export const useFlatMapZoom = ({ size, target, revision }: FlatMapZoomOptions) => {
  const shouldReduceMotion = usePrefersReducedMotion();

  const [transform, setTransform] = useState(INITIAL_TRANSFORM);

  const svgReference = useRef<SVGSVGElement>(null);
  const behaviorReference = useRef<ZoomBehavior<SVGSVGElement, unknown>>(null);

  const scaleBy = (factor: number) => {
    const svgElement = svgReference.current;
    const behavior = behaviorReference.current;
    if (!svgElement || !behavior) {
      return;
    }
    select(svgElement)
      .transition()
      .duration(shouldReduceMotion ? 0 : FLAT_MAP.STEP_DURATION_MILLISECONDS)
      .call(behavior.scaleBy.bind(behavior), factor);
  };

  const zoomIn = () => {
    scaleBy(FLAT_MAP.BUTTON_ZOOM_FACTOR);
  };

  const zoomOut = () => {
    scaleBy(1 / FLAT_MAP.BUTTON_ZOOM_FACTOR);
  };

  useEffect(() => {
    const svgElement = svgReference.current;
    if (!svgElement || size.width === 0 || size.height === 0) {
      return;
    }
    const behavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([FLAT_MAP.MINIMUM_SCALE, FLAT_MAP.MAXIMUM_SCALE])
      .extent([
        [0, 0],
        [size.width, size.height],
      ])
      .translateExtent([
        [0, 0],
        [size.width, size.height],
      ])
      .on(ZOOM_EVENT, (zoomEvent: D3ZoomEvent<SVGSVGElement, unknown>) => {
        setTransform({
          scale: zoomEvent.transform.k,
          translateX: zoomEvent.transform.x,
          translateY: zoomEvent.transform.y,
        });
      });
    behaviorReference.current = behavior;
    const selection = select(svgElement);
    selection.call(behavior);
    return () => {
      selection.interrupt();
      selection.on(ZOOM_EVENT_NAMESPACE, null);
    };
  }, [size.width, size.height]);

  useEffect(() => {
    const svgElement = svgReference.current;
    const behavior = behaviorReference.current;
    if (!svgElement || !behavior) {
      return;
    }
    select(svgElement)
      .transition()
      .duration(shouldReduceMotion ? 0 : FLAT_MAP.FLIGHT_DURATION_MILLISECONDS)
      .call(behavior.transform.bind(behavior), target);
  }, [target, revision, shouldReduceMotion]);

  return { svgReference, transform, zoomIn, zoomOut };
};

export const WORLD_TRANSFORM = zoomIdentity;
