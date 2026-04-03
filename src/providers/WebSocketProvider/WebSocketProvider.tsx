import { type PropsWithChildren, useCallback, useMemo, useRef, useState } from 'react';
import { WebSocketClient } from '@src/lib/WebSocketClient';
import { parseJson } from '../../common/utils/parseJson';
import { WebSocketContext, type WebSocketContextValue } from './WebSocketContext';
import { WsConnectionStatus, type WsConnectionStatusValues } from './wsConnectionStatus';

type WebSocketProviderProps = PropsWithChildren;

export default function WebSocketProvider(props: WebSocketProviderProps) {
  const { children } = props;

  const [connectionStatus, setConnectionStatus] = useState<WsConnectionStatusValues>(WsConnectionStatus.Idle);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const wsClientRef = useRef<WebSocketClient | null>(null);
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

  const clearErrorAndRetryCount = useCallback(() => {
    setConnectionError(null);
    setRetryCount(0);
  }, []);

  const disconnect = useCallback(() => {
    const wsClient = wsClientRef.current;

    if (!wsClient) return;

    wsClient.disconnect();

    wsClientRef.current = null;
    setConnectionStatus(WsConnectionStatus.Closed);
  }, []);

  const handleOpen = useCallback(
    (onConnected?: () => void) => {
      setConnectionStatus(WsConnectionStatus.Open);
      clearErrorAndRetryCount();
      onConnected?.();
    },
    [clearErrorAndRetryCount],
  );

  const handleClose = useCallback((event: { shouldRetry: boolean }) => {
    if (event.shouldRetry) {
      setConnectionStatus(WsConnectionStatus.Reconnecting);
    } else {
      wsClientRef.current = null;
      setConnectionStatus(WsConnectionStatus.Closed);
      setRetryCount(0);
    }

    setConnectionError(null);
  }, []);

  const handleRetry = useCallback((count: number) => {
    setRetryCount(count);
  }, []);

  const handleMessage = useCallback(
    (event: MessageEvent<string | Blob>) => {
      const data: string = typeof event.data === 'string' ? event.data : `[Blob ${event.data.size} bytes]`;

      setLastMessage(data);
      notifyMessageListeners(data);
    },
    [notifyMessageListeners],
  );

  const handleError = useCallback(() => {
    setConnectionError(new Error('WebSocket error'));
  }, []);

  const connect = useCallback(
    (targetUrl: string, onConnected?: () => void) => {
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
          onOpen: () => handleOpen(onConnected),
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
    [clearErrorAndRetryCount, disconnect, handleOpen, handleClose, handleError, handleMessage, handleRetry],
  );

  const send = useCallback((data: string) => {
    const wsClient = wsClientRef.current;

    if (!wsClient?.isConnected()) return;

    wsClient.send(data);
  }, []);

  const isConnected = connectionStatus === WsConnectionStatus.Open;
  const isConnecting = connectionStatus === WsConnectionStatus.Connecting;
  const isReconnecting = connectionStatus === WsConnectionStatus.Reconnecting;

  const value: WebSocketContextValue = useMemo(
    () => ({
      connectionStatus,
      connectionError,
      retryCount,
      isConnected,
      isConnecting,
      isReconnecting,
      lastMessage,
      connect,
      disconnect,
      send,
      subscribeMessages,
    }),
    [
      connectionStatus,
      connectionError,
      retryCount,
      isConnected,
      isConnecting,
      isReconnecting,
      lastMessage,
      connect,
      disconnect,
      send,
      subscribeMessages,
    ],
  );

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
}
