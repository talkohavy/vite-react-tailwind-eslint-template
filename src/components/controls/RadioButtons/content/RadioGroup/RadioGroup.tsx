import { useRadioGroupLogic } from './logic/useRadioGroupLogic';
import type { _RadioGroupProps } from '../../types';

export default function RadioGroup<T>(props: _RadioGroupProps<T>) {
  const { value: selectedValue, setValue, options, ChildItem, className, childClassName } = props;

  const { tabbableIndex, setInputRefAtIndex, handleKeyDown } = useRadioGroupLogic(props);

  return (
    <div className={className}>
      {options.map(({ value: currentItemValue, label, disabled }, index) => {
        const isChecked = selectedValue === currentItemValue;
        const onChange = () => setValue(currentItemValue);
        const handleInputRef = (el: HTMLInputElement) => {
          setInputRefAtIndex(index, el);
        };

        return (
          <div key={currentItemValue} className='group/radioWrapper relative'>
            <input
              ref={handleInputRef}
              type='radio'
              value={currentItemValue}
              onChange={onChange}
              checked={isChecked}
              disabled={disabled}
              tabIndex={index === tabbableIndex ? 0 : -1}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className='z-10 opacity-0 size-full absolute inset-0 cursor-pointer disabled:cursor-default rounded-full group-has-[input:checked]/radioWrapper:cursor-default'
            />

            <ChildItem
              key={currentItemValue}
              value={currentItemValue}
              label={label}
              isChecked={isChecked}
              className={childClassName}
            />
          </div>
        );
      })}
    </div>
  );
}
