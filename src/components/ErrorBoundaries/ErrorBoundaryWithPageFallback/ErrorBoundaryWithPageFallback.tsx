import type { PropsWithChildren } from 'react';
import ErrorBoundaryBase from '../ErrorBoundaryBase';
import FallbackPage from './FallbackPage';

export default function ErrorBoundaryWithPageFallback(props: PropsWithChildren) {
  const { children } = props;

  return <ErrorBoundaryBase fallback={FallbackPage}>{children}</ErrorBoundaryBase>;
}
