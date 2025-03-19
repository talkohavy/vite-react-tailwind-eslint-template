import { type PropsWithChildren, forwardRef } from 'react';
import { Content } from '@radix-ui/react-accordion';
import clsx from 'clsx';

type AccordionContentProps = PropsWithChildren<{ className?: string }>;

function AccordionContentToForward(props: AccordionContentProps, ref: any) {
  const { children, className, ...restProps } = props;

  return (
    <Content className={clsx('overflow-hidden bg-slate-50 text-slate-700', className)} {...restProps} ref={ref}>
      {children}
    </Content>
  );
}

const AccordionContent = forwardRef(AccordionContentToForward);

export default AccordionContent;
