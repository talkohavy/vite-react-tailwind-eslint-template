import { createAction } from '@reduxjs/toolkit';
import { createActionString } from '../../helpers/createActionString';

const prefix = 'modals';
const customActionString = (actionString) => createActionString({ prefix, actionString });

const openLogin = createAction(customActionString('Open login modal'));
const closeLogin = createAction(customActionString('Close login modal'));
const openRegister = createAction(customActionString('Open register modal'));
const closeRegister = createAction(customActionString('Close register modal'));
const openMobile = createAction(customActionString('Open mobile modal'));
const closeMobile = createAction(customActionString('Close mobile modal'));

export { closeLogin, closeMobile, closeRegister, openLogin, openMobile, openRegister, prefix };
