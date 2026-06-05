import { createToastFactory } from './createToastFactory';
import type { ToastProps } from '../../types';

export function showErrorToast(props: ToastProps) {
  const { title, data = {}, onClose, showCloseButton } = props;

  data.className = 'bg-red-300! hover:bg-red-400! active:bg-red-500!';

  return createToastFactory({ level: 'error', title, data, showCloseButton, onClose });
}
