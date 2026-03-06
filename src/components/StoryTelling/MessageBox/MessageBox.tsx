import type { PropsWithChildren } from 'react';

type MessageBoxProps = PropsWithChildren<{
  title: string;
}>;

export default function MessageBox(props: MessageBoxProps) {
  const { title, children } = props;

  return (
    <div className='border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-900/80 dark:border-blue-600 rounded-r-lg px-4 py-3 text-sm'>
      <div className='font-semibold mb-1 text-blue-700 dark:text-blue-300'>{title}</div>

      <div className='text-gray-700 dark:text-gray-300'>{children}</div>
    </div>
  );
}
