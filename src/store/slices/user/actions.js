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

const loginRequest = createAction(
  customActionString('login request'),
  /** @param {CredentialsLogin | CookieLogin | SamlLogin} payload */
  (payload) => ({ payload }),
);
const loginSuccess = createAction(
  customActionString('login success'),
  /** @param {{data: any}} payload */
  (payload) => ({ payload }),
);
const loginFailure = createAction(
  customActionString('login failed'),
  /** @param {{error: any}} payload */
  (payload) => ({ payload }),
);
const logout = createAction(customActionString('logout request'));
const registerUserRequest = createAction(customActionString('register request'), (payload) => ({ payload }));
const registerUserSuccess = createAction(customActionString('Register success'), (payload) => ({ payload }));
const registerUserFailure = createAction(
  customActionString('Register failed'),
  /** @param {{error: any}} payload */
  (payload) => ({ payload }),
);
const updateUserRequest = createAction(customActionString('user update request'), (payload) => ({ payload }));
const updateUserSuccess = createAction(customActionString('user update success'), (payload) => ({ payload }));
const updateUserFailure = createAction(
  customActionString('user update failure'),
  /** @param {{error: any}} payload */
  (payload) => ({ payload }),
);
const clearUser = createAction(customActionString('Clear user'));
const hideSpinner = createAction(customActionString('Hide spinner'));
const showSpinner = createAction(customActionString('Show spinner'));
const updateUser = createAction(
  customActionString('Update user in store'),
  /** @param {{isLogged: boolean, user: UserDB}} payload */
  (payload) => ({ payload }),
);

export {
  clearUser,
  hideSpinner,
  loginFailure,
  loginRequest,
  loginSuccess,
  logout,
  prefix,
  registerUserFailure,
  registerUserRequest,
  registerUserSuccess,
  showSpinner,
  updateUser,
  updateUserFailure,
  updateUserRequest,
  updateUserSuccess,
};
