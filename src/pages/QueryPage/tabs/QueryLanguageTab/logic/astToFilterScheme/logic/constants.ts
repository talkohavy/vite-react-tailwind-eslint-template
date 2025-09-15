import type { ComparatorValues } from 'create-query-language';

export const COMPARATOR_MAP: Record<ComparatorValues, string> = {
  '==': 'equals',
  '!=': 'notEquals',
  '>': 'greaterThan',
  '>=': 'greaterThanOrEqual',
  '<': 'lessThan',
  '<=': 'lessThanOrEqual',
  // ':': 'equals',
  // Should add this one day:
  // '<>': 'notEquals',
};
