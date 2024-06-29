import { createReducer } from '@reduxjs/toolkit';
import { fireFallbackAction } from './actions';

const apiFallbackReducer = createReducer(null, ({ addCase }) => {
  addCase(fireFallbackAction, (_, action) => {
    console.warn('Async API action', action.type, 'did NOT contain a SUCCESS/FAILURE actions');
  });
});

export { apiFallbackReducer };
