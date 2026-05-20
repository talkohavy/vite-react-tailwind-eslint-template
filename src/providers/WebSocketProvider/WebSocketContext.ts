import { createContext, useContext } from 'react';
import type { ConnectOptions } from './types';
import type { WsConnectionStatusValues } from './wsConnectionStatus';

export type WebSocketContextValue = {
  getSocket: () => WebSocket | null;
  connectionError: Error | null;
  retryCount: number;
  // - Latest message (updates on every message).
  // - Connection Status:
  connectionStatus: WsConnectionStatusValues;
  isConnected: boolean;
  isConnectionAcknowledged: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  // - Actions:
  connect: (targetUrl: string, options?: ConnectOptions) => void;
  disconnect: () => void;
  send: (data: string) => void;
  /**
   * Subscribe to all incoming text messages. Call the returned function to unsubscribe.
   * Use inside useEffect when a component needs to react to messages (e.g. setState).
   */
  subscribeMessages: <T = any>(listener: (message: T) => void) => () => void;
};

const INITIAL_STATE = null;

export const WebSocketContext = createContext<WebSocketContextValue | null>(INITIAL_STATE);
export const useWebSocket = (): WebSocketContextValue => {
  const ctx = useContext(WebSocketContext);

  if (!ctx) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }

  return ctx;
};
