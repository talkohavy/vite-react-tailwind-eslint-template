import { createReducer } from '@reduxjs/toolkit';
import { clearUser, hideSpinner, showSpinner, updateUser } from './actions';

/** @typedef {import('../../types').UserState} UserState */

/** @type {UserState} */
const INITIAL_STATE = {
  isLogged: false,
  isLoading: false,
  data: null,
};

const userReducer = createReducer(INITIAL_STATE, ({ addCase }) => {
  addCase(updateUser, (state, action) => {
    const { user, isLogged } = action.payload;
    state.isLogged = isLogged;
    state.data = user;
  });
  addCase(showSpinner, (state) => {
    // debugger;
    state.isLoading = true;
  });
  addCase(hideSpinner, (state) => {
    state.isLoading = false;
  });
  addCase(clearUser, () => INITIAL_STATE);
});

export { userReducer };
