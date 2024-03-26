import { API_URLS } from '../../../utils/globalConstants';
import { createMiddleware } from '../../helpers/createMiddleware';
import { apiRequest } from '../api';
import { closeLoginModal, closeRegisterModal } from '../modals/actions';
import { showToastMessage } from '../toast/actions';
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
      const { loginType, params } = action.payload;

      if (loginType === 'credentials') {
        // debugger;
        dispatch(showSpinner());
        // debugger;
        dispatch(
          apiRequest({
            method: 'POST',
            URL: API_URLS.users_service.loginWithCredentials,
            body: params,
            onSuccess: loginSuccess,
            onFailure: loginFailure,
          }),
        );
      }

      if (loginType === 'cookie') {
        dispatch(showSpinner());
        dispatch(
          apiRequest({
            method: 'POST',
            URL: API_URLS.users_service.loginWithCookie,
            onSuccess: loginSuccess,
            onFailure: loginFailure,
          }),
        );
      }

      if (loginType === 'saml') {
        dispatch(
          apiRequest({
            method: 'POST',
            URL: API_URLS.users_service.loginWithSaml,
            body: params,
            onSuccess: loginSuccess,
            onFailure: loginFailure,
          }),
        );
      }
    }

    if (loginSuccess.match(action)) {
      // debugger;
      const { data: user } = action.payload;
      const enrichedData = { isLogged: true, user };

      const { modals } = getState();

      dispatch(updateUser(enrichedData));
      dispatch(hideSpinner());
      if (modals.login) dispatch(closeLoginModal());
      if (modals.register) dispatch(closeRegisterModal());
      dispatch(showToastMessage({ from: 'login', text: 'successful login!', type: 'success' }));
    }

    if (loginFailure.match(action)) {
      const { error } = action.payload;

      dispatch(hideSpinner());

      if (error) dispatch(showToastMessage({ from: 'login', type: 'error', text: error }));
    }

    if (updateUserRequest.match(action)) {
      dispatch(showSpinner());

      const { userID } = getState().user.data;
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

      if (modals.login) dispatch(closeLoginModal());
      if (modals.register) dispatch(closeRegisterModal());
    }

    if (updateUserFailure.match(action)) {
      const { error } = action.payload;

      dispatch(hideSpinner());

      if (error) dispatch(showToastMessage({ from: 'update', type: 'error', text: 'update failed...' }));
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

      if (error) dispatch(showToastMessage({ from: 'register', type: 'error', text: error }));
    }

    if (logout.match(action)) {
      dispatch(clearUser());

      dispatch(apiRequest({ method: 'GET', URL: API_URLS.users_service.logout }));
    }
  },
});

export { userMiddleware };
