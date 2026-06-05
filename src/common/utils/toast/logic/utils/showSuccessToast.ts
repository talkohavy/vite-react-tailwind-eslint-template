import { createToastFactory } from './createToastFactory';
import type { ToastProps } from '../../types';

export function showSuccessToast(props: ToastProps) {
  const { title, data = {} } = props;

  data.className = 'bg-emerald-200! hover:bg-emerald-400! active:bg-emerald-500!';

  return createToastFactory({ level: 'success', title, data });
}
