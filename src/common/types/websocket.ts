import type { SocketEventValues } from '../constants';

export type ClientMessage<T = any> = {
  event: SocketEventValues;
  payload: T;
};

export type ServerMessage<T = any> = {
  type: string;
  payload?: T;
};

export type TopicMessage<T = any> = {
  topic: string;
  data: T;
};
