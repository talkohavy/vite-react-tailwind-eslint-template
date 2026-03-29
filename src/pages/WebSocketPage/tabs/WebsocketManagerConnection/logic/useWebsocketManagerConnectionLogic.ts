import { useCallback, useEffect, useState } from 'react';
import { useWebSocket } from '@src/providers/WebSocketProvider';
import { MessageState, type MessageStateValues } from '../../WebsocketHookConnectionTab/logic/constants';
import { nextId } from '../../WebsocketHookConnectionTab/logic/utils/nextId';
import type { MessageLogEntry } from '../../WebsocketHookConnectionTab/logic/useWebSocketPageLogic';

export function useWebsocketManagerConnectionLogic() {
  const {
    url,
    setUrl,
    connectionStatus,
    connectionError,
    retryCount,
    isConnected,
    isConnecting,
    isReconnecting,
    connect,
    disconnect,
    send: sendRaw,
    subscribeMessages,
  } = useWebSocket();

  const [messageToSend, setMessageToSend] = useState('');
  const [log, setLog] = useState<MessageLogEntry[]>([]);

  const addLogEntry = useCallback((direction: MessageStateValues, data: string) => {
    setLog((prev) => [...prev, { id: nextId(), time: new Date(), direction, data }]);
  }, []);

  useEffect(() => {
    return subscribeMessages((data) => {
      addLogEntry(MessageState.Received, data);
    });
  }, [subscribeMessages, addLogEntry]);

  const send = useCallback(() => {
    const trimmed = messageToSend.trim();

    if (!trimmed) return;

    sendRaw(trimmed);
    addLogEntry(MessageState.Sent, trimmed);
    setMessageToSend('');
  }, [messageToSend, sendRaw, addLogEntry]);

  const clearLog = useCallback(() => setLog([]), []);

  return {
    url,
    setUrl,
    connectionStatus,
    connectionError,
    retryCount,
    isConnected,
    isConnecting,
    isReconnecting,
    connect,
    disconnect,
    send,
    clearLog,
    log,
    messageToSend,
    setMessageToSend,
  };
}
