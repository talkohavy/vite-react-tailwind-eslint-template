import { Comparators, SpecialChars } from 'create-query-language';

export const COMPARATOR_SYMBOL_TO_NAME: Record<any, any> = {
  [Comparators['==']]: 'equals',
  [Comparators['!=']]: 'notEquals',
  [Comparators['>']]: 'greaterThan',
  [Comparators['>=']]: 'greaterThanOrEqual',
  [Comparators['<']]: 'lessThan',
  [Comparators['<=']]: 'lessThanOrEqual',
  [SpecialChars.Colon]: 'equals',
};
