import InputBase from '../Input/InputBase';
import { useNumberInputLogic } from './logic/useNumberInputLogic';

export type NumberInputProps = {
  value: number | string;
  setValue: (value: any) => void;
  step: number;
  min?: number;
  max?: number;
  placeholder?: string;
};

export default function NumberInput(props: NumberInputProps) {
  const { value, setValue, step = 1, min, max, placeholder = '' } = props;

  const { startAdding, stopAdding, startSubtracting, stopSubtracting, onTargetValueChange } = useNumberInputLogic({
    setValue,
    step,
    min,
    max,
  });

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
