import { createToastFactory } from './createToastFactory';
import type { ToastProps } from '../../types';

export function showLoadingToast(props: ToastProps) {
  const { title, data = {}, onClose, showCloseButton } = props;

  data.className = 'dark:bg-black! dark:text-white!';

  return createToastFactory({ level: 'loading', title, data, showCloseButton, onClose });
}
