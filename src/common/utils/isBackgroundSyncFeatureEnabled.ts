export function isBackgroundSyncFeatureEnabled() {
  return 'SyncManager' in window;
}
