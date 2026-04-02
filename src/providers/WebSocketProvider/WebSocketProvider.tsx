import { type PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WebSocketClient } from '@src/lib/WebSocketClient';
import { WebSocketContext, type WebSocketContextValue } from './WebSocketContext';
import { WsConnectionStatus, type WsConnectionStatusValues } from './wsConnectionStatus';

type WebSocketProviderProps = PropsWithChildren<{
  url: string;
  autoConnect?: boolean;
}>;

export default function WebSocketProvider(props: WebSocketProviderProps) {
  const { url: initialUrl, autoConnect = false, children } = props;

  const [url, setUrl] = useState(initialUrl);
  const [connectionStatus, setConnectionStatus] = useState<WsConnectionStatusValues>(WsConnectionStatus.Idle);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const wsClientRef = useRef<WebSocketClient | null>(null);
  const prevAutoConnectRef = useRef(false);
  const messageListenersRef = useRef(new Set<(message: string) => void>());

  const notifyMessageListeners = useCallback((message: string) => {
    messageListenersRef.current.forEach((listener) => {
      try {
        listener(message);
      } catch (err) {
        console.error(err);
      }
    });
  }, []);

  const subscribeMessages = useCallback((listener: (message: string) => void) => {
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
    (onConnected?: () => void) => {
      disconnect();
      clearErrorAndRetryCount();

      const trimmedUrl = url.trim();

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
    [clearErrorAndRetryCount, disconnect, url, handleOpen, handleClose, handleError, handleMessage, handleRetry],
  );

  useEffect(() => {
    if (autoConnect) {
      connect();
    } else if (prevAutoConnectRef.current) {
      // If autoConnect is false and it was true before, disconnect.
      disconnect();
    }

    prevAutoConnectRef.current = autoConnect;
  }, [autoConnect, connect, disconnect]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

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
      url,
      setUrl,
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
      url,
      setUrl,
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
