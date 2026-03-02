export const SocketEvents = {
  Register: 'register',
  Unregister: 'unregister',
  Send: 'send',
  WebRtc: 'web-rtc',
};

export type SocketEventValues = (typeof SocketEvents)[keyof typeof SocketEvents];

export type SocketEventMessage<T = any> = {
  event: SocketEventValues;
  payload: T;
};
