import { dalClient } from '../../../DAL';
import { createMiddleware } from '../../helpers/createMiddleware';
import { apiRequestFlow, prefix } from './actions';
import { runOnFailure, runOnSuccess } from './helpers';

/** @param {{ axiosInstance: import('axios').AxiosInstance }} props */
const fetchApiMiddleware = createMiddleware({
  uniquePrefix: prefix,
  handleAction: ({ action, dispatch }) => {
    if (apiRequestFlow.match(action)) {
      const { dalMethodName, dalMethodProps, requestMetadata, onSuccess, onFailure } = action.payload;

      if (!dalClient[dalMethodName]) throw new Error(`a method named ${dalMethodName} was not found on DAL class`);

      dalClient[dalMethodName](dalMethodProps)
        .then(runOnSuccess({ dispatch, onSuccess, requestMetadata }))
        .catch(runOnFailure({ dispatch, onFailure, requestMetadata }));
    }
  },
});

export { fetchApiMiddleware };
