import { createMiddleware } from '../../helpers/createMiddleware';
import { enterBackMsgMode, hideBackMsg, prefix, showBackMsg, updateBackMsg, updateTimeoutID } from './actions';

const backMsgMiddleware = createMiddleware({
  uniquePrefix: prefix,
  handleAction: ({ action, dispatch, getState }) => {
    if (enterBackMsgMode.match(action)) {
      const { from, type, text } = action.payload;
      const { timeoutID, hasChanged } = getState().backMsgs[from];
      // Step 1: set isShowing to true
      dispatch(showBackMsg({ from }));
      // Step 2: Enrich data
      const data = { from, type, text, hasChanged: (hasChanged + 1) % 10 };
      // Step 3: Update backMsg
      dispatch(updateBackMsg(data));
      // Step 4: promise: Revert to empty message
      // Note: timeoutID is of the empty message! Also, timeoutID isn't really necessary, however it's there strictly for memory saving purposes.
      const newTimeoutID = setTimeout(() => {
        dispatch(updateBackMsg({ from, type: '', text: '' }));
        dispatch(hideBackMsg({ from }));
      }, 3000);
      // Step 5: Clear previous timeoutID of the empty message to come (If one exists)
      clearTimeout(timeoutID);
      // Step 6: Log the timeoutID of the new empty message
      dispatch(updateTimeoutID({ from, id: newTimeoutID }));
    }
  },
});

export { backMsgMiddleware };
