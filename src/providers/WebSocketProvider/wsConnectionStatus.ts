export const WsConnectionStatus = {
  Idle: 'idle',
  Connecting: 'connecting',
  Open: 'open',
  Reconnecting: 'reconnecting',
  Closing: 'closing',
  Closed: 'closed',
} as const;

export type WsConnectionStatusValues = (typeof WsConnectionStatus)[keyof typeof WsConnectionStatus];
