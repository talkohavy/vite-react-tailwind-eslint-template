import { forwardRef } from 'react';
import clsx from 'clsx';
import { Content } from '@radix-ui/react-accordion';

function AccordionContentNamed({ children, className, ...props }, ref) {
  return (
    <Content className={clsx('overflow-hidden bg-slate-50 text-slate-700', className)} {...props} ref={ref}>
      {children}
    </Content>
  );
}

const AccordionContent = forwardRef(AccordionContentNamed);

export default AccordionContent;
