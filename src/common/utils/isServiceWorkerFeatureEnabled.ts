export function isServiceWorkerFeatureEnabled() {
  return 'serviceWorker' in navigator;
}
