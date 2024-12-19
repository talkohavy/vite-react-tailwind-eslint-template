import type { PropsWithChildren } from 'react';

export default function Main(props: PropsWithChildren) {
  const { children } = props;

  return (
    <main className='flex size-full items-center justify-between bg-white dark:bg-[#212121] dark:text-white'>
      {children}
    </main>
  );
}
