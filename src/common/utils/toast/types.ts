import type { ToastLevelValues } from './logic/constants';
import type { ExternalToast } from 'sonner';

export type _CreateToastFactoryProps = {
  title: (() => React.ReactNode) | React.ReactNode;
  data?: ExternalToast;
  level?: ToastLevelValues;
};

export type ToastProps = Omit<_CreateToastFactoryProps, 'level'>;

type PromiseToastExtendedResult = ExternalToast & {
  message: React.ReactNode;
};

type PromiseToastResult<Data = unknown> =
  | string
  | React.ReactNode
  | ((data: Data) => React.ReactNode | string | Promise<React.ReactNode | string>);

type PromiseToastExtendedResultFn<Data = unknown> =
  | PromiseToastExtendedResult
  | ((data: Data) => PromiseToastExtendedResult | Promise<PromiseToastExtendedResult>);

export type PromiseToastProps<ToastData = unknown> = {
  promise: Promise<ToastData> | (() => Promise<ToastData>);
  loading?: string | React.ReactNode;
  success?: PromiseToastResult<ToastData> | PromiseToastExtendedResultFn<ToastData>;
  error?: PromiseToastResult | PromiseToastExtendedResultFn;
  description?: PromiseToastResult;
  onFinally?: () => void | Promise<void>;
  data?: ExternalToast;
};
