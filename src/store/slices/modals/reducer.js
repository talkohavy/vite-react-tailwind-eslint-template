import { createReducer } from '@reduxjs/toolkit';
import { closeLogin, closeMobile, closeRegister, openLogin, openMobile, openRegister } from './actions';

const INITIAL_STATE = {
  login: false,
  register: false,
  mobile: false,
};

const modalsReducer = createReducer(INITIAL_STATE, ({ addCase }) => {
  addCase(openLogin, (state) => {
    state.login = true;
  });
  addCase(closeLogin, (state) => {
    state.login = false;
  });
  addCase(openRegister, (state) => {
    state.register = true;
  });
  addCase(closeRegister, (state) => {
    state.register = false;
  });
  addCase(openMobile, (state) => {
    state.mobile = true;
  });
  addCase(closeMobile, (state) => {
    state.mobile = false;
  });
});

export { modalsReducer };
