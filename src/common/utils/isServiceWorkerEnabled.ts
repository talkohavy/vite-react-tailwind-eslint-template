export function isServiceWorkerEnabled() {
  return 'serviceWorker' in navigator;
}
