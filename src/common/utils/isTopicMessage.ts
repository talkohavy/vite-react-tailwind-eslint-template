import type { TopicMessage } from '../types/websocket';

export function isTopicMessage(message: any): message is TopicMessage {
  return typeof message === 'object' && typeof message?.topic === 'string';
}
