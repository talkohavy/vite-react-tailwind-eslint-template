export type StreamingPayload<T = any> = {
  topic: string;
  data: T;
};
