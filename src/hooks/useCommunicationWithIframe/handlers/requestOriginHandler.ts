import { PostMessageResponseTypes } from '../logic/constants';
import type { PostMessageRequest } from '../types';

export function requestOriginHandler(message: PostMessageRequest) {
  const { requestId } = message;

  console.log('message is:', message);

  return {
    type: PostMessageResponseTypes.Response,
    payload: {
      origin: window.location.origin,
      requestId,
    },
  };
}
