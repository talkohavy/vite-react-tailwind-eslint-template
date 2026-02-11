import { useCallback, useEffect } from "react";

const DEFAULT_GAP_TO_BOTTOM_PX = 100;
const DEFAULT_GAP_TO_BOTTOM_PERCENT = 4;

type UseReachToBottomMechanismProps = {
  onBottomReached?: () => void;
  /**
   * Needed for the on-mount first check.
   * The newly created handleBottomReached function will be invoked with the parentRef.current element as the argument.
   */
  parentRef: React.RefObject<HTMLDivElement>;
  /**
   * Absolute distance in pixels from the bottom to trigger the callback.
   * Defaults to 100px.
   */
  thresholdInPx?: number;
  /**
   * Percentage of viewport height from the bottom to trigger the callback.
   * Defaults to 4%.
   */
  thresholdInPercent?: number;
};

/**
 * @description
 * You have a container and a window.
 * h1 = represents the height of the container.
 * h2 = represents the height of the window.
 *    __________
 *   |          |          }
 *   |          |          }
 *   |          |          }
 *  _|__________|_         } h1
 * |              |  ] h2  }
 * |______________|  ]     }
 *   |          |          }
 *   |__________|          }
 *
 * upperGap = the distance between the container's ceiling and the window's ceiling.
 * lowerGap = the distance between the container's floor and the window's floor.
 *
 * HOW TO USE:
 *
 * - Step 1: call the hook, and extract the onScroll function
 * - Step 2: attach it to the container element's `onScroll` attribute.
 *
 * When you scroll inside the container, the hook will update the `isVisible` value for you,
 * using a debounce with a delay of 100ms (default value). You can choose to override the
 * default delay, and pass a different value to `delayMs`.
 */
export function useReachToBottomMechanism(
  props: UseReachToBottomMechanismProps,
) {
  const {
    onBottomReached,
    parentRef,
    thresholdInPx = DEFAULT_GAP_TO_BOTTOM_PX,
    thresholdInPercent = DEFAULT_GAP_TO_BOTTOM_PERCENT,
  } = props;

  const handleBottomReached = useCallback(
    (containerRefElement: HTMLDivElement) => {
      if (containerRefElement && onBottomReached) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;

        const distanceToBottom = scrollHeight - scrollTop - clientHeight;
        const _100_percent = scrollHeight - clientHeight;
        const percentageGap = (distanceToBottom / _100_percent) * 100;

        const isCloseToBottom =
          distanceToBottom < thresholdInPx ||
          percentageGap < thresholdInPercent;

        if (isCloseToBottom) onBottomReached();
      }
    },
    [onBottomReached, thresholdInPx, thresholdInPercent],
  );

  // A check on mount:
  useEffect(() => {
    handleBottomReached(parentRef.current!);
  }, [handleBottomReached, parentRef]);

  return { handleBottomReached };
}
