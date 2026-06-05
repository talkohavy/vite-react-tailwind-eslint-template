import { toast } from 'sonner';
import { addCloseButton } from '../addCloseButton';
import { DEFAULT_TOAST_DATA } from '../constants';
import type { PromiseToastProps } from '../../types';

export function showPromiseToast<ToastData>(props: PromiseToastProps<ToastData>) {
  const {
    promise,
    loading = 'Loading...',
    success = 'Success',
    error = 'Something went wrong',
    description,
    onFinally,
    data = {},
    showCloseButton = false,
    onClose,
  } = props;

  const finalData = Object.assign(DEFAULT_TOAST_DATA, data, {
    loading,
    success,
    error,
    description,
    finally: onFinally,
    classNames: {
      success: 'bg-emerald-200! hover:bg-emerald-400! active:bg-emerald-500!',
      error: 'bg-red-300! hover:bg-red-400! active:bg-red-500!',
      loading: 'dark:bg-black! dark:text-white!',
      ...data.classNames,
    },
  });

  if (showCloseButton) {
    addCloseButton(finalData, onClose);
  }

  return toast.promise(promise, finalData);
}
