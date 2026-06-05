import { createToastFactory } from './createToastFactory';
import type { ToastProps } from '../../types';

export function showLoadingToast(props: ToastProps) {
  const { title, data = {} } = props;

  data.className = 'dark:bg-black! dark:text-white!';

  return createToastFactory({ level: 'loading', title, data });
}
