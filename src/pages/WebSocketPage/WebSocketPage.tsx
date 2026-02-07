import ConnectionPanel from './content/ConnectionPanel';
import MessageLogPanel from './content/MessageLogPanel';
import SendMessagePanel from './content/SendMessagePanel';
import { useWebSocketPageLogic } from './logic/useWebSocketPageLogic';

export default function WebSocketPage() {
  const {
    url,
    setUrl,
    messageToSend,
    setMessageToSend,
    isConnected,
    isConnecting,
    isReconnecting,
    retryCount,
    connect,
    disconnect,
    connectionState,
    connectionError,
    send,
    clearLog,
    log,
  } = useWebSocketPageLogic();

  return (
    <div className='size-full overflow-auto p-6'>
      <div className='mx-auto flex max-w-2xl flex-col gap-8'>
        <header>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>WebSocket Client</h1>

          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            Connect to a WebSocket server (e.g. backend using the &quot;ws&quot; package), send messages, and see
            incoming messages in the log.
          </p>
        </header>

        <ConnectionPanel
          url={url}
          setUrl={setUrl}
          isConnecting={isConnecting}
          isReconnecting={isReconnecting}
          retryCount={retryCount}
          connect={connect}
          disconnect={disconnect}
          connectionState={connectionState}
          connectionError={connectionError}
          isConnected={isConnected}
        />

        <SendMessagePanel
          messageToSend={messageToSend}
          setMessageToSend={setMessageToSend}
          isConnected={isConnected}
          send={send}
        />

        <MessageLogPanel clearLog={clearLog} log={log} isConnected={isConnected} />
      </div>
    </div>
  );
}
