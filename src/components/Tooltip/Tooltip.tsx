import type { PropsWithChildren } from 'react';
import * as TooltipOriginal from '@radix-ui/react-tooltip';

type TooltipProps = PropsWithChildren<{
  content: any;
}>;

export default function Tooltip(props: TooltipProps) {
  const { content, children } = props;

  return (
    <TooltipOriginal.Provider delayDuration={600} skipDelayDuration={2000}>
      <TooltipOriginal.Root>
        <TooltipOriginal.Trigger asChild>{children}</TooltipOriginal.Trigger>

        <TooltipOriginal.Portal>
          <TooltipOriginal.Content
            className='tooltip-content z-10 max-w-lg rounded border border-black bg-white p-2'
            sideOffset={5}
          >
            {content}
            <TooltipOriginal.Arrow className='fill-gray-600' />
          </TooltipOriginal.Content>
        </TooltipOriginal.Portal>
      </TooltipOriginal.Root>
    </TooltipOriginal.Provider>
  );
}
