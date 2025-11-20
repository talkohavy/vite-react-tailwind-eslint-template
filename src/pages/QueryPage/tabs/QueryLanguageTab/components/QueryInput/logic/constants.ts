import { ContextTypes, type ContextTypeValues } from 'create-query-language';

export const GroupLabels: Record<ContextTypeValues, string> = {
  [ContextTypes.Key]: 'Fields:',
  [ContextTypes.Value]: 'Values:',
  [ContextTypes.QuotedString]: 'Values:',
  [ContextTypes.LogicalOperator]: 'Operators:',
  [ContextTypes.Comparator]: 'Operators:',
  [ContextTypes.Colon]: 'Operators:',
  [ContextTypes.LeftParenthesis]: 'Operators:',
  [ContextTypes.RightParenthesis]: 'Operators:',
  [ContextTypes.Not]: 'Operators:',
} as const;
