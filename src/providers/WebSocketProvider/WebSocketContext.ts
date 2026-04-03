import { createContext, useContext } from 'react';
import type { WsConnectionStatusValues } from './wsConnectionStatus';

export type WebSocketContextValue = {
  connectionError: Error | null;
  retryCount: number;
  // - Latest message (updates on every message).
  // - Connection Status:
  connectionStatus: WsConnectionStatusValues;
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  lastMessage: string | null;
  // - Actions:
  connect: (targetUrl: string, onConnected?: () => void) => void;
  disconnect: () => void;
  send: (data: string) => void;
  /**
   * Subscribe to all incoming text messages. Call the returned function to unsubscribe.
   * Use inside useEffect when a component needs to react to messages (e.g. setState).
   */
  subscribeMessages: (listener: (message: Record<string, unknown>) => void) => () => void;
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
