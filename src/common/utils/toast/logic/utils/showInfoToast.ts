import { createToastFactory } from './createToastFactory';
import type { ToastProps } from '../../types';

export function showInfoToast(props: ToastProps) {
  const { title, data = {}, onClose, showCloseButton } = props;

  data.className = 'dark:bg-black! dark:text-white!';

  return createToastFactory({ level: 'info', title, data, showCloseButton, onClose });
}
