import { type PropsWithChildren, useCallback, useMemo, useRef, useState } from 'react';
import { useSubscribeMessages } from './logic/hooks/useSubscribeMessages';
import { useWebsocketConnect } from './logic/hooks/useWebsocketConnect';
import { WebSocketContext, type WebSocketContextValue } from './WebSocketContext';
import { WsConnectionStatus, type WsConnectionStatusValues } from './wsConnectionStatus';
import type { WebSocketClient } from '@src/lib/WebSocketClient';

type WebSocketProviderProps = PropsWithChildren;

export default function WebSocketProvider(props: WebSocketProviderProps) {
  const { children } = props;

  const wsClientRef = useRef<WebSocketClient | null>(null);

  const [connectionStatus, setConnectionStatus] = useState<WsConnectionStatusValues>(WsConnectionStatus.Idle);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const isConnected = connectionStatus === WsConnectionStatus.Open;
  const isConnecting = connectionStatus === WsConnectionStatus.Connecting;
  const isReconnecting = connectionStatus === WsConnectionStatus.Reconnecting;

  const { subscribeMessages, notifyMessageListeners } = useSubscribeMessages();

  const disconnect = useCallback(() => {
    const wsClient = wsClientRef.current;

    if (!wsClient) return;

    wsClient.disconnect();

    wsClientRef.current = null;
    setConnectionStatus(WsConnectionStatus.Closed);
  }, []);

  const { connect } = useWebsocketConnect({
    wsClientRef,
    setConnectionStatus,
    setConnectionError,
    setRetryCount,
    setLastMessage,
    notifyMessageListeners,
    disconnect,
  });

  const send = useCallback((data: string) => {
    const wsClient = wsClientRef.current;

    if (!wsClient?.isConnected()) return;

    wsClient.send(data);
  }, []);

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
