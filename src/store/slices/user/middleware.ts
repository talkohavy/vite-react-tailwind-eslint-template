import { createMiddleware } from '../../helpers/createMiddleware';
import { apiRequestFlow } from '../api';
import { closeLoginModal, closeRegisterModal } from '../modals/actions';
import { showToastMessage } from '../toast/actions';
import {
  hideLoginSpinner,
  loginWithCredentialsFailure,
  loginWithCredentialsRequest,
  loginWithCredentialsSuccess,
  prefix,
  showLoginSpinner,
  startLoginFlow,
  updateUser,
} from './actions';

const userMiddleware = createMiddleware({
  uniquePrefix: prefix,
  handleAction: ({ action, dispatch, getState }) => {
    if (startLoginFlow.match(action)) {
      const { loginType, params } = action.payload;

      if (loginType === 'credentials') {
        dispatch(loginWithCredentialsRequest({ params }));
      }

      if (loginType === 'cookie') {
        // dispatch(loginWithCookieRequest({ params }));
      }

      if (loginType === 'saml') {
        // dispatch(loginWithSamlRequest({ params }));
      }
    }

    if (loginWithCredentialsRequest.match(action)) {
      const { params } = action.payload;
      const dalMethodProps = { requestParams: params };

      dispatch(showLoginSpinner());

      dispatch(
        apiRequestFlow({
          dalMethodName: 'loginWithCredentials',
          dalMethodProps,
          requestMetadata: {},
          onSuccess: loginWithCredentialsSuccess,
          onFailure: loginWithCredentialsFailure,
        }),
      );
    }

    if (loginWithCredentialsSuccess.match(action)) {
      // debugger;
      const { response: user } = action.payload;
      const enrichedData = { isLogged: true, user };

      const { modals } = getState();

      dispatch(updateUser(enrichedData));
      dispatch(hideLoginSpinner());
      if (modals.login) dispatch(closeLoginModal());
      if (modals.register) dispatch(closeRegisterModal());
      dispatch(showToastMessage({ from: 'login', text: 'successful login!', type: 'success' }));
    }

    if (loginWithCredentialsFailure.match(action)) {
      const { error } = action.payload;

      dispatch(hideLoginSpinner());

      if (error) dispatch(showToastMessage({ from: 'login', type: 'error', text: error }));
    }
  },
});

export { userMiddleware };
