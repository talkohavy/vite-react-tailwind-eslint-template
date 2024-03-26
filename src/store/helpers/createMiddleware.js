/**
 * @typedef {import('@reduxjs/toolkit').Dispatch} Dispatch
 * @typedef {import('@reduxjs/toolkit').PayloadAction<any,string>} Action
 * @typedef {import('../types').GetStateFunction} GetStateFunction
 */

/**
 * @typedef {object} HandleActionProps
 * @property {Dispatch} dispatch
 * @property {GetStateFunction} getState
 * @property {Action} action
 */

/**
 * @typedef {object} CreateMiddlewareProps
 * @property {string} [uniquePrefix] defaults to '*'
 * @property {(props: HandleActionProps) => void} handleAction
 */

/**
 * @param {CreateMiddlewareProps} props
 * @returns {import('@reduxjs/toolkit').Middleware<(action: Action<any>) => number, any>}
 */
function createMiddleware({ uniquePrefix = '*', handleAction }) {
  const regex = uniquePrefix === '*' ? /.?/ : new RegExp(`^\\[${uniquePrefix}]`); // <--- For example: [modals]

  /**
   * @param {Action} action
   * @returns {boolean}
   */
  function shouldThisMiddlewareHandleTheAction(action) {
    const shouldHandleAction = regex.test(action.type);
    // debugger;

    return shouldHandleAction;
  }

  function reduxEnhancerReturnsAMiddleware({ dispatch, getState }) {
    return function reduxMiddleware(next) {
      return function actBasedOnAction(action) {
        // debugger;
        next(action);

        if (shouldThisMiddlewareHandleTheAction(action)) handleAction({ dispatch, getState, action });
      };
    };
  }

  return reduxEnhancerReturnsAMiddleware;
}

export { createMiddleware };
