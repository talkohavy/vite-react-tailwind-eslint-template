import { PostMessageResponseTypes } from '../logic/constants';
import type { BridgeRequest } from '../types';

export function requestOriginHandler(message: BridgeRequest) {
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
