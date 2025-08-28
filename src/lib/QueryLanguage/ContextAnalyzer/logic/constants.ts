export const ContextTypes = {
  Operator: 'operator',
  Grouping: 'grouping',
  Key: 'key',
  Value: 'value',
} as const;

type TypeOfContextType = typeof ContextTypes;
export type ContextTypeKeys = keyof TypeOfContextType;
export type ContextTypeValues = TypeOfContextType[ContextTypeKeys];
