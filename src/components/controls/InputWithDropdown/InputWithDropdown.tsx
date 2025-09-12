import { useMemo, useState, useEffect } from 'react';
import { Combobox as ComboboxOriginal, createListCollection, useCombobox } from '@ark-ui/react/combobox';
import { Field } from '@ark-ui/react/field';
import { Portal } from '@ark-ui/react/portal';
import clsx from 'clsx';
import type { SelectOption } from '../Select/types';
import CloseIcon from '../../svgs/CloseIcon';
import DownArrow from '../../svgs/DownArrow';
import styles from './InputWithDropdown.module.scss';

type InputValueChangeDetails = ComboboxOriginal.InputValueChangeDetails;
type SelectionDetails = ComboboxOriginal.SelectionDetails;

const {
  RootProvider,
  Label,
  Control,
  Trigger,
  Input,
  ClearTrigger,
  Positioner,
  Content,
  ItemGroup,
  Item,
  ItemText,
  ItemIndicator,
} = ComboboxOriginal;

type InputWithDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  onItemSelect: (item: SelectOption) => void;
  /**
   * Dynamic options that can change at any time
   */
  options: Array<SelectOption>;
  placeholder?: string;
  label?: string;
  allowCustomValue?: boolean;
  autoFocus?: boolean;
  closeOnSelect?: boolean;
  disabled?: boolean;
  isInvalid?: boolean;
  /**
   * @default true
   */
  loop?: boolean;
  className?: string;
  labelClassName?: string;
  triggerClassName?: string;
  clearIconClassName?: string;
  dropdownClassName?: string;
  /**
   * Custom filter function. If not provided, uses default string filtering.
   */
  filterFunction?: (options: Array<SelectOption>, inputValue: string) => Array<SelectOption>;
} & Omit<Field.RootProps, 'onChange'>;

export default function InputWithDropdown(props: InputWithDropdownProps) {
  const {
    value,
    onChange,
    onItemSelect,
    label,
    options,
    placeholder,
    allowCustomValue,
    autoFocus,
    closeOnSelect = true,
    disabled,
    isInvalid,
    loop = true,
    labelClassName,
    className,
    triggerClassName,
    clearIconClassName,
    dropdownClassName,
    filterFunction,
    ...rest
  } = props;

  const [filteredItems, setFilteredItems] = useState(options);

  // Default filter function
  const defaultFilterFunction = (optionsList: Array<SelectOption>, inputValue: string) => {
    const lowerInputValue = inputValue.toLowerCase();
    return optionsList.filter(({ label }) => label.toLowerCase().includes(lowerInputValue));
  };

  const collection = useMemo(() => createListCollection({ items: filteredItems }), [filteredItems]);

  const handleInputChange = (details: InputValueChangeDetails) => {
    const newValue = details.inputValue;

    // Update the input value
    onChange(newValue);

    // Filter options based on input
    const filterFunc = filterFunction || defaultFilterFunction;
    const newFilteredItems = filterFunc(options, newValue);
    setFilteredItems(newFilteredItems.length > 0 ? newFilteredItems : options);
  };

  const handleSelect = (details: SelectionDetails) => {
    // Find the selected item from the collection using the details
    const selectedValue = details.value[0]; // Get the first selected value
    const selectedItem = options.find((option) => option.value === selectedValue);

    if (selectedItem) {
      onItemSelect(selectedItem);
    }
  };

  // Update filtered items when options change
  useEffect(() => {
    const filterFunc = filterFunction || defaultFilterFunction;
    const newFilteredItems = filterFunc(options, value);
    setFilteredItems(newFilteredItems.length > 0 ? newFilteredItems : options);
  }, [options, value, filterFunction]);

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
    selectionBehavior: 'preserve', // This prevents the input from being replaced
  });

  return (
    <Field.Root {...rest}>
      <RootProvider
        value={combobox}
        // onExitComplete={() => {}}
      >
        <Label className={labelClassName}>{label}</Label>

        <Control className={clsx(styles.control, className)}>
          <Input value={value} placeholder={placeholder} className='w-full' />

          <div className='shrink-0'>
            <ClearTrigger className={clsx(styles.clearIcon, clearIconClassName)}>
              <CloseIcon />
            </ClearTrigger>

            <Trigger className={clsx(styles.trigger, triggerClassName)}>
              <DownArrow />
            </Trigger>
          </div>
        </Control>

        <Portal>
          <Positioner className={styles.dropdown}>
            <Content className={clsx(styles.content, dropdownClassName)}>
              <ItemGroup>
                {/* <ItemGroupLabel>Frameworks</ItemGroupLabel> */}
                {collection.items.map((item) => (
                  <Item key={item.value} item={item} className={styles.item}>
                    <ItemIndicator className={styles.selectItemIndicator}>✓</ItemIndicator>

                    <ItemText>{item.label}</ItemText>
                  </Item>
                ))}
              </ItemGroup>
            </Content>
          </Positioner>
        </Portal>
      </RootProvider>
    </Field.Root>
  );
}
