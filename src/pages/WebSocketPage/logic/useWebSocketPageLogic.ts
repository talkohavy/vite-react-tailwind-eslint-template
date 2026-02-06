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

  const clientRef = useRef<WebSocketClient | null>(null);

  const addLogEntry = useCallback((direction: MessageStateValues, data: string) => {
    setLog((prev) => [...prev, { id: nextId(), time: new Date(), direction, data }]);
  }, []);

  const disconnect = useCallback(() => {
    const client = clientRef.current;

    const ws = client?.getSocket();

    if (!(client && ws)) return;

    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      setConnectionState(WsConnectionState.Closing);
    }

    client.disconnect();
    clientRef.current = null;
  }, []);

  const connect = useCallback(
    (targetUrl: string) => {
      disconnect();
      setConnectionError(null);

      if (!targetUrl) {
        setConnectionError(new Error('Please enter a WebSocket URL (ws:// or wss://)'));
        return;
      }

      setConnectionState(WsConnectionState.Connecting);

      let client: WebSocketClient;

      try {
        client = new WebSocketClient();

        client.connect(targetUrl);
      } catch (err) {
        setConnectionState(WsConnectionState.Closed);
        setConnectionError(err instanceof Error ? err : new Error(String(err)));
        return;
      }

      clientRef.current = client;
      const ws = client.getSocket();

      if (!ws) return;

      ws.onopen = () => {
        setConnectionState(WsConnectionState.Open);
        setConnectionError(null);
      };

      ws.onclose = () => {
        clientRef.current = null;
        setConnectionState(WsConnectionState.Closed);
      };

      ws.onerror = () => {
        setConnectionError(new Error('WebSocket error'));
      };

      ws.onmessage = (event: MessageEvent<string | Blob>) => {
        let data: string;
        if (typeof event.data === 'string') {
          data = event.data;
        } else {
          data = `[Blob ${event.data.size} bytes]`;
        }
        addLogEntry(MessageState.Received, data);
      };
    },
    [disconnect, addLogEntry],
  );

  const send = useCallback(() => {
    const client = clientRef.current;

    if (!client?.isConnected()) return;

    const trimmed = messageToSend.trim();

    if (!trimmed) return;

    client.send(trimmed);

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

  return {
    url,
    setUrl,
    messageToSend,
    setMessageToSend,
    connectionState,
    connectionError,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    send,
    clearLog,
    log,
  };
}
