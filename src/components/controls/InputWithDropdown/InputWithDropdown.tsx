import { forwardRef, useMemo } from 'react';
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
  /**
   * @default false
   */
  showClear?: boolean;
  /**
   * @default true
   */
  showArrow?: boolean;
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
  rootClassName?: string;
  labelClassName?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  clearIconClassName?: string;
} & Omit<Field.RootProps, 'onChange'>;

function InputWithDropdownToForward(props: InputWithDropdownProps, ref: React.ForwardedRef<HTMLInputElement>) {
  const {
    value,
    onChange,
    onItemSelect,
    label,
    options,
    placeholder,
    showClear,
    showArrow = true,
    allowCustomValue,
    autoFocus,
    closeOnSelect = true,
    disabled,
    isInvalid,
    loop = true,
    className,
    rootClassName,
    triggerClassName,
    labelClassName,
    dropdownClassName,
    clearIconClassName,
    ...rest
  } = props;

  const collection = useMemo(() => createListCollection({ items: options }), [options]);

  const handleInputChange = (details: InputValueChangeDetails) => {
    // Just update the input value - no filtering logic
    onChange(details.inputValue);
  };

  const handleSelect = (details: SelectionDetails) => {
    const [selectedValue] = details.value;
    const selectedItem = options.find((option) => option.value === selectedValue);

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
    defaultOpen: false,
    openOnKeyPress: true, // <--- defaults to true
  });

  return (
    <Field.Root {...rest}>
      <RootProvider value={combobox} className={rootClassName}>
        <Label className={labelClassName}>{label}</Label>

        <Control className={clsx(styles.control, className)}>
          <Input ref={ref} placeholder={placeholder} className='w-full' />

          <div className='shrink-0'>
            {showClear && (
              <ClearTrigger className={clsx(styles.clearIcon, clearIconClassName)}>
                <CloseIcon />
              </ClearTrigger>
            )}

            {showArrow && (
              <Trigger className={clsx(styles.trigger, triggerClassName)}>
                <DownArrow />
              </Trigger>
            )}
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

const InputWithDropdown = forwardRef<HTMLInputElement, InputWithDropdownProps>(InputWithDropdownToForward);

export default InputWithDropdown;
