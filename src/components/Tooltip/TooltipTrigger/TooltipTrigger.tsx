import { type PropsWithChildren, useMemo } from 'react';
import type { PlacementValues, VariantValues } from '../logic/constants';

type TooltipTriggerProps = PropsWithChildren<{
  groupId?: string;
  /**
   * Content to be displayed in the tooltip.
   */
  offsetOverride?: number;
  contentOverride?: string;
  placeOverride?: PlacementValues;
  delayShowOverride?: number;
  delayHideOverride?: number;
  variant?: VariantValues;
  /**
   * @default false
   */
  shouldFollowMouse?: boolean;
  /**
   * @default false
   */
  hide?: boolean;
  onClick?: (value: any) => void;
  onMouseEnter?: (value: any) => void;
  onMouseLeave?: (value: any) => void;
  className?: string;
}>;

export default function TooltipTrigger(props: TooltipTriggerProps) {
  const {
    groupId,
    children,
    offsetOverride,
    contentOverride,
    placeOverride,
    delayShowOverride,
    delayHideOverride,
    shouldFollowMouse,
    variant,
    hide,
    className,
    onClick,
    onMouseEnter,
    onMouseLeave,
  } = props;

  const tooltipDataProps = useMemo(() => {
    const dataProps: any = {};

    if (groupId) dataProps['data-tooltip-id'] = groupId;
    if (offsetOverride) dataProps['data-tooltip-offset'] = offsetOverride;
    if (contentOverride) dataProps['data-tooltip-content'] = contentOverride;
    if (placeOverride) dataProps['data-tooltip-place'] = placeOverride;
    if (shouldFollowMouse) dataProps['data-tooltip-float'] = shouldFollowMouse;
    if (delayShowOverride) dataProps['data-tooltip-delay-show'] = delayShowOverride;
    if (delayHideOverride) dataProps['data-tooltip-delay-hide'] = delayHideOverride;
    if (hide) dataProps['data-tooltip-hidden'] = hide;
    if (variant) dataProps['data-tooltip-variant'] = variant;

    // dataProps['data-tooltip-class-name'] = 'custom-classname';

    return dataProps;
  }, [
    groupId,
    offsetOverride,
    contentOverride,
    placeOverride,
    delayShowOverride,
    delayHideOverride,
    variant,
    shouldFollowMouse,
    hide,
  ]);

  return (
    <a
      {...tooltipDataProps}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={className}
    >
      {children}
    </a>
  );
}
