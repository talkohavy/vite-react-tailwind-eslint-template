import { createToastFactory } from './createToastFactory';
import type { ToastProps } from '../../types';

export function showInfoToast(props: ToastProps) {
  const { title, data = {} } = props;

  data.className = 'dark:bg-black! dark:text-white!';

  return createToastFactory({ level: 'info', title, data });
}
