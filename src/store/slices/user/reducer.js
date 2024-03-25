import { createReducer } from '@reduxjs/toolkit';
import { clearUser, hideSpinner, showSpinner, updateUser } from './actions';

const INITIAL_STATE = {
  isLogged: false,
  isLoading: false,
  user: null,
};

const userReducer = createReducer(INITIAL_STATE, ({ addCase }) => {
  addCase(updateUser, (state, action) => {
    const { user, isLogged } = action.payload;
    state.isLogged = isLogged;
    state.user = user;
  });
  addCase(showSpinner, (state) => {
    state.isLoading = true;
  });
  addCase(hideSpinner, (state) => {
    state.isLoading = false;
  });
  addCase(clearUser, () => INITIAL_STATE);
});

export { userReducer };
