import { createReducer } from '@reduxjs/toolkit';
import { hideLoginSpinner, showLoginSpinner, updateUser } from './actions';

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
  addCase(showLoginSpinner, (state) => {
    // debugger;
    state.isLoading = true;
  });
  addCase(hideLoginSpinner, (state) => {
    state.isLoading = false;
  });
});

export { userReducer };
