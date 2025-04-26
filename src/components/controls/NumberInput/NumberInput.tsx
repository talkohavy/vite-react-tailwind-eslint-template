import { useCallback, useRef, useState } from 'react';
import InputBase from '../Input/InputBase';
import { createIntegerNumbersOnlyRule } from '../Input/logic/rules/createIntegerNumbersOnlyRule';
import { DELAY_BETWEEN_STEPS, DELAY_START_RUNNING } from './constants';

const allowNumbersOnly = createIntegerNumbersOnlyRule(20);

type NumberInputProps = {
  value: number | string;
  setValue: (value: any) => void;
  step: number;
  placeholder?: string;
};

export default function NumberInput(props: NumberInputProps) {
  const { value, setValue, step = 1, placeholder = '' } = props;

  const [intervalId, setIntervalId] = useState<any>(null);
  const isAddingRef = useRef(false);
  const isSubtractingRef = useRef(false);
  const timeoutIdRef = useRef<any>(null);

  const incrementValue = () => setValue((prev: any) => +prev + step);
  const decrementValue = () => setValue((prev: any) => +prev - step);

  const startAdding = () => {
    incrementValue();

    isAddingRef.current = true;
    timeoutIdRef.current = setTimeout(() => {
      setIntervalId(setInterval(incrementValue, DELAY_BETWEEN_STEPS));
    }, DELAY_START_RUNNING);
  };

  const stopAdding = () => {
    isAddingRef.current = false;
    clearTimeout(timeoutIdRef.current);
    clearInterval(intervalId);
  };

  const startSubtracting = () => {
    decrementValue();

    isSubtractingRef.current = true;
    timeoutIdRef.current = setTimeout(() => {
      setIntervalId(setInterval(decrementValue, DELAY_BETWEEN_STEPS));
    }, DELAY_START_RUNNING);
  };

  const stopSubtracting = () => {
    isSubtractingRef.current = false;
    clearTimeout(timeoutIdRef.current);
    clearInterval(intervalId);
  };

  const onTargetValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { shouldChange, newValue } = allowNumbersOnly(e, e.target.value);

      if (shouldChange) {
        setValue(newValue);
      }
    },
    [setValue],
  );

  return (
    <div className='flex gap-2'>
      <InputBase value={value.toString()} setValue={onTargetValueChange} placeholder={placeholder} />

      <div className='flex flex-col items-center justify-between p-0.5'>
        <button
          type='button'
          onMouseDown={startAdding}
          onMouseUp={stopAdding}
          onMouseLeave={stopAdding}
          onTouchStart={startAdding}
          onTouchEnd={stopAdding}
          className='flex size-4 items-center justify-center rounded-md bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:active:bg-neutral-500 text-xs dark:text-white transition-colors'
        >
          ▲
        </button>

        <button
          type='button'
          onMouseDown={startSubtracting}
          onMouseUp={stopSubtracting}
          onMouseLeave={stopSubtracting}
          onTouchStart={startSubtracting}
          onTouchEnd={stopSubtracting}
          className='flex size-4 items-center justify-center rounded-md bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:active:bg-neutral-500 text-xs dark:text-white transition-colors'
        >
          ▼
        </button>
      </div>
    </div>
  );
}
