import type { PropsWithChildren } from 'react';

export default function Main(props: PropsWithChildren) {
  const { children } = props;

  return (
    <main className='flex size-full items-start justify-between overflow-auto bg-white pt-1 dark:bg-[#212121] dark:text-white'>
      {children}
    </main>
  );
}
