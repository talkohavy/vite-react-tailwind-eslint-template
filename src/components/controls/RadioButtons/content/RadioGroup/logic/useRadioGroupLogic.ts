import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import type { _RadioGroupProps } from '../../../types';

export function useRadioGroupLogic<T>(props: _RadioGroupProps<T>) {
  const { value, setValue, options } = props;

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Roving tabindex: only the selected option (or first if none selected) is in the tab order.
  const selectedIndex = options.findIndex((opt) => opt.value === value);
  const tabbableIndex = selectedIndex >= 0 ? selectedIndex : 0;

  function setInputRefAtIndex(index: number, element: HTMLInputElement | null) {
    inputRefs.current[index] = element;
  }

  /**
   * `index` is the index of the current input element.
   * On mount, each input element is assigned an index.
   */
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>, index: number) {
    const direction = getNavigationDirection(e.key);

    if (!direction) return;

    e.preventDefault();

    focusNextEnabledOption(index, direction);
  }

  function getNavigationDirection(key: string): 1 | -1 | null {
    if (key === 'ArrowDown' || key === 'ArrowRight') return 1;
    if (key === 'ArrowUp' || key === 'ArrowLeft') return -1;
    return null;
  }

  function focusNextEnabledOption(fromIndex: number, direction: 1 | -1) {
    for (let i = 1; i <= options.length; i++) {
      const candidate = (fromIndex + direction * i + options.length) % options.length;
      const candidateOption = options[candidate];

      if (candidateOption && !candidateOption.disabled) {
        setValue(candidateOption.value);
        inputRefs.current[candidate]?.focus();
        break;
      }
    }
  }

  return { tabbableIndex, setInputRefAtIndex, handleKeyDown };
}
