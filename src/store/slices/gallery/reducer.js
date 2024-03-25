import { createReducer } from '@reduxjs/toolkit';
import { hideSpinner, leaveGallery, reportLoadingError, showSpinner, updateUsers } from './actions';

const INITIAL_STATE = {
  users: [],
  totalNumOfUsers: 0,
  loading: true,
  loadingFailed: false,
  curPage: null,
  curView: null,
  curRand: null,
};

const galleryReducer = createReducer(INITIAL_STATE, ({ addCase }) => {
  addCase(leaveGallery, () => INITIAL_STATE);
  addCase(updateUsers, (state, action) => {
    // TODO: right now? This is never being called, since you're using react-query! so this would definitely need some work in the future.
    /**
     * Previously it was like this:
     * payload.users = payload.data;
     * delete payload.data;
     * return { ...state, ...payload };
     */
    // @ts-ignore
    const { data } = action.payload;
    state.users = data;
  });
  addCase(showSpinner, (state) => {
    state.loading = true;
  });
  addCase(hideSpinner, (state) => {
    state.loading = false;
  });
  addCase(reportLoadingError, (state) => {
    state.loadingFailed = true;
  });
});

export { galleryReducer };
