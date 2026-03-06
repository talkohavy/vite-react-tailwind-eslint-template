import type { ReactNode } from 'react';

type ForkProps = {
  left: ReactNode;
  right: ReactNode;
};

export default function Fork(props: ForkProps) {
  const { left, right } = props;

  return (
    <div className='flex gap-3'>
      <div className='flex-1 flex flex-col gap-1'>{left}</div>

      <div className='flex-1 flex flex-col gap-1'>{right}</div>
    </div>
  );
}
