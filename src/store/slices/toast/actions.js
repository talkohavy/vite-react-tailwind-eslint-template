import { createAction } from '@reduxjs/toolkit';
import { createActionString } from '../../helpers/createActionString';

/**
 * @typedef {import('../../types').ToastType} ToastType
 * @typedef {import('../../types').SingleToastState} SingleToastState
 */

const prefix = 'toast';
const customActionString = (actionString) => createActionString({ prefix, actionString });

const showToastMessage = createAction(
  customActionString('Show toast message'),
  /** @param {{from: string, type?: ToastType, text: string}} payload */
  (payload) => ({ payload }),
);
const _internalUpdateToastMessage = createAction(
  customActionString('Internal update toast message in store'),
  /** @param {SingleToastState} payload */
  (payload) => ({ payload }),
);

const _internalUpdateTimeoutId = createAction(
  customActionString('Update timeoutId of toast message in store'),
  /** @param {{from: string, timeoutId: any}} payload */
  (payload) => ({ payload }),
);

export { _internalUpdateTimeoutId, _internalUpdateToastMessage, prefix, showToastMessage };
