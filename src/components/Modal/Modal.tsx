import { Close, Content, Overlay, Portal, Root, Title } from '@radix-ui/react-dialog';
import XIcon from '../../utils/svg/XIcon';
import ModalFooter from './ModalFooter';

const CLASSES = {
  modalOverlay: 'fixed inset-0 bg-black/50',
  modalWrapperElement:
    'fixed left-1/2 top-1/2 flex flex-col gap-5 max-h-[85vh] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 animate-appear items-start justify-start rounded-md bg-white p-6 shadow-md duration-1000',
  modalTitle: 'm-0 text-lg font-medium text-gray-600',
  closeButton: 'group absolute right-2.5 top-2.5 items-center justify-center rounded-full bg-transparent p-0.5',
  closeIcon: 'inline-flex h-6 w-6 stroke-black hover:stroke-red-500 group-focus:stroke-red-500',
};

type ModalProps = {
  isOpen: boolean;
  onConfirmClick?: any;
  onCancelClick?: any;
  title: string;
  body: import('react').ReactNode;
  confirmText?: string;
  cancelText?: string;
  showCloseIcon?: boolean;
  showCancelButton?: boolean;
  handleEscapeAndClickAway?: (props?: any) => void;
  footerClassName?: string;
};

export default function Modal(props: ModalProps) {
  const {
    isOpen,
    onConfirmClick,
    onCancelClick,
    title,
    body,
    confirmText = 'Ok',
    cancelText = 'Cancel',
    showCloseIcon = true,
    showCancelButton = true,
    handleEscapeAndClickAway,
    footerClassName,
  } = props;

  return (
    <Root open={isOpen} onOpenChange={handleEscapeAndClickAway}>
      <Portal>
        <Overlay className={CLASSES.modalOverlay} />

        <Content className={CLASSES.modalWrapperElement}>
          {showCloseIcon && (
            <Close asChild>
              <button type='button' className={CLASSES.closeButton} aria-label='Close' onClick={onCancelClick}>
                <XIcon className={CLASSES.closeIcon} />
              </button>
            </Close>
          )}
          <Title className={CLASSES.modalTitle}>{title}</Title>

          {body}

          <ModalFooter
            cancelText={cancelText}
            confirmText={confirmText}
            onConfirmClick={onConfirmClick}
            onCancelClick={onCancelClick}
            showCancelButton={showCancelButton}
            className={footerClassName}
          />
        </Content>
      </Portal>
    </Root>
  );
}
