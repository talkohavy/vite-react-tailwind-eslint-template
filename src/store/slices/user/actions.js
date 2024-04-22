import { createAction } from '@reduxjs/toolkit';
import { createActionString } from '../../helpers/createActionString';

/**
 * @typedef {{nickname: string, age: number, city: string}} UserDB
 * @typedef {import('./types').CredentialsLogin} CredentialsLogin
 * @typedef {import('./types').CookieLogin} CookieLogin
 * @typedef {import('./types').SamlLogin} SamlLogin
 */

const prefix = 'user';
const customActionString = (actionString) => createActionString({ prefix, actionString });

const startLoginFlow = createAction(
  customActionString('start login flow'),
  /** @param {CredentialsLogin | CookieLogin | SamlLogin} payload */
  (payload) => ({ payload }),
);
const loginWithCredentialsRequest = createAction(
  customActionString('login with credentials request'),
  /** @param {{params: any}} payload */
  (payload) => ({ payload }),
);
const loginWithCredentialsSuccess = createAction(
  customActionString('login with credentials success'),
  /** @param {{response: any, requestMetadata?: any}} payload */
  (payload) => ({ payload }),
);
const loginWithCredentialsFailure = createAction(
  customActionString('login failed'),
  /** @param {{error: any}} payload */
  (payload) => ({ payload }),
);
const hideLoginSpinner = createAction(customActionString('Hide login spinner'));
const showLoginSpinner = createAction(customActionString('Show login spinner'));
const updateUser = createAction(
  customActionString('Update user in store'),
  /** @param {{isLogged: boolean, user: UserDB}} payload */
  (payload) => ({ payload }),
);

export {
  hideLoginSpinner,
  loginWithCredentialsFailure,
  loginWithCredentialsRequest,
  loginWithCredentialsSuccess,
  prefix,
  showLoginSpinner,
  startLoginFlow,
  updateUser,
};
