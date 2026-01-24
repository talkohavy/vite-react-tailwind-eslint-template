import { forwardRef } from 'react';
import { Portal, Combobox as ComboboxOriginal } from '@ark-ui/react';
import clsx from 'clsx';
import CloseIcon from '../../svgs/CloseIcon';
import DownArrow from '../../svgs/DownArrow';
import styles from './InputWithDropdown.module.scss';
import {
  INPUT_WITH_DROPDOWN_ARROW_CLASS,
  INPUT_WITH_DROPDOWN_CLEAR_CLASS,
  INPUT_WITH_DROPDOWN_CONTROL_CLASS,
  INPUT_WITH_DROPDOWN_DROPDOWN_CLASS,
  INPUT_WITH_DROPDOWN_INPUT_CLASS,
  INPUT_WITH_DROPDOWN_ITEM_CLASS,
  INPUT_WITH_DROPDOWN_ITEM_GROUP_LABEL_CLASS,
  INPUT_WITH_DROPDOWN_ROOT_CLASS,
} from './logic/constants';
import { useInputWithDropdownLogic } from './logic/useInputWithDropdownLogic';
import type { Option, OptionGroup, OpenChangeDetails } from './types';

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
  ItemGroupLabel,
  Item,
  ItemText,
  ItemIndicator,
} = ComboboxOriginal;

export type InputWithDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  onItemSelect: (item: Option) => void;
  onKeyDown?: (e: any) => void;
  onMousedown?: (e: any) => void;
  /**
   * Dynamic options that can change at any time.
   * Can be either a flat array of options or an array of option groups.
   */
  options: Array<Option> | Array<OptionGroup>;
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
  itemClassName?: string;
  itemGroupLabelClassName?: string;
  clearIconClassName?: string;
  /**
   * Controls whether the dropdown is open
   */
  isOpen?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (details: OpenChangeDetails) => void;
  /**
   * @default false
   */
  showDropdownWhenEmpty?: boolean;
  /**
   * @default 'No results found'
   */
  noResultsLabel?: string;
};

function InputWithDropdownToForward(props: InputWithDropdownProps, ref: React.ForwardedRef<HTMLInputElement>) {
  const {
    value,
    onKeyDown,
    onMousedown,
    label,
    placeholder,
    showClear,
    showArrow = true,
    className,
    rootClassName,
    triggerClassName,
    labelClassName,
    dropdownClassName,
    itemClassName,
    itemGroupLabelClassName,
    clearIconClassName,
  } = props;

  const { combobox, groupedOptions } = useInputWithDropdownLogic(props);

  return (
    <RootProvider value={combobox} className={rootClassName}>
      <Label className={clsx(INPUT_WITH_DROPDOWN_ROOT_CLASS, labelClassName)}>{label}</Label>

      <Control className={clsx(INPUT_WITH_DROPDOWN_CONTROL_CLASS, styles.control, className)}>
        <Input
          ref={ref}
          placeholder={placeholder}
          className={clsx(INPUT_WITH_DROPDOWN_INPUT_CLASS, styles.input)}
          onKeyDown={onKeyDown}
          onMouseDown={onMousedown}
        />

        <div className={styles.actionsWrapper}>
          {showClear && (
            <ClearTrigger
              hidden={value.length === 0}
              className={clsx(INPUT_WITH_DROPDOWN_CLEAR_CLASS, styles.clearIcon, clearIconClassName)}
            >
              <CloseIcon />
            </ClearTrigger>
          )}

          {showArrow && (
            <Trigger className={clsx(INPUT_WITH_DROPDOWN_ARROW_CLASS, styles.arrowTrigger, triggerClassName)}>
              <DownArrow />
            </Trigger>
          )}
        </div>
      </Control>

      <Portal>
        <Positioner>
          <Content className={clsx(INPUT_WITH_DROPDOWN_DROPDOWN_CLASS, styles.dropdown, dropdownClassName)}>
            {groupedOptions.map((group, groupIndex) => {
              const GroupLabel = group.groupLabel;
              const RenderedGroupLabel = typeof GroupLabel === 'function' ? <GroupLabel /> : GroupLabel;

              return (
                <ItemGroup key={`group-${groupIndex}`}>
                  {RenderedGroupLabel && (
                    <ItemGroupLabel
                      className={clsx(INPUT_WITH_DROPDOWN_ITEM_GROUP_LABEL_CLASS, itemGroupLabelClassName)}
                    >
                      {RenderedGroupLabel}
                    </ItemGroupLabel>
                  )}

                  {group.items.map((item) => {
                    const Label = item.label;
                    const RenderedLabel = typeof Label === 'function' ? <Label /> : Label;

                    return (
                      <Item
                        key={item.value}
                        item={item}
                        className={clsx(INPUT_WITH_DROPDOWN_ITEM_CLASS, styles.item, itemClassName)}
                      >
                        <div className={styles.selectItemIndicator}>
                          <ItemIndicator>✓</ItemIndicator>
                        </div>

                        <ItemText>{RenderedLabel}</ItemText>
                      </Item>
                    );
                  })}
                </ItemGroup>
              );
            })}
          </Content>
        </Positioner>
      </Portal>
    </RootProvider>
  );
}

const InputWithDropdown = forwardRef<HTMLInputElement, InputWithDropdownProps>(InputWithDropdownToForward);

export default InputWithDropdown;
