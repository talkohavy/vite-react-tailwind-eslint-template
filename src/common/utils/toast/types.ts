import type { ToastLevelValues } from './logic/constants';
import type { ExternalToast } from 'sonner';

export type _CreateToastFactoryProps = {
  title: (() => React.ReactNode) | React.ReactNode;
  data?: ExternalToast;
  level?: ToastLevelValues;
  /**
   * @default false
   */
  showCloseButton?: boolean;
  onClose?: () => void;
};

export type ToastProps = Omit<_CreateToastFactoryProps, 'level'>;
