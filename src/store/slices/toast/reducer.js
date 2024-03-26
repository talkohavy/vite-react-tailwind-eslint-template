import { createReducer } from '@reduxjs/toolkit';
import { _internalUpdateTimeoutId, _internalUpdateToastMessage } from './actions';

/**
 * @typedef {import('../../types').ToastState} ToastState
 * @typedef {import('../../types').SingleToastState} SingleToastState
 */

/** @type {SingleToastState} */
export const emptyMessage = { timeoutId: null, isShowing: false, type: '', text: '', hasChanged: 0 };

/** @type {ToastState} */
const INITIAL_STATE = {
  login: emptyMessage,
  register: emptyMessage,
};

const toastReducer = createReducer(INITIAL_STATE, ({ addCase }) => {
  addCase(_internalUpdateToastMessage, (state, action) => {
    const { from, ...rest } = action.payload;
    state[from] = rest;
  });
  addCase(_internalUpdateTimeoutId, (state, action) => {
    const { from, timeoutId } = action.payload;
    state[from].timeoutId = timeoutId;
  });
});

export { toastReducer };
