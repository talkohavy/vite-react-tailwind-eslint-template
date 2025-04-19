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

  public static addOnInstalListener(onInstall: () => Promise<void>): void {
    if (!MyServiceWorker.isMyServiceWorkerFeatureEnabled()) return;

    MyServiceWorker._self.addEventListener('install', (event: any) => {
      event.waitUntil(onInstall());
    });
  }

  public static addOnActivateListener(onActivate: () => Promise<any>): any {
    if (!MyServiceWorker.isMyServiceWorkerFeatureEnabled()) return;

    MyServiceWorker._self.addEventListener('activate', (event: any) => {
      event.waitUntil(onActivate());

      return MyServiceWorker._self.clients.claim();
    });
  }

  public static addOnFetchListener(onFetch: (event: any) => Promise<Response | undefined>): void {
    if (!MyServiceWorker.isMyServiceWorkerFeatureEnabled()) return;

    MyServiceWorker._self.addEventListener('fetch', (event: any) => {
      event.respondWith(onFetch(event));
    });
  }

  public static isMyServiceWorkerFeatureEnabled(): boolean {
    return 'serviceWorker' in navigator;
  }
}
