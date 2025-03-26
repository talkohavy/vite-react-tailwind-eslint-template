import { useCallback, useState } from 'react';
import { wrapInDebounce } from '@talkohavy/lodash';

type UseIsCloseToEdgeProps = {
  initialIsVisible?: boolean;
  gapToEdgeThreshold?: number;
  delayMs?: number;
};

/**
 * @description
 * HOW TO USE:
 *
 * - Step 1: Define a useState outside this hook named [isVisible, setIsVisible]
 * - Step 2: call the hook and pass to it both the value and its setter
 * - Step 3: from the hook, extract the handleElementScroll function
 * - Step 4: pass the handleElementScroll function to an `onScroll` attribute on your element.
 *
 * This hook will update the `isVisible` internally value for you, using a debounce with a delay of 100ms (default value).
 * You can choose to override the default delay, and pass a different value to `delayMs`.
 */
export function useIsCloseToEdge(props?: UseIsCloseToEdgeProps) {
  const { initialIsVisible, gapToEdgeThreshold = 900, delayMs = 100 } = props ?? {};

  const [isVisible, setIsVisible] = useState(initialIsVisible);

  const onElementScroll = useCallback(
    // eslint-disable-next-line
    wrapInDebounce((e) => {
      const { scrollHeight, scrollTop } = e.target;
      const gapToBottom = scrollHeight - scrollTop;
      if (gapToBottom > gapToEdgeThreshold && isVisible) return setIsVisible(false);

      if (gapToBottom <= gapToEdgeThreshold && !isVisible) return setIsVisible(true);
    }, delayMs),
    [isVisible],
  );

  return { isVisible, onElementScroll };
}
