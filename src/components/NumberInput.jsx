import React, { useRef, useState } from 'react';
import Input from './Input';

const DELAY_START_RUNNING = 350;
const DELAY_BETWEEN_STEPS = 50;

export default function NumberInput({ value, setValue, step = 1, placeholder = '' }) {
  const [intervalId, setIntervalId] = useState(null);
  const isAddingRef = useRef(false);
  const isSubtractingRef = useRef(false);
  const timeoutIdRef = useRef(null);

  const incrementValue = () => setValue((prev) => +prev + step);
  const decrementValue = () => setValue((prev) => +prev - step);

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

  return (
    <div className='flex gap-2'>
      <Input value={value} setValue={setValue} placeholder={placeholder} />

      <div className='flex flex-col items-center justify-between p-0.5'>
        <button
          type='button'
          // onClick={incrementValue}
          onMouseDown={startAdding}
          onMouseUp={stopAdding}
          onMouseLeave={stopAdding}
          onTouchStart={startAdding}
          onTouchEnd={stopAdding}
          className='flex size-4 items-center justify-center rounded-md bg-neutral-200 text-xs'
        >
          ▲
        </button>
        <button
          type='button'
          // onClick={decrementValue}
          onMouseDown={startSubtracting}
          onMouseUp={stopSubtracting}
          onMouseLeave={stopSubtracting}
          onTouchStart={startSubtracting}
          onTouchEnd={stopSubtracting}
          className='flex size-4 items-center justify-center rounded-md bg-neutral-200 text-xs'
        >
          ▼
        </button>
      </div>
    </div>
  );
}
