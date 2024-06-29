import { createAction } from '@reduxjs/toolkit';
import { createActionString } from '../../helpers/createActionString';

const prefix = 'modals';
const customActionString = (actionString) => createActionString({ prefix, actionString });

const openLoginModal = createAction(customActionString('Open login modal'));
const closeLoginModal = createAction(customActionString('Close login modal'));
const openRegisterModal = createAction(customActionString('Open register modal'));
const closeRegisterModal = createAction(customActionString('Close register modal'));
const openMobileModal = createAction(customActionString('Open mobile modal'));
const closeMobileModal = createAction(customActionString('Close mobile modal'));

export {
  closeLoginModal,
  closeMobileModal,
  closeRegisterModal,
  openLoginModal,
  openMobileModal,
  openRegisterModal,
  prefix,
};
