import { useEffect } from 'react';

const bc = new BroadcastChannel('luckylove');

export default function HomePage() {
  bc.postMessage('New listening connected!');

  useEffect(() => {
    bc.addEventListener('message', (event) => {
      console.log(event.data);
      console.log(event);
    });
  }, []);

  return <div className='size-full p-6 overflow-auto'></div>;
}
