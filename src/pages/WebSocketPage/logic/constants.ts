export const WsConnectionState = {
  Idle: 'idle',
  Connecting: 'connecting',
  Open: 'open',
  Closing: 'closing',
  Closed: 'closed',
} as const;

export type WsConnectionStateValues = (typeof WsConnectionState)[keyof typeof WsConnectionState];

export const MessageState = {
  Sent: 'sent',
  Received: 'received',
} as const;

export type MessageStateValues = (typeof MessageState)[keyof typeof MessageState];
