import { createToastFactory } from './logic/utils/createToastFactory';
import type { ToastProps } from './types';

export function showSuccessToast(props: ToastProps) {
  const { title, data = {}, onClose, showCloseButton } = props;

  data.className = 'bg-emerald-200! hover:bg-emerald-400! active:bg-emerald-500!';

  return createToastFactory({ level: 'success', title, data, showCloseButton, onClose });
}

export function showErrorToast(props: ToastProps) {
  const { title, data = {}, onClose, showCloseButton } = props;

  data.className = 'bg-red-300! hover:bg-red-400! active:bg-red-500!';

  return createToastFactory({ level: 'error', title, data, showCloseButton, onClose });
}

export function showWarningToast(props: ToastProps) {
  const { title, data = {}, onClose, showCloseButton } = props;

  data.className = 'bg-amber-200! hover:bg-amber-400! active:bg-amber-500!';

  return createToastFactory({ level: 'warning', title, data, showCloseButton, onClose });
}

export function showInfoToast(props: ToastProps) {
  const { title, data = {}, onClose, showCloseButton } = props;

  data.className = 'dark:bg-black! dark:text-white!';

  return createToastFactory({ level: 'info', title, data, showCloseButton, onClose });
}

export function showLoadingToast(props: ToastProps) {
  const { title, data = {}, onClose, showCloseButton } = props;

  data.className = 'dark:bg-black! dark:text-white!';

  return createToastFactory({ level: 'loading', title, data, showCloseButton, onClose });
}
