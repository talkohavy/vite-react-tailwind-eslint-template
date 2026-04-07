import { useCallback, useRef } from 'react';
import { parseJson } from '../../../../common/utils/parseJson';

export function useSubscribeMessages() {
  const messageListenersRef = useRef(new Set<(message: Record<string, unknown>) => void>());

  const notifyMessageListeners = useCallback((message: string) => {
    messageListenersRef.current.forEach((listener) => {
      try {
        const parsedMessage = parseJson(message) ?? message;
        listener(parsedMessage);
      } catch (err) {
        console.error(err);
      }
    });
  }, []);

  const subscribeMessages = useCallback((listener: (message: Record<string, unknown>) => void) => {
    messageListenersRef.current.add(listener);

    return () => {
      messageListenersRef.current.delete(listener);
    };
  }, []);

  return { subscribeMessages, notifyMessageListeners };
}
