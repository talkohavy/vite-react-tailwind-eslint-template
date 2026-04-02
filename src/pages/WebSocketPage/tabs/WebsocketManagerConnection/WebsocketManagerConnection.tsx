import Examples from '../WebsocketHookConnectionTab/content/Examples';
import MessageLogPanel from '../WebsocketHookConnectionTab/content/MessageLogPanel';
import SendMessagePanel from '../WebsocketHookConnectionTab/content/SendMessagePanel';
import ConnectionPanel from './content/ConnectionPanel';
import { useWebsocketManagerConnectionLogic } from './logic/useWebsocketManagerConnectionLogic';

export default function WebsocketManagerConnectionTab() {
  const {
    url,
    setUrl,
    connectionStatus,
    connectionError,
    retryCount,
    isConnected,
    onConnectClick,
    disconnect,
    send,
    clearLog,
    log,
    messageToSend,
    setMessageToSend,
  } = useWebsocketManagerConnectionLogic();

  return (
    <div className='size-full overflow-auto p-6'>
      <div className='mx-auto flex max-w-2xl flex-col gap-8'>
        <header>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>WebSocket Client</h1>

          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            Same UI as the Hook tab, but connection state and messaging use{' '}
            <span className='font-medium text-gray-700 dark:text-gray-300'>WebSocketProvider</span> +{' '}
            <span className='font-medium text-gray-700 dark:text-gray-300'>useWebSocket()</span> (React context).
          </p>
        </header>

        <ConnectionPanel
          url={url}
          setUrl={setUrl}
          retryCount={retryCount}
          onConnectClick={onConnectClick}
          disconnect={disconnect}
          connectionStatus={connectionStatus}
          connectionError={connectionError}
        />

        <SendMessagePanel
          messageToSend={messageToSend}
          setMessageToSend={setMessageToSend}
          isConnected={isConnected}
          send={send}
        />

        <MessageLogPanel clearLog={clearLog} log={log} isConnected={isConnected} />

        <Examples />
      </div>
    </div>
  );
}
