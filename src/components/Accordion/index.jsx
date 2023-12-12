import React from 'react';
import clsx from 'clsx';
import { Content, Header, Item, Root, Trigger } from '@radix-ui/react-accordion';
import DownArrow from '../../utils/svg/DownArrow';

function AccordionTriggerName({ children, className, ...props }, forwardedRef) {
  return (
    <Header className='flex'>
      <Trigger
        className={clsx(
          'group flex h-11 flex-1 items-center justify-between bg-white px-5 text-purple-500 shadow-sm hover:bg-slate-50',
          className,
        )}
        {...props}
        ref={forwardedRef}
      >
        {children}

        <DownArrow size={15} aria-hidden className='transition-all duration-300 group-data-[state=open]:rotate-180' />
      </Trigger>
    </Header>
  );
}

const AccordionTrigger = React.forwardRef(AccordionTriggerName);

function AccordionContentNamed({ children, className, ...props }, forwardedRef) {
  return (
    <Content className={clsx('overflow-hidden bg-slate-50 text-slate-700', className)} {...props} ref={forwardedRef}>
      <div className='px-5 py-4'>{children}</div>
    </Content>
  );
}

const AccordionContent = React.forwardRef(AccordionContentNamed);

export default function Accordion() {
  return (
    <Root className='w-80 rounded-md bg-slate-100 shadow-sm' type='single' defaultValue='item-1' collapsible>
      <Item
        className='mt-px overflow-hidden first:mt-0 first:rounded-t-sm last:rounded-b-sm focus-within:relative focus-within:z-10 focus-within:shadow-xs'
        value='item-1'
      >
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
      </Item>

      <Item
        className='mt-px overflow-hidden first:mt-0 first:rounded-t-sm last:rounded-b-sm focus-within:relative focus-within:z-10 focus-within:shadow-xs'
        value='item-2'
      >
        <AccordionTrigger>Is it unstyled?</AccordionTrigger>
        <AccordionContent>Yes. It's unstyled by default, giving you freedom over the look and feel.</AccordionContent>
      </Item>
      <Item
        className='mt-px overflow-hidden first:mt-0 first:rounded-t-sm last:rounded-b-sm focus-within:relative focus-within:z-10 focus-within:shadow-xs'
        value='item-3'
      >
        <AccordionTrigger>Can it be animated?</AccordionTrigger>
        <Content className='overflow-hidden bg-slate-50 text-slate-700'>
          <div className='px-5 py-4'>Yes! You can animate the Accordion with CSS or JavaScript.</div>
        </Content>
      </Item>
    </Root>
  );
}
