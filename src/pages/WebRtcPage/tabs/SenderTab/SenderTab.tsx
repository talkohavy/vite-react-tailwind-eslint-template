import clsx from 'clsx';
import Button from '@src/components/controls/Button';
import GuidDisplayer from '@src/components/GuidDisplayer';
import { useSenderTabLogic } from './logic/useSenderTabLogic';

export default function SenderTab() {
  const {
    videoRef,
    error,
    isSharing,
    isConnected,
    isConnecting,
    isConnectDisabled,
    isDisconnectDisabled,
    isStartSharingDisabled,
    connect,
    disconnect,
    startSharing,
    sessionId,
    handleGenerateNewSession,
  } = useSenderTabLogic();

  return (
    <div className='flex flex-col gap-6'>
      <section className='flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900'>
        <h2 className='text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
          Sender — share screen or camera
        </h2>

        <p className='text-sm text-gray-600 dark:text-gray-300'>
          Share the session ID below with receivers (e.g. via email, Slack, WhatsApp). They paste it on the Receiver tab
          to join this session.
        </p>

        <div className='flex flex-col gap-2'>
          <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Session ID</span>
          <GuidDisplayer value={sessionId} onGenerateNew={handleGenerateNewSession} />
        </div>

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

          <Button
            onClick={() => startSharing('screen')}
            disabled={isStartSharingDisabled}
            className='bg-blue-600 hover:bg-blue-700 disabled:opacity-50'
          >
            {isSharing ? 'Sharing...' : 'Share screen'}
          </Button>

          <Button
            onClick={() => startSharing('camera')}
            disabled={isStartSharingDisabled}
            className='bg-violet-600 hover:bg-violet-700 disabled:opacity-50'
          >
            {isSharing ? 'Sharing...' : 'Share camera'}
          </Button>
        </div>

        {isConnecting && <span className='text-sm text-amber-600 dark:text-amber-400'>Connecting...</span>}

        {isConnected && !isSharing && (
          <span className='text-sm text-emerald-600 dark:text-emerald-400'>
            Connected. Click &quot;Share screen&quot; or &quot;Share camera&quot;.
          </span>
        )}

        {error && (
          <span className='text-sm text-red-600 dark:text-red-400' title={error.message}>
            {error.message}
          </span>
        )}
      </section>

      <section
        className={clsx(
          !isSharing && 'hidden',
          'flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900',
        )}
      >
        <h2 className='text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
          Your preview
        </h2>

        <video
          ref={videoRef}
          autoPlay
          controls
          muted // <--- the sender doesn't need to hear themselves. if not muted, there's going to be a feedback loop.
          playsInline // <--- so the preview plays inline on mobile instead of forcing fullscreen.
          className='w-full rounded-lg border border-gray-200 bg-black object-contain dark:border-gray-600'
        >
          <track kind='captions' />
        </video>
      </section>
    </div>
  );
}
