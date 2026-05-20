import { useCallback, useRef } from 'react';
import { parseJson } from '../../../../common/utils/parseJson';

export function useSubscribeMessages() {
  const messageListenersRef = useRef(new Set<(message: any) => void>());

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

  const subscribeMessages = useCallback(<T = any>(listener: (message: T) => void) => {
    messageListenersRef.current.add(listener);

    return () => {
      messageListenersRef.current.delete(listener);
    };
  }, []);

  return { subscribeMessages, notifyMessageListeners };
}
