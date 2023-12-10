import * as TooltipOriginal from '@radix-ui/react-tooltip';

export default function Tooltip({ content, children }) {
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
