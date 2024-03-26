import { createReducer } from '@reduxjs/toolkit';
import {
  closeLoginModal,
  closeMobileModal,
  closeRegisterModal,
  openLoginModal,
  openMobileModal,
  openRegisterModal,
} from './actions';

/** @typedef {import('../../types').ModalsState} ModalsState */

/** @type {ModalsState} */
const INITIAL_STATE = {
  login: false,
  register: false,
  mobile: false,
};

const modalsReducer = createReducer(INITIAL_STATE, ({ addCase }) => {
  addCase(openLoginModal, (state) => {
    // debugger;
    state.login = true;
  });
  addCase(closeLoginModal, (state) => {
    // debugger;
    state.login = false;
  });
  addCase(openRegisterModal, (state) => {
    state.register = true;
  });
  addCase(closeRegisterModal, (state) => {
    state.register = false;
  });
  addCase(openMobileModal, (state) => {
    state.mobile = true;
  });
  addCase(closeMobileModal, (state) => {
    state.mobile = false;
  });
});

export { modalsReducer };
