import type { PostMessageRequest } from '../../types';

export function isValidMessage(message: any): message is PostMessageRequest {
  if (typeof message === 'object' && typeof message?.type === 'string') return true;

  return false;
}
