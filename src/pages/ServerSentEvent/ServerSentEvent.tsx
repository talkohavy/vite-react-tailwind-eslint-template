import { useEffect, useState } from 'react';

export default function ServerSentEvent() {
  const [value, setValue] = useState();

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8000/sse', { withCredentials: true });

    eventSource.addEventListener('my-data', (event) => {
      console.log('event is:', event);

      const eventData = JSON.parse(event.data);

      setValue(eventData.time);
    });

    return () => eventSource.close();
  }, []);

  return (
    <div className='w-full p-4'>
      <div>hello world</div>
      <div>{value}</div>
    </div>
  );
}
