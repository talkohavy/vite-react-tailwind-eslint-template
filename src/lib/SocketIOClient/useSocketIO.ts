import { useCallback, useEffect, useRef, useState } from 'react';
import { ConnectionState, type ConnectionStateValues } from './logic/constants';
import { SocketIOClient } from './SocketIOClient';
import type { Socket } from 'socket.io-client';

export type EventLogEntry = {
  id: number;
  type: 'sent' | 'received';
  event: string;
  payload: unknown;
  time: Date;
};

type UseSocketIOReturn = {
  connectionState: ConnectionStateValues;
  connectionError: Error | null;
  client: SocketIOClient | null;
  socket: Socket | null;
  eventLog: EventLogEntry[];
  connect: (url: string) => void;
  disconnect: () => void;
  emit: (event: string, data?: unknown) => void;
  clearLog: () => void;
};

function nextId() {
  return Date.now() * 1000 + Math.floor(Math.random() * 1000);
}

export function useSocketIO(): UseSocketIOReturn {
  const clientRef = useRef<SocketIOClient | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionStateValues>(ConnectionState.Disconnected);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);

  const cleanupClient = useCallback(() => {
    const client = clientRef.current;

    if (!client) return;

    const socket = client.getSocket();

    socket.off('connect');
    socket.off('disconnect');
    socket.off('connect_error');
    socket.offAny();
    client.disconnect();
    clientRef.current = null;
  }, []);

  const disconnect = useCallback(() => {
    cleanupClient();
    setConnectionState(ConnectionState.Disconnected);
    setConnectionError(null);
  }, [cleanupClient]);

  const connect = useCallback(
    (url: string) => {
      const trimmedUrl = url.trim();

      if (!trimmedUrl) return;

      cleanupClient();

      const client = new SocketIOClient(trimmedUrl);
      clientRef.current = client;

      const socket = client.getSocket();

      setConnectionState(ConnectionState.Connecting);
      setConnectionError(null);

      socket.on('connect', () => {
        setConnectionState(ConnectionState.Connected);
        setConnectionError(null);
      });

      socket.on('disconnect', () => {
        setConnectionState(ConnectionState.Disconnected);
      });

      socket.on('connect_error', (err: Error) => {
        setConnectionState('error');
        setConnectionError(err);
      });

      const onAnyHandler = (eventName: string, ...args: unknown[]) => {
        setEventLog((prev) => [
          ...prev,
          { id: nextId(), type: 'received', event: eventName, payload: args, time: new Date() },
        ]);
      };
      socket.onAny(onAnyHandler);

      client.connect();
    },
    [cleanupClient],
  );

  const emit = useCallback((event: string, data?: unknown) => {
    const client = clientRef.current;

    if (!client?.isConnected()) return;

    client.getSocket().emit(event, data);

    setEventLog((prev) => [...prev, { id: nextId(), type: 'sent', event, payload: data, time: new Date() }]);
  }, []);

  const clearLog = useCallback(() => setEventLog([]), []);

  useEffect(() => {
    return () => {
      cleanupClient();
    };
  }, [cleanupClient]);

  return {
    connectionState,
    connectionError,
    get client() {
      return clientRef.current;
    },
    get socket() {
      return clientRef.current?.getSocket() ?? null;
    },
    eventLog,
    connect,
    disconnect,
    emit,
    clearLog,
  };
}
