import { useState } from 'react';
import { WS_SERVICE_URL } from '../../../common/constants';
import { ConnectionState } from '../../../lib/SocketIOClient/logic/constants';
import { useSocketIO } from '../../../lib/SocketIOClient/useSocketIO';

export function useSocketIOPageLogic() {
  const [url, setUrl] = useState(WS_SERVICE_URL);
  const [eventName, setEventName] = useState('');
  const [payloadText, setPayloadText] = useState('');

  const { connectionState, connectionError, eventLog, connect, disconnect, emit, clearLog } = useSocketIO();

  const isConnected = connectionState === ConnectionState.Connected;
  const isConnecting = connectionState === ConnectionState.Connecting;

  const handleEmit = () => {
    const trimmedEventName = eventName.trim();

    if (!trimmedEventName) return;

    let data: unknown;

    if (payloadText.trim()) {
      try {
        data = JSON.parse(payloadText);
      } catch {
        data = payloadText;
      }
    }

    emit(trimmedEventName, data);
  };

  return {
    url,
    setUrl,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    connectionState,
    connectionError,
    eventName,
    setEventName,
    handleEmit,
    payloadText,
    setPayloadText,
    clearLog,
    eventLog,
  };
}
