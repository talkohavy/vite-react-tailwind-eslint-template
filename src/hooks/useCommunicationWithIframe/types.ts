import type { PostMessageResponseTypeValues, PostMessageTypeValues } from './logic/constants';

export type PostMessageRequest = {
  readonly type: PostMessageTypeValues;
  readonly payload: unknown;
  readonly requestId?: string;
  readonly error?: string;
};

export type PostMessageResponse = {
  readonly type: PostMessageResponseTypeValues;
  readonly requestId: string;
  readonly payload?: unknown;
  readonly error?: string;
};
