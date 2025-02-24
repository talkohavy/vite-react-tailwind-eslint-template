import { PropsWithChildren } from 'react';
import ReactDom from 'react-dom';
import clsx from 'clsx';
import styles from './Modal.module.scss';

type ModalProps = PropsWithChildren<{
  alignTo?: 'center' | 'flex-start' | 'flex-end' | 'left' | 'right';
  id?: string;
  onClickAway?: () => void;
  className?: string;
}>;

export default function Modal(props: ModalProps) {
  const { children, id, onClickAway, alignTo = 'center', className } = props;

  return ReactDom.createPortal(
    <div
      data-test-id={id}
      onKeyDown={onClickAway ? (e) => e.key === 'Escape' && onClickAway() : undefined}
      // @ts-ignore - attributes does not exist on e.target
      onMouseDown={onClickAway ? (e) => e.target.attributes['data-test-id']?.value === id && onClickAway() : undefined}
      className={clsx(styles.modal, className)}
      style={{ justifyContent: alignTo }}
    >
      {children}
    </div>,
    document.body,
  );
}
