import { type PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WebSocketClient } from '@src/lib/WebSocketClient';
import { WebSocketContext, type WebSocketContextValue } from './WebSocketContext';
import { WsConnectionStatus, type WsConnectionStatusValues } from './wsConnectionStatus';
import type { WebSocketRetryOptions } from '@src/lib/WebSocketClient/WebSocketClient.interface';

type WebSocketProviderProps = PropsWithChildren<{
  url: string;
  autoConnect?: boolean;
  retryStrategy?: WebSocketRetryOptions | boolean;
}>;

export default function WebSocketProvider(props: WebSocketProviderProps) {
  const { url, autoConnect = false, retryStrategy, children } = props;

  const [connectionStatus, setConnectionStatus] = useState<WsConnectionStatusValues>(WsConnectionStatus.Idle);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const wsClientRef = useRef<WebSocketClient | null>(null);
  const messageListenersRef = useRef(new Set<(message: string) => void>());

  const notifyMessageListeners = useCallback((message: string) => {
    messageListenersRef.current.forEach((listener) => {
      listener(message);
    });
  }, []);

  const subscribeMessages = useCallback((listener: (message: string) => void) => {
    messageListenersRef.current.add(listener);

    return () => {
      messageListenersRef.current.delete(listener);
    };
  }, []);

  const disconnect = useCallback(() => {
    const wsClient = wsClientRef.current;
    const ws = wsClient?.getSocket();

    if (!(wsClient && ws)) return;

    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      setConnectionStatus(WsConnectionStatus.Closing);
    }

    wsClient.disconnect();
    wsClientRef.current = null;
  }, []);

  const handleOpen = useCallback(() => {
    setConnectionStatus(WsConnectionStatus.Open);
    setConnectionError(null);
    setRetryCount(0);
  }, []);

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

  const connect = useCallback(() => {
    disconnect();
    setConnectionError(null);
    setRetryCount(0);

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setConnectionError(new Error('WebSocket URL is empty'));
      return;
    }

    setConnectionStatus(WsConnectionStatus.Connecting);

    let wsClient: WebSocketClient;

    try {
      wsClient = new WebSocketClient(trimmedUrl, {
        onOpen: handleOpen,
        onClose: handleClose,
        onError: handleError,
        onMessage: handleMessage,
        onRetry: handleRetry,
        retryStrategy: retryStrategy ?? {
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
  }, [disconnect, url, handleOpen, handleClose, handleError, handleMessage, handleRetry, retryStrategy]);

  useEffect(() => {
    if (!autoConnect) return;

    connect();

    return () => {
      wsClientRef.current?.disconnect();
      wsClientRef.current = null;
    };
  }, [autoConnect, connect]);

  useEffect(() => {
    return () => {
      wsClientRef.current?.disconnect();
      wsClientRef.current = null;
    };
  }, []);

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
