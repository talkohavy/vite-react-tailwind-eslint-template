import { createToastFactory } from './createToastFactory';
import type { ToastProps } from '../../types';

export function showWarningToast(props: ToastProps) {
  const { title, data = {} } = props;

  data.className = 'bg-amber-200! hover:bg-amber-400! active:bg-amber-500!';

  return createToastFactory({ level: 'warning', title, data });
}
