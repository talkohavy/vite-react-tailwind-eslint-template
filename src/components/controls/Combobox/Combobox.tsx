import { useMemo, useState } from 'react';
import { Combobox as ComboboxOriginal, createListCollection, type ListCollection } from '@ark-ui/react/combobox';
import { Field } from '@ark-ui/react/field';
import { Portal } from '@ark-ui/react/portal';
import clsx from 'clsx';
import type { SelectOption } from '../Select/types';
import CloseIcon from '../../svgs/CloseIcon';
import DownArrow from '../../svgs/DownArrow';
import styles from './Combobox.module.scss';

type InputValueChangeDetails = ComboboxOriginal.InputValueChangeDetails;
type ValueChangeDetails<T> = ComboboxOriginal.ValueChangeDetails<T>;

const {
  Root,
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

type ComboboxProps = {
  inputValue: string;
  setInputValue: (value: any) => void;
  selectOption: SelectOption | null;
  setSelectOption: (value: any) => void;
  /**
   * WARNING!
   *
   * value cannot be 0! Component does not know how to handle it when navigating using keyboard arrows.
   */
  options: Array<SelectOption>;
  placeholder?: string;
  allowCustomValue?: boolean;
  autoFocus?: boolean;
  closeOnSelect?: boolean;
  disabled?: boolean;
  isInvalid?: boolean;
  loop?: boolean;
  isMultiSelect?: boolean;
  controlClassName?: string;
  triggerClassName?: string;
  clearIconClassName?: string;
} & Field.RootProps;

export default function Combobox(props: ComboboxProps) {
  const {
    inputValue,
    setInputValue,
    selectOption,
    setSelectOption,
    options,
    placeholder,
    allowCustomValue,
    autoFocus,
    closeOnSelect,
    disabled,
    isInvalid,
    loop,
    isMultiSelect,
    controlClassName,
    triggerClassName,
    clearIconClassName,
    ...rest
  } = props;

  const [filteredItems, setFilteredItems] = useState(options);

  const collection = useMemo(() => createListCollection({ items: filteredItems }), [filteredItems]);

  return (
    <Field.Root {...rest}>
      <Root
        inputValue={inputValue}
        onInputValueChange={(details: InputValueChangeDetails) => {
          const newValue = details.inputValue.toLowerCase();
          const newFilteredItems = options.filter(({ label }) => label.toLowerCase().includes(newValue));
          setInputValue(details.inputValue);
          if (newFilteredItems.length) {
            setFilteredItems(newFilteredItems);
          } else {
            setFilteredItems(options);
          }
        }}
        defaultValue={[selectOption] as any}
        onValueChange={(details: ValueChangeDetails<string>) => {
          // details.value would give you the item's value
          // details.items would give you the item itself
          if (details.items.length) {
            setSelectOption(details.items[0]);
          } else {
            setSelectOption(null);
          }
        }}
        collection={collection as ListCollection<any>}
        disabled={disabled}
        invalid={isInvalid}
        loopFocus={loop}
        autoFocus={autoFocus}
        allowCustomValue={allowCustomValue}
        closeOnSelect={closeOnSelect} // inputBehavior='autocomplete' // <--- defaults to 'none'. Options are: 'none' | 'autohighlight' | 'autocomplete'. Defines the auto-completion behavior of the combobox. - `autohighlight`: The first focused item is highlighted as the user types - `autocomplete`: Navigating the listbox with the arrow keys selects the item and the input is updated
        // defaultOpen={isInitiallyOpen} // <--- The initial open state of the combobox when rendered. Use when you don't need to control the open state of the combobox.
        // onHighlightChange={() => {}}
        // onInteractOutside={() => {}}
        // onExitComplete={() => {}}
        // onFocusOutside={() => {}}
        // onOpenChange={() => {}}
        // onPointerDownOutside={() => {}}
        multiple={isMultiSelect}
      >
        <Label className='bg-red-400'>Framework</Label>
        <Control className={clsx(styles.control, controlClassName)}>
          <Input defaultValue={selectOption?.label ?? ''} placeholder={placeholder} />

          <ClearTrigger className={clsx(styles.clearIcon, clearIconClassName)}>
            <CloseIcon />
          </ClearTrigger>

          <Trigger className={clsx(styles.trigger, triggerClassName)}>
            <DownArrow />
          </Trigger>
        </Control>

        <Portal>
          <Positioner className={styles.dropdown}>
            <Content className={styles.content}>
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
      </Root>
    </Field.Root>
  );
}
