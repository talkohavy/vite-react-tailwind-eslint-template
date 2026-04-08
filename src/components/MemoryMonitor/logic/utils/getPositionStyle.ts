import { OFFSET, type PositionValues, WIDGET_WIDTH } from '../constants';

export function getPositionStyle(position: PositionValues, winW: number, winH: number, widgetH: number) {
  const top = position.startsWith('top') ? OFFSET : winH - widgetH - OFFSET;
  const left = position.endsWith('left') ? OFFSET : winW - WIDGET_WIDTH - OFFSET;

  return { top, left };
}
