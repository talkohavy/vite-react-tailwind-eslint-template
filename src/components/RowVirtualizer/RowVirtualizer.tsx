import { type ComponentType, useCallback, useRef } from 'react';
import type { ChildItemProps } from './types';
import { useVirtualizer } from '@tanstack/react-virtual';
import clsx from 'clsx';

type RowVirtualizerProps = {
  items: any[];
  estimatedSize?: number;
  overscan?: number;
  /**
   * Get unique item identifier for the item at the specified index.
   *
   * You should override this when possible to return a unique identifier for each item.
   *
   * IMPORTANT! This function must be memoized! In order to prevent infinite re-render loops that will crash your application.
   */
  getItemKey?: (index: number) => string | number;
  ChildItem: ComponentType<ChildItemProps>;
  className?: string;
  /**
   * @default 1
   */
  columns?: number;
};

export default function RowVirtualizer(props: RowVirtualizerProps) {
  const { items, estimatedSize = 500, overscan, getItemKey, ChildItem, columns = 1, className } = props;

  const parentRef = useRef<HTMLDivElement>(null);
  const estimateSize = useCallback(() => estimatedSize, [estimatedSize]);
  const getScrollElement = useCallback(() => parentRef.current, []);

  const cardWidth = 100 / columns;

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement,
    estimateSize, // <--- 🧠 If you are dynamically measuring your elements, it's recommended to estimate the largest possible size (width/height, within comfort) of your items. This will ensure features like smooth-scrolling will have a better chance at working correctly.
    useFlushSync: false, // <--- defaults to true. Set to `false` when using React 19.
    overscan, // <--- The default value is 1. The number of items to render above and below the visible area. Increasing this number will increase the amount of time it takes to render the virtualizer, but might decrease the likelihood of seeing slow-rendering blank items at the top and bottom of the virtualizer when scrolling.
    getItemKey, // <--- This function is passed the index of each item and should return a unique key for that item. The default functionality of this function is to return the index of the item, but you should override this when possible to return a unique identifier for each item across the entire set.
    lanes: columns,
    indexAttribute: 'data-row-index',
    // horizontal: true, // <--- defaults to false. Set this to `true` if your virtualizer is oriented horizontally.
    // scrollMargin: 20,
    // paddingStart: 10, // <--- The padding to apply to the start of the virtualizer in pixels.
    // paddingEnd: 10, // <--- The padding to apply to the end of the virtualizer in pixels.
    // scrollPaddingStart: 100, // <--- The padding to apply to the start of the virtualizer in pixels when scrolling to an element.
    // scrollPaddingEnd: 100, // <--- The padding to apply to the end of the virtualizer in pixels when scrolling to an element.
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div ref={parentRef} className={clsx('overflow-auto', className)}>
      {/* <button
        type='button'
        onClick={() => {
          rowVirtualizer.scrollToIndex(0);
        }}
      >
        scroll to the top
      </button> */}

      <div className='relative w-full' style={{ height: rowVirtualizer.getTotalSize() }}>
        {virtualItems.map((virtualItem) => (
          <div
            key={virtualItem.key}
            ref={rowVirtualizer.measureElement}
            data-row-index={virtualItem.index}
            className='absolute top-0 w-full p-2'
            style={{
              height: virtualItem.size,
              left: `${virtualItem.lane * cardWidth}%`,
              width: `${cardWidth}%`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ChildItem index={virtualItem.index} {...items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
