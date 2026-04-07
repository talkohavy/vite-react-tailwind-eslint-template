import { type PropsWithChildren, useCallback, useMemo, useRef } from 'react';
import { useSubscribeMessages } from './logic/hooks/useSubscribeMessages';
import { useWebsocketConnect } from './logic/hooks/useWebsocketConnect';
import { useWebsocketState } from './logic/hooks/useWebsocketState';
import { WebSocketContext, type WebSocketContextValue } from './WebSocketContext';
import { WsConnectionStatus } from './wsConnectionStatus';
import type { WebSocketClient } from '@src/lib/WebSocketClient';

type WebSocketProviderProps = PropsWithChildren;

export default function WebSocketProvider(props: WebSocketProviderProps) {
  const { children } = props;

  const wsClientRef = useRef<WebSocketClient | null>(null);

  const {
    connectionStatus,
    connectionError,
    retryCount,
    lastMessage,
    isConnected,
    isConnecting,
    isReconnecting,
    setConnectionStatus,
    setConnectionError,
    setRetryCount,
    setLastMessage,
  } = useWebsocketState();

  const { subscribeMessages, notifyMessageListeners } = useSubscribeMessages();

  const disconnect = useCallback(() => {
    const wsClient = wsClientRef.current;

    if (!wsClient) return;

    wsClient.disconnect();

    wsClientRef.current = null;
    setConnectionStatus(WsConnectionStatus.Closed);
  }, [setConnectionStatus]);

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
