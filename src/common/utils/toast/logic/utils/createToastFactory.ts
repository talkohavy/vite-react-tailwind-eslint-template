import { toast } from 'sonner';
import { DEFAULT_TOAST_DATA } from '../constants';
import type { _CreateToastFactoryProps } from '../../types';

export function createToastFactory(props: _CreateToastFactoryProps) {
  const { title, data = {}, level } = props;

  const finalData = Object.assign({}, DEFAULT_TOAST_DATA, data);

  if (level) return toast[level](title, finalData);

  return toast(title, finalData);
}
