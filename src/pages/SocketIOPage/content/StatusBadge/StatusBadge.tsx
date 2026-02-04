import clsx from 'clsx';
import { ConnectionState, type ConnectionStateValues } from '../../../../lib/SocketIOClient/logic/constants';
import styles from './StatusBadge.module.scss';

const config: Record<ConnectionStateValues, { label: string; className: string; dotClassName: string }> = {
  [ConnectionState.Disconnected]: {
    label: 'Disconnected',
    className: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    dotClassName: 'bg-gray-500',
  },
  [ConnectionState.Connecting]: {
    label: 'Connecting…',
    className: 'bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-200',
    dotClassName: 'bg-amber-500 animate-pulse',
  },
  [ConnectionState.Connected]: {
    label: 'Connected',
    className: 'bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200',
    dotClassName: 'bg-emerald-600 dark:bg-emerald-400 animate-pulse',
  },
  [ConnectionState.Error]: {
    label: 'Error',
    className: 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200',
    dotClassName: 'bg-red-600',
  },
};

type StatusBadgeProps = {
  state: ConnectionStateValues;
};

export default function StatusBadge(props: StatusBadgeProps) {
  const { state } = props;

  const { label, className, dotClassName } = config[state];

  return (
    <span className={clsx(styles.statusBadge, className)}>
      <span className={clsx(styles.dotBase, dotClassName)} />

      {label}
    </span>
  );
}
