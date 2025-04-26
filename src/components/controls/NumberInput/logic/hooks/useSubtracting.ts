import { useCallback, useRef, useState } from 'react';
import { DELAY_BETWEEN_STEPS, DELAY_START_RUNNING } from '../constants';

type UseSubtractingProps = {
  setValue: (value: any) => void;
  step: number;
  min?: number;
};

export function useSubtracting(props: UseSubtractingProps) {
  const { setValue, step, min } = props;

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const isSubtractingRef = useRef(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const decrementValue = useCallback(() => {
    setValue((prev: any) => {
      const newValue = +prev - step;
      return min !== undefined && newValue < min ? min : newValue;
    });
  }, [setValue, step, min]);

  const startSubtracting = useCallback(() => {
    decrementValue();

    isSubtractingRef.current = true;
    timeoutIdRef.current = setTimeout(() => {
      setIntervalId(setInterval(decrementValue, DELAY_BETWEEN_STEPS));
    }, DELAY_START_RUNNING);
  }, [decrementValue]);

  const stopSubtracting = useCallback(() => {
    isSubtractingRef.current = false;

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [intervalId]);

  return { startSubtracting, stopSubtracting };
}
