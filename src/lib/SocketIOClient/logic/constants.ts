export const ConnectionState = {
  Disconnected: 'disconnected',
  Connecting: 'connecting',
  Connected: 'connected',
  Error: 'error',
} as const;

export type ConnectionStateValues = (typeof ConnectionState)[keyof typeof ConnectionState];
