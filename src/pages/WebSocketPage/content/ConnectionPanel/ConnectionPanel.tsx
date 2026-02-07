import Button from '@src/components/controls/Button';
import Input from '@src/components/controls/Input';
import RetryCounter from '../RetryCounter';
import StatusBadge from '../StatusBadge';
import type { WsConnectionStateValues } from '../../logic/constants';

type ConnectionPanelProps = {
  url: string;
  setUrl: (url: string) => void;
  isConnecting: boolean;
  isReconnecting: boolean;
  retryCount: number;
  connect: (url: string) => void;
  disconnect: () => void;
  connectionState: WsConnectionStateValues;
  connectionError: Error | null;
  isConnected: boolean;
};

export default function ConnectionPanel(props: ConnectionPanelProps) {
  const {
    url,
    setUrl,
    isConnecting,
    isReconnecting,
    retryCount,
    connect,
    disconnect,
    connectionState,
    connectionError,
    isConnected,
  } = props;

  const isDisconnectDisabled = !isConnected && !isConnecting && !isReconnecting;
  const isConnectDisabled = isConnecting || isReconnecting || isConnected;
  const isUrlInputDisabled = isConnectDisabled || isDisconnectDisabled;

  return (
    <section className='flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900'>
      <h2 className='text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>Connection</h2>

      <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3'>
        <div className='min-w-0 flex-1'>
          <label htmlFor='ws-server-url' className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            WebSocket URL
          </label>

          <Input
            initialValue={url}
            onChange={setUrl}
            placeholder='ws://localhost:8000'
            disabled={isUrlInputDisabled}
            className='block w-full dark:bg-gray-800 dark:border-gray-600'
          />
        </div>

        <div className='flex shrink-0 gap-2'>
          <Button
            onClick={() => connect(url)}
            disabled={isConnectDisabled}
            className='bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50'
          >
            Connect
          </Button>

          <Button
            onClick={disconnect}
            disabled={isDisconnectDisabled}
            className='bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 disabled:hover:bg-gray-600'
          >
            Disconnect
          </Button>
        </div>
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        <div className='flex justify-between items-center gap-2 w-full'>
          <StatusBadge state={connectionState} />

          {retryCount > 0 && <RetryCounter retryCount={retryCount} maxRetries={5} />}
        </div>

        {connectionError && (
          <span className='text-sm text-red-600 dark:text-red-400' title={connectionError.message}>
            {connectionError.message}
          </span>
        )}
      </div>
    </section>
  );
}
