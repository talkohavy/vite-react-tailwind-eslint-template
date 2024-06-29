/**
 * @typedef {import('./types').OnSuccessAction} OnSuccessAction
 * @typedef {import('./types').onFailureAction} onFailureAction
 */

/**
 * @param {{
 *   dispatch: any,
 *   onSuccess: OnSuccessAction,
 *   requestMetadata?: any,
 * }} props
 */
function runOnSuccess({ dispatch, onSuccess, requestMetadata }) {
  return (response) => dispatch(onSuccess({ response, requestMetadata }));
}

/**
 * @param {{
 *   dispatch: any,
 *   onFailure: onFailureAction,
 *   requestMetadata?: any,
 * }} props
 */
function runOnFailure({ dispatch, onFailure, requestMetadata }) {
  return (error) => {
    console.error(error);

    const { response } = error;
    const errorMessage = response?.data;

    // My custom error returned:
    if (errorMessage) return dispatch(onFailure({ error: errorMessage, requestMetadata }));

    // Some other error returned:
    return dispatch(onFailure(response));
  };
}

export { runOnFailure, runOnSuccess };
