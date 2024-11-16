import { State } from '@src/store';

const isUserLoadingSelector = (state: State) => state.user.isLoading;

const userDataSelector = (state: State) => state.user.data;

export { isUserLoadingSelector, userDataSelector };
