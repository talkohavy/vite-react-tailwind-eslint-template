import {
  Arrow,
  Root,
  Trigger,
  Value,
  Icon,
  Portal,
  Viewport,
  Group,
  ScrollDownButton,
  ScrollUpButton,
  Content,
} from '@radix-ui/react-select';
import clsx from 'clsx';
import type { SelectOption } from './types';
import DownArrow from '../../svgs/DownArrow';
import styles from './Select.module.scss';
import SelectItem from './SelectItem';

type SelectProps = {
  selectedOption: SelectOption;
  setSelectedOption: (value: any) => void;
  options: Array<SelectOption>;
  /**
   * Only visible when selectedOption is `null` or an empty object.
   */
  placeholder?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  /**
   * @default 5
   */
  sideOffset?: number;
  /**
   * @default 'bottom'
   */
  placement?: 'bottom' | 'left' | 'right' | 'top';
  /**
   * @default 'start'
   */
  align?: 'center' | 'start' | 'end';
  /**
   * An offset in pixels from the "start" or "end" alignment options. Only available when position is set to popper.
   */
  alignOffset?: number;
  ariaLabel?: string;
  showArrow?: boolean;
  dropdownClassName?: string;
  /**
   * Applies to all items in the dropdown.
   *
   * To affect only the selected item, use `itemClassName[data-state="checked"]`
   *
   * @example
   * itemClassName='bg-red-500 data-[state=checked]:bg-blue-500'
   */
  itemClassName?: string;
};

export default function Select(props: SelectProps) {
  const {
    selectedOption,
    setSelectedOption,
    options,
    placeholder,
    isDisabled,
    isRequired,
    sideOffset = 5,
    placement,
    align,
    alignOffset,
    showArrow,
    ariaLabel,
    dropdownClassName,
    itemClassName,
  } = props;

  return (
    <Root
      value={selectedOption?.value as any}
      onValueChange={(chosenValue) => {
        const selectedOption = options.find(({ value }) => value === chosenValue);

        if (!selectedOption) {
          throw new Error("Select component couldn't find an option to match chosenValue on onValueChange");
        }

        setSelectedOption(selectedOption);
      }}
      dir='ltr'
      disabled={isDisabled}
      required={isRequired}
      // open={isOpen}
      // onOpenChange={setIsOpen}
      // name='' // <--- The name of the select. Submitted with its owning form as part of a name/value pair.
    >
      <Trigger className={styles.selectTrigger} aria-label={ariaLabel}>
        <Value placeholder={placeholder} />
        <Icon className={styles.selectIcon}>
          <DownArrow className='size-2.5' />
        </Icon>
      </Trigger>

      <Portal>
        <Content
          position='popper' // <--- The positioning mode to use, 'item-aligned' is the default and behaves similarly to a native MacOS menu by positioning content relative to the active item. 'popper' positions content in the same way as our other primitives, for example Popover or DropdownMenu.
          side={placement}
          align={align}
          alignOffset={alignOffset}
          sideOffset={sideOffset}
          className={clsx(styles.selectContent, dropdownClassName)}
          // avoidCollisions={false} // <--- defaults to `true`
          // onEscapeKeyDown={(e)=>{}}
          // onPointerDownOutside={(e)=>{}}
          // sticky='always'
          // arrowPadding={arrowPadding}
          // hideWhenDetached // <--- defaults to false
        >
          <ScrollUpButton className={styles.selectScrollButton}>
            <DownArrow className='rotate-180 size-2.5' />
          </ScrollUpButton>

          <Viewport className={styles.selectViewport}>
            <Group>
              {options.map(({ value, label, isDisabled }) => (
                <SelectItem key={value} value={value} disabled={isDisabled} className={itemClassName}>
                  {label}
                </SelectItem>
              ))}
            </Group>
          </Viewport>

          <ScrollDownButton className={styles.selectScrollButton}>
            <DownArrow className='size-2.5' />
          </ScrollDownButton>

          {showArrow && <Arrow className={styles.dropdownMenuArrow} />}
        </Content>
      </Portal>
    </Root>
  );
}
