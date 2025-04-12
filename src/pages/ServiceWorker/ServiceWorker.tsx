import { useEffect, useState } from 'react';
import Button from '../../components/controls/Button';
import { registerServiceWorker } from './utils/registerServiceWorker';

export default function ServiceWorker() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // should essentially be called on main.tsx, but for the sake of this example, we are calling it here
    registerServiceWorker();
  }, []);

  useEffect(() => {
    function appInstalled(_event: any) {
      console.log('PWA was installed');
    }

    window.addEventListener('appinstalled', appInstalled);

    return () => {
      window.removeEventListener('appinstalled', appInstalled);
    };
  }, []);

  return (
    <div className='size-full p-6 overflow-auto'>
      <div>Service Worker Tutorial</div>

      <Button className='mt-4' onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Hide' : 'Show'} PWA Install Prompt
      </Button>

      {isVisible && <img src='/heart-256x256.png' alt='PWA Install Prompt' className='w-1/2 h-auto' />}
    </div>
  );
}
