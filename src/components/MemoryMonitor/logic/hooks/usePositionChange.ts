import { useLayoutEffect, useRef, useState } from 'react';
import { POSITION_CYCLE, type PositionValues } from '../constants';

type UsePositionChangeProps = {
  initialPosition: PositionValues;
  /** When the widget is minimized, the ref height/width change — remeasure for corner math. */
  collapsed: boolean;
};

export function usePositionChange(props: UsePositionChangeProps) {
  const { initialPosition, collapsed } = props;

  const [position, setPosition] = useState<PositionValues>(initialPosition);
  const [winSize, setWinSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [widgetHeight, setWidgetHeight] = useState(0);
  const widgetRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (widgetRef.current) setWidgetHeight(widgetRef.current.offsetHeight);
  }, [collapsed]);

  useLayoutEffect(() => {
    const onResize = () => setWinSize({ w: window.innerWidth, h: window.innerHeight });

    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleCyclePosition = () => {
    setPosition((prev) => {
      const idx = POSITION_CYCLE.indexOf(prev);

      return POSITION_CYCLE[(idx + 1) % POSITION_CYCLE.length] as PositionValues;
    });
  };

  return { position, handleCyclePosition, winSize, widgetHeight, widgetRef };
}
