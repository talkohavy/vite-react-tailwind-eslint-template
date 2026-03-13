import { useCallback, useEffect, useRef, useState } from 'react';
import { SocketIOEvents } from '@src/common/constants';
import type { StreamingPayload } from '../../types';

type UseStreamingProps = {
  emit: (eventName: string, data?: unknown) => void;
};

export function useStreaming(props: UseStreamingProps) {
  const { emit } = props;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        setIsStreaming(false);
        timeoutRef.current = null;
      }
    };
  }, [emit]);

  const startStreamingTo = useCallback(
    (topic: string) => {
      setIsStreaming(true);

      timeoutRef.current = setTimeout(() => {
        const payload: StreamingPayload = {
          topic,
          data: { message: `Hello: ${Date.now()}` },
        };

        emit(SocketIOEvents.SendMessageToTopic, payload);

        startStreamingTo(topic);
      }, 4000);
    },
    [emit],
  );

  const stopStreaming = useCallback(() => {
    if (!timeoutRef.current) return;

    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;

    setIsStreaming(false);
  }, []);

  return { startStreamingTo, stopStreaming, isStreaming };
}
