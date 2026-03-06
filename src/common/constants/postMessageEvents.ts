export const PostMessageEvents = {
  SendOrigin: 'get-host-origin',
  SendLogMessage: 'log-message',
  SendHiToIframe: 'say-hi',
  SendTheme: 'get-host-theme',
} as const;

export type PostMessageEventValues = (typeof PostMessageEvents)[keyof typeof PostMessageEvents];

export const IncomingMessageEvents = {
  RequestOrigin: 'request-origin',
} as const;

export type IncomingMessageEventValues = (typeof IncomingMessageEvents)[keyof typeof IncomingMessageEvents];
