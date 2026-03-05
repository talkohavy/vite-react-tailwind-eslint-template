import type { PostMessageRequest } from '../../types';

/**
 * Type guard: checks if a raw postMessage payload is a valid bridge request from the iframe.
 */
export function isValidMessage(message: any): message is PostMessageRequest {
  if (typeof message === 'object' && typeof message?.type === 'string') return true;

  return false;
}
