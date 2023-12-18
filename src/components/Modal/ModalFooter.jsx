import clsx from 'clsx';
import { Close } from '@radix-ui/react-dialog';

/**
 * @param {{
 *   onConfirmClick: any,
 *   onCancelClick: any,
 *   confirmText: string,
 *   cancelText: string,
 *   showCancelButton: boolean
 *   className: string
 * }} props
 */
export default function ModalFooter({
  onConfirmClick,
  onCancelClick,
  cancelText,
  confirmText,
  showCancelButton,
  className,
}) {
  return (
    <div className={clsx('flex w-full items-center justify-end gap-3', className)}>
      {showCancelButton && (
        <Close asChild>
          <button
            onClick={onCancelClick}
            className='inline-flex h-10 min-w-20 items-center justify-center rounded-full bg-neutral-200 px-4 hover:bg-neutral-300 focus:shadow-2xs'
            autoFocus
          >
            {cancelText}
          </button>
        </Close>
      )}

      <button
        onClick={onConfirmClick}
        className='inline-flex h-10 min-w-20 items-center justify-center rounded-full bg-red-400 px-4 hover:bg-red-500 focus:shadow-xs'
      >
        {confirmText}
      </button>
    </div>
  );
}
