import { useState } from 'react';
import { WsConnectionStatus, type WsConnectionStatusValues } from '../../wsConnectionStatus';

export function useWebsocketState() {
  const [connectionStatus, setConnectionStatus] = useState<WsConnectionStatusValues>(WsConnectionStatus.Idle);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const isConnected = connectionStatus === WsConnectionStatus.Open;
  const isConnecting = connectionStatus === WsConnectionStatus.Connecting;
  const isReconnecting = connectionStatus === WsConnectionStatus.Reconnecting;

  return {
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
  };
}
