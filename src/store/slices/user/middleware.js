import { API_URLS } from '../../../utils/globalConstants';
import { createMiddleware } from '../../helpers/createMiddleware';
import { apiRequest } from '../api';
import { enterBackMsgMode } from '../backMsgs/actions';
import { closeLogin, closeRegister } from '../modals/actions';
import {
  clearUser,
  hideSpinner,
  loginFailure,
  loginRequest,
  loginSuccess,
  logout,
  prefix,
  registerUserFailure,
  registerUserRequest,
  registerUserSuccess,
  showSpinner,
  updateUser,
  updateUserFailure,
  updateUserRequest,
  updateUserSuccess,
} from './actions';

const userMiddleware = createMiddleware({
  uniquePrefix: prefix,
  handleAction: ({ action, dispatch, getState }) => {
    if (loginRequest.match(action)) {
      const { loginType = 'withParams', params } = action.payload;

      if (loginType === 'withParams') {
        dispatch(showSpinner());
        dispatch(
          apiRequest({
            method: 'POST',
            URL: API_URLS.users_service.login,
            body: params,
            onSuccess: loginSuccess,
            onFailure: loginFailure,
          }),
        );
      }

      // if (loginType === 'withToken') {}
    }

    if (loginSuccess.match(action)) {
      const { payload } = action;
      const { data: user } = payload;

      const { modals } = getState();

      const enrichedData = { isLogged: true, user };

      dispatch(updateUser(enrichedData));
      dispatch(hideSpinner());

      if (modals.login) dispatch(closeLogin());
      if (modals.register) dispatch(closeRegister());
    }

    if (loginFailure.match(action)) {
      const { error } = action.payload;

      dispatch(hideSpinner());

      if (error) dispatch(enterBackMsgMode({ from: 'login', type: 'error', text: error }));
    }

    if (updateUserRequest.match(action)) {
      dispatch(showSpinner());

      const { userID } = getState().masterRoom.user;
      dispatch(
        apiRequest({
          method: 'PATCH',
          URL: `${API_URLS.users_service.users}/${userID}`,
          body: action.payload,
          onSuccess: updateUserSuccess,
          onFailure: updateUserFailure,
        }),
      );
    }

    if (updateUserSuccess.match(action)) {
      const { modals } = getState();
      const { payload } = action;
      const { data: user } = payload;

      const enrichedData = { isLogged: true, user };

      dispatch(updateUser(enrichedData));

      dispatch(hideSpinner());

      if (modals.login) dispatch(closeLogin());
      if (modals.register) dispatch(closeRegister());
    }

    if (updateUserFailure.match(action)) {
      const { error } = action.payload;

      dispatch(hideSpinner());

      if (error) dispatch(enterBackMsgMode({ from: 'update', type: 'error', text: 'update failed...' }));
    }

    if (registerUserRequest.match(action)) {
      const params = action.payload;

      dispatch(showSpinner());

      dispatch(
        apiRequest({
          method: 'POST',
          URL: API_URLS.users_service.users,
          body: params,
          onSuccess: registerUserSuccess,
          onFailure: registerUserFailure,
        }),
      );
    }

    if (registerUserSuccess.match(action)) {
      const { modals } = getState();
      const { payload } = action;
      const { data: user } = payload;

      console.log({ modals, user });
    }

    if (registerUserFailure.match(action)) {
      const { error } = action.payload;

      dispatch(hideSpinner());

      if (error) dispatch(enterBackMsgMode({ from: 'register', type: 'error', text: error }));
    }

    if (logout.match(action)) {
      dispatch(clearUser());

      dispatch(apiRequest({ method: 'GET', URL: API_URLS.users_service.logout }));
    }
  },
});

export { userMiddleware };
