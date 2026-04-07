import { useCallback } from 'react';
import { WebSocketClient } from '@src/lib/WebSocketClient';
import { WsConnectionStatus, type WsConnectionStatusValues } from '../../wsConnectionStatus';

type UseWebsocketConnectProps = {
  wsClientRef: any;
  setConnectionStatus: (status: WsConnectionStatusValues) => void;
  setConnectionError: (error: Error | null) => void;
  setRetryCount: (count: number) => void;
  setLastMessage: (message: string) => void;
  notifyMessageListeners: (message: string) => void;
  disconnect: () => void;
};

export function useWebsocketConnect(props: UseWebsocketConnectProps) {
  const {
    wsClientRef,
    setConnectionStatus,
    setConnectionError,
    setRetryCount,
    setLastMessage,
    notifyMessageListeners,
    disconnect,
  } = props;

  const clearErrorAndRetryCount = useCallback(() => {
    setConnectionError(null);
    setRetryCount(0);
  }, [setConnectionError, setRetryCount]);

  const handleOpen = useCallback(
    (onConnectionOpen?: () => void) => {
      setConnectionStatus(WsConnectionStatus.Open);
      clearErrorAndRetryCount();
      onConnectionOpen?.();
    },
    [clearErrorAndRetryCount, setConnectionStatus],
  );

  const handleClose = useCallback(
    (event: { shouldRetry: boolean }) => {
      if (event.shouldRetry) {
        setConnectionStatus(WsConnectionStatus.Reconnecting);
      } else {
        // eslint-disable-next-line
        wsClientRef.current = null;
        setConnectionStatus(WsConnectionStatus.Closed);
        setRetryCount(0);
      }

      setConnectionError(null);
    },
    [setConnectionStatus, setConnectionError, setRetryCount, wsClientRef],
  );

  const handleRetry = useCallback(
    (count: number) => {
      setRetryCount(count);
    },
    [setRetryCount],
  );

  const handleMessage = useCallback(
    (event: MessageEvent<string | Blob>) => {
      const data: string = typeof event.data === 'string' ? event.data : `[Blob ${event.data.size} bytes]`;

      setLastMessage(data);
      notifyMessageListeners(data);
    },
    [notifyMessageListeners, setLastMessage],
  );

  const handleError = useCallback(() => {
    setConnectionError(new Error('WebSocket error'));
  }, [setConnectionError]);

  const connect = useCallback(
    (targetUrl: string, onConnectionOpen?: () => void) => {
      disconnect();
      clearErrorAndRetryCount();

      const trimmedUrl = targetUrl.trim();

      if (!trimmedUrl) {
        setConnectionError(new Error('WebSocket URL is empty'));
        return;
      }

      setConnectionStatus(WsConnectionStatus.Connecting);

      let wsClient: WebSocketClient;

      try {
        wsClient = new WebSocketClient(trimmedUrl, {
          onOpen: () => handleOpen(onConnectionOpen),
          onClose: handleClose,
          onError: handleError,
          onMessage: handleMessage,
          onRetry: handleRetry,
          retryStrategy: {
            maxRetries: 5,
            retryDelayMs: 2000,
          },
        });

        wsClient.connect().catch((err: unknown) => {
          setConnectionStatus(WsConnectionStatus.Closed);
          setConnectionError(err instanceof Error ? err : new Error(String(err)));
        });
      } catch (err) {
        setConnectionStatus(WsConnectionStatus.Closed);
        setConnectionError(err instanceof Error ? err : new Error(String(err)));
        return;
      }

      wsClientRef.current = wsClient;
    },
    [
      wsClientRef,
      clearErrorAndRetryCount,
      disconnect,
      handleOpen,
      handleClose,
      handleError,
      handleMessage,
      handleRetry,
      setConnectionError,
      setConnectionStatus,
    ],
  );

  return { connect };
}
