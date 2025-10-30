import { useCallback } from 'react';

type UseScrollToEdgeProps = {
  to: 'top' | 'bottom';
  refElement: any;
  scrollBehavior?: 'smooth' | 'instant' | 'auto';
};

export function useScrollToEdge(props: UseScrollToEdgeProps) {
  const { refElement, scrollBehavior = 'smooth', to } = props;

  const scrollToEdge = useCallback(() => {
    refElement.current.scrollTo({
      top: to === 'top' ? 0 : refElement.current.scrollHeight,
      behavior: scrollBehavior,
    });
    // refElement should not be a dependency here
    // eslint-disable-next-line
  }, [to, scrollBehavior]);

  return { scrollToEdge };
}
