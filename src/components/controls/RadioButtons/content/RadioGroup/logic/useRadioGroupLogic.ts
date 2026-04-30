import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import type { _RadioGroupProps } from '../../../types';

export function useRadioGroupLogic<T>(props: _RadioGroupProps<T>) {
  const { value, setValue, options } = props;

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Roving tabindex: only the selected option (or first if none selected) is in the tab order.
  const selectedIndex = options.findIndex((opt) => opt.value === value);
  const tabbableIndex = selectedIndex >= 0 ? selectedIndex : 0;

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>, index: number) {
    const isNext = e.key === 'ArrowDown' || e.key === 'ArrowRight';
    const isPrev = e.key === 'ArrowUp' || e.key === 'ArrowLeft';
    if (!isNext && !isPrev) return;

    e.preventDefault();
    const direction = isNext ? 1 : -1;

    for (let i = 1; i <= options.length; i++) {
      const candidate = (index + direction * i + options.length) % options.length;
      const candidateOption = options[candidate];
      if (candidateOption && !candidateOption.disabled) {
        setValue(candidateOption.value);
        inputRefs.current[candidate]?.focus();
        break;
      }
    }
  }

  function setInputRefAtIndex(index: number, element: HTMLInputElement | null) {
    inputRefs.current[index] = element;
  }

  return { tabbableIndex, setInputRefAtIndex, handleKeyDown };
}
