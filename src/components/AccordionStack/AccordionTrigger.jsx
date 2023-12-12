import { forwardRef } from 'react';
import clsx from 'clsx';
import { Header, Trigger } from '@radix-ui/react-accordion';
import DownArrow from '../../utils/svg/DownArrow';

function AccordionTriggerName({ children, className, ...props }, ref) {
  return (
    <Header className='flex'>
      <Trigger
        className={clsx(
          'group flex h-11 flex-1 items-center justify-between bg-white px-5 text-purple-500 shadow-sm hover:bg-slate-50',
          className,
        )}
        {...props}
        ref={ref}
      >
        {children}

        <DownArrow size={15} aria-hidden className='transition-all duration-300 group-data-[state=open]:rotate-180' />
      </Trigger>
    </Header>
  );
}

const AccordionTrigger = forwardRef(AccordionTriggerName);

export default AccordionTrigger;
