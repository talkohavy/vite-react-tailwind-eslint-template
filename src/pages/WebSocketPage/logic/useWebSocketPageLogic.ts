import { useCallback, useRef, useState } from 'react';
import { WS_SERVICE_URL } from '../../../common/constants';
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

  const wsRef = useRef<WebSocket | null>(null);

  const addLogEntry = useCallback((direction: MessageStateValues, data: string) => {
    setLog((prev) => [...prev, { id: nextId(), time: new Date(), direction, data }]);
  }, []);

  const disconnect = useCallback(() => {
    const ws = wsRef.current;

    if (!ws) return;

    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      setConnectionState(WsConnectionState.Closing);
      ws.close();
    }
    wsRef.current = null;
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

      let ws: WebSocket;

      try {
        ws = new WebSocket(targetUrl);
      } catch (err) {
        setConnectionState(WsConnectionState.Closed);
        setConnectionError(err instanceof Error ? err : new Error(String(err)));
        return;
      }

      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionState(WsConnectionState.Open);
        setConnectionError(null);
      };

      ws.onclose = () => {
        wsRef.current = null;
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
    const ws = wsRef.current;

    if (!(ws?.readyState === WebSocket.OPEN)) return;

    console.log(ws.readyState);

    const trimmed = messageToSend.trim();

    if (!trimmed) return;

    ws.send(trimmed);

    addLogEntry(MessageState.Sent, trimmed);

    setMessageToSend('');
  }, [messageToSend, addLogEntry]);

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
