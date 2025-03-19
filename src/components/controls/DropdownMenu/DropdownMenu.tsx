import type { PropsWithChildren, ReactNode } from 'react';
import clsx from 'clsx';
import { DropdownMenu as DropdownMenuOriginal } from 'radix-ui';
import styles from './DropdownMenu.module.scss';

const { Trigger, Root, Portal, Content, Arrow } = DropdownMenuOriginal;

type DropdownMenuProps = PropsWithChildren<{
  triggerElement: ReactNode;
  isOpen?: boolean;
  showArrow?: boolean;
  isLoop?: boolean;
  setIsOpen?: (value: boolean) => void;
  isModal?: boolean;
  /**
   * @default 5
   */
  sideOffset?: number;
  className?: string;
}>;

export default function DropdownMenu(props: DropdownMenuProps) {
  const { children, isOpen, setIsOpen, isModal, showArrow, isLoop, sideOffset = 5, triggerElement, className } = props;

  return (
    <Root open={isOpen} onOpenChange={setIsOpen} modal={isModal}>
      <Trigger asChild>{triggerElement}</Trigger>

      <Portal>
        <Content className={clsx(styles.dropdownMenuContent, className)} sideOffset={sideOffset} loop={isLoop}>
          {children}

          {showArrow && <Arrow className={styles.dropdownMenuArrow} />}
        </Content>
      </Portal>
    </Root>
  );
}
