import type { PropsWithChildren } from 'react';

type MainProps = PropsWithChildren<any>;

export default function Main(props: MainProps) {
  const { children } = props;

  return <main className='flex size-full items-start justify-start bg-white dark:bg-[#383838]'>{children}</main>;
}
