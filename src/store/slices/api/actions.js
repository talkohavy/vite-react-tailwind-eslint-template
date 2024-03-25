import { createAction } from '@reduxjs/toolkit';
import { createActionString } from '../../helpers/createActionString';

/** @typedef {import('./types').ApiRequest} ApiRequest */

const prefix = 'app';
const customActionString = (actionString) => createActionString({ prefix, actionString });

const fireFallbackAction = createAction(customActionString('server responded'), (payload) => ({ payload }));

const apiRequest = createAction(
  customActionString('API Request'),
  /**
   * @param {ApiRequest} payload
   * @returns {{payload: ApiRequest}}
   */
  (payload) => ({
    payload: { method: 'GET', onSuccess: fireFallbackAction, onFailure: fireFallbackAction, ...payload },
  }),
);

export { apiRequest, fireFallbackAction, prefix };
