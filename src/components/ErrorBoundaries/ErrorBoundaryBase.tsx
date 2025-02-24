import { Component, type ComponentType, type PropsWithChildren } from 'react';

type ErrorBoundaryProps = PropsWithChildren<{
  fallback?: ComponentType<{ error: any }>;
  isDevelopmentOnly?: boolean;
}>;

export default class ErrorBoundaryBase extends Component<ErrorBoundaryProps> {
  state: { hasError: boolean; error: Error | null };

  constructor(props: ErrorBoundaryProps) {
    super(props);

    // to keep track of when an error occurs and the error itself
    this.state = { hasError: false, error: null };
  }

  // update the component state when an error occurs
  static getDerivedStateFromError(error: Error | null) {
    // specify that the error boundary has caught an error
    return { hasError: true, error };
  }

  componentDidCatch(error: Error | null, errorInfo: any) {
    // log the error
    console.error('error:', error);
    console.error('errorInfo:', errorInfo);
    // record the error in an APM tool...
  }

  /** @override */
  render() {
    // Return children immediately when:
    // - Case 1: no error
    // - Case 2: we declared this error-boundary to work only in development and we're not development mode
    const shouldReturnChildren =
      !this.state.hasError || (this.props.isDevelopmentOnly && process.env.NODE_ENV !== 'development');

    if (shouldReturnChildren) return this.props.children;

    const { fallback: Fallback } = this.props;
    const fallbackComponent = Fallback && <Fallback error={this.state.error} />;

    return fallbackComponent;
  }
}
