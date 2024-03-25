import { createAction } from '@reduxjs/toolkit';
import { createActionString } from '../../helpers/createActionString';

const prefix = 'gallery';
const customActionString = (actionString) => createActionString({ prefix, actionString });

const enterGallery = createAction(customActionString('Enter gallery'), (payload) => ({ payload }));
const leaveGallery = createAction(customActionString('Leave gallery'));
const fetchUsersRequest = createAction(customActionString('Fetch users request'), (payload) => ({ payload }));
const fetchUsersSuccess = createAction(
  customActionString('Fetch users success'),
  /** @param {any} payload */
  (payload) => ({ payload }),
);
const fetchUsersFailure = createAction(
  customActionString('Fetch users failure'),
  /** @param {{error: any}} payload */
  (payload) => ({ payload }),
);
const updateUsers = createAction(customActionString('Update users'), (payload) => ({ payload }));
const showSpinner = createAction(customActionString('Show spinner'));
const hideSpinner = createAction(customActionString('Hide spinner'));
const reportLoadingError = createAction(customActionString('Report loading error'));

export {
  enterGallery,
  fetchUsersFailure,
  fetchUsersRequest,
  fetchUsersSuccess,
  hideSpinner,
  leaveGallery,
  prefix,
  reportLoadingError,
  showSpinner,
  updateUsers,
};
