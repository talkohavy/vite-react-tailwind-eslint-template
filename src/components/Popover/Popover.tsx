import { Arrow, Content, Portal, Root, Trigger, Anchor, Close } from '@radix-ui/react-popover';

type PopoverProps = {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  isModal?: boolean;
  content: any;
  isAnchor?: boolean;
  isClose?: boolean;
};

/**
 *
 * @description
 * Needs more work...
 */
export default function Popover(props: PopoverProps) {
  const { isOpen, setIsOpen, isModal, content, isAnchor, isClose } = props;

  return (
    <Root
      open={isOpen} // <--- The controlled open state of the popover. Must be used in conjunction with onOpenChange.
      onOpenChange={setIsOpen} // <--- Event handler called when the open state of the popover changes.
      modal={isModal} // <--- The modality of the popover. When set to true, interaction with outside elements will be disabled and only popover content will be visible to screen readers.
      // defaultOpen // <--- The open state of the popover when it is initially rendered. Use when you do not need to control its open state.
    >
      <Trigger
        asChild
        className='inline-flex h-9 items-center justify-center rounded border border-transparent bg-white px-4 font-medium shadow-xs hover:bg-neutral-100 focus:border-black dark:bg-slate-800 dark:shadow-dark-xs dark:hover:bg-neutral-800'
      >
        <div className='inline-flex h-9 items-center justify-center rounded border border-transparent bg-white px-4 font-medium shadow-xs hover:bg-neutral-100 focus:border-black dark:bg-slate-800 dark:shadow-dark-xs dark:hover:bg-neutral-800'>
          More info
        </div>
      </Trigger>

      {isAnchor && <Anchor />}

      <Portal>
        <Content className='w-64 rounded bg-white p-5 shadow-xs dark:bg-slate-800 dark:text-white dark:shadow-dark-xs'>
          {isClose && <Close className='fill-red-700 bg-red-600' />}
          {content}
          <Arrow className='fill-white dark:fill-slate-800' />
        </Content>
      </Portal>
    </Root>
  );
}
