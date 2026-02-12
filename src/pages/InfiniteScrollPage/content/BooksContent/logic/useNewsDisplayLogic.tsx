import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useReachToBottomMechanism } from '@src/hooks/useReachToBottomMechanism';
import { COLUMN_COUNT, COLUMN_WIDTH, GAP, ROW_HEIGHT } from './constants';
import type { BooksContentProps } from '../BooksContent';

type UseNewsDisplayLogicProps = BooksContentProps;

export function useNewsDisplayLogic(props: UseNewsDisplayLogicProps) {
  const { books, onBottomReached } = props;

  const parentRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Calculate grid dimensions
  const columnCount = useMemo(() => {
    if (containerSize.width === 0) return COLUMN_COUNT;

    const availableWidth = containerSize.width - GAP * 2;

    return Math.max(1, Math.floor(availableWidth / (COLUMN_WIDTH + GAP)));
  }, [containerSize.width]);

  const rowCount = useMemo(() => {
    return Math.ceil(books.length / columnCount);
  }, [books.length, columnCount]);

  // Update container size on mount and resize
  useEffect(() => {
    const element = parentRef.current;
    if (!element) return;

    const updateSize = () => {
      if (parentRef.current) {
        const rect = parentRef.current.getBoundingClientRect();
        setContainerSize({
          width: rect.width || window.innerWidth,
          height: rect.height || window.innerHeight,
        });
      }
    };

    // Initial size update
    updateSize();

    // Use requestAnimationFrame for next frame to ensure DOM is ready
    const rafId = requestAnimationFrame(updateSize);

    // Fallback to catch any layout shifts (fonts, async CSS, etc.)
    const timeoutId = setTimeout(updateSize, 100);

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  const columnWidth = useMemo(() => {
    if (containerSize.width === 0) return COLUMN_WIDTH;

    const availableWidth = containerSize.width - GAP * 2;
    const totalGapWidth = GAP * (columnCount - 1);

    return Math.max(COLUMN_WIDTH, (availableWidth - totalGapWidth) / columnCount);
  }, [containerSize.width, columnCount]);

  const rowHeight = ROW_HEIGHT + GAP;

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 10,
  });

  const { handleBottomReached } = useReachToBottomMechanism({
    onBottomReached,
    parentRef,
  });

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      handleBottomReached(e.currentTarget);
    },
    [handleBottomReached],
  );

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  return {
    columnCount,
    columnWidth,
    parentRef,
    handleScroll,
    virtualRows,
    totalSize,
  };
}
