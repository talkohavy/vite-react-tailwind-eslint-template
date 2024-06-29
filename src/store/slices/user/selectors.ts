/** @typedef {import('../../types').State} State */

/** @param {State} state */
const isUserLoadingSelector = (state) => state.user.isLoading;

/** @param {State} state */
const userDataSelector = (state) => state.user.data;

export { isUserLoadingSelector, userDataSelector };
