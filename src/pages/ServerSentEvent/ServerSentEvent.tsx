import { useEffect, useState } from 'react';
import { getTime } from './logic/getTime';

export default function ServerSentEvent() {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8000/api/sse', { withCredentials: true });

    eventSource.addEventListener('luckylove-data', (event) => {
      console.log('event is:', event);

      const eventData = JSON.parse(event.data);

      setValue(eventData.time);
    });

    eventSource.addEventListener('connect', (event) => {
      console.log('event is:', event);
    });

    return () => eventSource.close();
  }, []);

  return (
    <div className='w-full p-4'>
      <div>hello world</div>
      <div className='text-3xl font-bold'>{value && getTime(value)}</div>
    </div>
  );
}
