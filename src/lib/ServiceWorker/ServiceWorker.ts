export class ServiceWorker {
  private static instance: ServiceWorker;
  private static _self: any;

  private constructor() {} // <--- prevent instantiation

  public static getInstance(self: any): ServiceWorker {
    if (!ServiceWorker.instance) {
      ServiceWorker.instance = new ServiceWorker();
      ServiceWorker._self = self;
    }

    return ServiceWorker.instance;
  }

  public static addOnInstalListener(onInstall: () => Promise<void>): void {
    if (!ServiceWorker.isServiceWorkerEnabled()) return;

    ServiceWorker._self.addEventListener('install', (event: any) => {
      event.waitUntil(onInstall());
    });
  }

  public static addOnActivateListener(onActivate: () => Promise<any>): any {
    if (!ServiceWorker.isServiceWorkerEnabled()) return;

    ServiceWorker._self.addEventListener('activate', (event: any) => {
      event.waitUntil(onActivate());
    });

    return ServiceWorker._self.clients.claim();
  }

  public static addOnFetchListener(onFetch: (event: any) => Promise<Response | undefined>): void {
    if (!ServiceWorker.isServiceWorkerEnabled()) return;

    ServiceWorker._self.addEventListener('fetch', (event: any) => {
      event.respondWith(onFetch(event));
    });
  }

  public static isServiceWorkerEnabled(): boolean {
    return 'serviceWorker' in navigator;
  }
}
