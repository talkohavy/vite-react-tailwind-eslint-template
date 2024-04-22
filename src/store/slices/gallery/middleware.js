import { LSKEY_SEARCH_PARAMS } from '../../../utils/globalConstants';
import { createMiddleware } from '../../helpers/createMiddleware';
import { apiRequestFlow } from '../api';
import {
  enterGallery,
  fetchUsersFailure,
  fetchUsersRequest,
  fetchUsersSuccess,
  hideSpinner,
  prefix,
  reportLoadingError,
  showSpinner,
  updateUsers,
} from './actions';

const galleryMiddleware = createMiddleware({
  uniquePrefix: prefix,
  handleAction: ({ action, dispatch }) => {
    if (enterGallery.match(action)) {
      // Step 1: create a fallback for view & page
      let params = action.payload;
      if (!params.view) params.view = 1;
      if (!params.page) params.page = 1;

      // Step 2: run type validation
      params.view = Number.parseInt(params.view);
      params.page = Number.parseInt(params.page);
      if (isNaN(params.view) || isNaN(params.page)) {
        // Type validation failed, report loading error
        return dispatch(reportLoadingError());
      }

      // Step 3: are new values same as current ones?
      // const { curView, curPage } = getState().gallery;
      // if (curView == params.view && curPage == params.page) return;

      // Step 4: use searchParams?
      if (params.useSearchParams) {
        const searchParams = JSON.parse(localStorage.getItem(LSKEY_SEARCH_PARAMS));
        params = { ...params, ...searchParams };
      }

      dispatch(showSpinner());

      dispatch(fetchUsersRequest(params));
    }

    if (fetchUsersRequest.match(action)) {
      dispatch(
        apiRequestFlow({
          dalMethodName: 'loginWithCredentials',
          dalMethodProps: { params: action.payload },
          onSuccess: fetchUsersSuccess,
          onFailure: fetchUsersFailure,
        }),
      );
    }

    if (fetchUsersSuccess.match(action)) {
      dispatch(updateUsers(action.payload));

      dispatch(hideSpinner());
    }

    if (fetchUsersFailure.match(action)) {
      const { error } = action.payload;

      console.warn(error);

      dispatch(reportLoadingError());

      dispatch(hideSpinner());
    }
  },
});

export { galleryMiddleware };
