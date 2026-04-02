import { useCallback, useEffect, useState } from 'react';
import { parseJson } from '@src/common/utils/parseJson';
import { useWebSocket } from '@src/providers/WebSocketProvider';
import {
  MessageState,
  type WsConnectionStateValues,
  type MessageStateValues,
} from '../../WebsocketHookConnectionTab/logic/constants';
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

  const [connectionAcknowledged, setConnectionAcknowledged] = useState(false);

  const onConnected = useCallback(() => {
    console.log('I am connected');
  }, []);

  const onConnectClick = useCallback(() => {
    setConnectionAcknowledged(false);
    connect(onConnected);
  }, [connect, onConnected]);

  const [messageToSend, setMessageToSend] = useState('');
  const [log, setLog] = useState<MessageLogEntry[]>([]);

  const addLogEntry = useCallback((direction: MessageStateValues, data: string) => {
    setLog((prev) => [...prev, { id: nextId(), time: new Date(), direction, data }]);
  }, []);

  useEffect(() => {
    return subscribeMessages((data) => {
      const parsedData = parseJson(data);

      if (parsedData.type === 'connection_acknowledged') {
        setConnectionAcknowledged(true);
      }

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

  const connectionStatusWithAcknowledged = (connectionAcknowledged ? 'connection_acknowledged' : connectionStatus) as
    | WsConnectionStateValues
    | 'connection_acknowledged';

  return {
    url,
    setUrl,
    connectionStatus: connectionStatusWithAcknowledged,
    connectionError,
    retryCount,
    isConnected,
    isConnecting,
    isReconnecting,
    onConnectClick,
    disconnect,
    send,
    clearLog,
    log,
    messageToSend,
    setMessageToSend,
  };
}
