import ConnectionPanel from './content/ConnectionPanel';
import EmitEventPanel from './content/EmitEventPanel';
import EventLogPanel from './content/EventLogPanel';
import { useSocketIOPageLogic } from './logic/useSocketIOPageLogic';

export default function SocketIOPage() {
  const {
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
  } = useSocketIOPageLogic();

  return (
    <div className='size-full overflow-auto p-6'>
      <div className='mx-auto flex max-w-2xl flex-col gap-8'>
        <header>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>Socket.IO Client</h1>

          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            Connect to a Socket.IO server, emit events, and see incoming messages in the log.
          </p>
        </header>

        <ConnectionPanel
          url={url}
          setUrl={setUrl}
          isConnecting={isConnecting}
          connect={connect}
          disconnect={disconnect}
          connectionState={connectionState}
          connectionError={connectionError}
          isConnected={isConnected}
        />

        <EmitEventPanel
          eventName={eventName}
          setEventName={setEventName}
          isConnected={isConnected}
          handleEmit={handleEmit}
          payloadText={payloadText}
          setPayloadText={setPayloadText}
        />

        <EventLogPanel clearLog={clearLog} eventLog={eventLog} isConnected={isConnected} />
      </div>
    </div>
  );
}
