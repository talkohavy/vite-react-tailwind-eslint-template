import { createSlice } from '@reduxjs/toolkit';
import type { UserState } from './types';

const initialState: UserState = {
  data: null,
  isLoading: false,
  isLogged: false,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const { user, isLogged } = action.payload;
      state.isLogged = isLogged;
      state.data = user;
    },
    showLoginSpinner: (state) => {
      // debugger;
      state.isLoading = true;
    },
    hideLoginSpinner: (state) => {
      state.isLoading = false;
    },
  },
});

export const { updateUser, showLoginSpinner, hideLoginSpinner } = userSlice.actions;
export const userReducer = userSlice.reducer;
