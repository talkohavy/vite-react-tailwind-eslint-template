import { createAction } from '@reduxjs/toolkit';
import { createActionString } from '../../helpers/createActionString';

const prefix = 'backMsgs';
const customActionString = (actionString) => createActionString({ prefix, actionString });

const enterBackMsgMode = createAction(
  customActionString('Entered backMsg mode'),
  /** @param {{from: string, type?: string, text: string}} payload */
  (payload) => ({ payload }),
);
const showBackMsg = createAction(
  customActionString('Show backMsg'),
  /** @param {{from: string}} payload */
  (payload) => ({ payload }),
);
const hideBackMsg = createAction(
  customActionString('Hide backMsg'),
  /** @param {{from: string}} payload */
  (payload) => ({ payload }),
);

const updateBackMsg = createAction(
  customActionString('toggle backMsg'),
  /** @param {{from: string, type: string, text: string, hasChanged?: any}} payload */
  (payload) => ({ payload }),
);
const updateTimeoutID = createAction(
  customActionString('Update timeoutID'),
  /** @param {{from: string, id: any}} payload */
  (payload) => ({ payload }),
);

export { enterBackMsgMode, hideBackMsg, prefix, showBackMsg, updateBackMsg, updateTimeoutID };
