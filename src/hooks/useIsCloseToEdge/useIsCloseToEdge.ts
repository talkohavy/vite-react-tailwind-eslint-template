import { useCallback, useState } from 'react';
import { wrapInDebounce } from '@talkohavy/lodash';
import { calcGapBetweenWindowCeilingAndContainerCeiling } from './utils/calcGapBetweenWindowCeilingAndContainerCeiling';
import { calcGapBetweenWindowFloorAndBottom } from './utils/calcGapBetweenWindowFloorAndBottom';
type UseIsCloseToEdgeProps = {
  to: 'top' | 'bottom';
  initialIsVisible?: boolean;
  thresholdGap?: number;
  delayMs?: number;
}; /**
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
export function useIsCloseToEdge(props: UseIsCloseToEdgeProps) {
  const { to, initialIsVisible, thresholdGap = 60, delayMs = 100 } = props ?? {};

  const [isVisible, setIsVisible] = useState(initialIsVisible);

  const onScroll = useCallback(
    // eslint-disable-next-line
    wrapInDebounce((e) => {
      const { scrollHeight, scrollTop, clientHeight } = e.target;

      const calcGapFunc =
        to === 'top' ? calcGapBetweenWindowCeilingAndContainerCeiling : calcGapBetweenWindowFloorAndBottom;

      const actualGap = calcGapFunc({ clientHeight, scrollHeight, scrollTop });

      if (actualGap > thresholdGap && !isVisible) return setIsVisible(true);

      if (actualGap <= thresholdGap && isVisible) return setIsVisible(false);
    }, delayMs),
    [isVisible],
  );

  return { isVisible, onScroll };
}
