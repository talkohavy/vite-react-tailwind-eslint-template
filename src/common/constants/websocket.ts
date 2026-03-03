const WS_SERVICE_PLACEHOLDER = '___WS_SERVICE_URL_PLACEHOLDER___';
export const WS_SERVICE_URL = WS_SERVICE_PLACEHOLDER.includes('WS_SERVICE_URL_PLACEHOLDER')
  ? 'http://localhost:8000'
  : WS_SERVICE_PLACEHOLDER;

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
