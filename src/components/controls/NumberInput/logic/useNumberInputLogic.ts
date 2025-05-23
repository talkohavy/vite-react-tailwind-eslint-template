import { useCallback } from 'react';
import { allowNumbersOnly } from './constants';
import { useAdding } from './hooks/useAdding';
import { useSubtracting } from './hooks/useSubtracting';
import { isWithinRange } from './utils/isWithinRange';

type useNumberInputLogicProps = {
  value: number;
  setValue: (value: any) => void;
  step: number;
  min?: number;
  max?: number;
};

export function useNumberInputLogic(props: useNumberInputLogicProps) {
  const { value, setValue, step, min, max } = props;

  // Invoked on user typing:
  const onTargetValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { shouldChange, newValue } = allowNumbersOnly(e, e.target.value);
      const shouldStillChange = shouldChange && isWithinRange({ newValue, min, max });

      if (shouldStillChange) {
        setValue(Number(newValue));
      }
    },
    [setValue, min, max],
  );

  const { startAdding, stopAdding } = useAdding({ value, setValue, step, max });

  const { startSubtracting, stopSubtracting } = useSubtracting({ value, setValue, step, min });

  return {
    onTargetValueChange,
    startAdding,
    stopAdding,
    startSubtracting,
    stopSubtracting,
  };
}
