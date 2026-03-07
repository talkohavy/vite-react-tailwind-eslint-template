import { SYNC_REQUESTS_TAG } from '@src/common/constants/serviceWorker';

// NOTE! The name `ServiceWorker` is already taken
export class MyServiceWorker {
  private static instance: MyServiceWorker;
  private static _self: any;

  private constructor() {} // <--- prevent instantiation

  public static getInstance(self: any): MyServiceWorker {
    if (!MyServiceWorker.instance) {
      MyServiceWorker.instance = new MyServiceWorker();
      MyServiceWorker._self = self;
    }

    return MyServiceWorker.instance;
  }

  /**
   * On install, the Service Worker caches the static assets.
   */
  public static addOnInstalListener(onInstall: () => Promise<void>): void {
    MyServiceWorker._self.addEventListener('install', (event: any) => {
      event.waitUntil(onInstall());
    });
  }

  /**
   * On activate, the Service Worker cleans up the old caches.
   */
  public static addOnActivateListener(onActivate: () => Promise<any>): any {
    MyServiceWorker._self.addEventListener('activate', (event: any) => {
      event.waitUntil(onActivate().then(() => MyServiceWorker._self.clients.claim()));
    });
  }

  /**
   * On fetch, the Service Worker caches the dynamic assets.
   */
  public static addOnFetchListener(onFetch: (event: any) => Promise<Response | undefined>): void {
    MyServiceWorker._self.addEventListener('fetch', (event: any) => {
      event.respondWith(onFetch(event));
    });
  }

  /**
   * On sync, the Service Worker syncs the data.
   */
  public static addOnSyncListener(onSync: (event: any) => void): void {
    MyServiceWorker._self.addEventListener('sync', (event: any) => {
      if (event.tag !== SYNC_REQUESTS_TAG) {
        console.error('No tag found for sync event');
        return;
      }

      event.waitUntil(onSync(event));
    });
  }
}
