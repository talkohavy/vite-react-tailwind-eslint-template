import Button from '@src/components/controls/Button';
import LogEntryRow from '../LogEntryRow';
import type { EventLogEntry } from '../../../../lib/SocketIOClient/useSocketIO';

type EventLogPanelProps = {
  clearLog: () => void;
  eventLog: EventLogEntry[];
  isConnected: boolean;
};

export default function EventLogPanel(props: EventLogPanelProps) {
  const { clearLog, eventLog, isConnected } = props;

  return (
    <section className='flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <h2 className='text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>Event log</h2>

        {eventLog.length > 0 && (
          <Button onClick={clearLog} className='text-sm'>
            Clear log
          </Button>
        )}
      </div>

      <div className='flex max-h-80 flex-col gap-2 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50'>
        {eventLog.length === 0 ? (
          <p className='py-8 text-center text-sm text-gray-500 dark:text-gray-400'>
            {isConnected
              ? 'Events you emit and receive will appear here.'
              : 'Connect to start sending and receiving events.'}
          </p>
        ) : (
          eventLog.map((entry) => <LogEntryRow key={entry.id} entry={entry} />)
        )}
      </div>
    </section>
  );
}
