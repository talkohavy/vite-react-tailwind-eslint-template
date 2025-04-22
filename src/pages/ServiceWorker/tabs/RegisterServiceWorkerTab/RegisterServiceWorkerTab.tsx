import { useEffect } from 'react';
import { registerServiceWorker } from '../../logic/utils/registerServiceWorker';

export default function RegisterServiceWorkerTab() {
  useEffect(() => {
    // should essentially be called on main.tsx, but for the sake of this example, we are calling it here
    registerServiceWorker();
  }, []);

  return (
    <div className='size-full p-6 overflow-auto'>
      <div>Service Worker Tutorial</div>

      <div className='border rounded-md p-2 mt-4'>
        This page should be loaded from the service worker, even if you're offline.
      </div>
    </div>
  );
}
