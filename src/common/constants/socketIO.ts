export const SocketIOEvents = {
  RegisterToTopic: 'register',
  UnregisterFromTopic: 'unregister',
  SendMessageToTopic: 'send',
  // WebRtc: 'web-rtc',
};

export const SocketIOTopics = {
  Presence: 'presence',
  EventStream: 'event-stream',
};

export type SocketIOEventValues = (typeof SocketIOEvents)[keyof typeof SocketIOEvents];
