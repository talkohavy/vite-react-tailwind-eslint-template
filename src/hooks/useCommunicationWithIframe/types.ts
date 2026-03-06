export type PostMessageRequest = {
  readonly type: string;
  readonly payload: unknown;
  readonly requestId?: string;
  readonly error?: string;
};
