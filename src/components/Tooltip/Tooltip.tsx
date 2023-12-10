import type { PropsWithChildren } from 'react';
import * as TooltipOriginal from '@radix-ui/react-tooltip';

type TooltipProps = PropsWithChildren<{
  content: any;
}>;

export default function Tooltip(props: TooltipProps) {
  const { content, children } = props;

  return (
    <TooltipOriginal.Provider delayDuration={800} skipDelayDuration={500}>
      <TooltipOriginal.Root>
        <TooltipOriginal.Trigger asChild>{children}</TooltipOriginal.Trigger>

        <TooltipOriginal.Portal>
          <TooltipOriginal.Content className='tooltip-content max-w-lg' sideOffset={5}>
            {content}
            <TooltipOriginal.Arrow />
          </TooltipOriginal.Content>
        </TooltipOriginal.Portal>
      </TooltipOriginal.Root>
    </TooltipOriginal.Provider>
  );
}
