import { toast } from 'sonner';
import { addCloseButton } from '../addCloseButton';
import { DEFAULT_TOAST_DATA } from '../constants';
import type { _CreateToastFactoryProps } from '../../types';

export function createToastFactory(props: _CreateToastFactoryProps) {
  const { title, data = {}, level, showCloseButton = false, onClose } = props;

  const finalData = Object.assign(data, DEFAULT_TOAST_DATA);

  if (showCloseButton) {
    addCloseButton(data, onClose);
  }

  if (level) return toast[level](title, finalData);

  return toast(title, finalData);
}
