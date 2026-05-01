import { useState } from 'react';
import Button from '@src/components/controls/Button';

export default function LazyCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className='flex flex-col gap-3'>
      <p className='text-sm dark:text-white/70'>
        <strong>NOTE!</strong> If this was NOT lazy, you'd see the same count value from the previous session.
      </p>

      <p className='text-sm dark:text-white/70'>
        This content is lazily mounted — it unmounts when the modal closes. Increment the counter, close, and reopen to
        see it reset.
      </p>

      <div className='flex items-center gap-3'>
        <Button onClick={() => setCount((c) => c - 1)}>−</Button>
        <span className='text-xl font-semibold w-6 text-center dark:text-white'>{count}</span>
        <Button onClick={() => setCount((c) => c + 1)}>+</Button>
      </div>
    </div>
  );
}
