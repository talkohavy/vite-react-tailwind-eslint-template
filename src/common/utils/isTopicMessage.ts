import type { TopicMessage } from '../types/websocket';

export function isTopicMessage<T = any>(message: any): message is TopicMessage<T> {
  return typeof message === 'object' && typeof message?.topic === 'string';
}
