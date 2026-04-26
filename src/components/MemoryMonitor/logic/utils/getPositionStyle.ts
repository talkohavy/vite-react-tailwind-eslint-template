import { OFFSET, type PositionValues, WIDGET_WIDTH } from '../constants';

export function getPositionStyle(
  position: PositionValues,
  winW: number,
  winH: number,
  widgetH: number,
  widgetW: number = WIDGET_WIDTH,
) {
  const top = position.startsWith('top') ? OFFSET : winH - widgetH - OFFSET;
  const left = position.endsWith('left') ? OFFSET : winW - widgetW - OFFSET;

  return { top, left };
}
