import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { apiFallbackReducer, fetchApiMiddleware } from './slices/api';
import { backMsgMiddleware, backMsgsReducer } from './slices/backMsgs';
import { galleryMiddleware, galleryReducer } from './slices/gallery';
import { modalsReducer } from './slices/modals';
import { userMiddleware, userReducer } from './slices/user';

/**
 * @typedef {import('@reduxjs/toolkit').Action} Action
 */

const rootReducer = combineReducers({
  user: userReducer,
  modals: modalsReducer,
  gallery: galleryReducer,
  backMsgs: backMsgsReducer,
  apiFallback: apiFallbackReducer,
});

function getAllMiddlewares({ axiosInstance }) {
  return [userMiddleware, backMsgMiddleware, galleryMiddleware, fetchApiMiddleware({ axiosInstance })];
}

// /**
//  * @param {Partial<RootState>} [preloadedState]
//  */
export function createStore({ preloadedState, axiosInstance }) {
  const store = configureStore({
    preloadedState,
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      const middlewares = getAllMiddlewares({ axiosInstance });
      return getDefaultMiddleware({ serializableCheck: false }).concat(...middlewares);
    },
  });

  return store;
}
