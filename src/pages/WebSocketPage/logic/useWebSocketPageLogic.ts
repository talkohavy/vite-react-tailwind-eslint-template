import { useCallback, useEffect, useRef, useState } from 'react';
import { WS_SERVICE_URL } from '../../../common/constants';
import { WebSocketClient } from '../../../lib/WebSocketClient';
import { MessageState, type MessageStateValues, WsConnectionState, type WsConnectionStateValues } from './constants';
import { nextId } from './utils/nextId';

export type MessageLogEntry = {
  id: string;
  time: Date;
  direction: MessageStateValues;
  data: string;
};

export function useWebSocketPageLogic() {
  const [url, setUrl] = useState(WS_SERVICE_URL);
  const [messageToSend, setMessageToSend] = useState('');
  const [connectionState, setConnectionState] = useState<WsConnectionStateValues>(WsConnectionState.Idle);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [log, setLog] = useState<MessageLogEntry[]>([]);
  const [retryCount, setRetryCount] = useState(0);

  const clientRef = useRef<WebSocketClient | null>(null);

  const addLogEntry = useCallback((direction: MessageStateValues, data: string) => {
    setLog((prev) => [...prev, { id: nextId(), time: new Date(), direction, data }]);
  }, []);

  const disconnect = useCallback(() => {
    const wsClient = clientRef.current;

    const ws = wsClient?.getSocket();

    if (!(wsClient && ws)) return;

    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      setConnectionState(WsConnectionState.Closing);
    }

    wsClient.disconnect();
    clientRef.current = null;
  }, []);

  const handleOpen = useCallback(() => {
    setConnectionState(WsConnectionState.Open);
    setConnectionError(null);
    setRetryCount(0);
  }, []);

  const handleClose = useCallback((event: { shouldRetry: boolean }) => {
    if (event.shouldRetry) {
      setConnectionState(WsConnectionState.Reconnecting);
    } else {
      clientRef.current = null;
      setConnectionState(WsConnectionState.Closed);
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

      addLogEntry(MessageState.Received, data);
    },
    [addLogEntry],
  );

  const handleError = useCallback(() => {
    setConnectionError(new Error('WebSocket error'));
  }, []);

  const connect = useCallback(
    (targetUrl: string) => {
      disconnect();
      setConnectionError(null);
      setRetryCount(0);

      if (!targetUrl) {
        setConnectionError(new Error('Please enter a WebSocket URL (ws:// or wss://)'));
        return;
      }

      setConnectionState(WsConnectionState.Connecting);

      let wsClient: WebSocketClient;

      try {
        wsClient = new WebSocketClient(targetUrl, {
          onOpen: handleOpen,
          onClose: handleClose,
          onError: handleError,
          onMessage: handleMessage,
          onRetry: handleRetry,
          retryStrategy: {
            maxRetries: 5,
            retryDelayMs: 2000,
          },
        });

        wsClient.connect();
      } catch (err) {
        setConnectionState(WsConnectionState.Closed);
        setConnectionError(err instanceof Error ? err : new Error(String(err)));
        return;
      }

      clientRef.current = wsClient;
    },
    [disconnect, handleOpen, handleClose, handleError, handleMessage, handleRetry],
  );

  const send = useCallback(() => {
    const wsClient = clientRef.current;

    if (!wsClient?.isConnected()) return;

    const trimmed = messageToSend.trim();

    if (!trimmed) return;

    wsClient.send(trimmed);

    addLogEntry(MessageState.Sent, trimmed);

    setMessageToSend('');
  }, [messageToSend, addLogEntry]);

  useEffect(() => {
    return () => {
      clientRef.current?.disconnect();
      clientRef.current = null;
    };
  }, []);

  const clearLog = useCallback(() => setLog([]), []);

  const isConnected = connectionState === WsConnectionState.Open;
  const isConnecting = connectionState === WsConnectionState.Connecting;
  const isReconnecting = connectionState === WsConnectionState.Reconnecting;

  return {
    url,
    setUrl,
    messageToSend,
    setMessageToSend,
    connectionState,
    connectionError,
    isConnected,
    isConnecting,
    isReconnecting,
    retryCount,
    connect,
    disconnect,
    send,
    clearLog,
    log,
  };
}
