import { useCallback, useState } from 'react';

export interface ElementSize {
  width: number;
  height: number;
}

const EMPTY_SIZE: ElementSize = { width: 0, height: 0 };

/** Tracks the rendered size of an element. Attach the returned callback as its `ref`. */
export const useElementSize = () => {
  const [size, setSize] = useState<ElementSize>(EMPTY_SIZE);

  const attach = useCallback((element: HTMLElement | null) => {
    if (!element) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, []);

  return { attach, size };
};
