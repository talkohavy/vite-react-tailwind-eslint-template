import type { ServerMessage } from '../types/websocket';

export function isServerMessage(message: any): message is ServerMessage {
  return typeof message === 'object' && typeof message?.type === 'string';
}
