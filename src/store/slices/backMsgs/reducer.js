import { createReducer } from '@reduxjs/toolkit';
import { hideBackMsg, showBackMsg, updateBackMsg, updateTimeoutID } from './actions';

const defaultBackMsg = { timeoutID: null, isShowing: false, type: '', text: '', hasChanged: 0 };

const INITIAL_STATE = {
  login: defaultBackMsg,
  register: defaultBackMsg,
};

const backMsgsReducer = createReducer(INITIAL_STATE, ({ addCase }) => {
  addCase(showBackMsg, (state, action) => {
    const { from } = action.payload;
    state[from].isShowing = true;
  });
  addCase(hideBackMsg, (state, action) => {
    const { from } = action.payload;
    state[from].isShowing = false;
  });
  addCase(updateBackMsg, (state, action) => {
    const { from, type, text, hasChanged } = action.payload;
    state[from].type = type;
    state[from].text = text;
    state[from].hasChanged = hasChanged;
  });
  addCase(updateTimeoutID, (state, action) => {
    const { from, id } = action.payload;
    state[from].timeoutID = id;
  });
});

export { backMsgsReducer };
