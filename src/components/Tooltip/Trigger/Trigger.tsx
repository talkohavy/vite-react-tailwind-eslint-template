import { PropsWithChildren, useMemo } from 'react';
import { Placement, Variant } from '../types';

type TriggerProps = PropsWithChildren<{
  groupId?: string;
  /**
   * Content to be displayed in the tooltip.
   */
  offsetOverride?: number;
  contentOverride?: string;
  placeOverride?: Placement;
  delayShowOverride?: number;
  delayHideOverride?: number;
  variantOverride?: Variant;
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

export default function Trigger(props: TriggerProps) {
  const {
    groupId,
    children,
    offsetOverride,
    contentOverride,
    placeOverride,
    delayShowOverride,
    delayHideOverride,
    shouldFollowMouse,
    variantOverride,
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
    if (variantOverride) dataProps['data-tooltip-variant'] = variantOverride;

    // dataProps['data-tooltip-class-name'] = 'custom-classname';

    return dataProps;
  }, [
    groupId,
    offsetOverride,
    contentOverride,
    placeOverride,
    delayShowOverride,
    delayHideOverride,
    variantOverride,
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
