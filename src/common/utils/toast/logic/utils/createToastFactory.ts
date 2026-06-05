import { toast } from 'sonner';
import { addCloseButton } from '../addCloseButton';
import { DEFAULT_TOAST_DATA } from '../constants';
import type { _CreateToastFactoryProps } from '../../types';

export function createToastFactory(props: _CreateToastFactoryProps) {
  const { title, data = {}, level, showCloseButton = false, onClose } = props;

  const finalData = Object.assign({}, DEFAULT_TOAST_DATA, data);

  // eslint-disable-next-line prefer-const -- it IS re-assigned!
  let toastId: string | number;

  if (showCloseButton) {
    addCloseButton(finalData, () => {
      toast.dismiss(toastId);
      onClose?.();
    });
  }

  toastId = level ? toast[level](title, finalData) : toast(title, finalData);

  return toastId;
}
