import { useMemo } from 'react';
import { type Combobox as ComboboxOriginal, createListCollection, useCombobox } from '@ark-ui/react';
import type { InputWithDropdownProps } from '../InputWithDropdown';
import type { Option, OptionGroup } from '../types';
import { flattenOptions } from './utils/flattenOptions';
import { groupOptions } from './utils/groupOptions';
import { isGroupedOptions } from './utils/isGroupedOptions';
import '../styles.css';

type InputValueChangeDetails = ComboboxOriginal.InputValueChangeDetails;
type SelectionDetails = ComboboxOriginal.SelectionDetails;

export function useInputWithDropdownLogic(props: InputWithDropdownProps) {
  const {
    value,
    onChange,
    onItemSelect,
    options,
    allowCustomValue,
    autoFocus,
    closeOnSelect = true,
    disabled,
    isInvalid,
    loop = true,
    isOpen,
    onOpenChange,
    showDropdownWhenEmpty = false,
    noResultsLabel = 'No results found',
  } = props;

  const { flatOptions, groupedOptions, collection } = useMemo(() => {
    let flatOptions: Option[];
    let groupedOptions: OptionGroup[];

    if (isGroupedOptions(options)) {
      flatOptions = flattenOptions(options);
      groupedOptions = options;
    } else {
      flatOptions = options;
      groupedOptions = groupOptions({ options });
    }

    if (flatOptions.length === 0 && showDropdownWhenEmpty) {
      const emptyItem: Option = { value: '__no_results__', label: noResultsLabel, disabled: true };
      flatOptions = [emptyItem];
      groupedOptions = [{ items: [emptyItem], groupLabel: undefined }];
    }

    const collection = createListCollection({ items: flatOptions });

    return { flatOptions, groupedOptions, collection };
  }, [options, showDropdownWhenEmpty, noResultsLabel]);

  const handleInputChange = (details: InputValueChangeDetails) => {
    // Just update the input value - no filtering logic
    onChange(details.inputValue);
  };

  const handleSelect = (details: SelectionDetails) => {
    const [selectedValue] = details.value;

    const selectedItem = flatOptions.find((option) => option.value === selectedValue);

    if (selectedItem) {
      onItemSelect(selectedItem);
    }
  };

  const combobox = useCombobox({
    collection,
    onInputValueChange: handleInputChange,
    onSelect: handleSelect,
    inputValue: value,
    disabled,
    invalid: isInvalid,
    loopFocus: loop,
    autoFocus,
    allowCustomValue,
    closeOnSelect,
    selectionBehavior: 'preserve', // <--- This prevents the input from being replaced
    open: isOpen,
    onOpenChange,
    openOnKeyPress: true, // <--- defaults to true
  });

  return { combobox, groupedOptions };
}
