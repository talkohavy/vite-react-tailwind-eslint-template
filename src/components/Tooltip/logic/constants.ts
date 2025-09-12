export const Placement = {
  Top: 'top',
  TopStart: 'top-start',
  TopEnd: 'top-end',
  Right: 'right',
  RightStart: 'right-start',
  Bottom: 'bottom',
  BottomStart: 'bottom-start',
  BottomEnd: 'bottom-end',
  Left: 'left',
  LeftStart: 'left-start',
  LeftEnd: 'left-end',
} as const;

type TypeofPlacement = typeof Placement;
export type PlacementKeys = keyof TypeofPlacement;
export type PlacementValues = TypeofPlacement[PlacementKeys];

export const Variant = {
  Dark: 'dark',
  Light: 'light',
  Success: 'success',
  Warning: 'warning',
  Error: 'error',
  Info: 'info',
} as const;

type TypeofVariant = typeof Variant;
export type VariantKeys = keyof TypeofVariant;
export type VariantValues = TypeofVariant[VariantKeys];
