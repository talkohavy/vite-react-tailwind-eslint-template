import { useRef, useState } from 'react';
import { useIsCloseToEdge } from '@src//hooks/useIsCloseToEdge';
import { useScrollToEdge } from '@src//hooks/useScrollToEdge';
import { tabs } from './constants';

export function useShowcaseLogic() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const TabContent = tabs[selectedTabIndex]!.item!;

  const refElement = useRef<HTMLElement>({} as HTMLElement);

  const { isCloseToEdge: isCloseToBottom, onScroll: onScrollToBottom } = useIsCloseToEdge({
    to: 'bottom',
  });
  const { scrollToEdge: scrollToBottom } = useScrollToEdge({ refElement: refElement, to: 'bottom' });

  const { isCloseToEdge: isCloseToTop, onScroll: onScrollToTop } = useIsCloseToEdge({
    to: 'top',
    initialIsCloseToEdge: true,
  });
  const { scrollToEdge: scrollToTop } = useScrollToEdge({ refElement: refElement, to: 'top' });

  return {
    TabContent,
    selectedTabIndex,
    setSelectedTabIndex,
    refElement,
    isCloseToBottom,
    isCloseToTop,
    onScrollToBottom,
    onScrollToTop,
    scrollToBottom,
    scrollToTop,
  };
}
