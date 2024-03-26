import { createMiddleware } from '../../helpers/createMiddleware';
import { makeAxiosConfigSerializable } from '../../helpers/makeAxiosConfigSerializable';
import { apiRequest, prefix } from './actions';

/**
 * @param {{
 *   dispatch: any,
 *   onSuccess: import('@reduxjs/toolkit').ActionCreatorWithPreparedPayload<[payload: any, config: any], any, string, never, never>,
 *   onFailure: import('@reduxjs/toolkit').ActionCreatorWithPreparedPayload<[payload: {error: any}], {error: any}, string, never, never>,
 * }} props
 */
const runOnSuccess =
  ({ dispatch, onSuccess, onFailure }) =>
  (response) => {
    const { data: axiosData, config } = response;
    const { error, data } = axiosData;

    const serializedConfig = makeAxiosConfigSerializable(config);

    if (error) {
      console.error(error);
      return dispatch(onFailure({ error }));
    }

    return dispatch(onSuccess(data, serializedConfig));
  };

/**
 * @param {{
 *   dispatch: any,
 *   onFailure: import('@reduxjs/toolkit').ActionCreatorWithPreparedPayload<[payload: {error: any}], {error: any}, string, never, never>,
 * }} props
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const runOnFailure =
  ({ dispatch, onFailure }) =>
  (error) => {
    console.error(error);

    const { response } = error;
    const errorMessage = response?.data;

    // My custom error returned:
    if (errorMessage) return dispatch(onFailure({ error: errorMessage }));

    // Some other error returned:
    return dispatch(onFailure(response));
  };

/** @param {{ axiosInstance: import('axios').AxiosInstance }} props */
// eslint-disable-next-line
const fetchApiMiddleware = ({ axiosInstance }) =>
  createMiddleware({
    uniquePrefix: prefix,
    handleAction: ({ action, dispatch }) => {
      if (apiRequest.match(action)) {
        // eslint-disable-next-line
        const { method, URL, body, config, onSuccess, onFailure } = action.payload;

        // - Real API request:
        // axiosInstance({ method, url: URL, ...config, data: body })
        //   .then(runOnSuccess({ dispatch, onSuccess, onFailure }))
        //   .catch(runOnFailure({ dispatch, onFailure }));

        // - Fake API request:
        setTimeout(() => {
          // debugger;
          const fakeResponseSuccess = {
            config: {},
            data: { data: { nickname: 'tal', age: 28 } },
          };
          runOnSuccess({ dispatch, onSuccess, onFailure })(fakeResponseSuccess);
          // const fakeResponseError = { error: {}, config: {} };
          // runOnFailure({ dispatch, onFailure })(fakeResponseError);
        }, 4000);
      }
    },
  });

export { fetchApiMiddleware };
