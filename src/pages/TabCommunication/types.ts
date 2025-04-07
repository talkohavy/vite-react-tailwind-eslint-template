import type { MessageType } from './constants';

export type Message = {
  type: MessageType;
  data: string;
};
