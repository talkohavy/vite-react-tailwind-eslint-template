import { wrapInDebounce } from '@talkohavy/lodash';
import { SYNC_REQUESTS } from '../../../../common/constants';
import { isBackgroundSyncFeatureEnabled } from '../../../../common/utils/isBackgroundSyncFeatureEnabled';

async function fireSyncEventCall() {
  if (!isBackgroundSyncFeatureEnabled()) {
    return console.warn('SyncManager is not supported in this browser.');
  }

  const registration = (await navigator.serviceWorker.ready) as any;

  await registration.sync.register(SYNC_REQUESTS);
}

export const fireSyncEvent = wrapInDebounce(fireSyncEventCall, 300);
