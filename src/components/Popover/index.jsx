import * as PopoverOriginal from '@radix-ui/react-popover';

export default function Popover({ content }) {
  return (
    <PopoverOriginal.Root>
      <PopoverOriginal.Trigger className='inline-flex h-9 items-center justify-center rounded border border-transparent bg-white px-4 font-medium shadow-xs hover:bg-neutral-100 focus:border-black dark:bg-slate-800 dark:shadow-dark-xs dark:hover:bg-neutral-800'>
        More info
      </PopoverOriginal.Trigger>

      <PopoverOriginal.Portal>
        <PopoverOriginal.Content className='w-64 rounded bg-white p-5 shadow-xs dark:bg-slate-800 dark:text-white dark:shadow-dark-xs'>
          {content}
          <PopoverOriginal.Arrow className='fill-white dark:fill-slate-800' />
        </PopoverOriginal.Content>
      </PopoverOriginal.Portal>
    </PopoverOriginal.Root>
  );
}
