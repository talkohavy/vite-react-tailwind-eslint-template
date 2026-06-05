import type { ExternalToast } from 'sonner';

export const DEFAULT_TOAST_DATA: ExternalToast = {
  duration: 3000,
  position: 'top-center',
  dismissible: true,
  closeButton: true,
};

Object.freeze(DEFAULT_TOAST_DATA);

export const ToastLevels = {
  Success: 'success',
  Error: 'error',
  Warning: 'warning',
  Info: 'info',
  Loading: 'loading',
} as const;

export type ToastLevelValues = (typeof ToastLevels)[keyof typeof ToastLevels];
