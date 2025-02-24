import type { PropsWithChildren } from 'react';
import ErrorBoundaryBase from '../ErrorBoundaryBase';
import ModalFallback from './ModalFallback';

type GlobalErrorBoundaryDevelopmentProps = PropsWithChildren<{
  isDevelopmentOnly?: boolean;
}>;

export default function GlobalErrorBoundaryDevelopment(props: GlobalErrorBoundaryDevelopmentProps) {
  const { children, isDevelopmentOnly } = props;

  return (
    <ErrorBoundaryBase isDevelopmentOnly={isDevelopmentOnly} fallback={ModalFallback}>
      {children}
    </ErrorBoundaryBase>
  );
}
