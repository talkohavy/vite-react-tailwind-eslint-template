export const MB = 1024 * 1024;

export const WIDGET_WIDTH = 208; // w-52
export const OFFSET = 16; // 1rem

export const Position = {
  TopLeft: 'top-left',
  TopRight: 'top-right',
  BottomLeft: 'bottom-left',
  BottomRight: 'bottom-right',
} as const;

export type PositionValues = (typeof Position)[keyof typeof Position];

export const POSITION_CYCLE: PositionValues[] = [
  Position.BottomRight,
  Position.TopRight,
  Position.TopLeft,
  Position.BottomLeft,
];

export const POSITION_CLASSES: Record<PositionValues, string> = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
};
