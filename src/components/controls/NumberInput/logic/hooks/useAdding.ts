import { useCallback, useRef, useState } from 'react';
import { DELAY_BETWEEN_STEPS, DELAY_START_RUNNING } from '../constants';

type UseAddingProps = {
  setValue: (value: any) => void;
  step: number;
  max?: number;
};

export function useAdding(props: UseAddingProps) {
  const { setValue, step, max } = props;

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const isAddingRef = useRef(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const incrementValue = useCallback(() => {
    setValue((prev: any) => {
      const newValue = +prev + step;
      return max !== undefined && newValue > max ? max : newValue;
    });
  }, [setValue, step, max]);

  const startAdding = useCallback(() => {
    incrementValue();

    isAddingRef.current = true;
    timeoutIdRef.current = setTimeout(() => {
      setIntervalId(setInterval(incrementValue, DELAY_BETWEEN_STEPS));
    }, DELAY_START_RUNNING);
  }, [incrementValue]);

  const stopAdding = useCallback(() => {
    isAddingRef.current = false;

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [intervalId]);

  return { startAdding, stopAdding };
}
