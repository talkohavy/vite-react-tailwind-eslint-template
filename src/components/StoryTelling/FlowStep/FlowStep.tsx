import type { ReactNode } from 'react';
import clsx from 'clsx';

const classesByVariant = {
  default: 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/40',
  success: 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/40',
  warn: 'border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950/40',
  danger: 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/40',
  muted: 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/40',
};

export default function FlowStep(props: {
  label: string;
  detail: ReactNode;
  variant?: 'default' | 'success' | 'warn' | 'danger' | 'muted';
}) {
  const { label, detail, variant = 'default' } = props;

  const variantClass = classesByVariant[variant];

  return (
    <div className={clsx('border rounded-lg px-3 py-2 text-sm', variantClass)}>
      <div className='font-semibold'>{label}</div>

      <div className='text-gray-600 dark:text-gray-400 mt-0.5'>{detail}</div>
    </div>
  );
}
