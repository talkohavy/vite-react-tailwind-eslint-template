import clsx from 'clsx';
import { Close } from '@radix-ui/react-dialog';

type ModalFooterProps = {
  onConfirmClick: any;
  onCancelClick: any;
  confirmText: string;
  cancelText: string;
  showCancelButton: boolean;
  className?: string;
};

export default function ModalFooter(props: ModalFooterProps) {
  const { onConfirmClick, onCancelClick, cancelText, confirmText, showCancelButton, className } = props;

  return (
    <div className={clsx('flex w-full items-center justify-end gap-3', className)}>
      {showCancelButton && (
        <Close asChild>
          <button
            type='button'
            onClick={onCancelClick}
            className='inline-flex h-10 min-w-20 items-center justify-center rounded-full bg-neutral-200 px-4 hover:bg-neutral-300 focus:shadow-2xs'
            autoFocus
          >
            {cancelText}
          </button>
        </Close>
      )}

      <button
        type='button'
        onClick={onConfirmClick}
        className='inline-flex h-10 min-w-20 items-center justify-center rounded-full bg-red-400 px-4 hover:bg-red-500 focus:shadow-xs'
      >
        {confirmText}
      </button>
    </div>
  );
}
