import { createLogger } from 'redux-logger';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { apiFallbackReducer, fetchApiMiddleware } from './slices/api';
import { galleryMiddleware, galleryReducer } from './slices/gallery';
import { modalsReducer } from './slices/modals';
import { toastMiddleware, toastReducer } from './slices/toast';
import { userMiddleware, userReducer } from './slices/user';

/**
 * @typedef {import('@reduxjs/toolkit').Action} Action
 * @typedef {import('./types').State} State
 */

const reduxLogger = createLogger({
  // predicate: (getState, action) => !bannedActions.includes(action.type),
});

const rootReducer = combineReducers({
  user: userReducer,
  modals: modalsReducer,
  gallery: galleryReducer,
  toast: toastReducer,
  apiFallback: apiFallbackReducer,
});

function getAllMiddlewares() {
  return [userMiddleware, toastMiddleware, galleryMiddleware, fetchApiMiddleware];
}

/**
 * @param {{preloadedState?: Partial<State>}} props
 */
export function createStore({ preloadedState }) {
  const store = configureStore({
    preloadedState,
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      const middlewares = getAllMiddlewares();
      import.meta.env.MODE !== 'production' && middlewares.push(reduxLogger);
      return getDefaultMiddleware({ serializableCheck: false }).concat(...middlewares);
    },
  });

  return store;
}
