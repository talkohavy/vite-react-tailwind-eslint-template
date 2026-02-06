import clsx from 'clsx';
import { WsConnectionState, type WsConnectionStateValues } from '../../logic/constants';

const config: Record<WsConnectionStateValues, { label: string; className: string; dotClassName: string }> = {
  [WsConnectionState.Idle]: {
    label: 'Disconnected',
    className: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    dotClassName: 'bg-gray-500',
  },
  [WsConnectionState.Connecting]: {
    label: 'Connecting…',
    className: 'bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-200',
    dotClassName: 'bg-amber-500 animate-pulse',
  },
  [WsConnectionState.Open]: {
    label: 'Connected',
    className: 'bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200',
    dotClassName: 'bg-emerald-600 dark:bg-emerald-400 animate-pulse',
  },
  [WsConnectionState.Closing]: {
    label: 'Closing…',
    className: 'bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-200',
    dotClassName: 'bg-amber-500 animate-pulse',
  },
  [WsConnectionState.Closed]: {
    label: 'Disconnected',
    className: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    dotClassName: 'bg-gray-500',
  },
};

type StatusBadgeProps = {
  state: WsConnectionStateValues;
};

export default function StatusBadge(props: StatusBadgeProps) {
  const { state } = props;
  const { label, className, dotClassName } = config[state];

  return (
    <span className={clsx('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium', className)}>
      <span className={clsx('size-2 rounded-full', dotClassName)} />
      {label}
    </span>
  );
}
