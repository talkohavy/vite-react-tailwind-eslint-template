import Button from '@src/components/controls/Button';
import { useReceiverTabLogic } from './logic/useReceiverTabLogic';

export default function ReceiverTab() {
  const {
    error,
    hasRemoteStream,
    isConnected,
    isConnecting,
    isConnectDisabled,
    isDisconnectDisabled,
    connect,
    disconnect,
    setVideoRef,
  } = useReceiverTabLogic();

  return (
    <div className='flex flex-col gap-6'>
      <section className='flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900'>
        <h2 className='text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
          Receiver — view shared screen
        </h2>

        {isConnected && (
          <span className='text-sm text-emerald-600 dark:text-emerald-400'>
            Connected. Waiting for sender to share...
          </span>
        )}

        <p className='text-sm text-gray-600 dark:text-gray-300'>
          Connect to the signaling server, then wait for the sender to start sharing. Open the sender in another tab or
          window first.
        </p>

        <div className='flex flex-wrap gap-2'>
          <Button
            onClick={connect}
            disabled={isConnectDisabled}
            className='bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50'
          >
            Connect
          </Button>

          <Button
            onClick={disconnect}
            disabled={isDisconnectDisabled}
            className='bg-gray-600 hover:bg-gray-700 disabled:opacity-50'
          >
            Disconnect
          </Button>
        </div>

        {isConnecting && <span className='text-sm text-amber-600 dark:text-amber-400'>Connecting...</span>}

        {error && (
          <span className='text-sm text-red-600 dark:text-red-400' title={error.message}>
            {error.message}
          </span>
        )}
      </section>

      {hasRemoteStream && (
        <section className='flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900'>
          <h2 className='text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
            Remote stream
          </h2>

          <video
            ref={setVideoRef}
            autoPlay
            playsInline
            controls
            className='w-full rounded-lg border border-gray-200 bg-black object-contain dark:border-gray-600'
          >
            <track kind='captions' />
          </video>
        </section>
      )}
    </div>
  );
}
