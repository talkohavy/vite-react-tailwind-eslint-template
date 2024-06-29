import { createAction } from '@reduxjs/toolkit';
import { createActionString } from '../../helpers/createActionString';

/** @typedef {import('./types').ApiRequest} ApiRequest */

const prefix = 'api';
const customActionString = (actionString) => createActionString({ prefix, actionString });

const fireFallbackAction = createAction(customActionString('server responded'), (payload) => ({ payload }));

const apiRequestFlow = createAction(
  customActionString('API Request'),
  /**
   * @param {ApiRequest} payload
   * @returns {{payload: ApiRequest}}
   */
  (payload) => ({
    payload: { onSuccess: fireFallbackAction, onFailure: fireFallbackAction, ...payload },
  }),
);

export { apiRequestFlow, fireFallbackAction, prefix };
