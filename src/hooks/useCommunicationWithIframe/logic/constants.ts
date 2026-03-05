export const PostMessageTypes = {
  RequestOrigin: 'request-origin',
} as const;

export type PostMessageTypeValues = (typeof PostMessageTypes)[keyof typeof PostMessageTypes];

export const PostMessageResponseTypes = {
  Response: 'response',
} as const;

export type PostMessageResponseTypeValues = (typeof PostMessageResponseTypes)[keyof typeof PostMessageResponseTypes];
