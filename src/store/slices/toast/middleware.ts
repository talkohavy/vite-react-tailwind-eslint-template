import { createMiddleware } from '../../helpers/createMiddleware';
import { _internalUpdateTimeoutId, _internalUpdateToastMessage, prefix, showToastMessage } from './actions';
import { emptyMessage } from './reducer';

const toastMiddleware = createMiddleware({
  uniquePrefix: prefix,
  handleAction: ({ action, dispatch, getState }) => {
    if (showToastMessage.match(action)) {
      const { from, type, text } = action.payload;
      const { timeoutId, hasChanged } = getState().toast[from];
      /** @type {any} */
      const enhancedData = { from, isShowing: true, type, text, hasChanged: (hasChanged + 1) % 10 };

      dispatch(_internalUpdateToastMessage(enhancedData));

      // Revert to empty message. Note: the timeoutId is for the empty message! Also, timeoutId isn't really necessary, however it's there strictly for memory saving purposes.
      const newTimeoutId = setTimeout(() => {
        dispatch(_internalUpdateToastMessage({ from, isShowing: false, ...emptyMessage }));
      }, 3000);

      // Run over / Clear previous timeoutId of the empty message to come (If one exists)
      clearTimeout(timeoutId);

      // update the timeoutId of the new empty message to come, so that you'd be able to clear it if another one runs over it.
      dispatch(_internalUpdateTimeoutId({ from, timeoutId: newTimeoutId }));
    }
  },
});

export { toastMiddleware };
