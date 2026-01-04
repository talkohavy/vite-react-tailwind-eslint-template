import type { ReactNode } from 'react';
import type { ChildItemProps, RadioOption } from './types';

type RadioGroupV2Props<T> = {
  value: number | string;
  setValue: (value: any) => void;
  options: Array<RadioOption<T>>;
  ChildItem: (props: ChildItemProps) => ReactNode;
  className?: string;
};

export default function RadioGroupV2<T>(props: RadioGroupV2Props<T>) {
  const { value: selectedValue, setValue, options, ChildItem, className } = props;

  return (
    <div className={className}>
      {options.map(({ value: currentItemValue, label, disabled }) => {
        const isChecked = selectedValue === currentItemValue;
        const onChange = () => setValue(currentItemValue);

        return (
          <div key={currentItemValue} className='group/radioWrapper relative'>
            <input
              type='radio'
              value={currentItemValue}
              onChange={onChange}
              checked={isChecked}
              disabled={disabled}
              className='z-10 opacity-0 size-full absolute inset-0 cursor-pointer disabled:cursor-default rounded-full'
            />

            <ChildItem key={currentItemValue} value={currentItemValue} label={label} isChecked={isChecked} />
          </div>
        );
      })}
    </div>
  );
}
