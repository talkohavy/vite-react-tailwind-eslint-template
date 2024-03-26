/** @typedef {import('../../types').State} State */

/** @param {State} state */
const loginToastMessageSelector = (state) => state.toast.login;

export { loginToastMessageSelector };
